const { User, Department, Subject, Class, Enrollment } = require('../models');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const teachers = await User.count({ where: { role: 'teacher' } });
    const students = await User.count({ where: { role: 'student' } });
    const subjects = await Subject.count();
    const departments = await Department.count();
    const classes = await Class.count();
    const enrollments = await Enrollment.count();

    const recentTeachers = await User.findAll({
      where: { role: 'teacher' },
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email']
    });

    const recentClasses = await Class.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Subject, attributes: ['name', 'code'] }]
    });

    res.json({
      stats: { totalUsers, teachers, students, subjects, departments, classes, enrollments },
      roleData: [
        { name: 'student', value: students },
        { name: 'teacher', value: teachers }
      ],
      recentTeachers,
      recentClasses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};