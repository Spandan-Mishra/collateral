import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';

const app = express();

app.post('/signin', (req, res) => {

    res.json({
        message: "Sign up successful",
    })
})

app.post('/login', (req, res) => {

    res.json({
        mesaage: "Login successful",
    })
})

app.post('/room', (req, res) => {

    res.json({
        message: "Room created",
    })
})