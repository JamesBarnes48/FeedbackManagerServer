import express, {Request, Response} from 'express';
import { collections } from "../connection";
import User from '../classes/User';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export const authRouter = express.Router();
authRouter.use(express.json());

//TODO
//standardise res.send or res.json across all routers
//test and see if the register and also the login works

authRouter.post('/register', async (req: Request, res: Response) => {
    try{
        //validate username and password according to clientside checks
        const newUser = new User(req.body.username);
        if(!newUser.validUsername()){
            res.status(400).json({message: 'Invalid username field'});
            return;
        }
        //set password hash stored in User class
        const setPasswordSuccess = await newUser.setPassword(req.body.password);
        if(!setPasswordSuccess){
            res.status(400).json({message: 'Invalid password field'});
            return;
        }

        //check if username already exists
        const foundUser = await collections.users!.findOne({username: newUser.username});
        if(foundUser){
            res.status(400).json({message: 'Username is already taken'});
            return;
        }

        const result = await collections.users!.insertOne(newUser.format());
        result
            ? res.status(201).json({message: `Successfully insert new user with id ${result.insertedId}`})
            : res.status(500).json({message: "Failed to insert a new user."});
    }catch(err){
        res.status(500).json({message: 'A server error occurred'});
        return;
    }
})

authRouter.post('/login', async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body;
        //check if user exists
        const foundUser = await collections.users!.findOne({username: username});
        if(!foundUser){
            res.status(401).json({message: 'Invalid username or password'});
            return;
        }
        //use bcrypt to check that entered password matches stored password after hashing
        const match = await bcrypt.compare(password, foundUser.password);
        if(!match){
            res.status(401).json({message: 'Invalid username or password'});
            return;
        }
        
        //create auth token - payload is publically visible so must not contain sensitive info
        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET_KEY,
            {expiresIn: '1h'}
        );
        res.status(200).json({message: 'Login successful', token});
    }catch(err){
        res.status(500).json({message: 'A server error occurred'});
        return;
    }
})