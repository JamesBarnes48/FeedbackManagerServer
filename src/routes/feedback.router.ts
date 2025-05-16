import express from 'express';

export const feedbackRouter = express.Router();
feedbackRouter.use(express.json());

feedbackRouter.get('/', (req, res) => {
    res.send('feedback!');
})