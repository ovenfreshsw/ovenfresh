import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from "./menu-item-card";
import React from "react";
import { CateringMenuDocumentPopulate } from "@/models/types/catering-menu";

type VisualMenuSelectorProps = {
    menuItems: CateringMenuDocumentPopulate[];
};

export function VisualMenuSelector({ menuItems }: VisualMenuSelectorProps) {
    // Get unique categories
    const categories = Array.from(
        new Set(menuItems.map((item) => item.category.name))
    );

    // Get category-specific items
    const getItemsByCategory = (category: string) => {
        return menuItems.filter((item) => item.category.name === category);
    };

    return (
        <Card>
            <CardHeader className="px-3.5 pt-3.5 md:px-6 md:pt-6">
                <CardTitle className="text-lg">Menu Items</CardTitle>
                <CardDescription>
                    Select items from our menu to add to the order
                </CardDescription>
            </CardHeader>
            <CardContent className="px-3.5 pb-3.5 md:px-6 md:pb-6">
                <Tabs defaultValue={categories[0]} className="w-full">
                    <TabsList className="flex mb-4 justify-start overflow-x-scroll scrollbar-hide">
                        {categories.map((category) => (
                            <TabsTrigger key={category} value={category}>
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map((category) => (
                        <TabsContent key={category} value={category}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getItemsByCategory(category).length > 0 ? (
                                    getItemsByCategory(category).map(
                                        (item, i) => (
                                            <MenuItemCard item={item} key={i} />
                                        )
                                    )
                                ) : (
                                    <div className="col-span-full text-center py-8 text-muted-foreground">
                                        No items found in this category.
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
