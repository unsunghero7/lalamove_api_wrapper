const express = require('express');
const cors = require("cors");
const path = require('path');

require('dotenv').config(); // getting all environment variables
require('./src/database/config'); // database connection

const { routesNotFound, globalErrorHandler } = require('./src/middleware')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'website')));


const lalamoveRoutes = require('./src/routes/lalamove');
const shopRoutes = require('./src/routes/shop');
const userRoutes = require('./src/routes/user');


app.use('/api/lalamove', lalamoveRoutes);
app.use('/api/shop',shopRoutes);
app.use('/api/user', userRoutes);


//if any api routes not found
app.use(routesNotFound)
//global error handle middleware
app.use(globalErrorHandler)


app.listen(PORT, () => console.log(`Server running at port: ${PORT}`)); // running the application
