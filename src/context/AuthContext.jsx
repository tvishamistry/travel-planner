import {createContext, useEffect, useState, useContext} from 'react';
const AuthContext = createContext();
import { supabase } from '../supabaseClient';

export const AuthContextProvider = ({children}) =>{
    const [session, setSession] = useState(undefined);

    //signup

    const signupNewUser = async(email, password)=>{
        const{data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if(error){
            console.error("Probelm signing up:", error);
            return {success: false, error};
        }
            return {success: true, data};

    };

    //signin
    const signinUser = async( email, password)=>{
        try{
            const {data,error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if(error){
                console.error("sign in error occoured", error);
                return {success: false, error: error.message}

            }
            console.log("sign in successful", data);
            return {success: true, data};

        }
        catch(error){
            console.error("an error occured");
        }

    };


    useEffect(() => {
        supabase.auth.getSession().then(({data:{session} })=>{
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) =>{
            setSession(session);
        })
    },[]);

    //signout
    const signOut=()=>{
        const {error} = supabase.auth.signOut();
        if(error){
            console.error("Error signing out", error);
        }
    };

    return(
        <AuthContext.Provider value = {{session, signupNewUser, signOut, signinUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth= ()=>{
    return useContext(AuthContext);
};