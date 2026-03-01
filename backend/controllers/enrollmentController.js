const { Enrollment, Class, Subject, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Class, include: [{ model: Subject, attributes: ['id', 'name', 'code'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.enroll = async (req, res) => {
  const { class_id } = req.body;
  try {
    const existing = await Enrollment.findOne({ where: { student_id: req.userId, class_id } });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });
    const enrollment = await Enrollment.create({ student_id: req.userId, class_id });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Enrollment.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};