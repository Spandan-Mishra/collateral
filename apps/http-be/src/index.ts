import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { userMiddleware } from './middleware';
import { CreateUserSchema, LoginUserSchema, CreateRoomSchema } from '@repo/common/types';

const app = express();

app.post('/signin', (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: parsedData.error.errors[0]?.message,
        })
        return ;
    }

    const { usernname, email, password } = req.body;
    
    res.json({
        message: "Sign up successful",
    })
})

app.post('/login', (req, res) => {
    const parsedData = LoginUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: parsedData.error.errors[0]?.message,
        })
        return ;
    }

    const { username, password } = req.body;

    res.json({
        mesaage: "Login successful",
    })
})

app.post('/room', userMiddleware, (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: parsedData.error.errors[0]?.message,
        })
        return ;
    }

    

    res.json({
        message: "Room created",
    })
})