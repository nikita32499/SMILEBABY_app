import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { store } from '../store'
import { actions } from '../items/items.slice'

const REACT_BASE_API_URL=  `${window.location.origin}/api/smilebaby`



export const ItemsApi = createApi({
    reducerPath:"ItemsApi",
    tagTypes:["Items"],
    baseQuery:fetchBaseQuery({
        baseUrl:REACT_BASE_API_URL,
    }),
    endpoints: builder=>({
        getAll:builder.query({
            query: () => `/items/getAll`,
            providesTags:()=>[{type:"Items",id:"LIST"}],
            transformResponse:(data)=>data.result
        }),
        create:builder.mutation({
            query: (items) => ({
                url: `/items/create`,
                method: 'POST',
                body:items,
            }),
            invalidatesTags:()=>[{type:"Items",id:"LIST"}],
            transformResponse:(data)=>data.result
        }),
        remove:builder.mutation({
            query: ({id}) => ({
                url: `/items/remove`,
                method: 'POST',
                body:{
                    id
                },
            }),
            transformResponse:(data)=>data.result,
            invalidatesTags:()=>[{type:"Items",id:"LIST"}],
        }),
        update:builder.mutation({
            query:({id,data})=>({
                url:"/items/update",
                method:"POST",
                body:{
                    id,data
                }
            }),
            transformResponse:(data)=>data.result,
            invalidatesTags:()=>[{type:"Items",id:"LIST"}],
        })
    })
})