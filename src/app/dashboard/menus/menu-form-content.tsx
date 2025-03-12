import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Upload from "@/components/upload/upload";
import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const MenuFormContent = ({
    action,
    form,
    onSubmit,
    categories,
    isSubmitting,
    resource,
    setResource,
}: {
    action: "Add" | "Edit";
    form: UseFormReturn<z.infer<typeof ZodCateringMenuSchema>>;
    onSubmit: (values: z.infer<typeof ZodCateringMenuSchema>) => Promise<void>;
    categories: { name: string; _id: string }[];
    isSubmitting: boolean;
    resource?: string | CloudinaryUploadWidgetInfo | undefined;
    setResource: React.Dispatch<
        React.SetStateAction<string | CloudinaryUploadWidgetInfo | undefined>
    >;
}) => {
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-lg">
                    {action} new catering menu
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        value={category._id}
                                                        key={category._id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter item name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="variant"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Variant &#040;if applicable&#041;
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Basmathi, Kaima"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Image</FormLabel>
                                <div className="flex items-center gap-2">
                                    <Upload
                                        folder="catering_menu"
                                        setResource={setResource}
                                        defaultSource="local"
                                    >
                                        <Button type="button" size="sm">
                                            Upload Image
                                        </Button>
                                    </Upload>
                                    {resource && (
                                        <Image
                                            src={
                                                (
                                                    resource as CloudinaryUploadWidgetInfo
                                                ).secure_url
                                            }
                                            width={40}
                                            height={40}
                                            alt="menu image"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">
                                Small Size
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="smallServingSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serving Size</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 5 PPL"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="smallPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 55.00"
                                                    {...field}
                                                    type="number"
                                                    min={0}
                                                    step={0.01}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">
                                Medium Size
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="mediumServingSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serving Size</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 10 PPL"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="mediumPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 99.00"
                                                    {...field}
                                                    type="number"
                                                    min={0}
                                                    step={0.01}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">
                                Full Deep Size
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="largeServingSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serving Size</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 15 PPL"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="largePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 125.00"
                                                    {...field}
                                                    type="number"
                                                    min={0}
                                                    step={0.01}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? `${action}ing...`
                                : `${action} Menu Item`}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default MenuFormContent;
