const { Class, Subject, Department, Enrollment } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [{
        model: Subject,
        attributes: ['id', 'name', 'code'],
        include: [{ model: Department, attributes: ['id', 'name'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
    const result = await Promise.all(classes.map(async c => {
      const studentCount = await Enrollment.count({ where: { class_id: c.id } });
      return { ...c.toJSON(), studentCount };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, subject_id } = req.body;
  try {
    const cls = await Class.create({ name, subject_id });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const cls = await Class.findByPk(req.params.id, {
      include: [{ model: Subject, include: [{ model: Department }] }]
    });
    if (!cls) return res.status(404).json({ message: 'Not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Class.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};