
import { Route,Routes,Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { AdminLayout } from "./layout";

import { Sections } from "./sections/page";
import { Items } from "./items/page";
import { Orders } from "./orders/page";



const AdminRouter=()=>{
    const [cookies, removeCookie] = useCookies();
 

    let auth=cookies.authorization
    

    if(!auth) return <Navigate to="/panel/login" replace/>

    return(
        <Routes>
            
            <Route element={<AdminLayout/>}>
                <Route index element={<p>Выбери что открыть</p>}/>
                <Route path="sections" element={<Sections/>} />
                <Route path="items" element={<Items/>} />
                <Route path="orders" element={<Orders/>}/>
                <Route path="*" element={<Navigate to="." replace/>} />
            </Route>
        </Routes>
        
    )
}
export default AdminRouter