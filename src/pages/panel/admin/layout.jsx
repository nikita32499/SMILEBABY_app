import { Outlet,Link } from "react-router-dom"
import style from "./layout.module.scss"

const Panel=()=>{




    return(
        <div className={style.admin__panel}>
            <Link to="/panel/admin/sections">
                Разделы
            </Link>
            <Link to="/panel/admin/items">
                Товары
            </Link>
            <Link to="/panel/admin/orders">
                Заказы
            </Link>
        </div>
    )
}

export const AdminLayout=()=>{

    return(
        <div className={style.admin}>
            <Panel/>
            <div className={style.admin__box}>
            <Outlet/>
            </div>
        </div>
    )
}