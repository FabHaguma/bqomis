const Service = require('../models/serviceModel');

exports.getAllServices = (req, res) => {
    Service.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getServiceById = (req, res) => {
    const { id } = req.params;
    Service.getById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Service not found' });
        res.json(results[0]);
    });
};

exports.createService = (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Service name is required' });

    const newService = { name, description };

    Service.create(newService, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Service created successfully', serviceId: result.insertId });
    });
};

exports.updateService = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedService = { name, description };

    Service.update(id, updatedService, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Service updated successfully' });
    });
};

exports.deleteService = (req, res) => {
    const { id } = req.params;
    Service.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Service deleted successfully' });
    });
};
