"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { addCateringMenuAction } from "@/actions/add-catering-menu-action";
import MenuFormContent from "../menu/menu-form-content";

export default function MenuForm({
    categories,
}: {
    categories: { name: string; _id: string }[];
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resource, setResource] = useState<
        string | CloudinaryUploadWidgetInfo | undefined
    >();

    const form = useForm<z.infer<typeof ZodCateringMenuSchema>>({
        resolver: zodResolver(ZodCateringMenuSchema),
        defaultValues: {
            category: "",
            name: "",
            variant: "",
            smallPrice: "",
            mediumPrice: "",
            largePrice: "",
            smallServingSize: "",
            mediumServingSize: "",
            largeServingSize: "",
            disabled: false,
        },
    });

    async function onSubmit(values: z.infer<typeof ZodCateringMenuSchema>) {
        setIsSubmitting(true);
        try {
            const promise = () =>
                new Promise(async (resolve, reject) => {
                    const result = await addCateringMenuAction(
                        values,
                        resource
                    );
                    setIsSubmitting(false);
                    form.reset();
                    setResource(undefined);
                    if (result.success) resolve(result);
                    else reject(result);
                });

            toast.promise(promise, {
                loading: "Creating menu item...",
                success: () => "The menu item has been added successfully.",
                error: ({ error }) =>
                    error
                        ? error
                        : "Failed to add menu item. Please try again.",
            });
        } catch {
            toast.error("Failed to add menu item. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <MenuFormContent
            action="Add"
            categories={categories}
            isSubmitting={isSubmitting}
            resource={resource}
            setResource={setResource}
            form={form}
            onSubmit={onSubmit}
        />
    );
}
