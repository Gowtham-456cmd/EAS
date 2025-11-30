import User from '../models/User.js';

/**
 * Generate next available Employee ID
 * Format: EMP001, EMP002, etc.
 */
export const generateEmployeeId = async () => {
  try {
    // Find the highest employee ID
    const lastEmployee = await User.findOne({
      role: 'employee',
      employeeId: { $regex: /^EMP\d+$/ }
    })
    .sort({ employeeId: -1 })
    .select('employeeId');

    if (!lastEmployee || !lastEmployee.employeeId) {
      return 'EMP001';
    }

    // Extract number from last ID (e.g., EMP001 -> 1)
    const lastNumber = parseInt(lastEmployee.employeeId.replace('EMP', ''));
    const nextNumber = lastNumber + 1;
    
    // Format with leading zeros (001, 002, etc.)
    return `EMP${String(nextNumber).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating Employee ID:', error);
    // Fallback: generate based on timestamp
    return `EMP${Date.now().toString().slice(-6)}`;
  }
};

/**
 * Generate next available Manager ID
 * Format: MGR001, MGR002, etc.
 */
export const generateManagerId = async () => {
  try {
    // Find the highest manager ID
    const lastManager = await User.findOne({
      role: 'manager',
      employeeId: { $regex: /^MGR\d+$/ }
    })
    .sort({ employeeId: -1 })
    .select('employeeId');

    if (!lastManager || !lastManager.employeeId) {
      return 'MGR001';
    }

    // Extract number from last ID (e.g., MGR001 -> 1)
    const lastNumber = parseInt(lastManager.employeeId.replace('MGR', ''));
    const nextNumber = lastNumber + 1;
    
    // Format with leading zeros (001, 002, etc.)
    return `MGR${String(nextNumber).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating Manager ID:', error);
    // Fallback: generate based on timestamp
    return `MGR${Date.now().toString().slice(-6)}`;
  }
};

