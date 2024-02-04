import style from "./style.module.scss"


const Loading = () =>{

    return (
        <div className={style.loader}>
            <div className={style.loader__element}>
                <img src="/gif/Spinner.gif" alt="" />
                <p>Загружается</p>
            </div>
        </div>
    )
}



export default Loading