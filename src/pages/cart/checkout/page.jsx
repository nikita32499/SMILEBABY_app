import style from "./style.module.scss"
import { Link, Navigate,useNavigate } from "react-router-dom"
import { useForm } from "../../../hooks/useForm"
import { useSelector } from "react-redux"
import { ItemsApi } from "../../../store/api/items.api"
import {Tovar} from "../../../utils/text.utils"
import { store } from "../../../store/store"
import { CartSlice } from "../../../store/cart/cart.slice"
import { Cart } from "../page"
import { OrderApi } from "../../../store/api/order.api"
import { useEffect } from "react"


import ErrorElement from "../../../components/ErrorElement/ErrorElement"
import Loading from "../../../components/Loading/Loading"

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
            value=>!value.replaceAll(" ","").match(/^\+?(7|8)\d{10}$/) && "Не правильный формат номера телефона"
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


// async function SendOrder({phone,name,email}){
//     let items = store.getState().cart.cart_list

    // if(!items.length){
    //     return 
    // }

//     let response
//     try {
//         response=await fetch(`${window.location.origin}/api/smilebaby/orders/create`,{
//             method:"POST",
//             headers:{
//                 'Content-Type': 'application/json'
//             },
//             body:JSON.stringify({
//                 items,
//                 phone,
//                 name,
//                 email
//             })
//         })
//     } catch (error) {
//         response=error.response
//     }
//     if(response.status===200){
//         let data = await response.json()

//         if("result" in data){
//             return true
            
//         }
//     }
// }



const Checkout=()=>{

    let [getFormState,handlerChange,errors]=useForm(fields)


    let cart_list = useSelector(state=>state.cart.cart_list)
    
    let {totalPrice,totalCount} = useSelector(state=>state.cart.total)

    let {data:items_list=[],isLoading,isError,error} = ItemsApi.useGetAllQuery()


    cart_list=cart_list.filter(cart_element=>cart_element.select)

    let [createOrder] = OrderApi.useCreateOrderMutation()


    if(!cart_list.length) return <Navigate to="/cart"/>


    



    return (
        isError?<ErrorElement/>:isLoading?<Loading/>:
        <div className={style.checkout}>
            <div className={style.checkout__form}>
                <Link to="/cart" className={style.checkout__form_tocart}>
                    <img src="/img/right-arrow.svg" alt="" />
                    <p>В корзину</p>
                </Link>
                <p className={style.checkout__form_title}>Оформление заказа</p>
                <p className={style.checkout__form_p1}>Пожалуйста заполните форму, и с вами свяжуться для оформления заказа. <br/><br/> Спасибо что выбираете нас!</p>
                <div className={style.checkout__form_inputbox}>
                    {Object.entries(fields).map(([key,{name,placeholder}])=>(
                        <>
                            <input type="text" name={key} placeholder={placeholder} onChange={handlerChange}/>
                            {errors[key]?<p className={style.checkout__form_error}>{errors[key]}</p>:""}
                        </>
                    ))}
                
                    
                    
                </div>
            </div>

            <div className={style.checkout__order}>
                <p className={style.checkout__order_title}>Ваш заказ</p>
                <div className={style.checkout__order_imgbox}>
                    {cart_list.map((cart_element)=>(
                        <div>
                            <img src={items_list.find(item=>item.id===cart_element.item_id).img_main} alt="" />
                            {cart_element.count?<div>{cart_element.count} шт</div>:""}
                        </div>
                    ))}
                </div>
                <p className={style.checkout__order_p2}>{Tovar(totalCount)} на сумму</p><p className={style.checkout__order_p2}>{totalPrice} ₽</p>

                <p className={style.checkout__order_p3}>Итого</p><p className={style.checkout__order_p3}>{totalPrice} ₽</p>

                <button onClick={async()=>{
                    let formData = getFormState()
                    if(!formData) return
                    let response = await createOrder({
                        phone:formData.phone.value,
                        email:formData.email.value,
                        name:formData.name.value
                    })
                    if(response?.data?.result){
                        store.dispatch(CartSlice.actions.clearCart())
                        window.location.assign("/")
                    }
                }}>Оформить заказ</button>

                
            </div>
        </div>
    )
}

export default Checkout