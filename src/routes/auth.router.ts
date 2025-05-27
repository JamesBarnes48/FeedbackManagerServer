import express, {Request, Response} from 'express';
import { collections } from "../connection";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    //validate username and password according to clientside checks
    if(!/^[a-zA-Z0-9_]{3,30}$/.test(username)){
        res.status(400).json({message: 'Invalid username field'});
        return;
    }
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,32}$/.test(password)){
        res.status(400).json({message: 'Invalid password field'});
        return;
    }

    //check if username already exists
    const foundUser = await collections.users!.findOne({username: username});
    if(foundUser){
        res.status(400).json({message: 'Username is already taken'});
        return;
    }
    //const result = await collections.users!.insertOne({})

    //TODO 
    //rewrite this using the class format the Feedback insert one uses
})

authRouter.post('/login', async (req: Request, res: Response) => {
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
})