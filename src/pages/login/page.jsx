import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import style from "./style.module.scss"


async function login({login,password}){


    let response
    try {
        response=await axios.post(`${window.location.origin}/api/smilebaby/users/login`,{
            login,
            password
        })
    } catch (error) {
        response=error.response
    }

    if(response?.status===200 && typeof response.data.result==="string"){
        return {success:true}
    }else{
        return {success:false,error:response.data.error || "Не получилось войти, попробуйте зайти позже"}
    }

}


export const Login=()=>{

    let [state,setState]=useState({})

    let navigate = useNavigate()
    let ref={
        login:useRef(),
        password:useRef()
    }

    return(
        <div className={style.login}>
            <p className={style.login__title}>Добро пожаловать в Smile Baby</p>
            <input placeholder="Введите логин" className={style.login__input} ref={ref.login} type="text" />
            <input placeholder="Введите пароль" className={style.login__input} ref={ref.password} type="password" />
            {state.error?<p className={style.login__error}>{state.error}</p>:""}
            <button className={style["login_to-login"]} onClick={async()=>{
                let result = await login({
                    login:ref.login.current.value,
                    password:ref.password.current.value
                })
                ref.login.current.value=null
                ref.password.current.value=null
                if(result.success){
                    navigate("/panel/admin/")
                }else{
                    setState(prev=>({
                        ...prev,
                        error:result.error
                    }))
                    setTimeout(()=>{
                        setState(prev=>({
                            ...prev,
                            error:null
                        }))
                    },10000)
                }
            }}>Войти</button>
        </div>
    )
}