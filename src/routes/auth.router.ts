import express, {Request, Response} from 'express';
import { collections } from "../connection";

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/login', (req: Request, res: Response) => {
    res.status(200).send('lar de dar');
})