"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import MenuFormContent from "../menu/menu-form-content";
import { CateringMenuDocument } from "@/models/types/catering-menu";
import { editCateringMenuAction } from "@/actions/edit-catering-menu-action";

export default function MenuForm({
    categories,
    menu,
}: {
    categories: { name: string; _id: string }[];
    menu: CateringMenuDocument;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resource, setResource] = useState<
        string | CloudinaryUploadWidgetInfo | undefined
    >();

    const form = useForm<z.infer<typeof ZodCateringMenuSchema>>({
        resolver: zodResolver(ZodCateringMenuSchema),
        defaultValues: {
            category: menu.category.toString() || "",
            name: menu.name || "",
            variant: menu.variant || "",
            smallPrice: menu.smallPrice?.toString() || "",
            mediumPrice: menu.mediumPrice?.toString() || "",
            largePrice: menu.largePrice?.toString() || "",
            smallServingSize: menu.smallServingSize || "",
            mediumServingSize: menu.mediumServingSize || "",
            largeServingSize: menu.largeServingSize || "",
            disabled: menu.disabled || false,
        },
    });

    async function onSubmit(values: z.infer<typeof ZodCateringMenuSchema>) {
        setIsSubmitting(true);
        try {
            const promise = () =>
                new Promise(async (resolve, reject) => {
                    const result = await editCateringMenuAction(
                        menu._id,
                        values,
                        menu.image,
                        menu.publicId,
                        resource
                    );
                    setIsSubmitting(false);
                    if (result.success) resolve(result);
                    else reject(result);
                });
            toast.promise(promise, {
                loading: "Updating menu item...",
                success: () => "The menu item has been updated successfully.",
                error: ({ error }) =>
                    error
                        ? error
                        : "Failed to update menu item. Please try again.",
            });
        } catch (error) {
            toast.error("Failed to update menu item. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <MenuFormContent
            action="Edit"
            categories={categories}
            isSubmitting={isSubmitting}
            resource={resource}
            setResource={setResource}
            form={form}
            onSubmit={onSubmit}
        />
    );
}
