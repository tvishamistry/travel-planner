import pool from "./dbConfig.js";

//new_user db ops
export const createNewUser = async (username, email, password) => {
    try {
        const [result] = await pool.query(
            "INSERT INTO new_user (username, email, password) VALUES (?, ?, ?)",
            [username, email, password]
        );
        return result;
    } catch (error) {
        console.error("Error in createNewUser:", error.message);
        throw error;
    }
};

export const isExisting = async (username) => {
    try {
        const [rows] = await pool.query(
            "SELECT EXISTS(SELECT 1 FROM new_user WHERE username = ?) AS `exists`",
            [username]
        );
        return rows[0].exists === 1;
    } catch (error) {
        console.error("Error in isExisting:", error.message);
        throw error;
    }
};

export const doesEmailExist = async (email) => {
    try {
        const [rows] = await pool.query(
            "SELECT EXISTS(SELECT 1 FROM new_user WHERE email = ?) AS `exists`",
            [email]
        );
        return rows[0].exists === 1;
    } catch (error) {
        console.error("Error in doesEmailExist:", error.message);
        throw error;
    }
};

export const getUser = async (username) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM new_user WHERE username = ?",
            [username]
        );
        return rows[0] || null;
    } catch (error) {
        console.error("Error in getUser:", error.message);
        throw error;
    }
};
 
//friend_requests db ops
export const sendFriendRequest = async (senderUsername, receiverUsername) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO friend_requests (sender_username, receiver_username)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE status = 'pending'`,
            [senderUsername, receiverUsername]
        );
        return result;
    } catch (error) {
        console.error("Error in sendFriendRequest:", error.message);
        throw error;
    }
};

export const respondToFriendRequest = async (requestId, status) => {
    try {
        const [result] = await pool.query(
            "UPDATE friend_requests SET status = ? WHERE id = ?",
            [status, requestId]
        );
        return result;
    } catch (error) {
        console.error("Error in respondToFriendRequest:", error.message);
        throw error;
    }
};


export const getFriends = async (username) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                CASE 
                    WHEN sender_username = ? THEN receiver_username 
                    ELSE sender_username 
                END AS friend_username,
                id
             FROM friend_requests
             WHERE (sender_username = ? OR receiver_username = ?)
               AND status = 'accepted'`,
            [username, username, username]
        );
        return rows;
    } catch (error) {
        console.error("Error in getFriends:", error.message);
        throw error;
    }
};

export const getPendingRequests = async (username) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, sender_username, created_at
             FROM friend_requests
             WHERE receiver_username = ? AND status = 'pending'`,
            [username]
        );
        return rows;
    } catch (error) {
        console.error("Error in getPendingRequests:", error.message);
        throw error;
    }
};

export const getSentRequests = async (username) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, receiver_username, status, created_at
             FROM friend_requests
             WHERE sender_username = ?`,
            [username]
        );
        return rows;
    } catch (error) {
        console.error("Error in getSentRequests:", error.message);
        throw error;
    }
};

//trips db ops
export const createTrip = async (name, description, destination, startDate, endDate, ownerUsername) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO trips (name, description, destination, start_date, end_date, owner_username)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, destination, startDate, endDate, ownerUsername]
        );
        await pool.query(
            `INSERT INTO trip_collaborators (trip_id, username, role) VALUES (?, ?, 'owner')`,
            [result.insertId, ownerUsername]
        );
        return result;
    } catch (error) {
        console.error("Error in createTrip:", error.message);
        throw error;
    }
};

export const getUserTrips = async (username) => {
    try {
        const [rows] = await pool.query(
            `SELECT t.*, tc.role
             FROM trips t
             JOIN trip_collaborators tc ON t.id = tc.trip_id
             WHERE tc.username = ?
             ORDER BY t.created_at DESC`,
            [username]
        );
        return rows;
    } catch (error) {
        console.error("Error in getUserTrips:", error.message);
        throw error;
    }
};

export const getTripById = async (tripId) => {
    try {
        const [rows] = await pool.query("SELECT * FROM trips WHERE id = ?", [tripId]);
        return rows[0] || null;
    } catch (error) {
        console.error("Error in getTripById:", error.message);
        throw error;
    }
};

//packingItems db ops
export const createPackingItems = async(name, bringer)=>{
    try{
        const [result] = await pool.query(`INSERT INTO packing_items (name, bringer) VALUES (?,?)`,[name, bringer]);
        return result;
    }
    catch(error){
        console.error("Error in createPackingItems", error.message);
        throw error;
    }
};

export const getPackingItems = async (tripId) =>{
    try{
        const [rows] = await pool.query("SELECT * FROM packing_items WHERE trip_id =?",[tripId]);
        return rows;
    }
    catch(error){
        console.error("Error in getPackingItems", error.message);
        throw error;
    }
};

export const deletePackingItem = async (tripId) =>{
    try{
        const [result] = await pool.query("DELETE * FROM packing_items WHERE trip_id =?", [tripId]);
        return result;
    }
    catch(error){
        console.error("Error in deletePackingItem: ", error.message);
        throw error;
    }
};

export const getPersonalPackingItems = async (tripId, username) =>{
    try{
        const [rows] = await pool.query("SELECT * FROM packing_items WHERE trip_id = ? AND username = ?", [tripId, username]);
        return rows;
    }
    catch(error){
        console.error("Error in getPersonalPackingItems: ", error.message);
        throw error;
    }
};

//trip_collaborators db ops
export const getTripCollaborators = async (tripId) => {
    try {
        const [rows] = await pool.query(
            "SELECT username, role FROM trip_collaborators WHERE trip_id = ?",
            [tripId]
        );
        return rows;
    } catch (error) {
        console.error("Error in getTripCollaborators:", error.message);
        throw error;
    }
};

export const addCollaborator = async (tripId, username) => {
    try {
        const [result] = await pool.query(
            `INSERT IGNORE INTO trip_collaborators (trip_id, username, role) VALUES (?, ?, 'collaborator')`,
            [tripId, username]
        );
        return result;
    } catch (error) {
        console.error("Error in addCollaborator:", error.message);
        throw error;
    }
};

export const removeCollaborator = async (tripId, username) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM trip_collaborators WHERE trip_id = ? AND username = ? AND role != 'owner'",
            [tripId, username]
        );
        return result;
    } catch (error) {
        console.error("Error in removeCollaborator:", error.message);
        throw error;
    }
};

//itinerary items db ops
export const addItineraryItem = async (tripId, dayNumber, timeOfDay, title, description, location, createdBy) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO itinerary_items (trip_id, day_number, time_of_day, title, description, location, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [tripId, dayNumber, timeOfDay, title, description, location, createdBy]
        );
        return result;
    } catch (error) {
        console.error("Error in addItineraryItem:", error.message);
        throw error;
    }
};

export const getItineraryItems = async (tripId) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM itinerary_items WHERE trip_id = ? ORDER BY day_number, time_of_day",
            [tripId]
        );
        return rows;
    } catch (error) {
        console.error("Error in getItineraryItems:", error.message);
        throw error;
    }
};

export const deleteItineraryItem = async (itemId) => {
    try {
        const [result] = await pool.query("DELETE FROM itinerary_items WHERE id = ?", [itemId]);
        return result;
    } catch (error) {
        console.error("Error in deleteItineraryItem:", error.message);
        throw error;
    }
};

export const deleteTrip = async (tripId, ownerUsername) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM trips WHERE id = ? AND owner_username = ?",
            [tripId, ownerUsername]
        );
        return result;
    } catch (error) {
        console.error("Error in deleteTrip:", error.message);
        throw error;
    }
};




