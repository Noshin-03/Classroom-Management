const { Department, Subject, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [{
        model: Subject,
        attributes: ['id', 'teacher_id'],
        include: [{ model: User, attributes: ['id', 'name', 'email'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
    const result = departments.map(d => ({
      ...d.toJSON(),
      subjectCount: d.Subjects?.length || 0,
      teacherCount: Array.from(new Set((d.Subjects || []).map(s => s.teacher_id).filter(Boolean))).length,
      teachers: Array.from(new Map(
        (d.Subjects || [])
          .filter(s => s.User)
          .map(s => [s.User.id, { id: s.User.id, name: s.User.name, email: s.User.email }])
      ).values())
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { code, name, description } = req.body;
  try {
    const dept = await Department.create({ code, name, description, created_by: req.userId });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { Class } = require('../models');
    const dept = await Department.findByPk(req.params.id, {
      include: [{
        model: Subject,
        include: [{ model: User, attributes: ['id', 'name', 'email'] }, { model: Class, attributes: ['id'] }]
      }]
    });
    if (!dept) return res.status(404).json({ message: 'Not found' });

    const payload = dept.toJSON();
    payload.Subjects = (payload.Subjects || []).map(subject => ({
      ...subject,
      classCount: subject.Classes?.length || 0
    }));
    payload.totalClasses = payload.Subjects.reduce((sum, s) => sum + (s.classCount || 0), 0);

    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Department.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Department.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};