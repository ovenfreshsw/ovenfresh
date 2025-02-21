"use client";

import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
// const PDFViewer = dynamic(
//     () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
//     {
//         ssr: false,
//         loading: () => <p>Loading...</p>,
//     }
// );

// Updated Order type to include all required fields
type Order = {
    id: string;
    store: {
        name: string;
        id: string;
    };
    customer: {
        name: string;
        phone: string;
    };
    address: string;
    deliveryDate: string;
    createdDate: string;
    totalPrice: number;
    tax: number;
    advancePaid: number;
    pendingBalance: number;
    paymentMethod: string;
    note: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
};

// Updated styles to accommodate the new table structure
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 30,
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
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableColHeader: {
        width: "8%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        fontSize: 8,
        fontWeight: "bold",
        backgroundColor: "#f0f0f0",
    },
    tableCol: {
        width: "8%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        fontSize: 7,
    },
    tableColWide: {
        width: "12%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        fontSize: 7,
    },
});

// Updated PDF document component
const OrdersPDF = ({ orders }: { orders: Order[] }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Orders Report</Text>
            <Text style={styles.subtitle}>
                Printed on: {format(new Date(), "MMMM d, yyyy HH:mm:ss")}
            </Text>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                        <Text>Order ID</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Store</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Customer</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Phone</Text>
                    </View>
                    <View style={styles.tableColWide}>
                        <Text>Address</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Created</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Delivery</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Total</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Tax</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Paid</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Pending</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Payment</Text>
                    </View>
                </View>
                {/* Table Body */}
                {orders.map((order) => (
                    <React.Fragment key={order.id}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text>{order.id}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{order.store.name}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{order.customer.name}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{order.customer.phone}</Text>
                            </View>
                            <View style={styles.tableColWide}>
                                <Text>{order.address}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {format(
                                        new Date(order.createdDate),
                                        "MM/dd/yyyy"
                                    )}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {format(
                                        new Date(order.deliveryDate),
                                        "MM/dd/yyyy"
                                    )}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>${order.totalPrice.toFixed(2)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>${order.tax.toFixed(2)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>${order.advancePaid.toFixed(2)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>${order.pendingBalance.toFixed(2)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{order.paymentMethod}</Text>
                            </View>
                        </View>
                        {/* Items sub-table */}
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: "100%" }]}>
                                <Text style={{ fontWeight: "bold" }}>
                                    Items:
                                </Text>
                                {order.items.map((item, index) => (
                                    <Text key={index}>
                                        {item.name} (x{item.quantity}) - $
                                        {item.price.toFixed(2)}
                                    </Text>
                                ))}
                            </View>
                        </View>
                        {/* Note */}
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: "100%" }]}>
                                <Text style={{ fontWeight: "bold" }}>
                                    Note:{" "}
                                </Text>
                                <Text>{order.note}</Text>
                            </View>
                        </View>
                    </React.Fragment>
                ))}
            </View>
        </Page>
    </Document>
);

// Component to display the PDF
export default function OrdersPDFViewer({ orders }: { orders: Order[] }) {
    const [PDFViewer, setPDFViewer] = useState<React.ComponentType | null>(
        null
    );

    useEffect(() => {
        import("@react-pdf/renderer").then((mod) => {
            setPDFViewer(() => mod.PDFViewer);
        });
    }, []);

    return (
        // @ts-expect-error: PDFViewer is not defined
        <PDFViewer width="100%" height={600}>
            <OrdersPDF orders={orders} />
        </PDFViewer>
    );
}
