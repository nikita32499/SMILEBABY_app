import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const REACT_BASE_API_URL=  "http://127.0.0.1/api/smilebaby"

export const SectionsApi = createApi({
    reducerPath:"SectionsApi",
    tagTypes:["Sections"],
    baseQuery:fetchBaseQuery({
        baseUrl:REACT_BASE_API_URL,
    }),
    endpoints: builder=>({
        getAllSections:builder.query({
            query: () => `/sections/getAll`,
            providesTags:(result,arg)=>{
                return [{type:"Sections",id:"LIST"}]
            },
            transformResponse:(data)=>data.result,
            
        }),
        createSection:builder.mutation({
            query: ({name,img}) => ({
                url: `/sections/create`,
                method: 'POST',
                body:{
                    name,img
                },
            }),
            invalidatesTags:()=>[{type:"Sections",id:"LIST"}],
            transformResponse:(data)=>data.result
            
        }),
        updateSection:builder.mutation({
            query:({id,data})=>({
                url:"/sections/update",
                method:"POST",
                body:{
                    id,data
                }
            }),
            invalidatesTags:()=>[{type:"Sections",id:"LIST"}],
            transformResponse:(data)=>data.result
        }),
        removeSection:builder.mutation({
            query:({id})=>({
                url:"/sections/remove",
                method:"POST",
                body:{id}
            }),
            invalidatesTags:()=>[{type:"Sections",id:"LIST"}],
            transformResponse:(data)=>data.result
        })
    })
})
