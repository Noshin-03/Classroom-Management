const { Assignment, Submission, User, Class, Enrollment, Notification } = require('../models');
const { Op } = require('sequelize');

exports.getByClass = async (req, res) => {
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const cls = await Class.findByPk(req.params.class_id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    if (requester.role === 'teacher' && cls.teacher_id !== req.userId) {
      return res.status(403).json({ message: 'You can only access your assigned classes' });
    }

    if (requester.role === 'student') {
      const enrollment = await Enrollment.findOne({
        where: { student_id: req.userId, class_id: cls.id }
      });
      if (!enrollment || !enrollment.joined_at) {
        return res.status(403).json({ message: 'You must join this class first' });
      }
    }

    const assignments = await Assignment.findAll({
      where: { class_id: req.params.class_id },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, description, due_date, points, class_id } = req.body;
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const cls = await Class.findByPk(class_id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    if (!(requester.role === 'admin' || cls.teacher_id === req.userId)) {
      return res.status(403).json({ message: 'Only class teacher or admin can create assignments' });
    }

    const assignment = await Assignment.create({
      title, description, due_date, points, class_id, teacher_id: req.userId
    });

    const joinedEnrollments = await Enrollment.findAll({
      where: {
        class_id,
        joined_at: { [Op.ne]: null }
      }
    });

    await Promise.all(joinedEnrollments.map(e =>
      Notification.create({
        message: `New assignment: ${title}`,
        is_read: false,
        user_id: e.student_id,
        type: 'assignment',
        reference_id: assignment.id
      })
    ));
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name'] },
        {
          model: Submission,
          include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        }
      ]
    });
    if (!assignment) return res.status(404).json({ message: 'Not found' });

    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const cls = await Class.findByPk(assignment.class_id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    if (requester.role === 'teacher' && cls.teacher_id !== req.userId) {
      return res.status(403).json({ message: 'You can only access your assigned classes' });
    }

    if (requester.role === 'student') {
      const enrollment = await Enrollment.findOne({
        where: { student_id: req.userId, class_id: assignment.class_id }
      });
      if (!enrollment || !enrollment.joined_at) {
        return res.status(403).json({ message: 'You must join this class first' });
      }
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });

    const cls = await Class.findByPk(assignment.class_id);
    if (!(requester.role === 'admin' || cls?.teacher_id === req.userId || assignment.teacher_id === req.userId)) {
      return res.status(403).json({ message: 'Not allowed to delete this assignment' });
    }

    await Assignment.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
