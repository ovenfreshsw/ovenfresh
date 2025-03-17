import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { StoreDocument } from "@/models/types/store";

async function formatRevenueBreakdown(
    stores: StoreDocument[],
    monthNumber: number,
    year: number
) {
    const result = [];

    // Loop through each store
    for (const store of stores) {
        const storeRevenue = {
            store: store.location,
            tiffin: 0,
            catering: 0,
        };

        // Single Promise.all for each store to fetch Tiffin and Catering data
        const [tiffinDocs, cateringDocs] = await Promise.all([
            // Fetch Tiffin data for current and previous months
            Tiffin.aggregate([
                {
                    $project: {
                        totalPrice: 1,
                        store: 1,
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                },
                { $match: { month: monthNumber, store: store._id, year } },
            ]),
            // Fetch Catering data for current and previous months
            Catering.aggregate([
                {
                    $project: {
                        totalPrice: 1,
                        store: 1,
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                },
                { $match: { month: monthNumber, store: store._id, year } },
            ]),
        ]);

        storeRevenue.tiffin = tiffinDocs.reduce(
            (total, doc) => total + doc.totalPrice,
            0
        );
        storeRevenue.catering = cateringDocs.reduce(
            (total, doc) => total + doc.totalPrice,
            0
        );

        result.push(storeRevenue);
    }

    return result;
}

export { formatRevenueBreakdown };
