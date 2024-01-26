import style from "./style.module.scss"
import { Link, Navigate } from "react-router-dom"
import { useForm } from "../../../hooks/useForm"

import { useSelector } from "react-redux"

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

export const Checkout=()=>{

    let [getFormState,handlerChange,errors]=useForm(fields)


    let cart_list = useSelector(state=>state.cart.cart_list)

    if(cart_list.length===0) return <Navigate to="/cart"/>

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

                </div>
                <p></p><p></p>

                <p></p><p></p>

                <button>Оформить заказ</button>

                <p>Нажимая на кнопку «Оформить заказ», вы принимаете условия <Link></Link></p>
            </div>
        </div>
    )
}