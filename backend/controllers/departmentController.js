const { Department, Subject, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [{ model: Subject, attributes: ['id'] }],
      order: [['createdAt', 'DESC']]
    });
    const result = departments.map(d => ({
      ...d.toJSON(),
      subjectCount: d.Subjects?.length || 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const dept = await Department.create({ code, name, description, created_by: req.userId });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id, {
      include: [{ model: Subject }]
    });
    if (!dept) return res.status(404).json({ message: 'Not found' });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Department.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Department.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};