require("dotenv").config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const packageRoute = require('./routes/packageRoute')
const laptopRoute = require('./routes/laptopRoute')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/packages', packageRoute);
app.use('/laptops', laptopRoute)


app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
