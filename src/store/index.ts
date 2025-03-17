import { configureStore } from "@reduxjs/toolkit";
import cateringItemReducer from "./slices/cateringItemSlice";
import cateringOrderReducer from "./slices/cateringOrderSlice";
import selectStoreReducer from "./slices/selectStoreSlice";
import selectYearReducer from "./slices/selectYearSlice";

export const store = configureStore({
    reducer: {
        cateringItem: cateringItemReducer,
        cateringOrder: cateringOrderReducer,
        selectStore: selectStoreReducer,
        selectYear: selectYearReducer,
    },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
