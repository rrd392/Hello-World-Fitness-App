const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const loginRoute = require('./routes/login'); 
const forgotPasswordRoute = require('./routes/forgot-password');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use('/api', loginRoute);
app.use('/api',forgotPasswordRoute);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
