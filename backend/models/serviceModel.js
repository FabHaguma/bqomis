const db = require('../config/db');

const Service = {
    getAll: (callback) => {
        db.query('SELECT * FROM services', callback);
    },

    getById: (serviceId, callback) => {
        db.query('SELECT * FROM services WHERE id = ?', [serviceId], callback);
    },

    getByName: (serviceName, callback) => {
        db.query('SELECT * FROM services WHERE name = ?', [serviceName], callback);
    },

    create: (serviceData, callback) => {
        db.query('INSERT INTO services SET ?', serviceData, callback);
    },

    update: (serviceId, serviceData, callback) => {
        db.query('UPDATE services SET ? WHERE id = ?', [serviceData, serviceId], callback);
    },

    delete: (serviceId, callback) => {
        db.query('DELETE FROM services WHERE id = ?', [serviceId], callback);
    }
};

module.exports = Service;
