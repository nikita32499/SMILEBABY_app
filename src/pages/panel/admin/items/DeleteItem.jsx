
import { Context,disable } from "./Context"
import { useContext } from "react"
import { ItemsApi } from "../../../../store/api/items.api"
import style from "./style.module.scss"


export const DeleteItem=({item})=>{
    const context=useContext(Context)

    let [deleteItem]= ItemsApi.useRemoveMutation()

    // let itTarget = context.state.action.type==="delete" && context.state.action.id===item.id
    let itAction = context.state.action.id===item.id
    let itTarget = context.state.action.type==="delete" && itAction
    if(itAction){
        if(itTarget){
            return(
                <div>
                    <button className={style.items__button} onClick={()=>{
                        context.setState(disable)
                    }}>Отмена</button>
                    <button  className={style.items__button} onClick={async()=>{
                        await deleteItem({id:item.id})
                        context.setState(disable)
                    }}>Подтвердите удаление</button>
                </div>
            )
        }else{
            return
        }
    }else{
        return(
            <button className={style["items__delete-button"]} onClick={()=>{
                context.setState(prev=>({
                    ...prev,
                    action:{
                        type:"delete",
                        id:item.id
                    }
                }))
            }}>
                Удалить товар
            </button>
        )
    }
}