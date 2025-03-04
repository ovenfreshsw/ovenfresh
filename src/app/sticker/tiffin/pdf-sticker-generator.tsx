"use client";

import { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

type Order = {
    orderId: string;
    deliveryDate: Date;
    order_type: "pickup" | "delivery";
    customerName: string;
    phone: string;
    note: string;
};

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: "center",
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
    address: {
        fontSize: 9,
        marginTop: 3,
        color: "#444",
    },
});

// Kitchen Order Sticker component
const KitchenOrderSticker = ({ order }: { order: Order }) => {
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
                    <View
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Text style={styles.title}>Tiffin Order Stickers</Text>
                        <Text style={styles.subtitle}>
                            Printed on:{" "}
                            {format(new Date(), "MMMM d, yyyy HH:mm:ss")}
                        </Text>
                    </View>
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
