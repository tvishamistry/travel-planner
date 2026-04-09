import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";

function Dashboard(){
    const [user,setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const userData = sessionStorage.getItem("currentUser");
    
            if(userData){
                setUser(JSON.parse(userData));

            }
            else{
            navigate("/login");
             }
    },[])

    
    if(!user) return <p>Loading</p>

    return(
        <div>
            <h1>Hello, {user.username}</h1>
        </div>
    );


}

export default Dashboard;