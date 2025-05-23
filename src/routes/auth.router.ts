import express, {Request, Response} from 'express';
import { collections } from "../connection";

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    //check if user exists
    const foundUser = await collections.users!.findOne({username: username});
    res.send(foundUser);
})