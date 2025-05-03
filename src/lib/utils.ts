import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthenticatedRequest } from "./types/auth-request";
import { UseFormReturn } from "react-hook-form";
import { ZodTiffinSchema } from "./zod-schema/schema";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { TiffinMenuDocument } from "@/models/types/tiffin-menu";
import { RolesSet } from "./type";
import { kmeans } from "ml-kmeans";
import { ClusteredOrderProps } from "./types/sorted-order";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function isRestricted(
    user: AuthenticatedRequest["user"],
    allow: RolesSet[] = ["ADMIN"]
) {
    // If the user's role is "SUPERADMIN", always return false (no restriction)
    if (user?.role === "SUPERADMIN") {
        return false;
    }

    // If a user is not in the allowedRoles, they are restricted
    return !allow.includes(user?.role as RolesSet);
}

function formatDate(date: Date) {
    // Format the date in "Month Day, Year" with proper suffix for the day
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Function to add ordinal suffix (st, nd, rd, th)
    function addOrdinalSuffix(day: number) {
        if (day >= 11 && day <= 13) return `${day}th`; // Special case for 11th, 12th, 13th
        switch (day % 10) {
            case 1:
                return `${day}st`;
            case 2:
                return `${day}nd`;
            case 3:
                return `${day}rd`;
            default:
                return `${day}th`;
        }
    }

    // Extract the day and replace it with the ordinal format
    const day = date.getDate();
    return formattedDate.replace(/\d+/, addOrdinalSuffix(day));
}

function calculateEndDate(
    weeks: string,
    form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>,
    setEndDateText: React.Dispatch<React.SetStateAction<string>>
) {
    const start = new Date(form.getValues("start_date"));
    const weeksNumber = parseFloat(weeks);

    if (isNaN(weeksNumber)) {
        return;
    }

    let daysToAdd = weeksNumber * 5 - 1; // Include the start date as Day 1

    while (daysToAdd > 0) {
        start.setDate(start.getDate() + 1); // Move forward one day
        if (start.getDay() !== 6 && start.getDay() !== 0) {
            // Skip Sat & Sun
            daysToAdd--; // Count only business days
        }
    }

    const endDate = new Date(start);
    const formattedDate = formatDate(endDate);
    form.setValue("end_date", endDate.toDateString());

    setEndDateText(`End date: ${formattedDate}`);
}

function calculateTotalAmount(
    form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>,
    tiffinMenu?: TiffinMenuDocument | null
) {
    const numberOfWeeks = Number(form.getValues("number_of_weeks"));
    const deliveryType = form.getValues("order_type");

    let subtotal = 0;

    switch (numberOfWeeks) {
        case 2:
            if (deliveryType === "pickup")
                subtotal = tiffinMenu?.pickup["2_weeks"] || 0;
            else subtotal = tiffinMenu?.delivery["2_weeks"] || 0;
            break;
        case 3:
            if (deliveryType === "pickup")
                subtotal = tiffinMenu?.pickup["3_weeks"] || 0;
            else subtotal = tiffinMenu?.delivery["3_weeks"] || 0;
            break;
        case 4:
            if (deliveryType === "pickup")
                subtotal = tiffinMenu?.pickup["4_weeks"] || 0;
            else subtotal = tiffinMenu?.delivery["4_weeks"] || 0;
            break;

        default:
            break;
    }

    const tax =
        (subtotal * Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0)) / 100;
    const total = subtotal + tax;

    return { tax, subtotal, total };
}

// Define an uppercase alphanumeric nanoid generator (A-Z, 0-9)
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

