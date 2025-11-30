import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
export const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    // Determine if late (after 9:30 AM)
    const checkInTime = new Date();
    const expectedTime = new Date(today);
    expectedTime.setHours(9, 30, 0, 0);
    
    let status = 'present';
    if (checkInTime > expectedTime) {
      status = 'late';
    }

    let attendance;
    const dateOnly = startOfDay(today);
    
    if (existingAttendance) {
      attendance = await Attendance.findByIdAndUpdate(
        existingAttendance._id,
        { checkInTime, status },
        { new: true }
      ).populate('userId', 'name email employeeId department');
    } else {
      attendance = await Attendance.create({
        userId,
        date: dateOnly,
        checkInTime,
        status
      });
      console.log('✅ Attendance check-in created:', attendance._id);
      attendance = await Attendance.findById(attendance._id)
        .populate('userId', 'name email employeeId department');
    }

    res.status(201).json(attendance);
  } catch (error) {
    console.error('❌ Check-in error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private
export const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    const totalHours = (checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);

    // If less than 4 hours, mark as half-day
    let status = attendance.status;
    if (totalHours < 4) {
      status = 'half-day';
    }

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = parseFloat(totalHours.toFixed(2));
    attendance.status = status;
    await attendance.save();
    console.log('✅ Attendance check-out saved:', attendance._id);

    const updatedAttendance = await Attendance.findById(attendance._id)
      .populate('userId', 'name email employeeId department');

    res.json(updatedAttendance);
  } catch (error) {
    console.error('❌ Check-out error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private
export const getMyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    let startDate, endDate;
    if (month && year) {
      startDate = startOfMonth(new Date(year, month - 1));
      endDate = endOfMonth(new Date(year, month - 1));
    } else {
      // Default to current month
      const now = new Date();
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my monthly summary
// @route   GET /api/attendance/my-summary
// @access  Private
export const getMySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    let startDate, endDate;
    if (month && year) {
      startDate = startOfMonth(new Date(year, month - 1));
      endDate = endOfMonth(new Date(year, month - 1));
    } else {
      const now = new Date();
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const halfDay = attendance.filter(a => a.status === 'half-day').length;
    const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    res.json({
      present,
      absent,
      late,
      halfDay,
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalDays: attendance.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's status
// @route   GET /api/attendance/today
// @access  Private
export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (!attendance) {
      return res.json({
        checkedIn: false,
        checkedOut: false,
        status: 'absent'
      });
    }

    res.json({
      checkedIn: !!attendance.checkInTime,
      checkedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      status: attendance.status,
      totalHours: attendance.totalHours
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees attendance (Manager)
// @route   GET /api/attendance/all
// @access  Private (Manager)
export const getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, month, year } = req.query;

    let query = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) {
        query.userId = user._id;
      } else {
        return res.json([]);
      }
    }

    if (date) {
      const dateStart = startOfDay(new Date(date));
      const dateEnd = endOfDay(new Date(date));
      query.date = { $gte: dateStart, $lte: dateEnd };
    } else if (month && year) {
      const startDate = startOfMonth(new Date(year, month - 1));
      const endDate = endOfMonth(new Date(year, month - 1));
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific employee attendance (Manager)
// @route   GET /api/attendance/employee/:id
// @access  Private (Manager)
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year } = req.query;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let startDate, endDate;
    if (month && year) {
      startDate = startOfMonth(new Date(year, month - 1));
      endDate = endOfMonth(new Date(year, month - 1));
    } else {
      const now = new Date();
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

    const attendance = await Attendance.find({
      userId: id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team summary (Manager)
// @route   GET /api/attendance/summary
// @access  Private (Manager)
export const getTeamSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    let startDate, endDate;
    if (month && year) {
      startDate = startOfMonth(new Date(year, month - 1));
      endDate = endOfMonth(new Date(year, month - 1));
    } else {
      const now = new Date();
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('userId', 'name employeeId department');

    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const halfDay = attendance.filter(a => a.status === 'half-day').length;

    res.json({
      present,
      absent,
      late,
      halfDay,
      totalRecords: attendance.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export attendance to CSV (Manager)
// @route   GET /api/attendance/export
// @access  Private (Manager)
export const exportAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(new Date(startDate)),
        $lte: endOfDay(new Date(endDate))
      };
    }

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) {
        query.userId = user._id;
      }
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    // Convert to CSV format
    const csvHeader = 'Date,Employee ID,Name,Email,Department,Check In,Check Out,Status,Total Hours\n';
    const csvRows = attendance.map(a => {
      const date = new Date(a.date).toLocaleDateString();
      const checkIn = a.checkInTime ? new Date(a.checkInTime).toLocaleString() : '';
      const checkOut = a.checkOutTime ? new Date(a.checkOutTime).toLocaleString() : '';
      return `${date},${a.userId.employeeId},${a.userId.name},${a.userId.email},${a.userId.department},${checkIn},${checkOut},${a.status},${a.totalHours || 0}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's attendance status (Manager)
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
export const getTodayStatusAll = async (req, res) => {
  try {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const attendance = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('userId', 'name email employeeId department');

    const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;

    res.json({
      present,
      absent,
      late,
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

