"use server";

import { getCoordinates } from "@/lib/google";
import connectDB from "@/lib/mongodb";
import {
    ZodCateringSchema,
    ZodCustomerSchema,
    ZodTiffinSchema,
} from "@/lib/zod-schema/schema";
import Address from "@/models/addressModel";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

type ValidatedDataType = {
    address: string;
    lat: number;
    lng: number;
    deliveryDate: Date;
    start_date: Date;
    end_date: Date;
};

export async function editAddressAction(formData: FormData) {
    try {
        await connectDB();
        const {
            orderId,
            orderType,
            addressId,
            address,
            placeId,
            customerId,
            lat,
            lng,
            deliveryDate,
            startDate,
            endDate,
        } = Object.fromEntries(formData.entries());

        if (!orderId || !orderType) {
            return { error: "Invalid order ID or order type." };
        }

        // Fetch existing address from the database
        const currentAddress = await Address.findById(addressId);

        if (!currentAddress) {
            return { error: "Address not found." };
        }

        // Validate input data based on order type
        const validationSchema =
            orderType === "catering"
                ? ZodCustomerSchema.merge(ZodCateringSchema).pick({
                      address: true,
                      deliveryDate: true,
                  })
                : ZodCustomerSchema.merge(ZodTiffinSchema).pick({
                      address: true,
                      start_date: true,
                      end_date: true,
                  });

        const validated = validationSchema.safeParse({
            address,
            deliveryDate,
            start_date: startDate,
            end_date: endDate,
        });

        if (!validated.success) {
            return { error: validated.error.format() };
        }

        const validatedData = validated.data as ValidatedDataType;

        // Check if address details have changed
        const isAddressSame = currentAddress.address === validatedData.address;

        if (isAddressSame) {
            // Only update order details if the address is unchanged
            await updateOrder(orderId.toString(), orderType.toString(), {
                ...validatedData,
                addressId: addressId as string,
            });
        } else {
            // Check if the address is shared with other orders
            const isAddressInUse = await Promise.all([
                Catering.findOne({ address: addressId, _id: { $ne: orderId } }),
                Tiffin.findOne({ address: addressId, _id: { $ne: orderId } }),
            ]);

            const location = await getCoordinates(placeId.toString());

            let newAddressId = addressId as string;

            if (isAddressInUse.some((order) => order)) {
                // Create a new address if it's used by another order
                const newAddress = await Address.create({
                    address: validatedData.address,
                    lat: location?.lat,
                    lng: location?.lng,
                    placeId: placeId,
                    customerId,
                });

                newAddressId = newAddress._id;
            } else {
                // Update existing address
                await Address.updateOne(
                    { _id: addressId },
                    {
                        $set: {
                            address: validatedData.address,
                            lat: location?.lat,
                            lng: location?.lng,
                        },
                    }
                );
            }

            // Update order with the new address
            await updateOrder(
                orderId.toString(),
                orderType.toString(),
                validatedData,
                newAddressId
            );
        }

        // Revalidate the order dashboard
        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}

// Define the type for updateData
type UpdateDataType = {
    address?: string;
    deliveryDate?: string;
    startDate?: string;
    endDate?: string;
};

// Function to update order details
async function updateOrder(
    orderId: string,
    orderType: string,
    data: ValidatedDataType & { addressId?: string },
    newAddressId?: string
) {
    const updateData: UpdateDataType = {
        address: newAddressId || data.addressId,
    };

    if (orderType === "catering") {
        updateData.deliveryDate = format(
            new Date(data.deliveryDate),
            "yyyy-MM-dd"
        );
        await Catering.updateOne({ _id: orderId }, { $set: updateData });
    } else {
        updateData.startDate = format(new Date(data.start_date), "yyyy-MM-dd");
        updateData.endDate = format(new Date(data.end_date), "yyyy-MM-dd");
        await Tiffin.updateOne({ _id: orderId }, { $set: updateData });
    }
}
