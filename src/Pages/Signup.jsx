import { Link } from 'react-router-dom';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
function Signup(){
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState("");
    const {session, signupNewUser} = UserAuth();
    console.log(session);
    const navigate = useNavigate();

    const handleSignUp = async(e)=>{
        e.preventDefault()
        setLoading(true)
        try{
            const result = await signupNewUser(email, password);
            if(result.success){
                navigate("/dashboard");

            }
        }
        catch(error){
            setError("an error occured");
        }
        finally{
            setLoading(false);
        }
    };
    return(
        <div>
            <form onSubmit = {handleSignUp}className="max-w-md m-auto pt-24" >
                <h2 className = "font-bold pb-2">Sign up today!</h2>
                <p>Already have an account? <Link to="/login">Login</Link></p>
                <div className = "flex flex-col py-4">
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