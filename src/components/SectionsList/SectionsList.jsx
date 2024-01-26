
import { SectionsApi } from "../../store/api/sections.api"
import style from "./style.module.scss"

import { Link } from "react-router-dom"

const SectionElement=({section,change})=>{


    return(
        <Link onClick={typeof change==="function"?change:""} to={`/shop/${section.id}?page=1`} className={style.sections__element}>
            <img src={section.img} alt="" />
            <span>{section.name}</span>
        </Link>
    )
}





export const SectionsList=({change})=>{

    let {data:sections_list,isFetching,isError}=SectionsApi.useGetAllSectionsQuery()


    return(
        (isFetching?
        <div>
            Идёт загрузка...
        </div>:isError?
        <div>
            Произошла ошибка
        </div>
        :
        <div className={style.sections}>
            <Link onClick={typeof change==="function"?change:""} to={`/shop/all?page=1`} className={style.sections__element+" "+style["sections__element--main"]}>
                <img src={"/img/smilebaby_logo.svg"} className={style.sections__main_img} alt="" />
                <span>Все товары</span>
            </Link>
            {sections_list.map((section,index)=>(
                <SectionElement key={index} change={change} section={section}/>
            ))}
        </div>)
    )
}