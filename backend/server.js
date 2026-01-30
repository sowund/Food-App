const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_CLIENT_ID = "368358949805-u0q2o81duc2j114qcana4fobegihkc4m.apps.googleusercontent.com";
const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID);

// 1. CONNECT TO AUTH DB
mongoose.connect("mongodb://127.0.0.1:27017/authdb")
    .then(() => console.log("Auth MongoDB connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// 2. UPDATED SCHEMA: Added 'name' so it matches what Google sends
const User = mongoose.model("User", {
    name: String,           // <--- Added this field
    Firstname: String,
    Lastname: String,
    DOB: String,
    email: String,
    Address: String,
    Phone_num: Number,
    password: String,
    googleId: String
}, "user");

// Register API
app.post("/register", async (req, res) => {
    try {
        const { Firstname, Lastname, DOB, email, Phone_num, Address, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        // Save 'name' as a combination of First and Last
        await User.create({
            name: `${Firstname} ${Lastname}`,
            Firstname,
            Lastname,
            DOB,
            email,
            Phone_num,
            Address,
            password: hashPassword
        });

        res.json({ message: "User added Successfully" });
    } catch (err) {
        res.status(400).json({ message: "Registration Failed" });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        // Check if user has a password (google users might not)
        if (!user.password) {
            return res.status(400).json({ message: "Please login with Google" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong Password" });
        }
        const token = jwt.sign({ id: user._id }, "234", { expiresIn: "10 sec" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Login Error" });
    }
});

// Google Sign-in API
app.post("/auth/google", async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) return res.status(400).json({ message: "No Google Token" });

        const ticket = await googleclient.verifyIdToken({
            idToken: id_token,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const googleId = payload.sub;
        const name = payload.name; // Google gives full name

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            user = await User.create({
                name: name,         // Now valid because we added 'name' to Schema
                email: email,
                password: "",       // No password for Google users
                googleId: googleId
            });
        }

        const token = jwt.sign({ id: user._id }, "234", { expiresIn: "1h" });
        res.json({ token });

    } catch (err) {
        console.error("Google Auth Error:", err); // Check your terminal for this log!
        res.status(400).json({ message: "Google Login Failed" });
    }
});

app.listen(4000, () => {
    console.log("Auth Server is running on http://localhost:4000");
});