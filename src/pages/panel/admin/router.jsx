
import { Route,Routes,Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { AdminLayout } from "./layout";
import { AdminPanel } from "./page";

import { Sections } from "./sections/page";
import { Items } from "./items/page";

export const AdminRouter=()=>{
    const [cookies, removeCookie] = useCookies();
 

    let auth=cookies.authorization
    

    if(!auth) return <Navigate to="/panel/login" replace/>

    return(
        <Routes>
            
            <Route element={<AdminLayout/>}>
                <Route index element={<p>dsfsdfsdf</p>}/>
                <Route path="sections" element={<Sections/>} />
                <Route path="items" element={<Items/>} />
                <Route path="*" element={<Navigate to="." replace/>} />
            </Route>
        </Routes>
        
    )
}