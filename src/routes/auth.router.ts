import express, {Request, Response} from 'express';
import { collections } from "../connection";
import User from '../classes/User';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
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

authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
    try{
        const { username, password } = req.body;
        //check if user exists
        const foundUser = await collections.users!.findOne({username: username});
        if(!foundUser){
            res.status(401).json({message: 'Invalid username or password'});
            return;
        }
        //use bcrypt to check that entered password matches stored password after hashing
        const match = await bcrypt.compare(password, foundUser.passwordHash);
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
        //set cookie on response header
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, //set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.status(200).json({message: 'Login successful'});
    }catch(err){
        res.status(500).json({message: 'A server error occurred'});
        return;
    }
})

//uses httponly cookies to verify is user is authed - these cookies can only be checked serverside (for security)
//used to provide access to vue router routes
authRouter.get('/heartbeat', (req: Request, res: Response): void => {
    const { token } = req.cookies;
    if(!token){
        res.status(401).json({authenticated: false});
        return;
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.status(200).json({authenticated: true, username: payload.username});
        return;
    }catch(err){
        res.status(401).json({authenticated: false});
    }
})