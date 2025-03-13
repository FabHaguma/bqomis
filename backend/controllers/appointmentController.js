const Appointment = require('../models/appointmentModel');

exports.getAllAppointments = (req, res) => {
    Appointment.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getAppointmentById = (req, res) => {
    const { id } = req.params;
    Appointment.getById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Appointment not found' });
        res.json(results[0]);
    });
};

exports.getAppointmentsByBranchAndDate = (req, res) => {
    const { branchId, date } = req.query;
    if (!branchId || !date) {
        return res.status(400).json({ message: 'Branch ID and date are required' });
    }

    Appointment.getByBranchAndDate(branchId, date, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getAppointmentsByBranchAndService = (req, res) => {
    const { branchId, serviceId } = req.query;
    if (!branchId || !serviceId) {
        return res.status(400).json({ message: 'Branch ID and service ID are required' });
    }

    Appointment.getByBranchAndService(branchId, serviceId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getAppointmentsByListOfBranchIds = (req, res) => {
    const { branchIds } = req.query;
    if (!branchIds) return res.status(400).json({ message: 'Branch IDs are required' });

    Appointment.getByListOfBranchIds(branchIds, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createAppointment = (req, res) => {
    const { user_id, branch_id, appointment_date, appointment_time, status } = req.body;
    if (!user_id || !branch_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newAppointment = {
        user_id,
        branch_id,
        appointment_date,
        appointment_time,
        status: status || 'booked'
    };

    Appointment.create(newAppointment, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Appointment created successfully', appointmentId: result.insertId });
    });
};

exports.updateAppointmentStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    Appointment.updateStatus(id, status, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment status updated successfully' });
    });
};

exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    Appointment.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment deleted successfully' });
    });
};
