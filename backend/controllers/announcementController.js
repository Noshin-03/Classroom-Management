const { Announcement, User, Class, Enrollment, Notification } = require('../models');
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

    const announcements = await Announcement.findAll({
      where: { class_id: req.params.class_id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, content, class_id } = req.body;
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const cls = await Class.findByPk(class_id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    if (!(requester.role === 'admin' || cls.teacher_id === req.userId)) {
      return res.status(403).json({ message: 'Only class teacher or admin can post announcements' });
    }

    const announcement = await Announcement.create({
      title, content, class_id, teacher_id: req.userId
    });

    const joinedEnrollments = await Enrollment.findAll({
      where: {
        class_id,
        joined_at: { [Op.ne]: null }
      }
    });

    await Promise.all(joinedEnrollments.map(e =>
      Notification.create({
        message: `New announcement: ${title}`,
        is_read: false,
        user_id: e.student_id,
        type: 'announcement',
        reference_id: class_id
      })
    ));

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const requester = await User.findByPk(req.userId);
    if (!requester) return res.status(404).json({ message: 'User not found' });

    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Not found' });

    const cls = await Class.findByPk(announcement.class_id);
    if (!(requester.role === 'admin' || cls?.teacher_id === req.userId || announcement.teacher_id === req.userId)) {
      return res.status(403).json({ message: 'Not allowed to delete this announcement' });
    }

    await Announcement.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};