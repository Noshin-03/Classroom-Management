const { Enrollment, Class, Subject, User } = require('../models');
const { Op } = require('sequelize');

const MAX_CLASS_SIZE = 30;

exports.getAll = async (req, res) => {
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const whereClause = {};

    if (requester.role === 'student') {
      whereClause.student_id = req.userId;
    }

    const enrollments = await Enrollment.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: Class,
          include: [{ model: Subject, attributes: ['id', 'name', 'code'] }],
          ...(requester.role === 'teacher' ? { where: { teacher_id: req.userId } } : {})
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getByClass = async (req, res) => {
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const cls = await Class.findByPk(req.params.classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    if (requester.role === 'teacher' && cls.teacher_id !== req.userId) {
      return res.status(403).json({ message: 'You can only access your assigned classes' });
    }

    if (requester.role === 'student') {
      const ownEnrollment = await Enrollment.findOne({
        where: { student_id: req.userId, class_id: cls.id }
      });
      if (!ownEnrollment || !ownEnrollment.joined_at) {
        return res.status(403).json({ message: 'You must join this class first' });
      }
    }

    const enrollments = await Enrollment.findAll({
      where: { class_id: req.params.classId, joined_at: { [Op.ne]: null } },
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'role'] }
      ]
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.enroll = async (req, res) => {
  const { class_id } = req.body;
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });
    if (requester.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in classes' });
    }

    const cls = await Class.findByPk(class_id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const existing = await Enrollment.findOne({ where: { student_id: req.userId, class_id } });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });
    
    // Check enrollment limit (30 students max)
    const enrollmentCount = await Enrollment.count({ where: { class_id } });
    if (enrollmentCount >= MAX_CLASS_SIZE) {
      return res.status(400).json({ message: `Class is full (maximum ${MAX_CLASS_SIZE} students)` });
    }
    
    const enrollment = await Enrollment.create({ student_id: req.userId, class_id, joined_at: null });
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