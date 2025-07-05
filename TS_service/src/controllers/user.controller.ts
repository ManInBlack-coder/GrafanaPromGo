import { Request,Response } from "express";
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";

export const UserController = {
    async registerUser(req: Request, res:Response) {
        try {
            const {username, email, passowrd} = req.body;
            if (!username || !email || !passowrd ) {
                return res.status(400).json({message: 'Username, email, and password are required'})
            } 
            const existingUser = await userModel.findUserByUsername(username);
            if (existingUser) {
                return res.status(409).json({message: 'Username already exists'});
            }

            const password_hash = bcrypt.hash(passowrd); 

            const newUser = await userModel.createUsers({ username, email, password_hash });
            return res.status(201).json({message: 'user registered successfully'})

        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Internal server error.' });

        }
    } 

}