




export const useUrlParams=()=>{
    const searchParams = new URLSearchParams(window.location.search)


    const paramsObject = {};
    for (const [key, value] of searchParams.entries()) {
        paramsObject[key] = value;
    }

    return paramsObject

}