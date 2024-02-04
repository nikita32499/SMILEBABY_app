import { createContext } from "react"


export const Context=createContext()




export const fields={
    section_id:{
        name:"Раздел",
        validations:[
            value=>!value.length && "Выберите Раздел",
        ]
    },
    season:{
        name:"Сезон",
        validations:[
            value=>!value.length && "Заполните Сезон",
        ]
    },
    country:{
        name:"Страна",
        validations:[
            value=>!value.length && "Заполните Страну производителя",
        ]
    },
    discount:{
        validations:[
            value=>isNaN(Number(value)) && "Нужно указать число"
        ],
        optional:true,
        name:"Скидка",
        transform:value=>Number(value)
    },
    name:{
        name:"Имя",
        validations:[
            value=>!value.length && "Заполните имя",
            value=>value.length<=2 && "Имя должно быть длинее 2 символов"
        ]
    },
    price:{
        name:"Цена",
        validations:[
            value=>!value.length && "Укажите Цену",
            value=>isNaN(Number(value)) && "Нужно указать число",
            value=>Number(value)<=0 && "Цена должна быть больше 0"
        ],
        transform:value=>Number(value)
    },
    descriptions:{
        validations:[
            value=>!value.length && "Укажите Описание",
        ],
        name:"Описание",
        
    },
    
}

export const disable=(prev)=>({
    ...prev,
    action:{}
})