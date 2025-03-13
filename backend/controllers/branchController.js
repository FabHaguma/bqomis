const Branch = require('../models/branchModel');

exports.getAllBranches = (req, res) => {
    Branch.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getBranchById = (req, res) => {
    const { id } = req.params;
    Branch.getById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Branch not found' });
        res.json(result[0]);
    });
};

exports.getBranchByDistrict = (req, res) => {
    const { district } = req.params;
    Branch.getByDistrict(district, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

exports.createBranch = (req, res) => {
    const newBranch = req.body;
    Branch.create(newBranch, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Branch created', id: result.insertId });
    });
};
