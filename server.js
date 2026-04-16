import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
    createNewUser, getUser, isExisting, doesEmailExist,
    sendFriendRequest, respondToFriendRequest, getFriends,
    getPendingRequests, getSentRequests,
    createTrip, getUserTrips, getTripById, getTripCollaborators,
    addCollaborator, removeCollaborator,
    addItineraryItem, getItineraryItems, deleteItineraryItem, deleteTrip
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

app.post("/friends/request", async (req, res) => {
    try {
        const { senderUsername, receiverUsername } = req.body;
        if (!senderUsername || !receiverUsername)
            return res.status(400).json({ error: "Both usernames required" });
        if (senderUsername === receiverUsername)
            return res.status(400).json({ error: "Cannot add yourself" });

        const receiverExists = await isExisting(receiverUsername);
        if (!receiverExists)
            return res.status(404).json({ error: "User not found" });

        await sendFriendRequest(senderUsername, receiverUsername);
        res.status(201).json({ success: true, message: "Friend request sent" });
    } catch (error) {
        console.error("Error in POST /friends/request:", error.message);
        res.status(500).json({ error: "Failed to send friend request" });
    }
});

app.put("/friends/request/:id", async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        if (!['accepted', 'rejected'].includes(status))
            return res.status(400).json({ error: "Invalid status" });
        await respondToFriendRequest(req.params.id, status);
        res.json({ success: true });
    } catch (error) {
        console.error("Error in PUT /friends/request/:id:", error.message);
        res.status(500).json({ error: "Failed to update request" });
    }
});

app.get("/friends/:username", async (req, res) => {
    try {
        const friends = await getFriends(req.params.username);
        res.json(friends);
    } catch (error) {
        console.error("Error in GET /friends/:username:", error.message);
        res.status(500).json({ error: "Failed to fetch friends" });
    }
});

app.get("/friends/:username/pending", async (req, res) => {
    try {
        const requests = await getPendingRequests(req.params.username);
        res.json(requests);
    } catch (error) {
        console.error("Error in GET /friends/:username/pending:", error.message);
        res.status(500).json({ error: "Failed to fetch pending requests" });
    }
});

app.get("/friends/:username/sent", async (req, res) => {
    try {
        const requests = await getSentRequests(req.params.username);
        res.json(requests);
    } catch (error) {
        console.error("Error in GET /friends/:username/sent:", error.message);
        res.status(500).json({ error: "Failed to fetch sent requests" });
    }
});

// ─── TRIPS ROUTES ────────────────────────────────────────────

app.post("/trips", async (req, res) => {
    try {
        const { name, description, destination, startDate, endDate, ownerUsername } = req.body;
        if (!name || !ownerUsername)
            return res.status(400).json({ error: "Trip name and owner required" });
        const result = await createTrip(name, description, destination, startDate, endDate, ownerUsername);
        res.status(201).json({ success: true, tripId: result.insertId });
    } catch (error) {
        console.error("Error in POST /trips:", error.message);
        res.status(500).json({ error: "Failed to create trip" });
    }
});

app.get("/trips/user/:username", async (req, res) => {
    try {
        const trips = await getUserTrips(req.params.username);
        res.json(trips);
    } catch (error) {
        console.error("Error in GET /trips/user/:username:", error.message);
        res.status(500).json({ error: "Failed to fetch trips" });
    }
});

app.get("/trips/:tripId", async (req, res) => {
    try {
        const trip = await getTripById(req.params.tripId);
        if (!trip) return res.status(404).json({ error: "Trip not found" });
        const collaborators = await getTripCollaborators(req.params.tripId);
        const itinerary = await getItineraryItems(req.params.tripId);
        res.json({ ...trip, collaborators, itinerary });
    } catch (error) {
        console.error("Error in GET /trips/:tripId:", error.message);
        res.status(500).json({ error: "Failed to fetch trip" });
    }
});

app.post("/trips/:tripId/collaborators", async (req, res) => {
    try {
        const { username } = req.body;
        const userExists = await isExisting(username);
        if (!userExists) return res.status(404).json({ error: "User not found" });
        await addCollaborator(req.params.tripId, username);
        res.status(201).json({ success: true });
    } catch (error) {
        console.error("Error in POST /trips/:tripId/collaborators:", error.message);
        res.status(500).json({ error: "Failed to add collaborator" });
    }
});

app.delete("/trips/:tripId/collaborators/:username", async (req, res) => {
    try {
        await removeCollaborator(req.params.tripId, req.params.username);
        res.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /trips/:tripId/collaborators/:username:", error.message);
        res.status(500).json({ error: "Failed to remove collaborator" });
    }
});

app.post("/trips/:tripId/itinerary", async (req, res) => {
    try {
        const { dayNumber, timeOfDay, title, description, location, createdBy } = req.body;
        if (!title || !dayNumber)
            return res.status(400).json({ error: "Title and day number required" });
        const result = await addItineraryItem(
            req.params.tripId, dayNumber, timeOfDay, title, description, location, createdBy
        );
        res.status(201).json({ success: true, itemId: result.insertId });
    } catch (error) {
        console.error("Error in POST /trips/:tripId/itinerary:", error.message);
        res.status(500).json({ error: "Failed to add itinerary item" });
    }
});

app.delete("/trips/:tripId/itinerary/:itemId", async (req, res) => {
    try {
        await deleteItineraryItem(req.params.itemId);
        res.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /trips/:tripId/itinerary/:itemId:", error.message);
        res.status(500).json({ error: "Failed to delete itinerary item" });
    }
});

app.delete("/trips/:tripId", async (req, res) => {
    try {
        const { ownerUsername } = req.body;
        await deleteTrip(req.params.tripId, ownerUsername);
        res.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /trips/:tripId:", error.message);
        res.status(500).json({ error: "Failed to delete trip" });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});