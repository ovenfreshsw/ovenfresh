import { CateringItemsState } from "@/lib/types/catering/catering-order-state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CateringItemsState[] = [];

export const cateringItemSlice = createSlice({
    name: "cateringOrder",
    initialState,
    reducers: {
        incrementQuantity: (
            state,
            action: PayloadAction<CateringItemsState>
        ) => {
            const existingItem = state.find(
                (item) => item._id === action.payload._id
            );

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                state.push({ ...action.payload, quantity: 1 }); // Ensure quantity is initialized
            }
        },
        decrementQuantity: (
            state,
            action: PayloadAction<CateringItemsState>
        ) => {
            const existingItem = state.find(
                (item) => item._id === action.payload._id
            );

            if (existingItem) {
                if (existingItem.quantity === 1) {
                    return state.filter(
                        (item) => item._id !== action.payload._id
                    );
                }
                existingItem.quantity = (existingItem.quantity || 0) - 1;
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            return state.filter((item) => item._id !== action.payload);
        },
        clearState: () => {
            return initialState;
        },
    },
});

export const { decrementQuantity, incrementQuantity, removeItem, clearState } =
    cateringItemSlice.actions;
export default cateringItemSlice.reducer;
