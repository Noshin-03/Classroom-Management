const { Announcement, User } = require('../models');

exports.getByClass = async (req, res) => {
  try {
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
    const announcement = await Announcement.create({
      title, content, class_id, teacher_id: req.userId
    });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Announcement.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};