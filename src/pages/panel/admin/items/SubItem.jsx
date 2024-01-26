import { useState,useContext, useRef } from "react"
import { Context } from "./Context"
import style from "./style.module.scss"
import { useForm } from "../../../../hooks/useForm"


const fields={
    size:{
        name:"Размер",
        validations:[
            value=>!value.length && "Заполните Размер",
             
        ],
        transform:value=>Number(value)
    },
    count:{
        validations:[
            value=>!value.length && "Укажите Кол-во",
            value=>isNaN(Number(value)) && "Нужно указать число"
        ],
        name:"Количество",
        transform:value=>Number(value)
    },
    
}













const Delete =({item,quantity})=>{
    let context = useContext(Context)

    if(context.state.action.subitem?.type==="delete"){
        return(
            <>
                <button onClick={()=>{
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            subitem:{}
                        }
                    }))
                }}>Отмена</button>
                <button onClick={()=>{
                    let prevQuantity = context.state.action.quantity || item.quantity || []

                    

                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            subitem:{},
                            quantity:[...prevQuantity.filter(el=>el.id!==quantity.id)]
                        }
                    }))
                }}>Подтвердить удаление</button>
            </>
        )
    }else if(context.state.action.subitem?.type==null){
        return(
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        ...prev.action,
                        subitem:{
                            type:"delete"
                        }
                    }
                }))
            }}>Удалить</button>
        )
    }else{
        return
    }

    
}


const Update=({item,quantity})=>{
    let context = useContext(Context)
    let [getFormState,handlerForm,errors]=useForm(fields)

    if(context.state.action.subitem?.type==="update"){
        return(
            <div className={style.items__subitem_update}>
                <div>
                    {Object.entries(fields).map(([key,{name}])=>(
                        <>
                            <p>{name}</p>
                            <input name={key} onChange={handlerForm} type="text" defaultValue={quantity[key]}/>
                            <p className={style["items__update-error"]}>{errors[key]?errors[key]:""}</p>
                        </>
                    ))}
                </div>
                <button onClick={()=>{

                    let dataForm = getFormState({type:"force"})
                    if(!dataForm) return
                    let count=dataForm.count.value || quantity.count
                    let size=dataForm.size.value || quantity.size
                    // let discount=dataForm.discount.value || quantity.discount || 0

                    let prevQuantity = context.state.action.quantity || item.quantity || []

                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            quantity:[...prevQuantity.filter(el=>el.id!==quantity.id),{count,size,id:quantity.id}],
                            subitem:{}
                        }
                    }))

                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                        }
                    }))
                }}>Сохранить изменения</button>
                <button onClick={()=>{
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            subitem:{}
                        }
                    }))
                }}>Отмена</button>
            </div>
        )
    }else if(context.state.action.subitem?.type==null){
        return(
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        ...prev.action,
                        subitem:{
                            type:"update"
                        }
                    }
                }))
            }}>
                Изменить
            </button>
        )
    }else{
        return
    }
}



const Create=({item})=>{
    let context = useContext(Context)

    let [getFormState,handlerForm,errors]=useForm(fields)



    if(context.state.action.subitem?.type==="create"){
        return(
            <div className={style.items__createbox}>
                
                <div>
                    <h1>Создание подтипа</h1>
                    {Object.entries(fields).map(([key,{name}])=>(
                        <>
                            <p>{name}</p>
                            <input name={key} onChange={handlerForm} type="text"/>
                            <p className={style["items__update-error"]}>{errors[key]?errors[key]:""}</p>
                        </>
                    ))}

                </div>
                <div className={style.items__createbox_buttons}>
                    <button onClick={()=>{
                        context.setState(prev=>({
                            ...prev,
                            action:{
                                ...prev.action,
                                subitem:{}
                            }
                        }))
                    }}>
                        Отмена
                    </button>
                    <button onClick={()=>{

                        let dataForm = getFormState()
                        if(!dataForm) return

                        let count=dataForm.count.value
                        let size=dataForm.size.value
                        // let discount=dataForm.discount.value || 0

                        let prevQuantity = context.state.action.quantity || item.quantity || []

                        context.setState(prev=>({
                            ...prev,
                            action:{
                                ...prev.action,
                                quantity:[...prevQuantity,{count,size,id:Math.random()}],
                                subitem:{}
                            }
                        }))
                    }}>
                        Добавить подтип
                    </button>
                </div>
            </div>
        )
    }else if(context.state.action.subitem?.type==null){
        return(
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        ...prev.action,
                        subitem:{
                            type:"create"
                        }
                    }
                }))
            }}>Создать подтип</button>
        )
    }else{
        return
    }



    
}



const SubItemElement=({item,quantity})=>{
    let context = useContext(Context)

    return(
        <div className={style.items__subitem_box}>  
            
            {context.state.action.subitem?.type!=="update"?<div className={style.items__subitem_element}>
                    <p>Количество</p>
                    <p>{quantity.count}</p>
                    <p>Размер</p>
                    <p>{quantity.size}</p>
                
            </div>:""}
            <Update item={item} quantity={quantity}/>
            <Delete item={item} quantity={quantity}/>
            
        </div>
    )
}




export const SubItem=({item})=>{
    let context = useContext(Context)

    return(
        <div className={style.items__subitem}>
            
            {(context.state.action.quantity || item.quantity).map(quantity=>(
                <SubItemElement item={item} quantity={quantity}/>
            ))}
            <Create item={item}/>
            
        </div>
    )
}