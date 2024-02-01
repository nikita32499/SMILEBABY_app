import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store } from "../store";
const REACT_BASE_API_URL=  `${window.location.origin}/api/smilebaby`

export const OrderApi = createApi({
    reducerPath:"OrderApi",
    tagTypes:["Order"],
    baseQuery:fetchBaseQuery({
        baseUrl:REACT_BASE_API_URL
    }),
    endpoints:builder=>({
        getAllOrders:builder.query({
            query:()=>`/orders/getAll`,
            providesTags:[{type:"Order",id:"LIST"}],
            transformResponse:(data)=>data.result
        }),
        deleteOrder:builder.mutation({
            query:()=>`/orders/remove`,
            invalidatesTags:[{type:"Order",id:"LIST"}]
        }),
        createOrder:builder.mutation({
            query:({phone,name,email})=>{
                let items = store.getState().cart.cart_list
                if(!items.length) return

                return {
                    url:`/orders/create`,
                    method:"POST",
                    body:{
                        phone,
                        name,
                        email,
                        items
                    }
                }
            },
            invalidatesTags:[{type:"Order",id:"LIST"}],
        })
    })
})