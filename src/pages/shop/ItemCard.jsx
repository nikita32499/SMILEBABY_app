import { useContext, useRef, useState } from "react"
import { ShopContext } from "./ShopContext"
import style from "./itemcard.module.scss"
import { Link } from "react-router-dom"

const Slider=({item})=>{
    let shopContext=useContext(ShopContext)


    let [state,setState]=useState({
        action:{}
    })

    

    let img_arr = [item.img_main,...item.img_prev || []]

    let img_number = state.action.img_number
    let isTarget = state.action.type==="hover" && state.action.id===item.id
    
    let img = isTarget && "img_number" in state.action?img_arr[img_number]:img_arr[0]

    return(
        <div className={style.itemcard__slider} onMouseMove={(event)=>{
            
            const { clientX } = event;
            const { left } = event.target.getBoundingClientRect();

            const x = clientX - left;
            
            let img_number = Math.floor((x/event.target.width*100)/(100/(item.img_prev.length+1)))
            if(state.action.img_number===img_number && item.id===state.action.id) return

            setState(prev=>({
                ...prev,
                action:{
                    type:"hover",
                    id:item.id,
                    img_number

                }
            }))
        }} onMouseLeave={()=>{
            if(state.action.type==="hover"){
                setState(prev=>({
                    ...prev,
                    action:{}
                }))
            }
        }}> 
        
            
            
            <img src={img} alt="" />
            {item.discount?<div className={style.itemcard__discountbox}>
                -{Math.floor(item.discount/(item.price/100))}%
            </div>:""}
            <div className={style.itemcard__slider_img_toggle} style={{gridTemplateColumns:`repeat(${img_arr.length},1fr)`}}>
                {isTarget && img_arr.length>1 && [...Array(img_arr.length)].map((_,index)=>(
                    <div className={style.itemcard__slider_img_toggle_element+" "+(index===img_number?style["itemcard__slider_img_toggle_element--active"]:"")}></div>
                ))}
            </div>
        </div>
    )
}



export const ItemCard=({item})=>{
    let shopContext=useContext(ShopContext)

   
    return(
        <div className={style.itemcard__fixed}>
            <Link  to={`/product/${item.id}`} className={style.itemcard}>
                <Slider item={item}/>
                <div className={style.itemcard__pricebox}>
                    {item.discount>0?<div>
                        <p className={style.itemcard__first_price}>{item.first_price} ₽</p>
                        <p className={style.itemcard__price+" "+style["itemcard__price--discount"]}>{item.price} ₽</p>
                    </div>:<p className={style.itemcard__price}>{item.price} ₽</p>}
                </div>
                <span className={style.itemcard__info_p}>{item.name}</span>
                <div className={style.itemcard__sizes}>
                    Размеры: {item.quantity.map(({size})=>`${size}`).join(", ") || "закончились"}
                </div>
                <p className={style.itemcard__button}>Подробнее</p>
            </Link>
        </div>
    )
}