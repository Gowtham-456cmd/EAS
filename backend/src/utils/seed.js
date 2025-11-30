import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { startOfDay, startOfMonth, endOfMonth, subDays, format } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Creating users...');

    // Create manager
    const manager = await User.create({
      name: 'John Manager',
      email: 'manager@company.com',
      password: 'manager123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });

    // Create employees
    const employees = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering'
      },
      {
        name: 'Bob Smith',
        email: 'bob@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'Engineering'
      },
      {
        name: 'Carol Williams',
        email: 'carol@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP003',
        department: 'Sales'
      },
      {
        name: 'David Brown',
        email: 'david@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP004',
        department: 'Sales'
      },
      {
        name: 'Eva Davis',
        email: 'eva@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP005',
        department: 'HR'
      }
    ]);

    console.log('Creating attendance records...');

    // Create attendance for last 30 days
    const today = new Date();
    const attendanceRecords = [];

    for (const employee of employees) {
      for (let i = 0; i < 30; i++) {
        const date = subDays(today, i);
        const dayOfWeek = date.getDay();

        // Skip weekends (Saturday = 6, Sunday = 0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          continue;
        }

        // Randomly skip some days (10% chance of absent)
        if (Math.random() < 0.1) {
          attendanceRecords.push({
            userId: employee._id,
            date: startOfDay(date),
            status: 'absent'
          });
          continue;
        }

        // Create check-in time (between 8:00 AM and 10:00 AM)
        const checkInHour = 8 + Math.random() * 2;
        const checkInMinutes = Math.floor(Math.random() * 60);
        const checkInTime = new Date(date);
        checkInTime.setHours(Math.floor(checkInHour), checkInMinutes, 0, 0);

        // Determine if late (after 9:30 AM)
        const expectedTime = new Date(date);
        expectedTime.setHours(9, 30, 0, 0);
        const status = checkInTime > expectedTime ? 'late' : 'present';

        // Create check-out time (8-9 hours after check-in)
        const workHours = 8 + Math.random();
        const checkOutTime = new Date(checkInTime.getTime() + workHours * 60 * 60 * 1000);

        attendanceRecords.push({
          userId: employee._id,
          date: startOfDay(date),
          checkInTime,
          checkOutTime,
          status,
          totalHours: parseFloat(workHours.toFixed(2))
        });
      }
    }

    // Store all data in MongoDB
    await Attendance.insertMany(attendanceRecords);

    // Verify data is stored in MongoDB
    const userCount = await User.countDocuments();
    const attendanceCount = await Attendance.countDocuments();

    console.log('\n✅ Seed data created successfully and stored in MongoDB!');
    console.log(`📊 Database Statistics:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Attendance Records: ${attendanceCount}`);
    console.log(`   - Database: ${process.env.MONGODB_URI}`);
    console.log('\n📝 Login credentials:');
    console.log('   Manager: manager@company.com / manager123');
    console.log('   Employee: alice@company.com / employee123');
    console.log('   Employee: bob@company.com / employee123');
    console.log('   Employee: carol@company.com / employee123');
    console.log('   Employee: david@company.com / employee123');
    console.log('   Employee: eva@company.com / employee123');
    console.log('\n💾 All data is stored in MongoDB collections:');
    console.log('   - Collection: users');
    console.log('   - Collection: attendances');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
