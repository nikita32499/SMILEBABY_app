import { createSlice } from "@reduxjs/toolkit";
import { ItemsApi } from "../api/items.api";

export const initialState={
    meta:{
        maxprice:99999,
        minprice:0,
        section_id:null
    },
    filter:{
        sort:null,
        price:{},
        size:[],
        season:[],
        modified:false
    }
}




export const ItemsSlice = createSlice({
    name:"items",
    initialState,
    reducers:{
        setFilter:(state,action)=>{
            if(action.payload==="default"){
                state.filter={...initialState.filter}
            }else{
                if(action.payload.price?.min) action.payload.price.min = Math.floor(Number(action.payload.price.min)) || state.filter.price.min
                if(action.payload.price?.max) action.payload.price.max = Math.floor(Number(action.payload.price.max)) || state.filter.price.max
                if(Number.isNaN(action.payload.price?.min)) action.payload.price.min=state.filter.price.min
                if(Number.isNaN(action.payload.price?.max)) action.payload.price.max=state.filter.price.max


                state.filter={
                    ...state.filter,
                    ...action.payload,
                    modified:true
                }
            }
            
        },
        setMetadata:(state,action)=>{
            state.meta={
                ...state.meta,
                ...action.payload
            }
        }
    },
    extraReducers:(builder)=>{
        builder.addMatcher(ItemsApi.endpoints.getAll.matchFulfilled,(state,action)=>{
            state.meta={
                ...state.meta,
                maxprice:action.payload.reduce((max,{price})=>max<price?price:max, 0),
                minprice:action.payload.reduce((min,{price})=>min>price?price:min, action.payload?.[0].price || 0)
            }
            
        })
    }
})


export const {reducer,actions} = ItemsSlice