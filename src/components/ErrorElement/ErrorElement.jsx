import style from "./style.module.scss"


export const ErrorElement=()=>{


    return(
        <div className={style.error}>
            <p>Произошла какая-то ошибка. Попробуйте перезапустить или зайти позже</p>
        </div>
    )
}