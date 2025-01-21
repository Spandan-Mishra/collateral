import { z } from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(8, { message: "Username must be atleast 8 characters" }).max(20, { message: "Username must be atmost 20 characters" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/), { message: "Password must contain atleast 8 characters, one uppercase, one lowercase, one number and one special character" })
})

export const LoginUserSchema = z.object({
    username: z.string().min(8, { message: "Username must be atleast 8 characters" }).max(20, { message: "Username must be atmost 20 characters" }),
    password: z.string().regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/), { message: "Password must contain atleast 8 characters, one uppercase, one lowercase, one number and one special character" })
})

export const CreateRoomSchema = z.object({
    roomId: z.string().length(6, { message: "Room ID must be 6 characters long" }),
})