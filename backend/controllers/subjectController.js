const { Subject, Department, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [{ model: Department, attributes: ['id', 'name', 'code'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { code, name, description, department_id } = req.body;
  try {
    const subject = await Subject.create({ code, name, description, department_id, teacher_id: req.userId });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: [{ model: Department }]
    });
    if (!subject) return res.status(404).json({ message: 'Not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Subject.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Subject.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};