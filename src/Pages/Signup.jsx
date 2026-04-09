import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Signup(){
    const[email,setEmail] = useState("");
    const[username, setUsername] = useState("");
    const[password,setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async(e)=>{
        e.preventDefault()
        setLoading(true)
        try{
            await createAccount();

        }
        catch(error){
            setError("an error occured");
        }
        finally{
            setLoading(false);
        }
    };

    const createAccount = async() =>{
     const response = await fetch("http://localhost:8000/newuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create account');
        }

        if(data.success){
            const userResult = await fetch(`http://localhost:8000/newuser/${username}`);
            const user = await userResult.json();
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            navigate("/dashboard");

        }

        
        return data;
    }

   


    return(
        <div>
            <form onSubmit = {handleSignUp}className="max-w-md m-auto pt-24" >
                <h2 className = "font-bold pb-2">Sign up today!</h2>
                <p>Already have an account? <Link to="/login">Login</Link></p>
                <div className = "flex flex-col py-4">
                    <input onChange = {(e) => setUsername(e.target.value)}placeholder = "username"className = "p-3 mt-4 border-2" type = "username" />
                    <input onChange = {(e) => setEmail(e.target.value)}placeholder = "email"className = "p-3 mt-4 border-2" type = "email" />
                    <input onChange = {(e) => setPassword(e.target.value)}placeholder = "password"className = "p-3 mt-4 border-2" type = "password" />
                    <button type = "submit" disabled = {loading} className = "mt-4 w-full">Sign up</button>
                    {error &&<p className = "text-red-600 text-center pt-4">{error}</p>}
                </div>
            </form>

        </div>
    );

}
export default Signup;