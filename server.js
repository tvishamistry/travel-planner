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

app.use(cors({
    origin: 'https://didactic-zebra-r4vvqrpw6vjxfpjrq-5173.app.github.dev',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());


app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await getUser(username);

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        if (user.pass !== password) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.error('Error in POST /login:', error.message);
        res.status(500).json({ error: "Failed to login" });
    }
});

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