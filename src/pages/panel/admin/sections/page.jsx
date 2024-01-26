import {useEffect,useState,createContext,useContext, useRef,memo, useMemo} from "react"
import FileService from "../file.service"

import style from "./style.module.scss"
import {SectionsApi} from "../../../../store/api/sections.api"

const Context=createContext()



const disable=(prev)=>({
    ...prev,
    action:{}
})



const Create=()=>{
    let context = useContext(Context)
    
    let [createSection,{}]=SectionsApi.useCreateSectionMutation()
    

    let ref={
        name:useRef()
    }


    

    return (
        <div className={style.create}>
                        {context.state.action.type==="create"?
                            <>
                            
                                <div className={style.create__preview}>
                                    {context.state.imgSrc && context.state.action.type==="create"?<img src={context.state.imgSrc} alt="" />:""}
                                    <input placeholder="Введите имя Раздела" ref={ref.name} type="text" />
                                </div>
                                    
                                <input type="file" name="file" id="" onChange={async(event)=>{
                                    let file = event.target.files[0]
                                        
                                    context.setState(prev=>({
                                        ...prev,
                                        file
                                    }))
                                }}/>


                                <button className={style.create__button} onClick={async()=>{
                                    let name = ref.name.current.value
                                    if(!context.state.imgSrc){
                                        return alert("Пропущено Фото Раздела")
                                    }else if(!name){
                                        return alert("Пропущено Имя Раздела")
                                    }

                                    await createSection({name,img:context.state.imgSrc})
                                    context.setState(prev=>({
                                        ...prev,
                                        imgSrc:null
                                    }))

                                }}>Создать</button>
                            </>

                            
                        :<button className={style.create__button} onClick={()=>{
                            context.setState(prev=>({
                                ...prev,
                                file:null,
                                imgSrc:null,
                                action:{
                                    type:"create",
                                }
                            }))
                        }}>
                            Создать раздел
                        </button> }
            </div>
        )
}




// принимает file
// ->
// создаёт imgSrc и удаляет file
const Popup=()=>{
    let context=useContext(Context)


    

    let [state,setState]=useState({
        create:false
    })

    useEffect(()=>{
        (async()=>{
            let imgSrc = await FileService.getImageBlob({file:context.state.file})
                    
            setState(prev=>({
                ...prev,
                imgSrc
            }))
        })()
    },[])


    
    return(
        <div className={style["update__popup"]} onClick={()=>{}}>
            {state.imgSrc?<img src={state.imgSrc} alt="" />:""}
            <button onClick={async()=>{

                let imgSrc = await FileService.upload_One({file:context.state.file})


                context.setState((prev=>({
                    ...prev,
                    file:null,
                    imgSrc
                })))
                // context.requestSectionsList()
            }
            }>Подтвердить</button>
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    file:null,
                }))
            }}>Отмена</button>
        </div>
    )
}







function Update({section}){
    let context = useContext(Context)

    // let section = useSelector(state=>state.sections.list.find(section=>section.id===section_id))
    let [updateSection,{}] = SectionsApi.useUpdateSectionMutation()
    let ref={
        name:useRef()
    }

    if(context.state.action.id===section.id){
        if(context.state.action.type==="update"){
            return(
                <div className={style.update}>
                    
                    <input ref={ref.name} placeholder="Имя раздела" type="text" defaultValue={section.name}/>
                    <input type="file" name="file" id="" onChange={async(event)=>{
                        let file = event.target.files[0]
                        
                        context.setState((prev=>({
                            ...prev,
                            file
                        })))
                    }}/>
                    <button onClick={()=>{
                        context.setState(prev=>({
                            ...prev,
                            action:{},
                            imgSrc:null
                        }))
                    }}>
                        Отмена
                    </button>
                    <button onClick={async()=>{
                        await updateSection({id:section.id,data:{
                            name:ref.name.current.value || undefined,
                            img:context.state.imgSrc || undefined
                        }})
                        context.setState(prev=>({
                            ...prev,
                            imgSrc:null,
                            action:{}
                        }))


                    }}>
                        Подтвердить изменения
                    </button>
                    
                </div>
            )
        }else{
            return ""
        }
    }else{
        return(
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        type:"update",
                        id:section.id
                    }
                }))
            }}>
                Изменить
            </button>
        )
    }
}


function Delete({section}){
    let context = useContext(Context)

    let [removeSection,{isError}] = SectionsApi.useRemoveSectionMutation() 

    if(context.state.action.id===section.id){
        if(context.state.action.type==="delete"){
            if(context.state.action.confirmation){
                return(
                    <>  
                        <p>Ты точно уверена?</p>
                        <button onClick={()=>{
                            context.setState(disable)
                        }}>
                            Отмена
                        </button>

                        <button className={style["sections__delete-comfirm"]} onClick={async()=>{
                            await removeSection({id:section.id})
                            context.setState(disable)
                        }}>
                            Да, удалить!
                        </button>
        
                        
                    </>
                )
            }else{
                return(
                    <>
                        <button onClick={async()=>{
                            context.setState(prev=>({
                                ...prev,
                                action:{
                                    ...prev.action,
                                    confirmation:true
                                }
                            }))
                            }}>
                                Подтвердить удаление
                        </button>
    
                        <button onClick={()=>{
                            context.setState(disable)
                        }}>
                            Отмена
                        </button>
                    
                    </>
                )
            }
            
        }else{
            return ""
        }
    }else{
        return(
            <button onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        type:"delete",
                        id:section.id
                    }
                }))
                
            }}>
                Удалить
            </button>
        )
    }
}


const SectionElement=({section})=>{


    let context = useContext(Context)
    

    let isTarget = context.state.action.type==="update" && context.state.action.id===section.id
    return(
        <div className={style["sections__list-box"]}>
            <img src={isTarget && context.state.imgSrc?context.state.imgSrc:`${window.location.origin}${section.img}`} alt="" />
            {isTarget?"":<p>{section.name}</p>}
            
            <Update section={section}/>
            <Delete section={section}/>
        </div>
    )
}

export const Sections=()=>{

    
    let [state,setState]=useState({
        file:null,
        imgSrc:null,
        action:{}
    })
    
    
    let {isFetching,data:sections_list=[],isError} = SectionsApi.useGetAllSectionsQuery()

   
    return(
        <Context.Provider value={{state,setState}}>
            <div className={style.sections}>
                    <div className={style.sections__list}>
                    
                    {isFetching?
                    <div>
                        Идёт загрузка...
                    </div>
                    :isError?
                    <div>
                        Произошла ошибка
                    </div>
                    :
                    sections_list.map((section,index)=>(
                        <SectionElement key={index} section={section}/>
                    ))}
                </div>
                <Create />
                {state.file?<Popup/>:""}
            </div>
        </Context.Provider>
        
        
    )
}