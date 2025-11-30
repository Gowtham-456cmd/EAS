import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, format } from 'date-fns';

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Private
export const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const weekStart = subDays(today, 7);

    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    // Monthly stats
    const monthlyAttendance = await Attendance.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const present = monthlyAttendance.filter(a => a.status === 'present').length;
    const absent = monthlyAttendance.filter(a => a.status === 'absent').length;
    const late = monthlyAttendance.filter(a => a.status === 'late').length;
    const totalHours = monthlyAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    // Recent attendance (last 7 days)
    const recentAttendance = await Attendance.find({
      userId,
      date: { $gte: weekStart, $lte: todayEnd }
    }).sort({ date: -1 }).limit(7);

    res.json({
      todayStatus: {
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'absent',
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime
      },
      monthlyStats: {
        present,
        absent,
        late,
        totalHours: parseFloat(totalHours.toFixed(2))
      },
      recentAttendance: recentAttendance.map(a => ({
        date: a.date,
        status: a.status,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        totalHours: a.totalHours
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
export const getManagerDashboard = async (req, res) => {
  try {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const weekStart = subDays(today, 7);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('userId', 'name email employeeId department');

    const presentToday = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const absentToday = totalEmployees - presentToday;
    const lateToday = todayAttendance.filter(a => a.status === 'late').length;

    // Weekly attendance trend
    const weeklyAttendance = await Attendance.find({
      date: { $gte: weekStart, $lte: todayEnd }
    });

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStart = startOfDay(date);
      const dateEnd = endOfDay(date);
      const dayAttendance = weeklyAttendance.filter(a => {
        const aDate = new Date(a.date);
        return aDate >= dateStart && aDate <= dateEnd;
      });
      weeklyTrend.push({
        date: format(date, 'yyyy-MM-dd'),
        present: dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length,
        absent: dayAttendance.filter(a => a.status === 'absent').length
      });
    }

    // Department-wise attendance
    const allUsers = await User.find({ role: 'employee' });
    const departmentStats = {};
    
    for (const user of allUsers) {
      if (!departmentStats[user.department]) {
        departmentStats[user.department] = { total: 0, present: 0 };
      }
      departmentStats[user.department].total++;
      
      const userTodayAttendance = todayAttendance.find(
        a => a.userId._id.toString() === user._id.toString()
      );
      if (userTodayAttendance && (userTodayAttendance.status === 'present' || userTodayAttendance.status === 'late')) {
        departmentStats[user.department].present++;
      }
    }

    const departmentWise = Object.entries(departmentStats).map(([dept, stats]) => ({
      department: dept,
      total: stats.total,
      present: stats.present,
      absent: stats.total - stats.present
    }));

    // Absent employees today
    const allEmployeeIds = allUsers.map(u => u._id.toString());
    const presentEmployeeIds = todayAttendance
      .filter(a => a.status === 'present' || a.status === 'late')
      .map(a => a.userId._id.toString());
    const absentEmployeeIds = allEmployeeIds.filter(id => !presentEmployeeIds.includes(id));
    
    const absentEmployees = await User.find({
      _id: { $in: absentEmployeeIds }
    }).select('name email employeeId department');

    res.json({
      totalEmployees,
      todayStats: {
        present: presentToday,
        absent: absentToday,
        late: lateToday
      },
      weeklyTrend,
      departmentWise,
      absentEmployees: absentEmployees.map(e => ({
        name: e.name,
        email: e.email,
        employeeId: e.employeeId,
        department: e.department
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

