import { useSelector } from "react-redux"
import style from "./style.module.scss"
import { createContext,useContext,useState } from "react"
import { useActions } from "../../hooks/useActions"
import { SectionsApi } from "../../store/api/sections.api"
import { ItemsApi } from "../../store/api/items.api"
import { CartElement } from "./CartElement"
import { Link } from "react-router-dom"
import * as text_util from "../../utils/text.utils"


const Context = createContext()




const CartList=({cart_list,sections})=>{
    let context = useContext(Context)

    let {setSelectManyItems,ChangeCountItemFromCart} = useActions()

    console.log("time",context.time)

    

    return(
        <div className={style.cart__cartlist}>
            <div className={style.cart__cartlist_header}>
                <div className={style.cart__cartlist_header_title}>
                    <h1>Корзина</h1>
                    {cart_list.length?<button>
                        {text_util.Tovar(cart_list.length)}
                    </button>:""}
                </div>
                <div className={style.cart__cartlist_header_panel}>
                    <button className={style.cart__cartlist_header_panel_selectall} onClick={()=>{
                        setSelectManyItems(cart_list.map(cart_element=>({
                            size:cart_element.size,
                            item_id:cart_element.item_id,
                            select:cart_list.every(cart_element=>cart_element.select)?false:true
                        })))
                    }}>
                        <div>
                            {cart_list.every(cart_element=>cart_element.select)?<img src="/img/galka.svg" alt="" />:""}
                        </div>
                        Выбрать всё
                    </button>
                    <button className={style.cart__cartlist_header_panel_delete} onClick={()=>{
                        ChangeCountItemFromCart(cart_list.filter(cart_element=>cart_element.select).map(cart_element=>({
                            size:cart_element.size,
                            item_id:cart_element.item_id,
                            count:0
                        })))
                    }}>
                        <img src="/img/delete.svg" alt="" />
                        Удалить <p>{cart_list.filter(cart_element=>cart_element.select).length}</p>
                        
                    </button>
                </div>
            </div>


            <div>
                {sections.map((section)=>(
                    <div className={style.cart__section}>
                        <p>{section.name}</p>
                        {section.items.map(cart_element=>(
                            <CartElement cart_element={cart_element}/>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}


const PriceBox=()=>{
    let context = useContext(Context)

    

    return(
        context.totalCount>0?<div className={style.cart__pricebox}>
            <h2 className={style.cart__pricebox_title}>Сумма заказа</h2>
            <p>{text_util.Tovar(context.totalCount)} на сумму</p><p>{context.totalPrice} ₽</p>
            {context.totalDiscount>0?<>
                <p>Скидка</p><p className={style.cart__price_discount}>{context.totalDiscount} ₽</p>
            </>:""}
            <p className={style.cart__pricebox_total}>Итого</p><p  className={style.cart__pricebox_total}>{context.totalPrice} ₽</p>
            <Link to={"/cart/checkout"} className={style.cart__pricebox_link+" "+(context.totalCount===0?style["cart__pricebox_link--disable"]:"")} onClick={(event)=>{
                if(context.totalCount===0) return event.preventDefault()
            }}>
                <p>Перейти к оформлению</p>
                <p>{text_util.Tovar(context.totalCount)}</p>
            </Link>
        </div>:""
    )
}


export const Cart=()=>{

    let [state,setState]=useState({
        select:[]
    })

    let cart_list = useSelector(state=>state.cart.cart_list) || []

    let {data:items_list=[],isLoading,isError,error} = ItemsApi.useGetAllQuery()

    let sections=cart_list.reduce((sections,cart_element)=>{
        let item = items_list.find(item=>item.id===cart_element.item_id)

        if(!item) return sections
        let section = sections.find(section=>section.id===item.section_id)
        if(section){
            section.items.push({cart_element,item})
            return sections
        }else{
            return [...sections,{id:item.section_id,name:item.section,items:[{cart_element,item}]}]
        }

    },[]).sort((a,b)=>b.id-a.id)



    let totalPrice=sections.reduce((price,{items})=>price+items.reduce((price,{item,cart_element})=>cart_element.select?price+cart_element.count * (item.price):price,0),0)

    let totalCount=sections.reduce((count,{items})=>count+items.reduce((count,{item,cart_element})=>cart_element.select?count+cart_element.count:count,0),0)

    let totalDiscount = sections.reduce((discount,{items})=>discount+items.reduce((discount,{item,cart_element})=>cart_element.select?discount+cart_element.count *(item.discount):discount,0),0)

    return(
        <Context.Provider value={{state,setState,totalPrice,totalCount,totalDiscount}}>
            {isLoading?<div>
                Загрузка...
            </div>:isError?<div>
                {console.error(error)}
                Ошибка
            </div>:<div className={style.cart}>
                <CartList cart_list={cart_list} sections={sections}/>
                <PriceBox/>
                {totalCount===0?<p className={style.cart__emptycart}>У вас пустая корзина</p>:""}
            </div>}
        </Context.Provider>
        
    )
}