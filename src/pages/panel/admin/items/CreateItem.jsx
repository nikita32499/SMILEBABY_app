import { useContext,useRef } from "react"

import { Context,disable,fields } from "./Context"
import {useForm} from "../../../../hooks/useForm"
import { ItemsApi } from "../../../../store/api/items.api"
import FileService from "../file.service"
import style from "./style.module.scss"





export const CreateItem=()=>{
    const context=useContext(Context)

    let ref={
        input_file:useRef()
    }
    let [createItem,{}]=ItemsApi.useCreateMutation()

    let [getFormState,handlerForm,errors] = useForm(fields)


    let itTarget = context.state.action.type==="create"

    return(
        context.state.action.type==="create"?<div className={style.items__create}>
            <h2>Создание товара</h2>

            <div className={style.items__slider}>
                {context.state.action.img_main?<img className={style["items__img-main"]} src={context.state.action.img_main} alt=""  onClick={()=>{
                        context.setState(prev=>({
                            ...prev,
                            action:{
                                ...prev.action,
                                imgSrc:context.state.action.img_main,
                                deletable:true
                            }
                        }))
                    }}/>:""}
                {itTarget?(context.state.action.img_prev || []).map(img=>(
                    <img src={img} alt="" onClick={()=>{
                        context.setState(prev=>({
                            ...prev,
                            action:{
                                ...prev.action,
                                imgSrc:img
                            }
                        }))
                    }}/>
                )):""}
                <button  className={style["items__add-img-button"]} onClick={()=>{
                    ref.input_file.current.click()
                }}><input ref={ref.input_file} style={{display:"none"}} type="file" name="" id="" onChange={async(event)=>{
                    let file = event.target.files[0]
                    let imgBlob = await FileService.getImageBlob({file})


                    context.setState(prev=>({
                        ...prev,
                        action:{
                            ...prev.action,
                            imgBlob,
                            file,
                            clearInput:()=>event.target.files=null
                        }
                    }))
                    
                }}/>Загрузить изображение</button>
                
            </div>
            {errors.img_main && !context.state.action.img_main?<span className={style["items__update-error"]}>Нужно обязательно указать основное фото товара</span>:""}
            {Object.entries(fields).map(([key,{name}])=>(
                <div key={key} className={style["items__create-input"]}>
                    <div>
                        <strong>{name} : </strong>
                        {key==="descriptions"?
                        <textarea className={style.items__description} onChange={handlerForm} name={key}></textarea>
                        :key==="section_id"?
                        <select name="section_id" id="" onChange={handlerForm}>
                            <option value={"-"}>Выберите кателогию</option>
                            {context.data.sections_list.map(section=>(
                                <option value={section.id}>{section.name}</option>
                            ))}
                        </select>
                        :
                        <input className={style['items__update-input']} type="text"  name={key} onChange={handlerForm}/>}
                    </div>
                    {errors[key]?<span className={style["items__update-error"]}>{errors[key]}</span>:""}
                </div>
            ))}
            
            <button onClick={async()=>{
                let dataForm = getFormState({extended:{
                    img_main:context.state.action.img_main
                }})
                if(!dataForm) return
                let items = Object.entries(dataForm).reduce((data,[key,{value}])=>{
                    if(value){
                        data[key]=value
                    }
                    return data
                },{})

                items.img_main = context.state.action.img_main
                items.img_prev = context.state.action.img_prev || []

                let {data,error} = await createItem(items)
                if(data){
                    context.setState(disable)
                }
                
            }}>
                Подтвердить Создание
            </button>
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{}
                }))
            }}>
                Отмена
            </button>
        </div>:<button className={style["items__create-item-button"]} onClick={()=>{
            context.setState(prev=>({
                ...prev,
                action:{
                    type:"create"
                }
            }))
        }}>
            Создать карточку товара
        </button>
    )
}