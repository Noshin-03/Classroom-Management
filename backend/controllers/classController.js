const { Class, Subject, Department, Enrollment } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [{
        model: Subject,
        attributes: ['id', 'name', 'code'],
        include: [{ model: Department, attributes: ['id', 'name'] }]
      }],
      order: [['createdAt', 'DESC']]
    });

    const result = await Promise.all(classes.map(async c => {
      const studentCount = await Enrollment.count({ where: { class_id: c.id } });
      return { ...c.toJSON(), studentCount };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, subject_id } = req.body;
  try {
    const { User } = require('../models');
    const requester = await User.findByPk(req.userId);
    const subject = await Subject.findByPk(subject_id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const canCreate = requester?.role === 'admin' || subject.teacher_id === req.userId;
    if (!canCreate) {
      return res.status(403).json({ message: 'Only admin or assigned subject teacher can create classes' });
    }

    if (!subject.teacher_id) {
      return res.status(400).json({ message: 'Assign a teacher to this subject before creating classes' });
    }

    let join_code;
    let exists = true;
    while (exists) {
      join_code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await Class.findOne({ where: { join_code } });
    }
    const cls = await Class.create({
      name,
      subject_id,
      join_code,
      teacher_id: subject.teacher_id
    });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const cls = await Class.findByPk(req.params.id, {
      include: [{ 
        model: Subject, 
        include: [
          { model: Department },
          { model: require('../models').User, attributes: ['id', 'name', 'email'] }
        ] 
      }]
    });
    if (!cls) return res.status(404).json({ message: 'Not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Class.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinByCode = async (req, res) => {
  const { join_code } = req.body;
  try {
    const cls = await Class.findOne({ where: { join_code } });
    if (!cls) return res.status(404).json({ message: 'Invalid join code' });

    const existing = await Enrollment.findOne({ 
      where: { student_id: req.userId, class_id: cls.id } 
    });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    await Enrollment.create({ student_id: req.userId, class_id: cls.id });
    res.json({ message: 'Joined successfully', class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};