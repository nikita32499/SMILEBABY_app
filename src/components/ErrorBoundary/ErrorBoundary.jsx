import React from "react";

export default class ErrorBoundary extends React.Component{
    constructor(props){
        super(props)
        if(!props.fallback) throw new Error("Не указан fallback")
        this.state={error:null}
    }



    componentDidCatch(error,errorInfo){
        console.error(error,errorInfo)
        this.setState(prev=>({
            ...prev,
            error
        }))
    }


    render(){
        if(this.state.error) return this.props.fallback
        return this.props.children
    }
}