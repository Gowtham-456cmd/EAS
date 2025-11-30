import express from 'express';
import { getEmployeeDashboard, getManagerDashboard } from '../controllers/dashboardController.js';
import { auth, managerOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/employee', auth, getEmployeeDashboard);
router.get('/manager', auth, managerOnly, getManagerDashboard);

export default router;

