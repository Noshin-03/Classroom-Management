'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@classroom.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Md. Mahfujur Rahman',
        email: 'rahmanmahfujur2020@gmail.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Noshin Tabassum Dina',
        email: 'bsse1505@iit.du.ac.bd',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        name: 'Prof. Michael Brown',
        email: 'michael.brown@classroom.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        name: 'Alice Williams',
        email: 'alice.williams@classroom.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        name: 'Bob Davis',
        email: 'bob.davis@classroom.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 7,
        name: 'Carol Martinez',
        email: 'carol.martinez@classroom.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 8,
        name: 'David Wilson',
        email: 'david.wilson@classroom.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 9,
        name: 'Emma Taylor',
        email: 'emma.taylor@classroom.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 10,
        name: 'Frank Anderson',
        email: 'frank.anderson@classroom.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Departments', [
      {
        id: 1,
        code: 'CS',
        name: 'Computer Science',
        description: 'Department of Computer Science and Engineering',
        created_by: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        code: 'MATH',
        name: 'Mathematics',
        description: 'Department of Mathematics',
        created_by: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        code: 'PHY',
        name: 'Physics',
        description: 'Department of Physics',
        created_by: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        code: 'ENG',
        name: 'English',
        description: 'Department of English Literature',
        created_by: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Subjects', [
      {
        id: 1,
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts using Python',
        department_id: 1,
        teacher_id: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        code: 'CS201',
        name: 'Data Structures',
        description: 'Fundamental data structures and algorithms',
        department_id: 1,
        teacher_id: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        code: 'CS301',
        name: 'Database Systems',
        description: 'Relational database design and SQL',
        department_id: 1,
        teacher_id: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        code: 'MATH101',
        name: 'Calculus I',
        description: 'Differential and integral calculus',
        department_id: 2,
        teacher_id: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        code: 'MATH201',
        name: 'Linear Algebra',
        description: 'Vector spaces and matrix theory',
        department_id: 2,
        teacher_id: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        code: 'PHY101',
        name: 'Physics I',
        description: 'Mechanics and thermodynamics',
        department_id: 3,
        teacher_id: 3,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Classes', [
      {
        id: 1,
        name: 'CS101 - Section A',
        subject_id: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'CS101 - Section B',
        subject_id: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'CS201 - Section A',
        subject_id: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        name: 'CS301 - Section A',
        subject_id: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        name: 'MATH101 - Section A',
        subject_id: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        name: 'MATH201 - Section A',
        subject_id: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 7,
        name: 'PHY101 - Section A',
        subject_id: 6,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Enrollments', [
      { id: 1, student_id: 5, class_id: 1, createdAt: now, updatedAt: now },
      { id: 2, student_id: 5, class_id: 3, createdAt: now, updatedAt: now },
      { id: 3, student_id: 5, class_id: 5, createdAt: now, updatedAt: now },
      
      { id: 4, student_id: 6, class_id: 2, createdAt: now, updatedAt: now },
      { id: 5, student_id: 6, class_id: 4, createdAt: now, updatedAt: now },
      { id: 6, student_id: 6, class_id: 7, createdAt: now, updatedAt: now },
      
      { id: 7, student_id: 7, class_id: 1, createdAt: now, updatedAt: now },
      { id: 8, student_id: 7, class_id: 5, createdAt: now, updatedAt: now },
      { id: 9, student_id: 7, class_id: 6, createdAt: now, updatedAt: now },
      
      { id: 10, student_id: 8, class_id: 2, createdAt: now, updatedAt: now },
      { id: 11, student_id: 8, class_id: 3, createdAt: now, updatedAt: now },
      { id: 12, student_id: 8, class_id: 7, createdAt: now, updatedAt: now },
      
      { id: 13, student_id: 9, class_id: 1, createdAt: now, updatedAt: now },
      { id: 14, student_id: 9, class_id: 4, createdAt: now, updatedAt: now },
      { id: 15, student_id: 9, class_id: 5, createdAt: now, updatedAt: now },
      
      { id: 16, student_id: 10, class_id: 2, createdAt: now, updatedAt: now },
      { id: 17, student_id: 10, class_id: 6, createdAt: now, updatedAt: now },
      { id: 18, student_id: 10, class_id: 7, createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Enrollments', null, {});
    await queryInterface.bulkDelete('Classes', null, {});
    await queryInterface.bulkDelete('Subjects', null, {});
    await queryInterface.bulkDelete('Departments', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
