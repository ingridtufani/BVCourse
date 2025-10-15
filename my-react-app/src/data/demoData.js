export const programData = [
  {
    code: "SD-DIP",
    name: "Software Development - Diploma",
    type: "Diploma (2 years)",
    department: "SD",
    term: "Winter",
    startDate: "2024-09-05",
    endDate: "2026-06-15",
    fees: {
      domestic: "$9,254",
      international: "$27,735"
    },
    description: "A comprehensive two-year software development diploma program designed to equip students with practical and theoretical skills for modern software careers."
  },
  {
    code: "SD-PDIP",
    name: "Software Development - Post-Diploma",
    type: "Post-Diploma (1 year)",
    department: "SD",
    term: "Winter",
    startDate: "2024-09-05",
    endDate: "2025-06-15",
    fees: {
      domestic: "$7,895",
      international: "$23,675"
    },
    description: "Jumpstart your tech career with our one-year post-diploma program in software development, focusing on advanced concepts and industry readiness."
  }
];

export const courseData = [
  {
    code: "SD101",
    name: "Introduction to Programming",
    term: "Winter",
    startDate: "2024-09-10",
    endDate: "2024-12-10",
    description: "Learn the basics of programming logic, syntax, and problem-solving using Python."
  },
  {
    code: "SD102",
    name: "Web Development Essentials",
    term: "Winter",
    startDate: "2024-09-12",
    endDate: "2024-12-12",
    description: "Build responsive web applications using HTML, CSS, JavaScript, and modern frameworks."
  },
  {
    code: "SD201",
    name: "Database Design & SQL",
    term: "Spring",
    startDate: "2025-03-15",
    endDate: "2025-06-15",
    description: "Understand relational database concepts and master SQL for data manipulation."
  },
  {
    code: "SD202",
    name: "Software Testing & QA",
    term: "Spring",
    startDate: "2025-03-18",
    endDate: "2025-06-18",
    description: "Learn testing methodologies and best practices in software quality assurance."
  }
];


export const MOCK_USERS = [
    { username: 'aluno123', password: '123', role: 'student', id: 1 },
    { username: 'admin456', password: '456', role: 'admin', id: 2 },
];

export const initialCourses = [
    { id: 1, title: 'Database Design & SQL' },
    { id: 2, title: 'Web Development Essentials' },
    { id: 3, title: 'Introduction Programming' },
    { id: 4, title: 'Software Testing Q&A' },
    { id: 5, title: 'Advanced JavaScript' },
];

export const initialStudents = [
    { id: '1234', name: 'Bruno', program: 'SD-DIP', email: 'bruno@gmail.com', status: 'Active' },
];

export const initialMessages = [
    { id: 1, sender: 'Bruno', program: 'SD-DIP', subject: 'Error', date: '2025-10-10' },
];