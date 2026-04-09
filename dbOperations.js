import pool from "./dbConfig.js"

export const createNewUser= async(username, email, password)=>{
    try{
        const result = await pool.query("INSERT INTO new_user (username, email, pass) VALUES ($1,$2,$3)", [username, email, password]);
        return result.rows[0];
    }
    catch(error){
        console.error("Error in createNewUser: ", error.message);
        throw error;
    }
};

export const isExisting = async(username)=>{
    try{
        const result = await pool.query("SELECT EXISTS(SELECT 1 FROM new_user WHERE username = $1)",[username]);
        return result.rows[0].exists;
    }
    catch(error){
        console.error("Error in isExisting: ", error.message);
        throw error;
    }
};

export const getUser = async(username)=>{
    try{
        const result = await pool.query("SELECT * FROM new_user WHERE username=$1",[username]);
        return result.rows[0] || null;

    }
    catch(error){
        console.error("Error in getUser: ", error.message);
        throw error;
    }
};
