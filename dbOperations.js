import pool from "./dbConfig.js";

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




