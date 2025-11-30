import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { generateEmployeeId, generateManagerId } from '../utils/generateEmployeeId.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId, department } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userRole = role || 'employee';
    let finalEmployeeId = employeeId;

    // Auto-generate ID if not provided
    if (!finalEmployeeId || finalEmployeeId.trim() === '') {
      if (userRole === 'manager') {
        finalEmployeeId = await generateManagerId();
      } else {
        finalEmployeeId = await generateEmployeeId();
      }
      console.log(`✅ Auto-generated ${userRole} ID: ${finalEmployeeId}`);
    } else {
      // Check if provided ID already exists
      const idExists = await User.findOne({ employeeId: finalEmployeeId });
      if (idExists) {
        const idLabel = userRole === 'manager' ? 'Manager ID' : 'Employee ID';
        return res.status(400).json({ message: `${idLabel} already exists` });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      employeeId: finalEmployeeId,
      department
    });

    if (user) {
      console.log('✅ User created successfully:', user.email);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

