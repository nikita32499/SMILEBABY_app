
import style from "./filter.module.scss"
import { useActions } from "../../hooks/useActions"
import { useSelector } from "react-redux"
import { createContext, useContext, useRef, useState } from "react"
import { FilterIsDefault } from "../../utils/filter.utils"

const FilterContext=createContext()


const ToggleFilter=({param_list=[]})=>{


    return(
        <div className={style.filter__toggle}>
            {param_list.map(param=>(
                <button className={style.filter__toggle_element+" "+(param.isActive()?style["filter__toggle_element--active"]:"")} onClick={()=>{
                    param.cb()
                }}>
                    <div><div></div></div>
                    <p>{param.name}</p>
                </button>
            ))}
            
        </div>
    )
}


const OptionFilter=({param_list=[]})=>{
    

    return(
        <div className={style.filter__option}>
            {param_list.map(param=>(
                <button className={style.filter__option_element} onClick={()=>{
                    param.cb()
                }}>
                    <div>

                        <img style={{display:param.isActive()?"block":"none"}} src={"/img/galka.svg"} alt="" />
                    </div>
                    <p className={style.filter__option_p1}>{param.name}</p>
                    <p className={style.filter__option_p2}>{param.count} шт</p>
                </button>
            ))}
        </div>
    )
}



const PriceFilter=()=>{
    let filterContext = useContext(FilterContext)
    let {setFilter} = useActions()
    let {price} = useSelector(state=>state.items.filter)
    let {maxprice,minprice} = useSelector(state=>state.items.meta)

    let [state,setState]=useState({
        price:{}
    })

    
    





    let ref={
        min:useRef(),
        max:useRef(),
        price_line:useRef(),
        price_box:useRef()
    }




    function MouseDown(event,side){
        let startX = event.screenX
        let right =  Number(ref.price_line.current.style.right?.match(/\d+/)) || 0
        let left =  Number(ref.price_line.current.style.left?.match(/\d+/)) || 0

        function MouseMove(event){
            
            let deltaX = (event.screenX-startX)/(ref.price_box.current.clientWidth/(100))



            let value
            if(side==="right"){
                if(right-deltaX<=0){
                    value=maxprice
                }else{
                    value=maxprice-(maxprice-minprice)/100*(right-deltaX)
                }

                if(price.min>=value) return

                if(right-deltaX>0)ref.price_line.current.style.right=`${right-deltaX}%`
                setState({
                    price:{
                        ...state.price,
                        max:Math.floor(value)
                    }
                })
            }else if(side==="left"){
                if(left+deltaX<=0){
                    value=minprice
                }else{
                    value=minprice+(maxprice-minprice)/100*(left+deltaX)
                }

                if(price.max<=value || value<minprice) return
                if(left+deltaX>0)ref.price_line.current.style.left=`${left+deltaX}%`
                setState({
                    price:{
                        ...state.price,
                        min:Math.floor(value)
                    }
                })
                
            //    data_price.min=Math.floor(minprice+(maxprice-minprice)*(value/ref.price_box.current.clientWidth))
            }else{
                return
            }
            
            

            

        }

        function MouseUp(){

            
            window.removeEventListener("mousemove",MouseMove)
            window.removeEventListener("mouseup",MouseUp)
        }

        window.addEventListener("mousemove",MouseMove)
        window.addEventListener("mouseup",MouseUp)
    }
    let left=(price.min-minprice)/(maxprice-minprice)*100
    let right=(maxprice-price.max)/(maxprice-minprice)*100
    
    
    

    return(
        <>
            <div className={style.filter__price}>
                <div ref={ref.price_box} className={style.filter__price_polzynok_box}>
                    <div ref={ref.price_line} className={style.filter__price_line} style={{
                        left:`${left || 0}%`,
                        right:`${right || 0}%`
                    }}>
                        <div onMouseDown={(event)=>{MouseDown(event,"left")}}></div>
                        <div onMouseDown={(event)=>{MouseDown(event,"right")}}></div>
                    </div>
                </div>
                <div className={style.filter__price_int}>
                    <div className={style.filter__price_intbox}>
                        <p>Мин. цена</p>
                        <input ref={ref.min} type="text" value={state.price.min || price.min} defaultValue={price.min || minprice} onChange={(event)=>{
                            setState({
                                price:{
                                    ...state.price,
                                    min:Math.floor(Number(event.target.value))
                                }
                            })
                        }}/>
                    </div>
                    <div className={style.filter__price_int_line}></div>
                    <div className={style.filter__price_intbox}>
                        <p>Макс. цена</p>
                        <input ref={ref.max} type="text"  value={state.price.max || price.max}  defaultValue={price.max || maxprice} onChange={(event)=>{
                            setState({
                                price:{
                                    ...state.price,
                                    max:Math.floor(Number(event.target.value))
                                }
                            })
                        }}/>
                    </div>
                </div>
                <button className={style.filter__price_apply_button} onClick={()=>{
                    setFilter({
                        price:state.price
                    })
                    filterContext.setState(prev=>({
                        ...prev,
                        action:{}
                    }))
                }}>Применить</button>
            </div>



            <div className={style.filter__price_mobile}>
                <div className={style.filter__price_mobile_inputbox}>
                    <div>
                        <p>От</p>
                        <input ref={ref.min} type="text" value={state.price.min || price.min} defaultValue={price.min || minprice} onChange={(event)=>{
                                setFilter({
                                    price:{
                                        ...state.price,
                                        min:Math.floor(Number(event.target.value))
                                    }
                                })
                            }}/>
                    </div>
                    
                    <div>
                        <p>До</p>
                        <input ref={ref.max} type="text"  value={state.price.max || price.max}  defaultValue={price.max || maxprice} onChange={(event)=>{
                            setFilter({
                                price:{
                                    ...state.price,
                                    max:Math.floor(Number(event.target.value))
                                }
                            })
                        }}/>
                    </div>
                </div>
                {[{text:"От 1000 ₽",price:{min:1000}},{text:"До 2000 ₽",price:{max:2000}},{text:"До 3000 ₽",price:{max:3000}},{text:"До 5000 ₽",price:{max:5000}}].map(price_el=>(
                    <button className={style.filter__price_mobile_price_el} onClick={()=>{
                        setFilter({
                            price:{
                                min: price_el.price.min || minprice,
                                max: price_el.price.max || maxprice,
                            }
                        })
                    }}>{price_el.text}</button>
                ))}
            </div>
        </>
        
    )
}



