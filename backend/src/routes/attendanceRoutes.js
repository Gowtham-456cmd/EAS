import express from 'express';
import {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendance,
  getTodayStatusAll
} from '../controllers/attendanceController.js';
import { auth, managerOnly } from '../middleware/auth.js';

const router = express.Router();

// Employee routes
router.post('/checkin', auth, checkIn);
router.post('/checkout', auth, checkOut);
router.get('/my-history', auth, getMyHistory);
router.get('/my-summary', auth, getMySummary);
router.get('/today', auth, getTodayStatus);

// Manager routes
router.get('/all', auth, managerOnly, getAllAttendance);
router.get('/employee/:id', auth, managerOnly, getEmployeeAttendance);
router.get('/summary', auth, managerOnly, getTeamSummary);
router.get('/export', auth, managerOnly, exportAttendance);
router.get('/today-status', auth, managerOnly, getTodayStatusAll);

export default router;

