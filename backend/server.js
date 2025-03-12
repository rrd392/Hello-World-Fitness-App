const express = require('express');
const cors = require('cors');
const loginRoute = require('./routes/login'); 
const forgotPasswordRoute = require('./routes/forgot-password');
const resetPasswordRoute = require('./routes/reset-password');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Use Routes
app.use('/api',loginRoute);
app.use('/api',forgotPasswordRoute);
app.use('/api',resetPasswordRoute);

const signupRoutes = require('./routes/signup');
app.use('/api/signup', signupRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

const notificationRoutes = require('./routes/notification');
app.use('/api/notification', notificationRoutes);

const workoutPlanRoutes = require('./routes/workout-plan');
app.use('/api/workout-plan', workoutPlanRoutes);

const attendanceRoutes = require('./routes/attendance');
app.use('/api/attendance', attendanceRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const nutritionRoutes = require('./routes/nutrition');
app.use('/api/nutrition', nutritionRoutes);

const classesRoutes = require('./routes/classes');
app.use('/api/classes', classesRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
