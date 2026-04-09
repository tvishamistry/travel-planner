import {useState} from 'react';
import {useNavigate} from 'react';
function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async() =>{
        if(!username || !password){
            setError("All fields must be filled out");
        }
        try{
           await loginToAccount();
        }
        catch(error){
            console.error("Error logging into account: ", error.message)
        }

    }
    const loginToAccount = async() => {
    const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,  
            password: password
        })
           
    });
    if(response.ok){
            const user = await userResult.json();
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            navigate("/dashboard");

        }
    }
    return(
         <div>
            <form onSubmit = {handleLogin}className="max-w-md m-auto pt-24" >
                <h2 className = "font-bold pb-2">Sign up today!</h2>
                <p>Already have an account? <Link to="/login">Login</Link></p>
                <div className = "flex flex-col py-4">
                    <input onChange = {(e) => setUsername(e.target.value)}placeholder = "username"className = "p-3 mt-4 border-2" type = "username" />
                    <input onChange = {(e) => setPassword(e.target.value)}placeholder = "password"className = "p-3 mt-4 border-2" type = "password" />
                    <button type = "submit" disabled = {loading} className = "mt-4 w-full">Sign up</button>
                    {error &&<p className = "text-red-600 text-center pt-4">{error}</p>}
                </div>
            </form>

        </div>

    );


}

export default Login;