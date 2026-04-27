/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║       Brain Box: Engaging E-Learning System             ║
 * ║       Database Seed Script                              ║
 * ║                                                          ║
 * ║  Populates MongoDB with demo users, courses,            ║
 * ║  modules, and quizzes.                                  ║
 * ║  Run once:  node seed.js                                ║
 * ╚══════════════════════════════════════════════════════════╝
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User   = require('./models/User');
const Course = require('./models/Course');
const Quiz   = require('./models/Quiz');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brainbox';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('🧠  Brain Box — Connected to MongoDB');

  // Wipe existing data
  await User.deleteMany({});
  await Course.deleteMany({});
  await Quiz.deleteMany({});
  console.log('🗑️   Cleared existing data');

  // ── Users ──────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const teacher = await User.create({
    name: 'Dr. Ananya Sharma',
    email: 'teacher@demo.com',
    password: passwordHash,
    role: 'teacher',
  });

  const students = await User.insertMany([
    { name: 'Ravi Kumar',   email: 'student@demo.com', password: passwordHash, role: 'student', points: 350 },
    { name: 'Priya Mehta',  email: 'priya@demo.com',   password: passwordHash, role: 'student', points: 280 },
    { name: 'Arjun Singh',  email: 'arjun@demo.com',   password: passwordHash, role: 'student', points: 420 },
    { name: 'Neha Gupta',   email: 'neha@demo.com',    password: passwordHash, role: 'student', points: 190 },
    { name: 'Vikram Joshi', email: 'vikram@demo.com',  password: passwordHash, role: 'student', points: 510 },
    { name: 'Sita Patel',   email: 'sita@demo.com',    password: passwordHash, role: 'student', points: 130 },
  ]);

  console.log(`👥  Created ${students.length + 1} Brain Box users`);

  // ── Courses ────────────────────────────────────────────────────────────────
  const coursesData = [
    {
      title: 'Complete Mathematics — Class 10',
      description: 'Master algebra, geometry, trigonometry, and statistics with step-by-step video lessons and practice quizzes. Aligned with CBSE and ICSE syllabi.',
      category: 'Mathematics',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
      tags: ['math', 'algebra', 'geometry', 'class10'],
      modules: [
        { title: 'Real Numbers & Euclid\'s Algorithm',  description: 'Explore the fundamental theorem of arithmetic and Euclid\'s division lemma.',           videoUrl: 'https://www.youtube.com/watch?v=NuY7szYSXSw', duration: '18:45', order: 1, isPreview: true },
        { title: 'Polynomials — Zeros & Coefficients',  description: 'Understand the relationship between zeros and coefficients of polynomials.',            videoUrl: 'https://www.youtube.com/watch?v=6Y4xNlEMLXA', duration: '22:10', order: 2 },
        { title: 'Pair of Linear Equations',            description: 'Solve simultaneous equations by substitution, elimination, and graphical methods.',     videoUrl: 'https://www.youtube.com/watch?v=5juto2ze2E0', duration: '25:30', order: 3 },
        { title: 'Quadratic Equations',                 description: 'Factorisation, completing the square, and the quadratic formula.',                      videoUrl: 'https://www.youtube.com/watch?v=i7idZfS8t8w', duration: '20:15', order: 4 },
        { title: 'Arithmetic Progressions (AP)',         description: 'nth term, sum of n terms, and real-life applications.',                                 videoUrl: 'https://www.youtube.com/watch?v=JiI1sUpKhBI', duration: '19:00', order: 5 },
      ],
    },
    {
      title: 'Physics Fundamentals — Class 11',
      description: 'From kinematics to thermodynamics — build a rock-solid conceptual foundation in Physics with animated explanations and problem-solving sessions.',
      category: 'Physics',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80',
      tags: ['physics', 'kinematics', 'class11', 'mechanics'],
      modules: [
        { title: 'Units & Measurements',      description: 'SI units, significant figures, and dimensional analysis.',                            videoUrl: 'https://www.youtube.com/watch?v=C5QdKuFcJLU', duration: '16:20', order: 1, isPreview: true },
        { title: 'Motion in a Straight Line', description: 'Distance, displacement, velocity, acceleration — v-t and s-t graphs.',               videoUrl: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE', duration: '24:00', order: 2 },
        { title: 'Laws of Motion',            description: 'Newton\'s three laws with free-body diagram problems.',                               videoUrl: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds', duration: '28:30', order: 3 },
        { title: 'Work, Energy & Power',      description: 'Conservative forces, potential energy, and the work-energy theorem.',                 videoUrl: 'https://www.youtube.com/watch?v=2WS1sG9fhOk', duration: '21:45', order: 4 },
      ],
    },
    {
      title: 'Python Programming — Zero to Hero',
      description: 'Learn Python from scratch with real projects. Covers data types, OOP, file handling, APIs, and data science basics. Perfect for beginners.',
      category: 'Programming',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
      tags: ['python', 'programming', 'beginner', 'coding'],
      modules: [
        { title: 'Introduction to Python',        description: 'Install Python, run your first script, and understand the interpreter.',          videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: '12:00', order: 1, isPreview: true },
        { title: 'Variables, Data Types & Input', description: 'Strings, ints, floats, booleans, and type conversion.',                          videoUrl: 'https://www.youtube.com/watch?v=Z1Yd7upQsXY', duration: '18:30', order: 2 },
        { title: 'Control Flow — If/Else & Loops',description: 'Conditional logic, for loops, while loops, and list comprehensions.',            videoUrl: 'https://www.youtube.com/watch?v=PqFKRqpHrjw', duration: '22:15', order: 3 },
        { title: 'Functions & Modules',           description: 'Define reusable functions, handle arguments, and import modules.',                videoUrl: 'https://www.youtube.com/watch?v=9Os0o3wzS_I', duration: '20:00', order: 4 },
        { title: 'Lists, Tuples & Dictionaries',  description: 'Core Python data structures with slicing, methods, and iteration.',              videoUrl: 'https://www.youtube.com/watch?v=W8KRzm-HUcc', duration: '25:00', order: 5 },
        { title: 'Object-Oriented Programming',   description: 'Classes, objects, inheritance, and polymorphism in Python.',                     videoUrl: 'https://www.youtube.com/watch?v=JeznW_7DlB0', duration: '30:00', order: 6 },
      ],
    },
    {
      title: 'Organic Chemistry — Class 12',
      description: 'Clear your organic chemistry doubts with reaction mechanisms, named reactions, and IUPAC nomenclature explained visually.',
      category: 'Chemistry',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
      tags: ['chemistry', 'organic', 'class12', 'reactions'],
      modules: [
        { title: 'IUPAC Nomenclature',                    description: 'Systematic naming of hydrocarbons and functional groups.',                videoUrl: 'https://www.youtube.com/watch?v=aS9KfS0i_cA', duration: '20:00', order: 1, isPreview: true },
        { title: 'Reaction Mechanisms Overview',          description: 'Homolytic vs heterolytic cleavage, nucleophiles, and electrophiles.',     videoUrl: 'https://www.youtube.com/watch?v=ER-nN6yHzHU', duration: '26:30', order: 2 },
        { title: 'Haloalkanes & Haloarenes',              description: 'SN1 vs SN2, elimination reactions, and Grignard reagent.',               videoUrl: 'https://www.youtube.com/watch?v=KwqxFmj7Gks', duration: '28:00', order: 3 },
        { title: 'Aldehydes, Ketones & Carboxylic Acids', description: 'Nucleophilic addition, aldol condensation, and esterification.',         videoUrl: 'https://www.youtube.com/watch?v=8Uu7LiERU9s', duration: '32:00', order: 4 },
      ],
    },
    {
      title: 'Biology — Cell Biology & Genetics',
      description: 'Deep-dive into the building blocks of life — cell structure, mitosis, meiosis, Mendelian genetics, and DNA replication.',
      category: 'Biology',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600&q=80',
      tags: ['biology', 'genetics', 'cell', 'class12'],
      modules: [
        { title: 'Cell: The Unit of Life',        description: 'Prokaryotic vs eukaryotic cells, organelles and their functions.',              videoUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8', duration: '17:30', order: 1, isPreview: true },
        { title: 'Cell Cycle & Cell Division',    description: 'Interphase, mitosis, meiosis — stages and significance.',                       videoUrl: 'https://www.youtube.com/watch?v=f-ldPgEfAHI', duration: '23:00', order: 2 },
        { title: 'Molecular Basis of Inheritance',description: 'DNA structure, replication, transcription, and translation.',                   videoUrl: 'https://www.youtube.com/watch?v=8kK2zwjRV0M', duration: '27:15', order: 3 },
        { title: 'Principles of Inheritance',     description: 'Mendel\'s laws, monohybrid and dihybrid crosses, codominance.',                videoUrl: 'https://www.youtube.com/watch?v=CBezq1fFUEA', duration: '22:45', order: 4 },
      ],
    },
    {
      title: 'English Literature — Prose & Poetry',
      description: 'Analyse classic and contemporary literature with guided reading, themes, literary devices, and essay writing techniques for board exams.',
      category: 'English',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
      tags: ['english', 'literature', 'prose', 'poetry', 'essays'],
      modules: [
        { title: 'Reading Comprehension Strategies',      description: 'Skimming, scanning, inference, and author\'s purpose.',                 videoUrl: 'https://www.youtube.com/watch?v=K0u3zToBl-U', duration: '14:00', order: 1, isPreview: true },
        { title: 'Literary Devices & Figures of Speech',  description: 'Metaphor, simile, personification, irony, and more with examples.',    videoUrl: 'https://www.youtube.com/watch?v=VZTNKiPJDEU', duration: '19:30', order: 2 },
        { title: 'Poetry Analysis — Form & Tone',         description: 'How to read a poem: meter, rhyme scheme, imagery, and themes.',        videoUrl: 'https://www.youtube.com/watch?v=4jS85XGU4PA', duration: '16:45', order: 3 },
        { title: 'Essay Writing — Structure & Style',     description: 'Introduction, body paragraphs, conclusion, and cohesive devices.',     videoUrl: 'https://www.youtube.com/watch?v=aOzgQJkSzuQ', duration: '21:00', order: 4 },
      ],
    },
  ];

  // Insert courses
  const createdCourses = [];
  for (const cd of coursesData) {
    const { modules, ...rest } = cd;
    const course = await Course.create({
      ...rest,
      teacher: teacher._id,
      isPublished: true,
      enrolledStudents: students.map(s => s._id),
    });
    // Push modules so subdoc _ids are generated by Mongoose
    modules.forEach(m => course.modules.push(m));
    await course.save();
    createdCourses.push(course);
  }
  console.log(`📚  Created ${createdCourses.length} Brain Box courses`);

  // Enroll all students in all courses
  const courseIds = createdCourses.map(c => c._id);
  await User.updateMany({ role: 'student' }, { $set: { enrolledCourses: courseIds } });
  console.log(`🎓  Enrolled all students in every course`);

  // ── Quizzes ────────────────────────────────────────────────────────────────
  const quizPayloads = [
    // Mathematics — module 0 (Real Numbers)
    {
      courseIdx: 0, moduleIdx: 0,
      title: 'Brain Box Quiz: Real Numbers',
      questions: [
        { question: 'What is the HCF of 12 and 18?',                              options: ['2', '3', '6', '9'],                                                       correctAnswer: 2, explanation: 'HCF(12,18) = 6 by prime factorisation.'                                      },
        { question: 'Which of the following is an irrational number?',             options: ['0.75', '√9', '√2', '1/3'],                                                correctAnswer: 2, explanation: '√2 cannot be expressed as p/q.'                                           },
        { question: 'Euclid\'s division lemma states a = ?',                       options: ['bq', 'bq + r', 'b + qr', 'bq − r'],                                       correctAnswer: 1, explanation: 'a = bq + r, where 0 ≤ r < b.'                                            },
        { question: 'How many prime factors does 360 have?',                       options: ['2', '3', '4', '5'],                                                       correctAnswer: 1, explanation: '360 = 2³ × 3² × 5 — three distinct primes.'                              },
        { question: 'The product of any three consecutive integers is divisible by:', options: ['2', '3', '6', '12'],                                                   correctAnswer: 2, explanation: 'Always divisible by 3! = 6.'                                              },
      ],
    },
    // Physics — module 0 (Units & Measurements)
    {
      courseIdx: 1, moduleIdx: 0,
      title: 'Brain Box Quiz: Units & Measurements',
      questions: [
        { question: 'The SI unit of electric current is:',                                     options: ['Volt', 'Ohm', 'Ampere', 'Watt'],                              correctAnswer: 2, explanation: 'Ampere (A) is the base SI unit for current.'                             },
        { question: 'How many significant figures are in 0.00305?',                            options: ['2', '3', '5', '6'],                                          correctAnswer: 1, explanation: 'Only non-zero digits and sandwiched zeros count — 3, 0, 5 = 3 sig. figs.' },
        { question: 'Dimensional formula of velocity is:',                                     options: ['[LT]', '[LT⁻¹]', '[L²T⁻¹]', '[MLT⁻¹]'],                   correctAnswer: 1, explanation: 'Velocity = displacement / time = [L][T⁻¹].'                             },
        { question: 'Which instrument measures small lengths of the order of 0.01 mm?',        options: ['Metre rule', 'Vernier caliper', 'Screw gauge', 'Spherometer'], correctAnswer: 2, explanation: 'A screw gauge (micrometer) has a least count of 0.01 mm.'               },
        { question: 'Parsec is a unit of:',                                                    options: ['Time', 'Mass', 'Distance', 'Energy'],                        correctAnswer: 2, explanation: '1 parsec ≈ 3.086 × 10¹⁶ m — used in astronomy.'                         },
      ],
    },
    // Python — module 0 (Introduction)
    {
      courseIdx: 2, moduleIdx: 0,
      title: 'Brain Box Quiz: Python Basics',
      questions: [
        { question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'fun', 'define'],                                             correctAnswer: 1, explanation: '"def" is the keyword for defining functions in Python.'                  },
        { question: 'What does print(type(3.14)) output?',                   options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"],       correctAnswer: 1, explanation: '3.14 is a floating-point number.'                                        },
        { question: 'Which of these is a valid variable name?',              options: ['2name', 'my-var', '_count', 'class'],                                          correctAnswer: 2, explanation: 'Variable names can start with an underscore.'                             },
        { question: 'What is the output of 10 // 3?',                        options: ['3.33', '3', '1', '4'],                                                        correctAnswer: 1, explanation: '// is integer (floor) division.'                                          },
        { question: 'How do you start a comment in Python?',                 options: ['//', '/*', '#', '--'],                                                        correctAnswer: 2, explanation: 'Python uses # for single-line comments.'                                   },
      ],
    },
    // Chemistry — module 0 (IUPAC Nomenclature)
    {
      courseIdx: 3, moduleIdx: 0,
      title: 'Brain Box Quiz: IUPAC Nomenclature',
      questions: [
        { question: 'What is the IUPAC name of CH₃-CH₂-OH?',              options: ['Methanol', 'Ethanol', 'Propanol', 'Butanol'],          correctAnswer: 1, explanation: '2-carbon chain with -OH group = Ethanol.'                    },
        { question: 'The suffix for a ketone functional group in IUPAC is:', options: ['-ol', '-al', '-one', '-oic acid'],                   correctAnswer: 2, explanation: 'Ketones end in -one (e.g. propan-2-one).'                    },
        { question: 'How many carbon atoms does pentane have?',             options: ['3', '4', '5', '6'],                                  correctAnswer: 2, explanation: 'Pent- = 5 carbons.'                                          },
        { question: 'The IUPAC name for CH₃COOH is:',                      options: ['Ethanoic acid', 'Methanoic acid', 'Propanoic acid', 'Butanoic acid'], correctAnswer: 0, explanation: 'CH₃COOH has 2 carbons — ethanoic acid (acetic acid).' },
        { question: 'Which prefix represents 4 carbons?',                   options: ['Meth-', 'Eth-', 'Prop-', 'But-'],                    correctAnswer: 3, explanation: 'But- represents 4 carbon atoms.'                            },
      ],
    },
    // Biology — module 0 (Cell)
    {
      courseIdx: 4, moduleIdx: 0,
      title: 'Brain Box Quiz: Cell Biology',
      questions: [
        { question: 'Which organelle is called the "powerhouse of the cell"?', options: ['Ribosome', 'Golgi body', 'Mitochondria', 'Nucleus'],           correctAnswer: 2, explanation: 'Mitochondria produce ATP via cellular respiration.'                              },
        { question: 'Cell wall in plant cells is made of:',                   options: ['Chitin', 'Cellulose', 'Peptidoglycan', 'Glycogen'],             correctAnswer: 1, explanation: 'Plant cell walls are primarily composed of cellulose.'                         },
        { question: 'Which of the following lacks a membrane-bound nucleus?', options: ['Amoeba', 'Yeast', 'Bacteria', 'Paramecium'],                    correctAnswer: 2, explanation: 'Bacteria are prokaryotes — no membrane-bound nucleus.'                         },
        { question: 'The fluid-mosaic model describes the structure of:',     options: ['Cell wall', 'Cell membrane', 'Cytoplasm', 'Nuclear envelope'],  correctAnswer: 1, explanation: 'Singer and Nicolson proposed the fluid-mosaic model for the plasma membrane.'  },
        { question: 'Which organelle synthesises proteins?',                  options: ['Lysosome', 'Vacuole', 'Ribosome', 'Centrosome'],                correctAnswer: 2, explanation: 'Ribosomes are the sites of protein synthesis.'                                  },
      ],
    },
    // English — module 0 (Reading & Literary Devices)
    {
      courseIdx: 5, moduleIdx: 0,
      title: 'Brain Box Quiz: Reading & Literary Devices',
      questions: [
        { question: '"The world is a stage" is an example of:',                      options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correctAnswer: 1, explanation: 'A direct comparison without "like" or "as" = metaphor.'                   },
        { question: 'Which literary device gives human traits to non-human things?', options: ['Irony', 'Alliteration', 'Personification', 'Oxymoron'], correctAnswer: 2, explanation: 'Personification attributes human qualities to objects or animals.'        },
        { question: '"She sells seashells by the seashore" is an example of:',       options: ['Assonance', 'Alliteration', 'Onomatopoeia', 'Rhyme'],   correctAnswer: 1, explanation: 'Repetition of the initial "s" consonant sound = alliteration.'           },
        { question: 'The central message or insight of a literary work is its:',     options: ['Plot', 'Setting', 'Theme', 'Conflict'],                 correctAnswer: 2, explanation: 'The theme is the underlying idea or message the author conveys.'          },
        { question: 'A narrative in first person uses which pronoun primarily?',     options: ['He/She', 'They', 'I/We', 'You'],                        correctAnswer: 2, explanation: 'First-person narratives use "I" or "we".'                                },
      ],
    },
  ];

  let quizCount = 0;
  for (const qp of quizPayloads) {
    const course = createdCourses[qp.courseIdx];
    const module = course.modules[qp.moduleIdx];
    await Quiz.create({
      title:         qp.title,
      course:        course._id,
      module:        module._id,
      questions:     qp.questions,
      passThreshold: 60,
      pointsReward:  50,
      timeLimit:     15,
    });
    quizCount++;
  }
  console.log(`📝  Created ${quizCount} Brain Box quizzes`);

  // ── Mark some modules complete for first student (richer demo) ────────────
  const firstStudent = students[0];
  const firstCourse  = createdCourses[0];
  firstStudent.completedModules = [
    firstCourse.modules[0]._id,
    firstCourse.modules[1]._id,
  ];
  firstStudent.quizResults = [{
    quiz:   (await Quiz.findOne({ course: firstCourse._id }))._id,
    score:  80,
    passed: true,
  }];
  await firstStudent.save();
  console.log(`⭐  Set demo progress for ${firstStudent.name}`);

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log('\n✅  Brain Box seed complete!');
  console.log('════════════════════════════════════════');
  console.log('  🧠  Brain Box: Engaging E-Learning System');
  console.log('════════════════════════════════════════');
  console.log('  Demo accounts:');
  console.log('  🎓 Student  →  student@demo.com  /  demo1234');
  console.log('  👨‍🏫 Teacher  →  teacher@demo.com  /  demo1234');
  console.log('════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });