import { bindActionCreators } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import {actions as items_actions} from "../store/items/items.slice"
import {actions as sections_actions} from "../store/sections/sections.slice"
import {actions as cart_actions} from "../store/cart/cart.slice"
import { store } from "../store/store";

const rootActions={
    ...items_actions,
    ...sections_actions,
    ...cart_actions
}




export const useSubscribe=(handler)=>{
    return store.subscribe(handler)
}

export const useActions=()=>{
    const dispath = useDispatch()

    return useMemo(()=>bindActionCreators(rootActions,dispath),[dispath])
}