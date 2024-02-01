import {configureStore, combineReducers } from "@reduxjs/toolkit";

// import {reducer as admin_reducer} from "./admin/admin.slice"
// import {reducer as components_reducer} from "./components/components.slice"
import {reducer as items_reducer} from "./items/items.slice"
import {reducer as sections_reducer} from "./sections/sections.slice"
import { ItemsApi } from "./api/items.api";
import { SectionsApi } from "./api/sections.api";
import { OrderApi } from "./api/order.api";
import {reducer as cart_reducer} from "./cart/cart.slice"



const reducers=combineReducers({
    items:items_reducer,
    sections:sections_reducer,
    cart:cart_reducer,
    [ItemsApi.reducerPath]:ItemsApi.reducer,
    [SectionsApi.reducerPath]:SectionsApi.reducer,
    [OrderApi.reducerPath]:OrderApi.reducer
})



const ExpandRootState = store => next => action =>{
    let result =  next({
        ...action,
        rootState:store.getState()
    })
    return result
}




export const store =configureStore({
    reducer:reducers,
    middleware:getDefaultMiddleware=>getDefaultMiddleware().concat([ExpandRootState,SectionsApi.middleware,ItemsApi.middleware,OrderApi.middleware])
}) 