// Function to generate an order ID
function generateOrderId() {
    const year = new Date().getFullYear(); // Get current year
    const uniquePart = nanoid(); // Generate a 6-character unique ID
    return `${year}-${uniquePart}`; // Example: "2025-9GHT3X"
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth radius in km
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// K-Means Clustering (Divides Orders into Two Zones)
function clusterOrders(orders: ClusteredOrderProps[]) {
    const orderLocations = orders.map((o) => [o.lat, o.lng]);
    if (orderLocations.length <= 1) return [orders, []];

    // Perform K-Means clustering with k=2
    const result = kmeans(orderLocations, 2, {
        initialization: "kmeans++",
        seed: 42,
    });

    // Assign clusters to orders
    orders.forEach((order, index) => {
        order.zone = result.clusters[index]; // Cluster label (0 or 1)
    });

    // Separate into two lists
    const zone1Orders = orders.filter((o) => o.zone === 0);
    const zone2Orders = orders.filter((o) => o.zone === 1);

    return [zone1Orders, zone2Orders];
}

function findOptimalRoute(
    store: { lat: number; lng: number },
    orders: ClusteredOrderProps[]
) {
    const unvisited = [...orders];
    const route = [];
    let current = {
        lat: store.lat,
        lng: store.lng,
    };

    while (unvisited.length) {
        unvisited.sort(
            (a, b) =>
                haversine(current.lat, current.lng, a.lat, a.lng) -
                haversine(current.lat, current.lng, b.lat, b.lng)
        );
        const next = unvisited.shift();
        route.push(next);
        current = next!;
    }

    return route as ClusteredOrderProps[];
}

const getMonthsUpToCurrent = (
    removeAllMonth = false,
    year?: number
): { value: string; name: string }[] => {
    const currentYear = new Date().getFullYear(); // Get the current year
    const currentMonth = new Date().getMonth(); // Get the current month (0-based index)

    // If a year is provided, use that year, otherwise, use the current year
    const targetYear = year || currentYear;

    // Define months array
    const months = [
        { value: "all", name: "All Months" },
        { value: "jan", name: "January" },
        { value: "feb", name: "February" },
        { value: "mar", name: "March" },
        { value: "apr", name: "April" },
        { value: "may", name: "May" },
        { value: "jun", name: "June" },
        { value: "jul", name: "July" },
        { value: "aug", name: "August" },
        { value: "sep", name: "September" },
        { value: "oct", name: "October" },
        { value: "nov", name: "November" },
        { value: "dec", name: "December" },
    ];

    // If the given year is the current year, return months up to the current month
    if (targetYear === currentYear) {
        if (removeAllMonth) {
            return months.slice(1, currentMonth + 2); // Exclude "All Months" and return up to the current month
        }
        return months.slice(0, currentMonth + 2); // Include "All Months" and return up to the current month
    }

    // If the given year is not the current year, return all months for that year
    if (removeAllMonth) {
        return months.slice(1); // Exclude "All Months" and return all months from January to December
    }
    return months; // Include "All Months" and return all months from January to December
};

function getYearsUpToCurrent(): number[] {
    const currentYear = new Date().getFullYear();

    const years: number[] = [];

    for (let year = 2025; year <= currentYear; year++) {
        years.push(year);
    }

    return years;
}

function appendBracket(str1: string, str2?: string | null, isMoney = false) {
    if (str2 && str2.length > 0) {
        if (isMoney) {
            return "$" + str1 + " (" + str2 + ")";
        }
        return str1 + " (" + str2 + ")";
    }
    return isMoney ? "$" + str1 : str1;
}

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0; // if previous month was 0, handle it as a 100% change if current > 0
    return ((current - previous) / previous) * 100;
};

function getMonthInNumber(month: string) {
    const monthMap: Record<string, number> = {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12,
    };
    return monthMap[month];
}

function addWeekdays(startDate: string, numberOfWeeks: number) {
    const start = new Date(startDate);
    const totalWeekdays = numberOfWeeks * 5;
    let addedDays = 1; // We count the start date as day 1
    const current = new Date(start);

    while (addedDays < totalWeekdays) {
        current.setDate(current.getDate() + 1);
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
            addedDays++;
        }
    }

    return current;
}

export {
    cn,
    isRestricted,
    formatDate,
    calculateEndDate,
    calculateTotalAmount,
    generateOrderId,
    clusterOrders,
    findOptimalRoute,
    getMonthsUpToCurrent,
    appendBracket,
    calculatePercentageChange,
    getMonthInNumber,
    getYearsUpToCurrent,
    addWeekdays,
};
