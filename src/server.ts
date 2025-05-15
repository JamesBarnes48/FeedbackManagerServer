import express from 'express';

//setup express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

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