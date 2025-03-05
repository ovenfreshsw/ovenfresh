import { configureStore } from "@reduxjs/toolkit";
import cateringItemReducer from "./slices/cateringItemSlice";
import cateringOrderReducer from "./slices/cateringOrderSlice";

export const store = configureStore({
    reducer: {
        cateringItem: cateringItemReducer,
        cateringOrder: cateringOrderReducer,
    },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
