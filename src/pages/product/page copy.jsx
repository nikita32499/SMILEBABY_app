import style from "./style.module.scss"
import { createContext,useContext, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { ItemsApi } from "../../store/api/items.api"
import { Link, Navigate, useParams,useNavigate } from "react-router-dom"
import { useActions } from "../../hooks/useActions"

const Context = createContext()


const info_fields={
    season:"Сезон",
    country:"Страна производитель"
}



const Slider = ({item})=>{

    let [state,setState]=useState({
        img_list:[item.img_main,...item.img_prev],
        index:0
    })

    let navigate = useNavigate()

    let ref={
        product__slider_mobilebox:useRef()
    }

    function TouchStart(event){
        let {pageX:startX} = event.touches[0];
        let currentMarginLeft = Number(ref.product__slider_mobilebox.current.style.marginLeft?.match(/-?\d+/)?.[0]) || 0
        function TouchMove(event){
            if (event.touches.length > 0) {
                var pageX = event.touches[0].pageX;
                
                  let newMarginLeft = currentMarginLeft+pageX-startX
                  if(newMarginLeft>0){
                    newMarginLeft=0
                  }else if(ref.product__slider_mobilebox.current.clientWidth-window.innerWidth<-newMarginLeft){
                    newMarginLeft=-(ref.product__slider_mobilebox.current.clientWidth-window.innerWidth)
                    
                  }
                  ref.product__slider_mobilebox.current.style.marginLeft=`${newMarginLeft}px`
            }
        }

        function TouchEnd(event){
                
            let newMarginLeft = Number(ref.product__slider_mobilebox.current.style.marginLeft?.match(/-?\d+/)?.[0]) || 0

            if(newMarginLeft>0){
                newMarginLeft=0
            }else if(ref.product__slider_mobilebox.current.clientWidth-window.innerWidth<-newMarginLeft){
                newMarginLeft=-(ref.product__slider_mobilebox.current.clientWidth-window.innerWidth)
            }
            let index = Math.round(newMarginLeft/window.innerWidth)
            ref.product__slider_mobilebox.current.style.marginLeft=`${index*window.innerWidth}px`
            setState(prev=>({
                ...prev,
                index:-index
            }))
            window.removeEventListener("touchend",TouchEnd)
            window.removeEventListener("touchmove",TouchMove)
        }


        window.addEventListener("touchend",TouchEnd)
        window.addEventListener("touchmove",TouchMove)

    }



    return(
        <div className={style.product__slider}>
            <div className={style.product__slider_img_first}>
                <img src={state.img_list[0]} alt="" />
            </div>
            <div className={style.product__slider_img_other}>
                {state.img_list.slice(1).map((img,index)=>(
                    <img key={index} src={img} alt="" onClick={()=>{
                        setState(prev=>({
                            ...prev,
                            img_list:[...prev.img_list.slice(index+1,prev.img_list.length),...prev.img_list.slice(0,index+1)]
                        }))
                    }}/>
                ))}
            </div>
            <div className={style.product__slider_mobilebox} onTouchStart={TouchStart}>
                <div ref={ref.product__slider_mobilebox} className={style.product__slider_imgbox}>
                    {state.img_list.map((img)=>(
                    <img src={img} alt="" />
                    ))}
                </div>
                {state.img_list.length>1?<div className={style.product__slider_mobilebox_dotbox}>
                    {state.img_list.map((_,index)=>(
                        <div className={index===state.index?style["product__slider_mobilebox_dotbox--active"]:""}></div>
                    ))}
                </div>:""}
                
            </div>
            <button className={style.product__slider_mobilebox_back} onClick={()=>{
                navigate(-1)
            }}>
                <img src="/img/right-arrow.svg" alt="" />
            </button>
            
        </div>
    )
}
const Panel = ({item,items_list})=>{
    const context = useContext(Context)

    let {addManyItemsToCart,ChangeCountItemFromCart} = useActions()

    let cart_list = useSelector(state=>state.cart.cart_list)


    let ref={
        product__panel:useRef()
    }

    

    useEffect(()=>{
        let startY = window.scrollBy

        function Move(){
            let deltaY = window.scrollY - startY
            if(deltaY<0) deltaY=0
            ref.product__panel.current.style.marginTop=`${deltaY}px`
            
        }

        window.addEventListener("scroll",Move)

        return ()=>{
            window.removeEventListener("scroll",Move)
        }
    },[])

    return(
        <div ref={ref.product__panel} className={style.product__panel}>
            <h1>{item.name}</h1>
            <h2>{item.section}</h2>
            {item.discount?<div className={style.product__discount_boxs}>
                <p className={style.product__first_price}>{item.first_price} ₽</p>
                <h3 className={style.product__panel_price+" "+style["product__panel_price--discount"]}>{item.price} ₽</h3>
                <div className={style.product__discountbox}>-{Math.floor(item.discount/(item.price/100))}%</div>
            </div>:<h3 className={style.product__panel_price}>{item.price} ₽</h3>}
            <div className={style.product__panel_sizebox}>
                <p>Размер <p>RUS</p></p>
                <div className={style.product__panel_sizelist}>
                    {item.quantity.map((quant,index)=>{
                        let itChoose = cart_list.find(cart_element=>cart_element.size===quant.size && cart_element.item_id===item.id)
                        return (
                            quant.count?<button className={style.product__panel_size_button+" "+(itChoose || context.state.size.includes(quant.size)?style["product__panel_size_button--active"]:"")} key={index} onClick={()=>{
                                if(cart_list.find(cart_element=>cart_element.item_id===item.id)){
                                    return context.setState(prev=>({
                                        ...prev,
                                        errors:[...prev.errors,{name:"for first delete"}]
                                    }))
                                }
                                context.setState(prev=>({
                                    ...prev,
                                    size:prev.size.includes(quant.size)?prev.size.filter(size=>size!==quant.size):[...prev.size,quant.size],
                                    errors:prev.size.length===0?prev.errors.filter(error=>error.name!=="not choose size"):prev.errors
                                }))
                            }}>
                                {quant.size}
                            </button>:""
                        )
                    })}
                </div>
                {context.state.errors.find(error=>error.name==="for first delete")?<p className={style.product__panel_error}>Сначала удалите товар</p>:""}
            </div>
            <div className={style.product__panel_buybox}>
                {cart_list.find(cart_element=>cart_element.item_id===item.id)?<>
                    <Link to={"/cart"} className={style.product__panel_tocart_button+" "+style.product__panel_is_buy_button}>
                        Перейти в корзину
                    </Link>
                    <button className={style.product__panel_is_buy_button+" "+style.product__panel_delete_buy} onClick={()=>{
                        ChangeCountItemFromCart(
                            {
                                type:"allById",
                                count:0,
                                item_id:item.id
                            }
                        )
                        context.setState(prev=>({
                            ...prev,
                            size:[],
                            errors:prev.errors.map(error=>error.name==="for first delete")
                        }))
                    }}>
                        <img src="/img/delete.svg" alt="" />
                    </button>
                </>:<button className={style.product__panel_buy_button} onClick={()=>{
                    if(context.state.size.length===0){
                        return context.setState(prev=>({
                            ...prev,
                            errors:[...prev.errors,{name:"not choose size"}]
                        }))
                    }
                    addManyItemsToCart(context.state.size.map(size=>({
                        count:1,
                        item_id:item.id,
                        size
                    })))

                    
                }}>
                    Добавить в корзину
                </button>}
                
            </div>
            {context.state.errors.find(error=>error.name==="not choose size")?<p className={style.product__panel_error}>Выберите размер</p>:""}
            
        </div>
    )
}
const Info = ({item})=>{
    return(
        <div className={style.product__info}>
            <p className={style.product__info_title}>О товаре</p>
            <div className={style.product__info_paramsbox}>
                {Object.entries(info_fields).map(([key,name],index)=>(
                    <>
                        <p>{name}</p> <p>{item[key]}</p>
                    </>
                ))}
            </div>
            <p className={style.product__info_description}>
                {item.descriptions}
            </p>
        </div>
    )
}

export const Product=()=>{

    let [state,setState]=useState({
        action:{},
        errors:[],
        size:[]
    })

    let {item_id}=useParams()
    item_id=Number(item_id)

    let {data:items_list=[],isLoading,isError,error}=ItemsApi.useGetAllQuery()

    let item=items_list.find(item=>item.id===item_id)


    return(
        <Context.Provider value={{state,setState}}>
            {isLoading?<div>
            Загрузка...
            </div>:isError?<div>
                {console.log(error)}
                Ошибка
            </div>:!item?<div>
                Товар не найден
            </div>:<div className={style.product}>
                <Slider item={item}/>
                <Panel item={item} items_list={items_list}/>
                <Info item={item}/>
            </div>}
        </Context.Provider>
       
    )
}