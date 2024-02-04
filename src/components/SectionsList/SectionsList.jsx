
import { SectionsApi } from "../../store/api/sections.api"
import style from "./style.module.scss"

import { Link } from "react-router-dom"
import { memo } from "react"

import Loading from "../Loading/Loading"
import ErrorElement from "../ErrorElement/ErrorElement"

const SectionElement=({section,change})=>{


    return(
        <Link onClick={typeof change==="function"?change:""} to={`/shop/${section.id}?page=1`} className={style.sections__element}>
            <img src={section.img} alt="" />
            <span>{section.name}</span>
        </Link>
    )
}





export const SectionsList=memo(({change})=>{

    let {data:sections_list,isLoading,isError,error}=SectionsApi.useGetAllSectionsQuery()


    return(
        isError?<ErrorElement error={error} message={"Не удалось получить список разделов"}/>:isLoading?"":
        <div className={style.sections}>
            <Link onClick={typeof change==="function"?change:""} to={`/shop/all?page=1`} className={style.sections__element+" "+style["sections__element--main"]}>
                <img src={"/img/smilebaby_logo.svg"} className={style.sections__main_img} alt="" />
                <span>Все товары</span>
            </Link>
            {sections_list.map((section,index)=>(
                <SectionElement key={index} change={change} section={section}/>
            ))}
        </div>
    )
})