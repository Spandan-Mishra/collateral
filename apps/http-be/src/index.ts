import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '@repo/backend-common/config';
import { userMiddleware } from './middleware';
import { CreateUserSchema, LoginUserSchema, CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup', async (req, res) => {
    try {
        const parsedData = CreateUserSchema.safeParse(req.body);
        if(!parsedData.success) {
            res.status(400).json({
                message: parsedData.error.errors[0]?.message,
            })
            return ;
        }

        const { username, email, password } = req.body;

        const existingUser = await prismaClient.user.findFirst({
            where: {
                OR: [
                    {
                        email
                    }, 
                    {
                        username
                    }
                ]
            }
        })
        

        if(existingUser !== null) {
            res.status(400).json({
                message: "User already exists",
            })
            return ;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            }
        })

        res.json({
            message: "Sign up successful",
        })

    } catch(e) {
        res.status(400).json({
            message: "Error signing up",
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const parsedData = LoginUserSchema.safeParse(req.body);
        if(!parsedData.success) {
            res.status(400).json({
                message: parsedData.error.errors[0]?.message,
            })
            return ;
        }

        const { username, password } = req.body;

        const user = await prismaClient.user.findFirst({
            where: {
                username
            }
        })

        if(!user) {
            res.status(400).json({
                message: "User not found",
            })
            return ;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            res.status(400).json({
                message: "Invalid password",
            })
            return ;
        }

        const token = jwt.sign({
            userId: user.id,
        }, JWT_SECRET)

        res.json({
            mesaage: "Login successful",
            token
        })
    } catch(e) {
        res.status(400).json({
            message: "Error logging in",
        })
    }
})

app.post('/room', userMiddleware, async (req, res) => {
    try {
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if(!parsedData.success) {
            res.status(400).json({
                message: parsedData.error.errors[0]?.message,
            })
            return ;
        }

        const { name } = req.body;
        // @ts-ignore: TODO: fix
        const userId = req.userId;
        const existingRoom = await prismaClient.room.findFirst({
            where: {
                slug: name
            }
        })

        if (existingRoom) {
            res.status(400).json({
                message: "Room already exists",
                roomId: existingRoom.id,
            })
            return ;
        }

        const room = await prismaClient.room.create({
            data: {
                slug: name,
                adminId: userId,
            }
        })

        res.json({
            message: "Room created",
            roomId: room.id,
        })

    } catch(e) {
        res.status(400).json({
            message: "Error creating room",
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId
        },
        take: 30,
    });

    res.json({
        messages
    })
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(3001, () => {
    console.log('Server started at 3001');
})