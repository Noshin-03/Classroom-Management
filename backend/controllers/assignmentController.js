const { Assignment, Submission, User } = require('../models');

exports.getByClass = async (req, res) => {
  try {
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
    const assignment = await Assignment.create({
      title, description, due_date, points, class_id, teacher_id: req.userId
    });
    const { Enrollment, Notification } = require('../models');
    const enrollments = await Enrollment.findAll({ where: { class_id } });
    await Promise.all(enrollments.map(e =>
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
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Assignment.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
