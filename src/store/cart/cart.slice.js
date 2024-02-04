import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../../utils/localStorage.utils";
import {store} from "../store"
import {ItemsApi} from "../api/items.api"

const initialState = {
    cart_list:[],//{count:int,item:TypeItem}
    total:{
        totalPrice:null,
        totalCount:null,
        totalDiscount:null
    }
}


function CalculateTotal({state,items_list}){
    let totalPrice=state.cart_list.reduce((price,cart_element)=>{
        let item = items_list.find(item=>item.id===cart_element.item_id)
        if(!item) return price
        return cart_element.select?price+cart_element.count * (item.price):price
    },0)
    
    let totalCount=state.cart_list.reduce((count,cart_element)=>cart_element.select?count+cart_element.count:count,0)

    let totalDiscount = state.cart_list.reduce((discount,cart_element)=>{
        let item = items_list.find(item=>item.id===cart_element.item_id)
        if(!item) return discount
        return cart_element.select?discount+cart_element.count *(item.discount):discount
    },0)

    return {
        totalPrice,
        totalCount,
        totalDiscount
    }
}



export const CartSlice=createSlice({
    name:"cart",
    initialState: loadState("cart") || initialState, //loadState({reduxStateName:"cart"})
    reducers:{
        addManyItemsToCart:(state,action)=>{


            let cart_list = [...state.cart_list]

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
            cart_list=cart_list.filter(cart_element=>cart_element.count>0)
            state.cart_list=cart_list

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

            
        },
        clearCart:(state,action)=>{
            state.cart_list=[]
        }
    },

    extraReducers:(builder)=>{
        builder.addMatcher(ItemsApi.endpoints.getAll.matchFulfilled,(state,action)=>{
            let items_list = action.payload || []
            state.total=CalculateTotal({state,items_list})
            
        })
        
        Object.values(CartSlice.actions).forEach((action) => {
            builder.addMatcher(action.match,(state,action)=>{
                if(!action.rootState) return
                let {data:items_list=[]} = ItemsApi.endpoints.getAll.select()(action.rootState)
                state.total=CalculateTotal({state,items_list})
            })
        });

        

    }
})



export const {actions,reducer} = CartSlice;


const saveState = () => {
    try {
      alert("ddd")
      localStorage.setItem("cart",JSON.stringify(store.getState().cart))
    } catch (error) {
      console.error(`Ошибка сохранения state (vart) localStorage:`, error);
    }
  };

window.addEventListener("unload", saveState);
window.addEventListener("beforeunload", saveState);