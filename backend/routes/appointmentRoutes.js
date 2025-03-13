const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.get('/byBranchAndDate', appointmentController.getAppointmentsByBranchAndDate);
router.get('/byBranchAndService', appointmentController.getAppointmentsByBranchAndService);
router.post('/', appointmentController.createAppointment);
router.put('/:id/status', appointmentController.updateAppointmentStatus);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
