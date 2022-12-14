import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./reducers/cartSlice";
import { filterSlice } from "./reducers/filterSlice";
import { teaSlice } from "./reducers/teaSlice";
import { userSlice } from "./reducers/userSlice";

export const store = configureStore({
    reducer: {
        tea: teaSlice.reducer,
        filter: filterSlice.reducer,
        cart: cartSlice.reducer,
        user: userSlice.reducer
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch