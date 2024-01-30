import style from "./style.module.scss"
import { Link, Navigate } from "react-router-dom"
import { useForm } from "../../../hooks/useForm"
import { useSelector } from "react-redux"
import { ItemsApi } from "../../../store/api/items.api"
import {Tovar} from "../../../utils/text.utils"
import { store } from "../../../store/store"


const fields={
    name:{
        validations:[
            value=>!value.length && "Вы забыли указать имя"
        ],
        name:"Имя",
        placeholder:"Имя*"
    },
    phone:{
        validations:[
            value=>!value.length && "Вы забыли указать телефон",
            value=>!value.replaceAll(" ","").match(/^\+?(7|8)d{10}$/) && "Не правильный формат номера телефона"
        ],
        name:"Телефон",
        placeholder:"Телефон*"
    },
    email:{
        validations:[
            value=>!value.match(/.+?@[a-z0-9_]+\.[a-z]+/i) && "Не правильный формат почты"
        ],
        optional:true,
        name:"Email",
        placeholder:"Email (необязательно)"
    },
}


function SendOrder(){
    let response
    try {
        response=fetch
    } catch (error) {
        response=error.response
    }
}



export const Checkout=()=>{

    let [getFormState,handlerChange,errors]=useForm(fields)


    let cart_list = useSelector(state=>state.cart.cart_list)
    

    let {data:items_list=[],isLoading,isError,error} = ItemsApi.useGetAllQuery()


    let items=cart_list.reduce((items,cart_element)=>{
        let item = items_list.find(item=>cart_element.select && item.id===cart_element.item_id)
        if(!item) return items
        items.push({cart_element,item})
        return items
    },[]).sort((a,b)=>b.id-a.id)


    let totalPrice=items.reduce((price,{item,cart_element})=>cart_element.select?price+cart_element.count * (item.price):price,0)

    let totalCount=items.reduce((count,{item,cart_element})=>cart_element.select?count+cart_element.count:count,0)

    let totalDiscount = items.reduce((discount,{item,cart_element})=>cart_element.select?discount+cart_element.count *(item.discount):discount,0)

    if(!cart_list.find(cart_element=>cart_element.select)) return <Navigate to="/cart"/>


    



    return (
        <div className={style.checkout}>
            <div className={style.checkout__form}>
                <button className={style.checkout__form_tocart}>
                    <img src="/img/right-arrow.svg" alt="" />
                    <p>В корзину</p>
                </button>
                <p className={style.checkout__form_title}>Оформление заказа</p>
                <p className={style.checkout__form_p1}>Пожалуйста заполните форму, и с вами свяжуться для оформления заказа. Спасибо выбираете нас!</p>
                <div className={style.checkout__form_inputbox}>
                    {Object.entries(fields).map(([key,{name,placeholder}])=>(
                        <>
                            <input type="text" name={key} placeholder={placeholder} onChange={handlerChange}/>
                            {errors[key]?<span className={style["items__update-error"]}>{errors[key]}</span>:""}
                        </>
                    ))}
                
                    
                    
                </div>
            </div>

            <div className={style.checkout__order}>
                <p className={style.checkout__order_title}>Ваш заказ</p>
                <div className={style.checkout__order_imgbox}>
                    {items.map(({cart_element,item})=>(
                        <div>
                            <img src={item.img_main} alt="" />
                            {cart_element.count?<div>{cart_element.count} шт</div>:""}
                        </div>
                    ))}
                </div>
                <p className={style.checkout__order_p2}>{Tovar(totalCount)} на сумму</p><p className={style.checkout__order_p2}>{totalPrice}</p>

                <p className={style.checkout__order_p3}>Итого</p><p className={style.checkout__order_p3}>{totalPrice}</p>

                <button onClick={()=>{

                }}>Оформить заказ</button>

                
            </div>
        </div>
    )
}