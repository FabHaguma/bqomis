const db = require('../config/db');
const { getByDistrict } = require('./branchModel');

const Appointment = {
    getAll: (callback) => {
        db.query('SELECT * FROM appointments', callback);
    },

    getById: (appointmentId, callback) => {
        db.query('SELECT * FROM appointments WHERE appointment_id = ?', [appointmentId], callback);
    },

    getByBranchAndDate: (branchId, date, callback) => {
        db.query(
            'SELECT * FROM appointments WHERE branch_id = ? AND appointment_date = ? ORDER BY appointment_time',
            [branchId, date],
            callback
        );
    },

    getByBranchAndService: (branchId, serviceId, callback) => {
        db.query(
            'SELECT * FROM appointments WHERE branch_id = ? AND service_id = ? ORDER BY appointment_time, created_at',
            [branchId, serviceId],
            callback
        );
    },

    getByListOfBranchIds: (branchIds, callback) => {
        db.query(
            'SELECT * FROM appointments WHERE branch_id IN (?) ORDER BY appointment_date, appointment_time',
            [branchIds],
            callback
        );
    },

    create: (appointmentData, callback) => {
        db.query('INSERT INTO appointments SET ?', appointmentData, callback);
    },

    updateStatus: (appointmentId, status, callback) => {
        db.query('UPDATE appointments SET status = ? WHERE appointment_id = ?', [status, appointmentId], callback);
    },

    delete: (appointmentId, callback) => {
        db.query('DELETE FROM appointments WHERE appointment_id = ?', [appointmentId], callback);
    }
};

module.exports = Appointment;
