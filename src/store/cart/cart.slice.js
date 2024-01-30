import { createSlice } from "@reduxjs/toolkit";
import { loadState,saveState } from "../../utils/localStorage.utils";
import {store} from "../store"
import {ItemsApi} from "../api/items.api"

const initialState = {
    cart_list:[],//{count:int,item:TypeItem}
    sections:[],
    total:{
        totalPrice:null,
        totalCount:null,
        totalDiscount:null
    }
}

export const CartSlice=createSlice({
    name:"cart",
    initialState: loadState("cart") || initialState, //loadState({reduxStateName:"cart"})
    reducers:{
        setTotal:(state,action)=>{
            state.total={
                ...state.total,
                ...action.payload
            }
        },
        setSections:(state,action)=>{
            state.sections=action.payload || [...state.sections]
        },
        addManyItemsToCart:(state,action)=>{
            let cart_list = [...state.cart_list]

            console.log(ItemsApi.endpoints.getAll.select()(action.rootState))

            if(Object.getPrototypeOf(action.payload).constructor === Object){
                action.payload=[action.payload]
            }
            

            for(let new_cart_element of action.payload){

                

                if(cart_list.find((cart_element)=>cart_element.item_id===new_cart_element.item_id && cart_element.size === new_cart_element.size)){
                    cart_list=[...cart_list.map((cart_element)=>cart_element.item_id===new_cart_element.item_id && cart_element.size === new_cart_element.size?{...cart_element,...new_cart_element}:cart_element)]
                }else{
                    cart_list=[...cart_list,{...new_cart_element,select:true}]
                }
            }
            state.cart_list=cart_list

            
            
        },
        ChangeCountItemFromCart:(state,action)=>{
            let cart_list = [...state.cart_list]
            
            if(action.payload.type==="allById"){
                cart_list=state.cart_list.map(cart_element=>{
                    if(cart_element.item_id===action.payload.item_id){
                        return {...cart_element,count:action.payload.count}
                    }else{
                        return {...cart_element}
                    }
                })
            }else{
                
                if(Object.getPrototypeOf(action.payload).constructor === Object){
                    action.payload=[action.payload]
                }



                for(let new_cart_element of action.payload){

                    cart_list=cart_list.map(cart_element=>{
                        if(cart_element.item_id===new_cart_element.item_id && new_cart_element.size===cart_element.size){
                            return {...cart_element,count:new_cart_element.count}
                        }else{
                            return {...cart_element}
                        }
                    })

                }
            }
            state.cart_list=cart_list.filter(cart_element=>cart_element.count>0)

        },

        setSelectManyItems:(state,action)=>{

            let cart_list = [...state.cart_list]
            if(Object.getPrototypeOf(action.payload).constructor === Object){
                action.payload=[action.payload]
            }
            for(let new_cart_element of action.payload){
                cart_list=cart_list.map(cart_element=>cart_element.size===new_cart_element.size && cart_element.item_id===new_cart_element.item_id?{...cart_element,select:new_cart_element.select}:cart_element)
            }

            state.cart_list=cart_list
        }
    }
})



export const {actions,reducer} = CartSlice


window.addEventListener('beforeunload', ()=>{
    localStorage.setItem("cart",JSON.stringify(store.getState().cart))
});