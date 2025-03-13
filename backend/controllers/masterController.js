
const Service = require('../models/serviceModel');
const appointmentController = require('./appointmentController');

function getAppointmentCalendar(branchName, serviceName){
    let service = Service.getByName(serviceName);
    let branch = Branch.getByName(branchName);
    let appointments = appointmentController.getAppointmentsByBranchAndService(branch.id, service.id);
    let calendar = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

    appointments.forEach(appointment => {
        let hour = parseInt(appointment.appointment_time.split(':')[0], 10);
        let minute = appointment.appointment_time.split(':')[1];
        let tenMinutes = parseInt(minute / 10);
        let shiftHour = hour - 9; // Assuming the shift starts at 9 AM
        if (shiftHour >= 0 && shiftHour < 8) {
            calendar[shiftHour][tenMinutes] += 1;
        }
    });

    return calendar;
}

function getAppointmentsPerHourOnService(serviceName){
    let service = Service.getByName(serviceName);
    let branches = Branch.getByService(service.id);
    let appointmentsPerHour = [0, 0, 0, 0, 0, 0, 0, 0];

    branches.forEach(branch => {
        // Create mock req and res objects
        let req = {
            query: {
                branchId: branch.id,
                serviceId: service.id
            }
        };

        let branchAppointments = appointmentController.getAppointmentsByBranchAndService(req, res);
        branchAppointments.forEach(appointment => {
            let hour = parseInt(appointment.appointment_time.split(':')[0], 10);
            let shiftHour = hour - 9; // Assuming the shift starts at 9 AM
            if (shiftHour >= 0 && shiftHour < 8) {
                appointmentsPerHour[shiftHour] += 1;
            }
        });
    });

    return appointmentsPerHour;
}

function getAppointmentsPerHourInDistrict(district) {
    let branches = Branch.getByDistrict(district);
    let appointmentsPerHour = [0, 0, 0, 0, 0, 0, 0, 0];

    branches.forEach(branch => {
        // Create mock req and res objects
        let req = {
            query: {
                branchId: branch.id,
                date: new Date().toISOString().split('T')[0] // Format date as YYYY-MM-DD
            }
        };

        let branchAppointments = appointmentController.getAppointmentsByBranchAndDate(req, res);
        branchAppointments.forEach(appointment => {
            let hour = parseInt(appointment.appointment_time.split(':')[0], 10);
            let shiftHour = hour - 9; // Assuming the shift starts at 9 AM
            if (shiftHour >= 0 && shiftHour < 8) {
                appointmentsPerHour[shiftHour] += 1;
            }
        });
    });

    return appointmentsPerHour;
}