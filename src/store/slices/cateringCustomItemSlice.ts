import { CateringCustomItemState } from "@/lib/types/catering/catering-order-state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CateringCustomItemState[] = [];

export const cateringCustomItemSlice = createSlice({
    name: "cateringCustomItem",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CateringCustomItemState>) => {
            state.push(action.payload);
        },
        removeCustomItem: (state, action: PayloadAction<{ name: string }>) => {
            return state.filter(
                (item) =>
                    item.name.toLowerCase() !==
                    action.payload.name.toLowerCase()
            );
        },
        clearCustomItemState: () => {
            return initialState;
        },
    },
});

export const { addItem, removeCustomItem, clearCustomItemState } =
    cateringCustomItemSlice.actions;
export default cateringCustomItemSlice.reducer;
