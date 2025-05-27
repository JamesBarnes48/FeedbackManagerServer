import express, {Request, Response} from 'express';
import { collections } from "../connection";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export const authRouter = express.Router();
authRouter.use(express.json());

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