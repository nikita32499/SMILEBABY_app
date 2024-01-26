import {useState,useContext, useRef} from "react"
import FileService from "../file.service"
import style from "./style.module.scss"
import { ItemsApi } from "../../../../store/api/items.api"
import { SectionsApi } from "../../../../store/api/sections.api"
import {useForm} from "../../../../hooks/useForm"
import { DeleteItem } from "./DeleteItem"

import { Context,disable,fields } from "./Context"
import { CreateItem } from "./CreateItem"
import { SubItem } from "./SubItem"








const PopUp=()=>{
    let context = useContext(Context)

    let isMain = context.state.action.img_main===context.state.action.imgSrc

    if(context.state.action.imgBlob){
        return(
            <div className={style.popup}>
                <img src={context.state.action.imgBlob} alt="" />
                <button onClick={async()=>{
                    let imgSrc = await FileService.upload_One({file:context.state.action.file})
                    if(context.state.action.clearInput) context.state.action.clearInput()
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            imgBlob:null,
                            file:null,
                            ...(context.state.action.type==="update"?{
                                img_prev:[...context.state.action.item.img_prev,imgSrc]
                            }:!context.state.action.img_main?{
                                img_main:imgSrc
                            }:{
                                img_prev:[...context.state.action.img_prev || [],imgSrc]
                            })
                        }
                    }))
                }}>Загрузить</button>
                <button onClick={()=>{
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            imgBlob:null,
                            file:null
                        }
                    }))
                }}>Закрыть</button>
            </div>
            
        )
    }
    return(
        <div className={style.popup}>
            <img src={`${window.location.origin}${context.state.action.imgSrc}`} alt="" />
            {context.state.action.img_main?<>
                {!isMain?<button onClick={()=>{
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            img_main:context.state.action.imgSrc,
                            img_prev:[prev.action.img_main,...prev.action.img_prev.filter(img=>img!==context.state.action.imgSrc)],
                            imgSrc:null
                        },
                        
                    }))
                }}>
                    Сделать основной
                </button>:""}
                {!isMain?<button onClick={()=>{
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            img_prev:context.state.action.img_prev.filter(img=>img!==context.state.action.imgSrc),
                            imgSrc:null,
                        }
                    }))
                }}>Удалить</button>:context.state.action.deletable?<button onClick={()=>{
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            img_main:null,
                            imgSrc:null,
                        }
                    }))
                }}>Удалить</button>:""}
                
            </>:""}
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        ...prev.action,
                        imgSrc:null,
                    }
                }))
            }}>Закрыть</button>
        </div>
    )
}





const Update=({item})=>{
    let context = useContext(Context)



    let itAction = context.state.action.id===item.id
    let itTarget = context.state.action.type==="update" && itAction




    let [updateItem,{}]=ItemsApi.useUpdateMutation()
    
    let [getFormState,handlerForm,errors]=useForm(fields)
    
    if(itAction){
        if(itTarget){
            return(
                <>  
                    <div className={style["items__update-box"]}>
                        
                        {Object.entries(fields).map(([key,{name}],index)=>(
                            <div className={style["items__update-edit"]}>
                                <div>
                                    <strong>{name} : </strong>
                                    {key==="descriptions"?
                                    <textarea className={style.items__description} defaultValue={item[key]} onChange={handlerForm} name={key}></textarea>
                                    :key==="section_id"?
                                    <select name="section_id" id="" onChange={handlerForm}>
                                        <option value={item.section_id}>{item.section}</option>
                                        {context.data.sections_list.filter(section=>section.id!==item.section_id).map(section=>(
                                            <option value={section.id}>{section.name}</option>
                                        ))}
                                    </select>
                                    :
                                    <input className={style['items__update-input']} type="text" defaultValue={key==="size"?item[key].join(", "):item[key]} name={key} onChange={handlerForm}/>}
                                </div>
                                {errors[key]?<span className={style["items__update-error"]}>{errors[key]}</span>:""}
                            </div>
                        ))}
                        
                    </div>
                    <SubItem item={item}/>
                    <button className={style["items__update-button"]} onClick={async()=>{
                        context.setState(disable)
                    }}>
                        Отмена
                    </button>
    
                    <button className={style["items__update-button"]} onClick={async()=>{
                        if(Object.keys(errors).length) return
                        let dataForm = getFormState({type:"force"})
                        if(!dataForm) return
                        let data = Object.entries(dataForm).reduce((data,[key,{value}])=>{
                            if(value){
                                data[key]=value
                            }
                            return data
                        },{})
    
                        if(context.state.action.img_main ) data.img_main = context.state.action.img_main
                        if(context.state.action.img_prev ) data.img_prev = context.state.action.img_prev
                        if(context.state.action.quantity ) data.quantity = context.state.action.quantity
    
                        if(Object.keys(data).length){
                            await updateItem({id:item.id,data})
                        }
                        
                        
                        context.setState(disable)
                    }}>Подтвердить изменения</button>
                    
                </>
            )
        }else{
            return
        }
        
    }else{
        return(
            <button className={style["items__update-button"]} onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        type:"update",
                        id:item.id
                    }
                }))
            }}>Изменить</button>
        )
    }


    
}
















