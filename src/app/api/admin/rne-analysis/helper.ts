import { MonthlyRevenueData } from "@/lib/types/finance";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { StoreDocument } from "@/models/types/store";
import { endOfMonth, startOfMonth } from "date-fns";

function formatStoreData(stores: StoreDocument[]) {
    const arr = stores.map((store, i) => ({
        value: `store${i + 1}`,
        name: store.location,
    }));
    arr.unshift({
        value: "all",
        name: "All Stores",
    });
    return arr;
}

// Predefined color map for known services
const colorMap: { [key: string]: string } = {
    "Scarborough Tiffin": "#2563eb",
    "Scarborough Catering": "#16a34a",
    "Oshawa Tiffin": "#ea580c",
    "Oshawa Catering": "#8b5cf6",
};

// Function to generate a random color (without concern for vibrancy)
const generateRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Function to get the colors for store locations and services
const generateStoreColors = (
    data: {
        location: string;
    }[]
): { [key: string]: string } => {
    const result: { [key: string]: string } = {};

    // Iterate over each store data object
    data.forEach((entry) => {
        const { location } = entry;

        // Define service names for each location
        const services = ["Tiffin", "Catering"];

        // Loop through the services and create keys for each service type
        services.forEach((service) => {
            const key = `${location} ${service}`;

            // If the key exists in the color map, use that color, else generate a random color
            result[key] = colorMap[key] || generateRandomColor();
        });
    });

    return result;
};

const currentYear = new Date().getFullYear();
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

async function formatRevenueData(stores: StoreDocument[]) {
    // Initialize the result array
    const result: MonthlyRevenueData[] = [];
    const currentMonth = new Date().getMonth();

    // Loop through each month of the current year
    for (let monthIndex = 0; monthIndex < currentMonth + 1; monthIndex++) {
        // Example: Looping for Jan, Feb, Mar
        const monthName = months[monthIndex];

        const monthData: MonthlyRevenueData = { name: monthName };

        // Loop over stores to gather month-specific data
        for (const store of stores) {
            // Get the start and end of the current month
            const startOfTheMonth = startOfMonth(
                new Date(currentYear, monthIndex, 1)
            );
            const endOfTheMonth = endOfMonth(
                new Date(currentYear, monthIndex, 1)
            );

            // Find Tiffins for the store in the current month
            const tiffins = await Tiffin.find(
                {
                    store: store._id,
                    createdAt: { $gte: startOfTheMonth, $lt: endOfTheMonth },
                },
                "totalPrice"
            );

            // Find Caterings for the store in the current month
            const caterings = await Catering.find(
                {
                    store: store._id,
                    createdAt: { $gte: startOfTheMonth, $lt: endOfTheMonth },
                },
                "totalPrice"
            );

            // Aggregate totals for Tiffins and Caterings
            const tiffinTotal = tiffins.reduce(
                (sum, tiffin) => sum + tiffin.totalPrice,
                0
            );
            const cateringTotal = caterings.reduce(
                (sum, catering) => sum + catering.totalPrice,
                0
            );

            // Add the data for the specific store and category
            monthData[`${store.location} Tiffin`] = tiffinTotal;
            monthData[`${store.location} Catering`] = cateringTotal;
        }

        // Push the month's data to the result array
        result.push(monthData);
    }

    return result;
}

interface Result {
    [key: string]: {
        tiffin: string[];
        catering: string[];
        all: string[];
    };
}

const getStoreServiceMap = (stores: StoreDocument[]): Result => {
    const result: Result = {
        all: {
            tiffin: [],
            catering: [],
            all: [],
        },
    };

    stores.forEach((store, index) => {
        const storeKey = `store${index + 1}`;

        // Initialize the store entry
        result[storeKey] = {
            tiffin: [`${store.location} Tiffin`],
            catering: [`${store.location} Catering`],
            all: [`${store.location} Tiffin`, `${store.location} Catering`],
        };

        // Add to 'all' entry
        result.all.tiffin.push(`${store.location} Tiffin`);
        result.all.catering.push(`${store.location} Catering`);
        result.all.all.push(
            `${store.location} Tiffin`,
            `${store.location} Catering`
        );
    });

    return result;
};

export {
    formatStoreData,
    generateStoreColors,
    formatRevenueData,
    getStoreServiceMap,
};
