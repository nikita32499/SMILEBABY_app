import { ItemsApi } from "../../../../store/api/items.api"
import { OrderApi } from "../../../../store/api/order.api"
import { createContext,useContext, useState } from "react"

import style from "./style.module.scss"
import { Link } from "react-router-dom"

const Context = createContext()

const Order=({order})=>{
    let context = useContext(Context)
    let date_str = ((d)=>`${d.getHours()}`.padStart(2,"0")+`:${d.getMinutes()}`.padStart(2,"0")+`  ${d.getDate()}`.padStart(2,"0")+`.${d.getMonth()+1}`.padStart(2,"0")+`.${d.getFullYear()}`)(new Date(1706642484080))
    // let item = context.item_list.find(item=>item.id)

    let isTarget = context.state.action.type==="delete" && context.state.action.id===order.id
    


    return(
        <div className={style.order__box}>
            <div className={style.order__user_info}>
                <p><strong>ID:</strong> {order.id}</p>
                <p><strong>Имя:</strong> {order.name}</p>
                <p><strong>Телефон:</strong> {order.phone}</p>
                <p><strong>Email:</strong> {order.email || "Не указан"}</p>
                <p><strong>Создан:</strong> {date_str}</p>
            </div>
            <div className={style.order__user_productlist}>
                {order.items.map(cart_item=>({...cart_item,item:context.item_list.find(item=>item.id===cart_item.item_id)})).filter(cart_item=>cart_item.item).map(cart_item=>(
                    <div className={style.order__user_product}>
                        <Link to={`/product/${cart_item.item_id}`}><strong>{cart_item.item.name}</strong></Link>
                        <p>Размер: {cart_item.size}</p>
                        <p>Кол-во: {cart_item.count}</p>
                        
                    </div>
                ))}
            </div>
            {isTarget?<>
                <button onClick={()=>{
                    context.setState(prev=>({
                        ...prev,
                        action:{}
                    }))
                }}>
                    Отмена
                </button>
                <button onClick={()=>{
                    context.deleteOrder({id:order.id})
                }}>
                    Подтвердить удаление
                </button>
            </>:<button onClick={()=>{
               context.setState(prev=>({
                    ...prev,
                    action:{
                        type:"delete",
                        id:order.id
                    }
               })) 
            }}>Удалить заказ</button>}
        </div>
    )
}



export const Orders=()=>{
    let [state,setState]=useState({
        action:{}
    })

    let {data:orders_list=[],...order_query}=OrderApi.useGetAllOrdersQuery()


    let {data:item_list=[],...item_query}=ItemsApi.useGetAllQuery()

    let [deleteOrder] = OrderApi.useDeleteOrderMutation()

    return(
        <Context.Provider value={{state,setState,item_list,deleteOrder}}>
            {order_query.isError || item_query.isError?<div>{console.error(order_query.error || item_query.isError)}Ошибка</div>:order_query.isLoading || item_query.isLoading?<div>Загрузка...</div>:
            <div className={style.order__list}>
                {orders_list.map(order=>(
                    <Order order={order}/>
                ))}
            </div>}
        </Context.Provider>
        
    )
}