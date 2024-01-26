import { Navigate, useParams } from "react-router-dom"
import style from "./style.module.scss"
import { useContext, useEffect, useMemo, useRef, useState } from "react"

import { ItemsApi } from "../../store/api/items.api"
import { SectionsApi } from "../../store/api/sections.api"
import { SectionsList } from "../../components/SectionsList/SectionsList"
import { ShopContext } from "./ShopContext"
import { ItemCard } from "./ItemCard"
import { Filter } from "./Filter"
import { useSelector } from "react-redux"
import { useActions } from "../../hooks/useActions"
import { useUrlParams } from "../../hooks/useUrlParams"
import { Link } from "react-router-dom"

const PagesPanel=({ItemList})=>{
    let max_view = 15
    let {page} = useUrlParams()
    page = Number(page) || 1
    

    let length = Math.ceil(ItemList.length/max_view)

    return(
        length>1?<div className={style.shop__pagepanel}>
            {page>1?<Link to={`?page=${page-1}`} className={style.shop__pagepanel_buttonmove}><img src={`/img/right-arrow.svg`} alt="" /> <p>Назад</p></Link>:<div className={style.shop__pagepanel_hidden}></div>}
            
            <div className={style.shop__pagepanel_buttonbox}>
                {[...Array(length)].map((_,index)=>(
                    <Link key={index} to={`?page=${index+1}`} className={style.shop__pagepanel_page+" "+(index+1===page?style["shop__pagepanel_page--active"]:"")}>
                        {index+1}
                    </Link>
                ))}
            </div>
            {page===length?<div className={style.shop__pagepanel_hidden}></div>:<Link to={`?page=${page+1}`} className={style.shop__pagepanel_buttonmove}><p>Дальше</p> <img style={{transform:"rotate(180deg)"}} src={`/img/right-arrow.svg`} alt="" /></Link>}
        </div>:""
    )
}




export const Shop=()=>{

    let [state,setState]=useState({
        action:{}
    })
    

    let {section_id} = useParams()
    let {page} = useUrlParams()
    let max_view = 15
    page = Number(page) || 1
    
    let {data:items_list=[],...items_query} = ItemsApi.useGetAllQuery(null,{pollingInterval:60000})
    let {data:sections_list=[],...sections_query} = SectionsApi.useGetAllSectionsQuery(null,{pollingInterval:60000})
    

    let section={}
    if(section_id!=="all"){
        if(!sections_query.isLoading && !sections_query.isError){
            section = sections_list.find(section=>section.id===Number(section_id)) || {}
        }
    }else{
        section={name:"Все товары"}
    }
    
    

    let filter = useSelector(state=>state.items.filter)
    

    items_list=items_list.filter(item=>!(section_id!=="all" && Number(section_id)!==item.section_id))


    let ItemList=items_list.filter(item=>{
        if(item.price<filter.price.min || (filter.price.max && item.price>filter.price.max)){
        }else if(filter.season.length && !filter.season.includes(item.season)){
        }else if(filter.size.length && !item.quantity.find(({size})=>filter.size.includes(size))){
        }else if(!item.quantity.find(({count})=>count)){    
        }else{
            return true
        }
    })
    if(filter.sort){
        ItemList=ItemList.sort((a,b)=>{
            if(filter.sort==="price++"){
                return a.price-b.price
            }else if(filter.sort==="price--"){
                return b.price-a.price
            }else{
                return 0
            }
        })
    }


    let ref={
        shop__cardlist:useRef()
    }

    if(ItemList.length && ItemList.length+max_view<(page*max_view)+1){
        return <Navigate to={"?page=1"}/>
    }

    

    return(
        <ShopContext.Provider value={{state,setState}}>
            <div className={style.shop}>
                <SectionsList change={(event)=>{
                    ref.shop__cardlist.current.classList.add(style["shop__list--active"])
                }}/>
                <div ref={ref.shop__cardlist} className={style.shop__list+" "+(window.location.search.includes("page=")?style["shop__list--active"]:"")}>
                    <div className={style.shop__title_box}>
                        <div className={style.shop__mobile_box}>
                            <button className={style.shop__back_to_sections} onClick={()=>{
                                ref.shop__cardlist.current.classList.remove(style["shop__list--active"])
                            }}>
                                <img src="/img/right-arrow.svg" alt="" />
                                <div>
                                    <h2>{section.name}</h2> 
                                    <p>{ItemList.length} товаров</p> 
                                </div>
                            </button>
                        </div>
                        <h2>{section.name}</h2>
                        
                        <Filter items_list={items_list}/>
                    </div>
                    <div className={style.shop__cardlist}>
                        {ItemList.length?ItemList.slice((page-1)*max_view,page*max_view).map((item,index)=>(
                            <ItemCard item={item} key={index}/>
                        )):<div className={style.shop__notfound_item}>
                            Не один товар не найден
                        </div>}
                    </div>
                    <PagesPanel ItemList={ItemList}/>
                </div>
            </div>
        </ShopContext.Provider>
        
    )
}