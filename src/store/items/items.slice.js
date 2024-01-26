import { createSlice } from "@reduxjs/toolkit";


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
                if(action.payload.price?.min)action.payload.price.min=Math.floor(action.payload.price.min)
                if(action.payload.price?.max)action.payload.price.max=Math.floor(action.payload.price.max)

                // if(action.payload.price?.max<action.payload.price?.min){

                // }

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
    }
})


export const {reducer,actions} = ItemsSlice