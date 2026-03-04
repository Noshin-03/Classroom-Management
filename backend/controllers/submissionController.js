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
    res.json({ message: 'Graded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
