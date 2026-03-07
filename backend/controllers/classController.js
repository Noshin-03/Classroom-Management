const { Class, Subject, Department, Enrollment } = require('../models');

const MAX_CLASS_SIZE = 30;

exports.getAll = async (req, res) => {
  try {
    const { User } = require('../models');
    const requester = await User.findByPk(req.userId);
    
    // Build query conditions
    let whereClause = {};
    
    // Teachers only see their assigned classes
    if (requester?.role === 'teacher') {
      whereClause.teacher_id = req.userId;
    }
    // Students see all classes (but will only access enrolled ones)
    // Admins see all classes
    
    const classes = await Class.findAll({
      where: whereClause,
      include: [{
        model: Subject,
        attributes: ['id', 'name', 'code'],
        include: [{ model: Department, attributes: ['id', 'name'] }]
      }],
      order: [['createdAt', 'DESC']]
    });

    const result = await Promise.all(classes.map(async c => {
      const studentCount = await Enrollment.count({ where: { class_id: c.id } });
      const classData = c.toJSON();
      
      // Only hide join_code from students (teachers and admins can see it)
      if (requester?.role === 'student') {
        delete classData.join_code;
      }
      
      return { ...classData, studentCount };
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
    const { User } = require('../models');
    const requester = await User.findByPk(req.userId);
    
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
    
    // Check access permissions
    if (requester?.role === 'student') {
      // Students must enroll and then join with code before viewing details
      const enrollment = await Enrollment.findOne({
        where: { student_id: req.userId, class_id: cls.id }
      });
      if (!enrollment || !enrollment.joined_at) {
        return res.status(403).json({ message: 'You must enroll and join this class with code first' });
      }
    } else if (requester?.role === 'teacher' && cls.teacher_id !== req.userId) {
      return res.status(403).json({ message: 'You can only access your assigned classes' });
    }
    
    const classData = cls.toJSON();
    // Only hide join_code from students (teachers and admins can see it)
    if (requester?.role === 'student') {
      delete classData.join_code;
    }
    
    res.json(classData);
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
    const { User } = require('../models');
    const requester = await User.findByPk(req.userId);
    if (requester?.role !== 'student') {
      return res.status(403).json({ message: 'Only students can join a class' });
    }

    const cls = await Class.findOne({ 
      where: { join_code },
      include: [{ model: Subject }]
    });
    if (!cls) return res.status(404).json({ message: 'Invalid join code' });

    const enrollment = await Enrollment.findOne({ 
      where: { student_id: req.userId, class_id: cls.id } 
    });
    if (!enrollment) {
      return res.status(403).json({ message: 'You must enroll first before joining with code' });
    }
    if (enrollment.joined_at) {
      return res.status(400).json({ message: 'Already joined this class' });
    }
    
    // Check enrollment limit (30 students max)
    const enrollmentCount = await Enrollment.count({ where: { class_id: cls.id } });
    if (enrollmentCount >= MAX_CLASS_SIZE) {
      return res.status(400).json({ message: `Class is full (maximum ${MAX_CLASS_SIZE} students)` });
    }

    await enrollment.update({ joined_at: new Date() });
    
    // Remove join_code from response for students
    const classData = cls.toJSON();
    delete classData.join_code;
    
    res.json({ message: 'Joined successfully', class: classData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};