const ButtonFilter=({children,text,filter_prev,type,cancel,mobile_button})=>{
    let filterContext = useContext(FilterContext)
    
    let filter_text = filter_prev && filter_prev()

    return(
        <button className={style.filter__button+" "+(filter_text?style["filter__button--active"]:"")} onClick={(event)=>{
            
            event.stopPropagation()

            function hiddenFilterPanel(){
                filterContext.setState(prev=>({
                    ...prev,
                    action:{}
                }))
                window.removeEventListener("click",hiddenFilterPanel)
            }
            
            window.addEventListener("click",hiddenFilterPanel)
            
            
            
            filterContext.setState(prev=>({
                ...prev,
                action:{
                    type:prev.action.type!==type?type:null
                }
            }))
            
        }}>

            {text} {typeof filter_text==="string"?<p className={style.filter__button_filter_text}>{filter_text}</p>:""}
            <img src={filter_text?"/img/cross_white.svg":"/img/row_down-black.svg"} alt="" onClick={(event)=>{
                if(filter_text && cancel){
                    cancel()
                    event.stopPropagation()
                    filterContext.setState(prev=>({
                        ...prev,
                        action:{}
                    }))
                }
            }}/>
            {filterContext.state.action.type===type?
            <div className={style.filter__button_fixed_box} onClick={(event)=>{
                event.stopPropagation()
            }}>
                {children}
                <MobileSetButtons 
                apply={mobile_button.apply}
                reset_text={mobile_button.reset_text}
                reset={mobile_button.reset}
                isChoose={mobile_button.isChoose}
                />
            </div>:""}
            {mobile_button.isChoose()?<div className={style.filter__button_fixed_box_reset} onClick={(event)=>{
                event.stopPropagation()
                mobile_button.reset()
            }}>
                Сбросить
            </div>:""}
        </button>
    )
}

const MobileSetButtons=({apply,reset,reset_text,apply_text,isChoose})=>{
    let filterContext = useContext(FilterContext)


    return(
        <div className={style.filter__mobile_button_set}>
            <button className={style.filter__mobile_button+" "+style.filter__mobile_button_reset+" "+(isChoose()?style["filter__mobile_button_reset--active"]:"")} onClick={()=>{
                if(isChoose()){
                    reset()
                }
            }}>{reset_text}</button>
            <button className={style.filter__mobile_button+" "+style.filter__mobile_button_show} onClick={apply}>{apply_text || "Применить"}</button>
        </div>
    )
}




