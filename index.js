require("dotenv").config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const packageRoute = require('./routes/packageRoute')
const laptopRoute = require('./routes/laptopRoute')
const adminRoute = require("./routes/adminRoute");
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173", "https://deskify-seven.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true, 
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/packages', packageRoute);
app.use('/laptops', laptopRoute)
app.use('/admin', adminRoute)


app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
