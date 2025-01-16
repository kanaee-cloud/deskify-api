require("dotenv").config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const packageRoute = require('./routes/packageRoute')
const laptopRoute = require('./routes/laptopRoute')

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: 'http://localhost:3001'
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/packages', packageRoute);
app.use('/laptop', laptopRoute)


app.get('/', (req, res) => {
  res.send('Welcome to the Deskify Product API!');
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
