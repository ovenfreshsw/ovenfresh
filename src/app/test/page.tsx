// import Catering from "@/models/cateringModel";
import OrdersPDFViewer from "./order-pdf-generator";
// import Store from "@/models/storeModel";
// import Address from "@/models/addressModel";
// import CateringMenu from "@/models/cateringMenuModel";
// import connectDB from "@/lib/mongodb";

const TestPage = async () => {
    // await connectDB();
    // const orders = await Catering.find()
    //     .populate({ path: "store", model: Store })
    //     .populate({ path: "address", model: Address })
    //     .populate({ path: "items.itemId", model: CateringMenu });

    return (
        <OrdersPDFViewer
            orders={[
                {
                    advancePaid: 100,
                    customer: {
                        name: "John Doe",
                        phone: "1234567890",
                    },
                    deliveryDate: "2023-01-01T00:00:00.000Z",
                    id: "1",
                    pendingBalance: 100,
                    store: {
                        id: "1",
                        name: "Store 1",
                    },
                    totalPrice: 100,
                    paymentMethod: "Cash",
                    address: "123 Main St, Anytown, USA",
                    createdDate: "2023-01-01T00:00:00.000Z",
                    items: [
                        {
                            name: "Item 1",
                            quantity: 1,
                            price: 100,
                        },
                        {
                            name: "Item 2",
                            quantity: 2,
                            price: 200,
                        },
                    ],
                    note: "This is a note",
                    tax: 10,
                },
                {
                    advancePaid: 200,
                    customer: {
                        name: "Dave Smith",
                        phone: "1234567890",
                    },
                    deliveryDate: "2023-01-01T00:00:00.000Z",
                    id: "2",
                    pendingBalance: 100,
                    store: {
                        id: "1",
                        name: "Store 2",
                    },
                    totalPrice: 300,
                    paymentMethod: "Cash",
                    address: "123 Main St, Anytown, USA",
                    createdDate: "2023-01-01T00:00:00.000Z",
                    items: [
                        {
                            name: "Item 3",
                            quantity: 1,
                            price: 100,
                        },
                        {
                            name: "Item 4",
                            quantity: 2,
                            price: 200,
                        },
                    ],
                    note: "This is a note",
                    tax: 10,
                },
            ]}
        />
    );
};

export default TestPage;
