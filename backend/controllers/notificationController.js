const { Notification } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.userId } }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markOneRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { id: req.params.id, user_id: req.userId } }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
