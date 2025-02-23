"use client";

import { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

type Order = {
    orderId: string;
    deliveryDate: Date;
    customerName: string;
    phone: string;
    items: { name: string; quantity: number }[];
    note: string;
};

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
    },
    sticker: {
        width: "50%",
        height: "25%",
        padding: 8,
        boxSizing: "border-box",
    },
    orderHeader: {
        borderBottom: 1,
        paddingBottom: 5,
        marginBottom: 5,
    },
    orderId: {
        fontSize: 14,
        fontWeight: "bold",
    },
    datetime: {
        fontSize: 10,
        color: "#666",
    },
    customerInfo: {
        fontSize: 10,
        marginBottom: 3,
    },
    itemsContainer: {
        marginTop: 5,
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 3,
    },
    quantity: {
        fontSize: 12,
        fontWeight: "bold",
        width: 25,
    },
    itemName: {
        fontSize: 12,
        fontWeight: "bold",
        flex: 1,
    },
    specialInstructions: {
        fontSize: 9,
        marginLeft: 25,
        color: "#666",
        fontStyle: "italic",
    },
    totalItems: {
        fontSize: 11,
        fontWeight: "bold",
        marginTop: 3,
        borderTop: 1,
        paddingTop: 3,
    },
    priority: {
        fontSize: 10,
        color: "red",
        position: "absolute",
        top: 8,
        right: 8,
    },
    address: {
        fontSize: 9,
        marginTop: 3,
        color: "#444",
    },
});

// Kitchen Order Sticker component
const KitchenOrderSticker = ({ order }: { order: Order }) => {
    const totalItems = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <View style={styles.sticker}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.orderId}</Text>
                <Text style={styles.datetime}>
                    {format(order.deliveryDate, "dd/MM/yyyy")}
                </Text>
            </View>
            <Text style={styles.customerInfo}>
                {order.customerName} | {order.phone}
            </Text>
            <View style={styles.itemsContainer}>
                {order.items.map((item, index) => (
                    <View key={index}>
                        <View style={styles.itemRow}>
                            <Text style={styles.quantity}>
                                {item.quantity}x
                            </Text>
                            <Text style={styles.itemName}>{item.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <Text style={styles.totalItems}>Total Items: {totalItems}</Text>
            <Text style={styles.address}>Note: {order.note}</Text>
        </View>
    );
};

// PDF Document component
export default function KitchenStickers({ orders }: { orders: Order[] }) {
    const [PDFViewer, setPDFViewer] = useState<React.ComponentType | null>(
        null
    );

    useEffect(() => {
        import("@react-pdf/renderer").then((mod) => {
            setPDFViewer(() => mod.PDFViewer);
        });
    }, []);

    return PDFViewer ? (
        // @ts-expect-error: PDFViewer is not defined
        <PDFViewer width="100%" height={800}>
            <Document>
                <Page size="A4" style={styles.page}>
                    {orders.map((order, index) => (
                        <KitchenOrderSticker key={index} order={order} />
                    ))}
                </Page>
            </Document>
        </PDFViewer>
    ) : (
        <div className="h-screen flex justify-center items-center">
            <p>Loading PDF Viewer...</p>
        </div>
    );
}