const ImageElement=({item,img,classname=""})=>{
    let context = useContext(Context)
    let itTarget = context.state.action.type==="update" && context.state.action.id===item.id


    return(
        <img className={classname} src={`${window.location.origin}${img}`} alt="" onClick={(event)=>{
            context.setState(prev=>({
                ...prev,
                action:{
                    ...prev.action,
                    ...(itTarget?{
                        img_main: prev.action.img_main || item.img_main,
                        img_prev: prev.action.img_prev || item.img_prev
                    }:{
                        img_main:null,
                        img_prev:null
                    }),
                    imgSrc:img,
                }
            }))
        }}/>
    )
}



const ItemsInfo=({item})=>{
    let context = useContext(Context)

    let itAction = context.state.action.id===item.id
    let itTarget = context.state.action.type==="info" &&  itAction


    if(itAction){
        if(itTarget){
            return(
                <div className={style.items__info}>
                    <span><strong>Текущий номер раздела : </strong>{item.section_id}</span>
                    <button className={style["items__info-button"]} onClick={()=>{
                        context.setState(prev=>({
                            ...prev,
                            action:{}
                        }))
                    }}>Закрыть</button>
                </div>
            )
        }else{
            return
        }
    }else{
        return(
            <button className={style["items__info-button"]} onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        type:"info",
                        id:item.id
                    }
                }))
            }}>
                Доп.инфо
            </button>
        )
    }
}

const ItemsElement=({item})=>{
    item=JSON.parse(JSON.stringify(item))

    let context = useContext(Context)
    let itTarget = context.state.action.type==="update" && context.state.action.id===item.id
    
    let ref={
        input_file:useRef()
    }
 

    
    let img_prev = (itTarget && context.state.action.img_prev) || item.img_prev
    
    return(
        <div className={style["items__item"]}>
            
            <div className={style.items__slider}>
                    
                <ImageElement classname={style["items__img-main"]} item={item} img={(itTarget && context.state.action.img_main) || item.img_main}/>
                {img_prev.map((img,index)=>(
                    <ImageElement key={index} item={item} img={img}/>
                ))}
                {itTarget?<button className={style["items__add-img-button"]} onClick={(event)=>{
                    ref.input_file.current.click()


                }}><input ref={ref.input_file} style={{display:"none"}} type="file" name="" id="" onChange={async(event)=>{
                    let file = event.target.files[0]
                    let imgBlob = await FileService.getImageBlob({file})
                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            file,
                            imgBlob,
                            item,
                            clearInput:()=>event.target.files=null
                        }
                    }))
                }}/>Добавить изображение</button>:""}
            </div>
            
            {itTarget?"":
            <>
            
                
                {Object.entries(fields).map(([key,{name}],index)=>{
                    let value = key==="section_id"?item.section:key==="size"?item[key].join(", "):item[key]
                    return(
                        <div>
                            <strong>{name}  :  </strong>{value}
                        </div>
                    )
                })}
                <div className={style.items__quantity_table}>
                    <p>Кол-во</p>
                    <p>Размер</p>
                    {item.quantity.map((quantity,index)=>(
                        <>
                            <p>{quantity.count}</p>
                            <p>{quantity.size}</p>
                        </>
                    ))}
                </div>
            </>
            }
            
        
            <Update item={item}/>
            <DeleteItem item={item}/>
            <ItemsInfo item={item}/>
            
        </div>
    )
}

export const Items=()=>{

    let [state,setState]=useState({
        action:{}
    })
    
    let {isLoading,data:items_list=[],isError,error} = ItemsApi.useGetAllQuery()
    let {data:sections_list=[]}=SectionsApi.useGetAllSectionsQuery()
    

    return(
        <Context.Provider value={{state,setState,data:{sections_list,items_list}}}>
            <div>
                <CreateItem/>
                <div className={style.items__list}>
                {isLoading?
                <div>
                    Идёт загрузка...
                </div>
                :isError?
                <div>
                    Произошла ошибка
                    {console.log(error)}
                </div>
                :items_list.map((item,index)=>(
                    <ItemsElement key={index} item={item}/>
                ))}
                </div>
                {state.action.imgSrc || state.action.imgBlob?<PopUp/>:""}
               
            </div>
        </Context.Provider>
        
        
    )
}