import { createSlice } from "@reduxjs/toolkit";

const initialState={
    list:[]
}

export const SectionsSlice = createSlice({
    name:"sections",
    initialState,
    reducers:{
        setSectionsList:(state,action)=>{
            state.list=action.payload
        }
    }
})


export const {actions,reducer} = SectionsSlice