"use server";

import { revalidatePath } from "next/cache";

// In a real application, this would be connected to a database
// For this example, we'll use in-memory storage
let menuItems: any[] = [
    {
        _id: "1",
        category: "BIRIYANI",
        name: "Chicken Biriyani",
        variant: "Basmathi",
        smallPrice: 55.0,
        mediumPrice: 99.0,
        largePrice: 125.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "2",
        category: "BIRIYANI",
        name: "Chicken Biriyani",
        variant: "Kaima",
        smallPrice: 70.0,
        mediumPrice: 115.0,
        largePrice: 140.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "3",
        category: "BIRIYANI",
        name: "Beef Biriyani",
        variant: "Kaima",
        smallPrice: 70.0,
        mediumPrice: 130.0,
        largePrice: 180.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "4",
        category: "BIRIYANI",
        name: "Mutton Biriyani",
        variant: "Kaima",
        smallPrice: 70.0,
        mediumPrice: 130.0,
        largePrice: 180.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "5",
        category: "BIRIYANI",
        name: "Goat Biriyani",
        variant: "Kaima",
        smallPrice: 75.0,
        mediumPrice: 139.0,
        largePrice: 195.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "6",
        category: "BIRIYANI",
        name: "Fish Biriyani",
        variant: "K / B",
        smallPrice: 75.0,
        mediumPrice: 139.0,
        largePrice: 199.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "7",
        category: "BIRIYANI",
        name: "Veg Biriyani",
        variant: "Kaima",
        smallPrice: 65.0,
        mediumPrice: 110.0,
        largePrice: 130.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "8",
        category: "BIRIYANI",
        name: "Veg Biriyani",
        variant: "Basmathi",
        smallPrice: 55.0,
        mediumPrice: 99.0,
        largePrice: 115.0,
        smallServingSize: "5 PPL",
        mediumServingSize: "10 PPL",
        largeServingSize: "15 PPL",
        image: "",
    },
    {
        _id: "9",
        category: "GHEE RICE",
        name: "Ghee Rice",
        variant: "Kaima",
        smallPrice: 55.0,
        mediumPrice: 99.0,
        largePrice: 115.0,
        smallServingSize: "5 + PPL",
        mediumServingSize: "13-15 PPL",
        largeServingSize: "20 PPL",
        image: "",
    },
    {
        _id: "10",
        category: "GHEE RICE",
        name: "Ghee Rice",
        variant: "Basmathi",
        smallPrice: 45.0,
        mediumPrice: 89.0,
        largePrice: 99.0,
        smallServingSize: "5 + PPL",
        mediumServingSize: "13-15 PPL",
        largeServingSize: "20 PPL",
        image: "",
    },
    {
        _id: "11",
        category: "FRIED RICE",
        name: "Fried Rice Veg",
        smallPrice: 50.0,
        mediumPrice: 85.0,
        largePrice: 110.0,
        smallServingSize: "5-7 PPL",
        mediumServingSize: "10-13 PPL",
        largeServingSize: "15-18 PPL",
        image: "",
    },
    {
        _id: "12",
        category: "FRIED RICE",
        name: "Fried Rice Egg",
        smallPrice: 55.0,
        mediumPrice: 90.0,
        largePrice: 120.0,
        smallServingSize: "5-7 PPL",
        mediumServingSize: "10-13 PPL",
        largeServingSize: "15-18 PPL",
        image: "",
    },
    {
        _id: "13",
        category: "FRIED RICE",
        name: "Fried Rice Chicken",
        smallPrice: 55.0,
        mediumPrice: 95.0,
        largePrice: 125.0,
        smallServingSize: "5-7 PPL",
        mediumServingSize: "10-13 PPL",
        largeServingSize: "15-18 PPL",
        image: "",
    },
    {
        _id: "14",
        category: "FRIED RICE",
        name: "Veg Pulao",
        smallPrice: 45.0,
        mediumPrice: 85.0,
        largePrice: 99.0,
        smallServingSize: "5-7 PPL",
        mediumServingSize: "10-13 PPL",
        largeServingSize: "15-18 PPL",
        image: "",
    },
    {
        _id: "15",
        category: "NOODLES",
        name: "Noodles -Veg",
        mediumPrice: 80.0,
        largePrice: 110.0,
        image: "",
    },
    {
        _id: "16",
        category: "NOODLES",
        name: "Noodles -Chicken/Egg",
        mediumPrice: 90.0,
        largePrice: 120.0,
        image: "",
    },
    {
        _id: "17",
        category: "MANDI",
        name: "Mandi Chicken - Half Pcs",
        mediumPrice: 99.0,
        largePrice: 135.0,
        image: "",
    },
    {
        _id: "18",
        category: "MANDI",
        name: "Mandi Chicken - Qtr Leg",
        mediumPrice: 125.0,
        largePrice: 165.0,
        image: "",
    },
    {
        _id: "19",
        category: "KAPPA",
        name: "Kappa",
        smallPrice: 65.0,
        mediumPrice: 95.0,
        largePrice: 125.0,
        smallServingSize: "10 PPL",
        mediumServingSize: "15-20 PPL",
        largeServingSize: "20-25 PPL",
        image: "",
    },
    {
        _id: "20",
        category: "KAPPA",
        name: "Kappa Biriyani",
        variant: "B/L",
        smallPrice: 95.0,
        mediumPrice: 130.0,
        largePrice: 175.0,
        smallServingSize: "10 PPL",
        mediumServingSize: "15-20 PPL",
        largeServingSize: "20-25 PPL",
        image: "",
    },
];

let orders: any[] = [];

export async function getMenuItems() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return menuItems;
}

export async function addMenuItem(data: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newItem = {
        id: String(menuItems.length + 1),
        ...data,
        image: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
            data.name.replace(/\s+/g, "+")
        )}`,
    };

    menuItems.push(newItem);
    revalidatePath("/admin");
    return newItem;
}

export async function deleteMenuItem(id: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    menuItems = menuItems.filter((item) => item.id !== id);
    revalidatePath("/admin");
    return { success: true };
}

export async function getOrders() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return orders;
}

export async function createOrder(data: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const totalAmount = data.items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
    );

    const newOrder = {
        id: String(orders.length + 1),
        ...data,
        status: "pending",
        totalAmount,
        createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    revalidatePath("/manager");
    return newOrder;
}

export async function updateOrderStatus(id: string, status: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    orders = orders.map((order) =>
        order.id === id ? { ...order, status } : order
    );

    revalidatePath("/manager");
    return { success: true };
}
