import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
    createNewUser,
    getUser,
    isExisting,
    doesEmailExist
} from './dbOperations.js';



dotenv.config();

const PORT = process.env.PORT || 8000;
const app  = express();

app.use(cors());
app.use(express.json());

app.post("/newuser", async(req, res) =>{
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({ error: "All fields are required" });
        }
        const exists = await isExisting(username);
        const emailExists = await doesEmailExist(email);

        if(exists){
            return res.status(409).json({ error: "Username is already taken" });
        }
        if(emailExists){
            return res.status(409).json({error: "Email is already in use"});
        }
        await createNewUser(username, email, password);
        res.status(201).json({ success: true, message: "Account created!" });  
    }
    catch(error){
        console.error('Error in POST /newuser:', error.message);
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.get("/newuser/:username", async(req,res)=>{
    try{
        const user = await getUser(req.params.username);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch(error){
         console.error('Error in GET /newuser/:username:', error.message);
        res.status(500).json({ error: "Failed to create user" });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});