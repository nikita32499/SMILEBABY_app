import { useActions } from "../../hooks/useActions"
import style from "./CartElement.module.scss"




export const CartElement=({cart_element:{cart_element,item}})=>{

    let {ChangeCountItemFromCart,setSelectManyItems}=useActions()

    let itemCount = item.quantity.find(quant=>quant.size===cart_element.size).count

    return(
        <div className={style.cartelement}>
            <button className={style.cartelement__select} onClick={()=>{
                setSelectManyItems({
                    item_id:cart_element.item_id,
                    size:cart_element.size,
                    select:!cart_element.select
                })
            }}>
                {cart_element.select?<img src="/img/galka.svg" alt="" />:""}
            </button>
            <img src={item.img_main} alt="" />
            <div className={style.cartelement__infobox}>
                <p>{item.name}</p>
                <div className={style.cartelement__infobox_info}>
                    <p>Размер: {cart_element.size}</p>
                    <p>В наличии: {itemCount} шт</p>
                </div>
                {itemCount>1?<div className={style.cartelement__countbox}>
                    <button onClick={()=>{
                        if(cart_element.count-1===0) return
                        ChangeCountItemFromCart({
                            item_id:cart_element.item_id,
                            size:cart_element.size,
                            count:cart_element.count-1
                        })
                    }}>
                        <img src="/img/minus.svg" alt="" />
                    </button>
                    <div>{cart_element.count}</div>
                    <button onClick={()=>{
                        if(cart_element.count+1>itemCount) return
                        ChangeCountItemFromCart({
                            item_id:cart_element.item_id,
                            size:cart_element.size,
                            count:cart_element.count+1
                        })
                    }}>
                        <img src="/img/plus.svg" alt="" />
                    </button>
                </div>:<span className={style.cartelement__pricebox_last}>Последний</span>}
            </div>

            <div className={style.cartelement__pricebox}>
                {item.discount?<>
                    <p className={style.cartelement__pricebox_first_price}>{item.first_price} ₽</p>
                    <p className={style.cartelement__pricebox_price+" "+style["cartelement__pricebox_price--discount"]}>{item.price} ₽</p>
                    <div className={style.cartelement__discountbox}>-{Math.floor(item.discount/(item.price/100))}%</div>
                </>:<p className={style.cartelement__pricebox_price}>{item.price} ₽</p>}
            </div>

            <button className={style.cartelement__delete} onClick={()=>{
                ChangeCountItemFromCart({
                    item_id:cart_element.item_id,
                    size:cart_element.size,
                    count:0
                })
            }}>
                <img src="/img/delete-gray.svg" alt="" />
            </button>
        </div>
    )
}