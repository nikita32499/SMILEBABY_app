import style from "./style.module.scss"
import { Link } from "react-router-dom"


const NotFound=()=>{


    return(
        <div className={style.notfound}>
            <p>404</p>
            <p>Мы не смогли найти страницу по вашей ссылке</p>
            <Link to="/" className={style.notfound__tomain}>На главную <img style={{transform:"rotate(180deg)"}} src="/img/right-arrow.svg" alt="" /></Link>
        </div>
    )
}

export default NotFound