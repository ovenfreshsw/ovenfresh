"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();
export const autocomplete = async (input: string) => {
    if (input.length < 3) return [];

    try {
        const response = await client.placeAutocomplete({
            params: {
                input,
                key: process.env.GOOGLE_API_KEY!,
            },
        });

        return response.data.predictions;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getCoordinates = async (placeID: string) => {
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeID,
                key: process.env.GOOGLE_API_KEY!,
            },
        });

        return response.data.result.geometry?.location;
    } catch (error) {
        console.log(error);
        return null;
    }
};
