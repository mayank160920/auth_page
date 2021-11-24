const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require('dotenv').config()

// create express instance
const app = express();

// use middleware to parse json body
app.use(express.json());
// use middleware to allow cors
app.use(cors());

// let's store all the login data inside a js object
const credsData = {};

// utils functions
function validateCredentials(creds) {
    if (!creds.email || !creds.password) {
        throw Error("Invalid Schema");
    }

    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email_regex.test(creds.email)) {
        throw Error("Invalid Email Format");
    }

    const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!password_regex.test(creds.password)) {
        throw Error("Invalid Password Format");
    }
}

// list all the routes
app.get("/", (req, res) => {
    res.send({ status: 1, data: "pong!" })
})

app.post("/login", (req, res) => {
    // simple schema validation
    try {
        validateCredentials(req.body);
    } catch (error) {
        return res.status(400).send({ status: false, error: error.message })
    }

    const { email, password } = req.body;
    // check if email is registered
    if (!credsData[email]) {
        return res.status(400).send({ status: false, error: "Email Not Registered" })
    }

    // verify the password
    if (credsData[email].password !== password) {
        return res.status(400).send({ status: false, error: "Invalid Password" })
    }

    // return jwt token
    const token = jwt.sign({ email: email }, process.env.JWT_KEY, { expiresIn: '2hr' })
    res.status(200).send({ status: true, email: email, token: token })
})

app.post("/signup", (req, res) => {
    // simple schema validation
    try {
        validateCredentials(req.body);
    } catch (error) {
        return res.status(400).send({ status: false, error: error.message })
    }

    const { email, password } = req.body;
    // check if email is already registered
    if (credsData[email]) {
        return res.status(400).send({ status: false, error: "Email Already Registered" })
    }

    // save the creds
    credsData[email] = { email: email, password: password };

    // return jwt token
    const token = jwt.sign({ email: email }, process.env.JWT_KEY, { expiresIn: '2hr' })
    res.status(200).send({ status: true, email: email, token: token })
})

app.get("/dashboard", (req, res) => {
    try {
        const decoded = jwt.verify(req.headers["x-access-token"], process.env.JWT_KEY)
        const { email } = decoded;
        res.status(200).send({ status: true, email: email })
    } catch (error) {
        res.status(400).send({ status: false, error: "Invalid Auth Token" })
    }
})

app.listen(3001, () => { console.log("Server Started Running ...") })