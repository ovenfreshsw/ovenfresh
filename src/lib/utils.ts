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

export {
    cn,
    isRestricted,
    formatDate,
    calculateEndDate,
    calculateTotalAmount,
    generateOrderId,
    clusterOrders,
    findOptimalRoute,
};
