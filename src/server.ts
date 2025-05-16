import express from 'express';
import { rateLimit } from 'express-rate-limit';

import { connectToDatabase } from './connection';
import { feedbackRouter } from './routes/feedback.router';

//setup express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

//setup rate limiter middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // each IP can make up to 10 requests per minute
  standardHeaders: 'draft-8', 
  legacyHeaders: false,
});

app.use(limiter)

//ensure db has been connected to before we open our routes!
connectToDatabase().then(() => {
  app.use('/feedback', feedbackRouter);

  //catch invalid routes
  //obvs have to use this weird format for wildcards in typescript for some reason
  app.all('/{*any}', (req, res) => {
    res.status(404).send('Not Found! Wooops');
  });

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error: Error) => {
  console.error("Database connection failed", error);
  process.exit();
});

module.exports = app;