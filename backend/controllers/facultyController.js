const { User, Subject } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const faculty = await User.findAll({
      where: { role: 'teacher' },
      attributes: ['id', 'name', 'email', 'createdAt'],
      include: [{ model: Subject, attributes: ['id'] }]
    });
    const result = faculty.map(f => ({
      ...f.toJSON(),
      subjectCount: f.Subjects?.length || 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};