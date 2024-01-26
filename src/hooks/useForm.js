import { useRef, useState } from "react"






export const useForm=(formsConfig)=>{

    let state = useRef(Object.keys(formsConfig).reduce((formData,name)=>{
        formData[name].error=null
        return formData
    },formsConfig))


    let [errors,setErrors]=useState({})

   



    function handlerChange(event){
        let key = event.target.attributes.name.value
        let param = state.current[key]
        let newValue = event.target.value

        if(!param) throw new Error("Не существующий параметр")

        if("validations" in param){
            for(let validFunc of param.validations){
                let error = validFunc(newValue)


                if(error){
                    return setErrors(prev=>({
                        ...prev,
                        [key]:error
                    }))
                }
        
            }
        }

        state.current={
            ...state.current,
            [key]:{
                ...state.current[key],
                value:"transform" in param?param.transform(newValue):newValue,
            }
        }
            if(key in errors){
                setErrors(prev=>{
                    const { [key]: _, ...restErrors } = prev;
                    return restErrors
                })
        }
        
        
    }

    function getFormState({type,extended={}}={}){
        const errors={}
        if(type!=="force"){
            for(let [key,param] of Object.entries(state.current)){
                if(param.value==null && param.optional) break
                if("validations" in param){
                    for(let validFunc of param.validations){
                        let error = validFunc(param.value!=null?String(param.value):"")
        
        
                        if(error){
                            errors[key]=error
                            
                        }
                
                    }
                }
            }
            for(let [key,value] of Object.entries(extended)){
                if(!value){
                    errors[key]=true
                }
            }
            if(Object.keys(errors).length){
                return setErrors(prev=>({
                    ...prev,
                    ...errors
                }))
            }
        }
        
        

        return state.current
    }







    return [getFormState,handlerChange,errors]
}