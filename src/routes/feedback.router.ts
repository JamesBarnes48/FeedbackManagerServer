import express, {Request, Response} from 'express';
import Feedback from '../classes/Feedback'

export const feedbackRouter = express.Router();
feedbackRouter.use(express.json());

feedbackRouter.get('/', (req, res) => {
    res.send('feedback!');
})

feedbackRouter.post('/', (req: Request, res: Response) => {
    try{
        if(!req.body?.feedbackProps) res.status(400).send('feedbackProps could not be found in request body');
        const {isPositive, rating, expectation, details} = req.body.feedbackProps;
    
        const feedbackInstance = new Feedback(isPositive, rating, expectation, details);
        if(!feedbackInstance.isValid()) res.status(400).send('Invalid feedback parameters');
        res.status(200).send('success');
    }catch(err){
        res.status(500).send('Something went wrong');
    }
})