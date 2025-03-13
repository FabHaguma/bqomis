require('dotenv').config();

const express = require('express');
const cors = require('cors');

const branchRoutes = require('./routes/branchRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/branches', branchRoutes);
app.use('/services', serviceRoutes);
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
