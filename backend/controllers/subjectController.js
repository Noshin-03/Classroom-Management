const { Subject, Department, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { code, name, description, department_id, teacher_id } = req.body;
  try {
    const requester = await User.findByPk(req.userId);
    let assignedTeacherId = null;

    if (requester?.role === 'admin') {
      assignedTeacherId = teacher_id ? Number(teacher_id) : null;
    }

    if (assignedTeacherId) {
      const teacher = await User.findOne({ where: { id: assignedTeacherId, role: 'teacher' } });
      if (!teacher) {
        return res.status(400).json({ message: 'Invalid teacher selected' });
      }
    }

    const subject = await Subject.create({
      code,
      name,
      description,
      department_id,
      teacher_id: assignedTeacherId
    });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { Class, Enrollment } = require('../models');
    const subject = await Subject.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Class, attributes: ['id', 'name', 'join_code', 'createdAt'] }
      ]
    });
    if (!subject) return res.status(404).json({ message: 'Not found' });

    const payload = subject.toJSON();
    payload.Classes = await Promise.all((payload.Classes || []).map(async cls => {
      const studentCount = await Enrollment.count({ where: { class_id: cls.id } });
      return { ...cls, studentCount };
    }));
    payload.classCount = payload.Classes.length;

    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    const requester = await User.findByPk(req.userId);
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Not found' });
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'teacher_id')) {
      const canManageTeacher = requester?.role === 'admin' || Number(subject.teacher_id) === Number(req.userId);
      if (!canManageTeacher) {
        return res.status(403).json({ message: 'Only admin or currently assigned teacher can update teacher assignment' });
      }

      const teacherId = payload.teacher_id;
      if (teacherId === null || teacherId === '') {
        payload.teacher_id = null;
      } else {
        payload.teacher_id = Number(teacherId);
        const teacher = await User.findOne({ where: { id: payload.teacher_id, role: 'teacher' } });
        if (!teacher) {
          return res.status(400).json({ message: 'Invalid teacher selected' });
        }
      }
    }

    await Subject.update(payload, { where: { id: req.params.id } });
    const updated = await Subject.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({ message: 'Updated', subject: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Subject.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};