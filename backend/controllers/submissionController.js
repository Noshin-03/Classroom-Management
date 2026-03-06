const { Submission } = require('../models');

exports.submit = async (req, res) => {
  const { content, assignment_id } = req.body;
  try {
    const existing = await Submission.findOne({
      where: { assignment_id, student_id: req.userId }
    });
    if (existing) return res.status(400).json({ message: 'Already submitted' });

    const submission = await Submission.create({
      content, assignment_id, student_id: req.userId
    });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.grade = async (req, res) => {
  const { grade } = req.body;
  try {
    await Submission.update({ grade }, { where: { id: req.params.id } });
    const { Notification, Assignment } = require('../models');
    const submission = await Submission.findByPk(req.params.id);
    const assignment = await Assignment.findByPk(submission.assignment_id);
    await Notification.create({
      message: `Your submission for "${assignment.title}" was graded: ${grade}/${assignment.points}`,
      is_read: false,
      user_id: submission.student_id,
      type: 'grade',
      reference_id: submission.id
    });
    res.json({ message: 'Graded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
