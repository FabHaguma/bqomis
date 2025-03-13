const db = require('../config/db');

const Branch = {
    getAll: (callback) => {
        db.query('SELECT * FROM branches', callback);
    },
    getById: (id, callback) => {
        db.query('SELECT * FROM branches WHERE id = ?', [id], callback);
    },
    getByName: (name, callback) => {
        db.query('SELECT * FROM branches WHERE name = ?', [name], callback);
    },
    getByDistrict: (district, callback) => {
        db.query('SELECT * FROM branches WHERE district = ? OR province = ?', [district, district], callback);
    },
    create: (data, callback) => {
        db.query('INSERT INTO branches SET ?', data, callback);
    }
};

module.exports = Branch;
