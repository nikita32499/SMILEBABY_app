import { Outlet } from "react-router-dom"
import { useRef,Suspense } from "react"
import { Link } from "react-router-dom"
import style from "./layout.module.scss"
import { useSelector } from "react-redux"





function Header(){
    let ref = {
        "header__nav-links":useRef()
    }
   
    function offMenu(){
        ref["header__nav-links"].current.classList.remove(style["header__nav-links--activate"])
        window.removeEventListener("click",offMenu)
        document.body.removeEventListener("click",offMenu)
    }

    let cart_list=useSelector(state=>state.cart.cart_list)

    return(
        <header className={style.header} onClick={(event)=>event.stopPropagation()}>
            <nav className={style.header__nav}>
                <button className={style["header__burger-button"]} onClick={()=>{
                    ref["header__nav-links"].current.classList.add(style["header__nav-links--activate"])
                    document.body.addEventListener("click",offMenu)
                }}>
                    <img src="/img/burger_menu.svg" alt="бургер" />
                </button>
                <div ref={ref["header__nav-links"]} className={style["header__nav-links"]}>
                    <button className={style["header__close-button"]} onClick={()=>{
                        offMenu()
                    }}>
                        <img src="/img/right-arrow.svg" alt="бургер" />
                        Назад
                    </button>
                    <Link onClick={offMenu} className={style["header__nav-a"]} to="/">Витрина</Link>
                    <Link onClick={offMenu} className={style["header__nav-a"]} to="/">О нас</Link>
                    <Link onClick={offMenu} className={style["header__nav-a"]} to="/">Контакты</Link>
                </div>
                <Link onClick={offMenu} to="/" className={style["header__nav-logo"]}>
                    <img src="/img/smilebaby_logo.svg" alt="логотип" />
                </Link>
                <Link onClick={offMenu}  to="/cart" className={style["header__nav-cart"]}>
                    {cart_list.length?<div className={style.header__nav_cart_count}>
                        {cart_list.reduce((countAccum,{count})=>countAccum+count,0)}
                    </div>:""}
                    <img src="/img/cart_icon.svg" alt="корзинка" />
                    <span>Корзина</span>
                </Link>
            </nav>
        </header>
    )
}


function Footer(){


    return(
        <footer className={style.footer}>
            <div className={style.footer__media}>
                <img className={style["footer__media-logo"]} src="/img/smilebaby_logo_gray.svg" alt="бургер" />
                <div className={style["footer__media-icons"]}>
                    <Link to="#">
                        <img src="/img/vk_icon.svg" alt="" />
                    </Link>
                    <Link to="#">
                        <img src="/img/whatsup_icon.svg" alt="" />
                    </Link>
                    <Link to="#">
                        <img src="/img/telegram_icon.svg" alt="" />
                    </Link>
                    <Link to="#">
                        <img src="/img/youtube_icon.svg" alt="" />
                    </Link>
                </div>
            </div>

            <div className={style.footer__info}>
                <p>+7 900 555-35-35</p>
                <p>Ежедневно с 09:00 до 21:00</p>
                <p>email: emailemailedsf@mail.ru</p>
            </div>

            <div className={style.footer__links}>
                <Link to="#">Главная</Link>
                <Link to="#">Витрина</Link>
                <Link to="#">О нас</Link>
                <Link to="#">Контакты</Link>
            </div>
            
            <span className={style.footer__offerta}>
            Оставляя на сайте свои контактные данные, Вы даете согласие на обработку своих персональных данных в соответствии с политикой конфиденциальности.
Сайт не является публичной офертой и носит информационный характер.
            </span>
            
        </footer>
    )
}


const Layout=()=>{
    return(
        <>
            <Header/>
                <main>
                    <Outlet/>
                    
                </main>
            <Footer/>
        </>
    )
}  
export  default Layout