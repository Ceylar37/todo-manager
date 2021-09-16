import {configureStore} from "@reduxjs/toolkit";
import {todoReducer} from "./todoReducer";


export const store = configureStore({
    reducer: {
        todo: todoReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// @ts-ignore
window.store = store

// @ts-ignore
window.state = store.getState