export const Filter=({items_list})=>{



    let {setFilter} = useActions()
    let {maxprice,minprice} = useSelector(state=>state.items.meta)
    let filter = useSelector(state=>state.items.filter)

    let sort_param = [
        {
            name:"По возрастанию цены",
            cb:()=>{
                let value = "price++"
                setFilter({
                    sort:filter.sort!==value?value:null 
                })
            },
            isActive:()=>filter.sort==="price++"
        
        },
        {
            name:"По убыванию цены",
            cb:()=>{
                let value = "price--"
                setFilter({
                    sort:filter.sort!==value?value:null
                })
            },
            isActive:()=>filter.sort==="price--"
        }
    ]


    
    
    let size_param = Object.entries(items_list.reduce((data,{quantity})=>{
        for(let {count,size} of quantity){
            if(!(size in data)){
                data[size]=0
            }
            data[size]+=Number(count)
        }
        return data
    },{})).map(([size,count])=>({
        name:size,
        count,
        cb:()=>{
            let value = Number(size)
            let currentSize = filter.size || []
            let newValue
            if(currentSize.includes(value)){
                newValue = currentSize.filter(size=>size!==value)
            }else{
                newValue=[...currentSize,value]
            }

            setFilter({
                size: newValue
            })
        },
        isActive:()=>filter.size.includes(Number(size))
    }))


    

    let season_params = Object.entries(items_list.reduce((data,{quantity,season})=>{
        for(let {count} of quantity){
            if(!(season in data)){
                data[season]=0
            }
            data[season]+=Number(count)
        }
        return data
    },{})).map(([season,count])=>({
        name:season,
        count,
        cb:()=>{
            let value = season
            let currentSize = filter.season || []
            let newValue
            if(currentSize.includes(value)){
                newValue = currentSize.filter(season=>season!==value)
            }else{
                newValue=[...currentSize,value]
            }
            setFilter({
                season: newValue
            })
        },
        isActive:()=>filter.season.includes(season)
    }))

    
    let [state,setState]=useState({
        action:{}
    })


    let ref={
        filter__layer:useRef()
    }
    
    return(
        <FilterContext.Provider value={{state,setState}}>
            
            <button className={style.filter__mobile_toggle} onClick={()=>{
                ref.filter__layer.current.classList.add(style["filter--active"])
            }}><img src="/img/filter.svg" alt="" /><p>Фильтры</p></button>
            <div ref={ref.filter__layer} className={style.filter__layer}>
                <div  className={style.filter}>
                    <ButtonFilter 
                        type={"sort"} 
                        text={(()=>{
                                switch (filter.sort) {
                                    case "price++":
                                        return "По увеличению цены"
                                    case "price--":
                                        return "По убыванию цены"
                                default:
                                    return "По убыванию цены"
                                }
                            })()} 
                        filter_prev={()=>filter.sort?true:false} 
                        cancel={()=>setFilter({sort:null})}
                        mobile_button={{
                            apply:()=>setState(prev=>({...prev,action:{}})),
                            reset_text:"По умолчанию",
                            reset:()=>setFilter({sort:null}),
                            isChoose:()=>filter.sort!=null
                        }}
                        >
                        <ToggleFilter param_list={sort_param}/>
                    </ButtonFilter>
                    <ButtonFilter 
                        type={"price"} 
                        text="Цена" 
                        filter_prev={()=>{
                            if(filter.price.min==null && filter.price.max==null){
                                return
                            }else{
                                return `${filter.price.min || minprice} - ${filter.price.max || maxprice}`
                            }
                        }}
                        cancel={()=>{
                            setFilter({
                                price:{}
                            })
                        }}
                        mobile_button={{
                            apply:()=>setState(prev=>({...prev,action:{}})),
                            reset_text:"Сбросить",
                            reset:()=>{
                                setFilter({price:{}})
                                setState(prev=>({
                                    ...prev,
                                    action:{}
                                }))
                            },
                            isChoose:()=>Number.isInteger(filter.price.min) || Number.isInteger(filter.price.max)
                        }}>
                        <PriceFilter/>
                    </ButtonFilter>
                    <ButtonFilter 
                        type={"size"} 
                        text="Размер" 
                        filter_prev={()=>{
                            if(!filter.size.length){
                                return
                            }else{
                                return String(filter.size[0])
                            }
                        }}
                        cancel={()=>{
                            setFilter({
                                size:[]
                            })
                        }}
                        mobile_button={{
                            apply:()=>setState(prev=>({...prev,action:{}})),
                            reset_text:"Сбросить",
                            reset:()=>setFilter({size:[]}),
                            isChoose:()=>filter.size.length>0
                        }}>
                        <OptionFilter param_list={size_param}/>
                    </ButtonFilter>
                    <ButtonFilter 
                        type={"season"} 
                        text="Сезон" 
                        filter_prev={()=>{
                            if(filter.season.length===0){
                                return
                            }else{
                                return filter.season[0]
                            }
                        }}
                        cancel={()=>{
                            setFilter({
                                season:[]
                            })
                        }}
                        mobile_button={{
                            apply:()=>setState(prev=>({...prev,action:{}})),
                            reset_text:"Сбросить",
                            reset:()=>setFilter({season:[]}),
                            isChoose:()=>filter.season.length>0
                        }}>
                        <OptionFilter param_list={season_params} />
                    </ButtonFilter>
                    <MobileSetButtons
                        apply={()=>{
                            ref.filter__layer.current.classList.remove(style["filter--active"])
                            setState(prev=>({
                                ...prev,
                                action:{}
                            }))
                        }}
                        reset_text={"Сбросить всё"}
                        apply_text={"Показать"}
                        reset={()=>{
                            setFilter("default")
                        }}
                        isChoose={()=>{
                            return !(FilterIsDefault())
                        }}
                        />
                </div>
            </div>
        </FilterContext.Provider>
        
    )
}