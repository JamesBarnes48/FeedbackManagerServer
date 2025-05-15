import express from 'express';
import { rateLimit } from 'express-rate-limit';

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

//catch invalid routes
app.all('*', (req, res) => {
    res.status(404).send('Not Found');
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Express!');
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;