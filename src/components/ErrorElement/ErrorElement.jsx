import style from "./style.module.scss"


const ErrorElement=({error,message})=>{

    if(error) console.error(error)

    return(
        <div className={style.error}>
            <p className={style.error__p}>Ошибка</p>
            {message?<p className={style.error__title}>{message}</p>:""}
            <p>Произошла какая-то ошибка. Попробуйте перезапустить или зайти позже</p>
        </div>
    )
}

export default ErrorElement