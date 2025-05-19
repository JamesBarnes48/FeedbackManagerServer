import express, {Request, Response} from 'express';

import { collections } from "../connection";
import Feedback from '../classes/Feedback'

export const feedbackRouter = express.Router();
feedbackRouter.use(express.json());

feedbackRouter.get('/', async (req: Request, res: Response) => {
    try{
        const result = await collections.feedback!.find().toArray();
        const feedbacks: Object[] = result.map((r) => {return {id: r._id, isPositive: r.isPositive, rating: r.rating, expectation: r.expectation, details: r.details}});
        
        res.status(200).json({feedbacks});
    }catch(err){
        console.error('GET /feedback error: ', err);
        res.status(500).send('Something went wrong');
    }
})

feedbackRouter.post('/', async (req: Request, res: Response) => {
    try{
        if(!req.body?.feedbackProps){
            res.status(400).send('feedbackProps could not be found in request body');
            return;
        }
        const {isPositive, rating, expectation, details} = req.body.feedbackProps;
    
        const feedbackInstance = new Feedback(isPositive, rating, expectation, details);
        if(!feedbackInstance.isValid()){ 
            res.status(400).send('Invalid feedback parameters');
            return;
        }
        
        const result = await collections.feedback!.insertOne(feedbackInstance.toString());

        result
            ? res.status(201).send(`Successfully insert new feedback with id ${result.insertedId}`)
            : res.status(500).send("Failed to insert a new feedback.");

    }catch(err){
        console.error('POST /feedback error: ', err);
        res.status(500).send('Something went wrong');
    }
})