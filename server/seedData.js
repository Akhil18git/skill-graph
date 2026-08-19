// Seed dataset for SkillGraph
// Contains Nodes and Typed Relationships for Graph Traversal
// Mix of fresher and experienced candidates, simplified skills & technologies

const nodes = {
  people: [
    // Freshers / Entry-Level
    { id: 'p1', name: 'Akhil goud', title: 'Computer Science Graduate', bio: 'Recent CS graduate passionate about web development and graph databases. Built several personal projects using React and Node.js.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
    { id: 'p2', name: 'Kavya Sree', title: 'Frontend Developer (Fresher)', bio: 'Self-taught frontend developer with strong skills in React and CSS. Loves building visually appealing UIs.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' },
    { id: 'p3', name: 'Rahul Verma', title: 'Data Science Student', bio: 'Final year B.Tech student specializing in data science. Completed internship using Python and basic ML models.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' },
    { id: 'p4', name: 'Sneha Pillai', title: 'Backend Developer Trainee', bio: 'Completed a 6-month bootcamp on Node.js and REST APIs. Looking for first full-time opportunity in backend engineering.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250' },

    // Mid-Level
    { id: 'p5', name: 'Arjun Menon', title: 'Fullstack Developer (2 yrs)', bio: '2 years of experience building fullstack web apps with React frontend and Express/Node backend. Comfortable with REST APIs and SQL.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
    { id: 'p6', name: 'Kavitha Reddy', title: 'Software Engineer - Backend', bio: '3 years in backend development. Built REST APIs and worked with PostgreSQL. Recently exploring graph databases.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250' },

    // Experienced
    { id: 'p7', name: 'Vikram Singh', title: 'Senior Software Engineer', bio: '6 years of experience in distributed backend systems, cloud infrastructure, and graph data modeling.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
    { id: 'p8', name: 'Anjali Krishnan', title: 'ML & Data Engineer (5 yrs)', bio: 'Data engineer with strong background in Python ML pipelines, ETL workflows, and machine learning model deployment.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' }
  ],

  skills: [
    { id: 's1', name: 'JavaScript & React', category: 'Frontend', demandLevel: 'VERY HIGH' },
    { id: 's2', name: 'Node.js & REST APIs', category: 'Backend', demandLevel: 'VERY HIGH' },
    { id: 's3', name: 'Python & Data Analysis', category: 'Data Science', demandLevel: 'HIGH' },
    { id: 's4', name: 'Graph Databases & Cypher', category: 'Database Systems', demandLevel: 'HIGH' },
    { id: 's5', name: 'SQL & Databases', category: 'Database Systems', demandLevel: 'VERY HIGH' },
    { id: 's6', name: 'Machine Learning Basics', category: 'AI & ML', demandLevel: 'HIGH' }
  ],

  technologies: [
    { id: 't1', name: 'React & Vite', category: 'UI Framework', version: '18.x' },
    { id: 't2', name: 'Node.js & Express', category: 'Backend Runtime', version: '20.x' },
    { id: 't3', name: 'Python & scikit-learn', category: 'ML Framework', version: '3.11' },
    { id: 't4', name: 'CognoDB / Neo4j', category: 'Graph Database', version: '5.x' }
  ],

  projects: [
    { id: 'pr1', name: 'Personal Portfolio Website', description: 'A responsive personal portfolio built with React and CSS animations.', domain: 'Frontend Development', impact: 'Showcased projects to potential recruiters.' },
    { id: 'pr2', name: 'To-Do App with REST API', description: 'Fullstack to-do list with a Node.js/Express backend and React frontend.', domain: 'Fullstack Development', impact: 'Implemented full CRUD operations and user auth.' },
    { id: 'pr3', name: 'Student Grade Prediction Model', description: 'ML model built with Python and scikit-learn to predict student exam outcomes.', domain: 'Data Science', impact: 'Achieved 83% accuracy on test dataset.' },
    { id: 'pr4', name: 'E-commerce Backend API', description: 'RESTful API for an online store with product listings, cart, and order management.', domain: 'Backend Development', impact: 'Handled 500+ concurrent requests in load testing.' },
    { id: 'pr5', name: 'Skill Graph Explorer', description: 'Graph-based career mapping tool using CognoDB to model people, skills, and roles.', domain: 'Graph Data Engineering', impact: 'Demonstrated multi-hop traversals linking candidates to jobs.' },
    { id: 'pr6', name: 'Sales Dashboard', description: 'Interactive data dashboard with charts and filters built using React and REST APIs.', domain: 'Frontend Development', impact: 'Helped sales team track monthly KPIs in real-time.' }
  ],

  jobRoles: [
    // Fresher / Entry Level
    { id: 'j1', title: 'Junior Frontend Developer', domain: 'Frontend Development', tier: 'Junior', experienceLevel: '0-1 years', salaryRange: '₹4L - ₹7L' },
    { id: 'j2', title: 'Junior Backend Developer', domain: 'Backend Development', tier: 'Junior', experienceLevel: '0-1 years', salaryRange: '₹4L - ₹7L' },
    { id: 'j3', title: 'Data Analyst (Entry Level)', domain: 'Data Science', tier: 'Junior', experienceLevel: '0-1 years', salaryRange: '₹4L - ₹6L' },

    // Mid Level
    { id: 'j4', title: 'Fullstack Developer', domain: 'Fullstack Development', tier: 'Mid', experienceLevel: '2-4 years', salaryRange: '₹8L - ₹16L' },
    { id: 'j5', title: 'Backend Engineer', domain: 'Backend Development', tier: 'Mid', experienceLevel: '2-4 years', salaryRange: '₹9L - ₹18L' },
    { id: 'j6', title: 'Data Scientist', domain: 'Data Science', tier: 'Mid', experienceLevel: '2-4 years', salaryRange: '₹10L - ₹20L' },

    // Senior Level
    { id: 'j7', title: 'Senior Software Engineer', domain: 'Backend Development', tier: 'Senior', experienceLevel: '5+ years', salaryRange: '₹22L - ₹40L' },
    { id: 'j8', title: 'Graph Data Engineer', domain: 'Graph Data Engineering', tier: 'Senior', experienceLevel: '3+ years', salaryRange: '₹18L - ₹35L' }
  ],

  // No companies — roles represent open/fresher market and freelance opportunities
  companies: [],

  domains: [
    { id: 'd1', name: 'Frontend Development', description: 'UI design, React, CSS, component architecture' },
    { id: 'd2', name: 'Backend Development', description: 'REST APIs, Node.js, server-side logic, databases' },
    { id: 'd3', name: 'Fullstack Development', description: 'End-to-end web application development' },
    { id: 'd4', name: 'Data Science', description: 'Python, ML models, data analysis, statistics' },
    { id: 'd5', name: 'Graph Data Engineering', description: 'Graph databases, openCypher, knowledge graph modeling' }
  ]
};

const relationships = [
  // ─── Person → Skill (HAS_SKILL) ───────────────────────────────────────────

  // p1 - Akhil (Fresher, CS Graduate)
  { from: 'p1', to: 's1', type: 'HAS_SKILL', props: { proficiency: 3, yearsExperience: 1 } },
  { from: 'p1', to: 's2', type: 'HAS_SKILL', props: { proficiency: 3, yearsExperience: 1 } },
  { from: 'p1', to: 's4', type: 'HAS_SKILL', props: { proficiency: 2, yearsExperience: 1 } },

  // p2 - Priya (Fresher, Frontend)
  { from: 'p2', to: 's1', type: 'HAS_SKILL', props: { proficiency: 4, yearsExperience: 1 } },

  // p3 - Rahul (Fresher, Data Science Student)
  { from: 'p3', to: 's3', type: 'HAS_SKILL', props: { proficiency: 3, yearsExperience: 1 } },
  { from: 'p3', to: 's6', type: 'HAS_SKILL', props: { proficiency: 3, yearsExperience: 1 } },
  { from: 'p3', to: 's5', type: 'HAS_SKILL', props: { proficiency: 2, yearsExperience: 1 } },

  // p4 - Sneha (Fresher, Backend Trainee)
  { from: 'p4', to: 's2', type: 'HAS_SKILL', props: { proficiency: 3, yearsExperience: 1 } },
  { from: 'p4', to: 's5', type: 'HAS_SKILL', props: { proficiency: 2, yearsExperience: 1 } },

  // p5 - Arjun (Mid, Fullstack 2yrs)
  { from: 'p5', to: 's1', type: 'HAS_SKILL', props: { proficiency: 4, yearsExperience: 2 } },
  { from: 'p5', to: 's2', type: 'HAS_SKILL', props: { proficiency: 4, yearsExperience: 2 } },
  { from: 'p5', to: 's5', type: 'HAS_SKILL', props: { proficiency: 3, yearsExperience: 2 } },

  // p6 - Kavitha (Mid, Backend 3yrs)
  { from: 'p6', to: 's2', type: 'HAS_SKILL', props: { proficiency: 4, yearsExperience: 3 } },
  { from: 'p6', to: 's5', type: 'HAS_SKILL', props: { proficiency: 4, yearsExperience: 3 } },
  { from: 'p6', to: 's4', type: 'HAS_SKILL', props: { proficiency: 2, yearsExperience: 1 } },

  // p7 - Vikram (Senior, 6yrs)
  { from: 'p7', to: 's2', type: 'HAS_SKILL', props: { proficiency: 5, yearsExperience: 6 } },
  { from: 'p7', to: 's5', type: 'HAS_SKILL', props: { proficiency: 5, yearsExperience: 5 } },
  { from: 'p7', to: 's4', type: 'HAS_SKILL', props: { proficiency: 4, yearsExperience: 3 } },
  { from: 'p7', to: 's1', type: 'HAS_SKILL', props: { proficiency: 3, yearsExperience: 2 } },

  // p8 - Anjali (ML Engineer 5yrs)
  { from: 'p8', to: 's3', type: 'HAS_SKILL', props: { proficiency: 5, yearsExperience: 5 } },
  { from: 'p8', to: 's6', type: 'HAS_SKILL', props: { proficiency: 5, yearsExperience: 4 } },
  { from: 'p8', to: 's5', type: 'HAS_SKILL', props: { proficiency: 4, yearsExperience: 3 } },

  // ─── Person → Project (CONTRIBUTED_TO) ───────────────────────────────────

  { from: 'p1', to: 'pr1', type: 'CONTRIBUTED_TO', props: { role: 'Developer', durationMonths: 2 } },
  { from: 'p1', to: 'pr2', type: 'CONTRIBUTED_TO', props: { role: 'Fullstack Developer', durationMonths: 3 } },
  { from: 'p1', to: 'pr5', type: 'CONTRIBUTED_TO', props: { role: 'Graph Developer', durationMonths: 2 } },

  { from: 'p2', to: 'pr1', type: 'CONTRIBUTED_TO', props: { role: 'UI Developer', durationMonths: 3 } },
  { from: 'p2', to: 'pr6', type: 'CONTRIBUTED_TO', props: { role: 'Frontend Developer', durationMonths: 2 } },

  { from: 'p3', to: 'pr3', type: 'CONTRIBUTED_TO', props: { role: 'Data Analyst', durationMonths: 4 } },

  { from: 'p4', to: 'pr4', type: 'CONTRIBUTED_TO', props: { role: 'Backend Developer', durationMonths: 3 } },
  { from: 'p4', to: 'pr2', type: 'CONTRIBUTED_TO', props: { role: 'API Developer', durationMonths: 2 } },

  { from: 'p5', to: 'pr2', type: 'CONTRIBUTED_TO', props: { role: 'Fullstack Lead', durationMonths: 5 } },
  { from: 'p5', to: 'pr6', type: 'CONTRIBUTED_TO', props: { role: 'Frontend Developer', durationMonths: 4 } },

  { from: 'p6', to: 'pr4', type: 'CONTRIBUTED_TO', props: { role: 'Backend Engineer', durationMonths: 6 } },

  { from: 'p7', to: 'pr4', type: 'CONTRIBUTED_TO', props: { role: 'Lead Backend Engineer', durationMonths: 8 } },
  { from: 'p7', to: 'pr5', type: 'CONTRIBUTED_TO', props: { role: 'Graph Architect', durationMonths: 5 } },

  { from: 'p8', to: 'pr3', type: 'CONTRIBUTED_TO', props: { role: 'ML Engineer', durationMonths: 6 } },

  // ─── Project → Technology (USES_TECH) ────────────────────────────────────

  { from: 'pr1', to: 't1', type: 'USES_TECH', props: { environment: 'Production' } },
  { from: 'pr2', to: 't1', type: 'USES_TECH', props: { environment: 'Production' } },
  { from: 'pr2', to: 't2', type: 'USES_TECH', props: { environment: 'Production' } },
  { from: 'pr3', to: 't3', type: 'USES_TECH', props: { environment: 'Development' } },
  { from: 'pr4', to: 't2', type: 'USES_TECH', props: { environment: 'Production' } },
  { from: 'pr5', to: 't4', type: 'USES_TECH', props: { environment: 'Development' } },
  { from: 'pr5', to: 't2', type: 'USES_TECH', props: { environment: 'Production' } },
  { from: 'pr6', to: 't1', type: 'USES_TECH', props: { environment: 'Production' } },

  // ─── Project → Skill (DEMONSTRATES_SKILL) ────────────────────────────────

  { from: 'pr1', to: 's1', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.95 } },
  { from: 'pr2', to: 's1', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.85 } },
  { from: 'pr2', to: 's2', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.90 } },
  { from: 'pr3', to: 's3', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.90 } },
  { from: 'pr3', to: 's6', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.85 } },
  { from: 'pr4', to: 's2', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.92 } },
  { from: 'pr4', to: 's5', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.80 } },
  { from: 'pr5', to: 's4', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.95 } },
  { from: 'pr5', to: 's2', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.80 } },
  { from: 'pr6', to: 's1', type: 'DEMONSTRATES_SKILL', props: { relevanceScore: 0.88 } },

  // ─── Project → Domain (BELONGS_TO_DOMAIN) ────────────────────────────────

  { from: 'pr1', to: 'd1', type: 'BELONGS_TO_DOMAIN' },
  { from: 'pr2', to: 'd3', type: 'BELONGS_TO_DOMAIN' },
  { from: 'pr3', to: 'd4', type: 'BELONGS_TO_DOMAIN' },
  { from: 'pr4', to: 'd2', type: 'BELONGS_TO_DOMAIN' },
  { from: 'pr5', to: 'd5', type: 'BELONGS_TO_DOMAIN' },
  { from: 'pr6', to: 'd1', type: 'BELONGS_TO_DOMAIN' },

  // ─── Technology → Skill (ENABLES_SKILL) ──────────────────────────────────

  { from: 't1', to: 's1', type: 'ENABLES_SKILL' },
  { from: 't2', to: 's2', type: 'ENABLES_SKILL' },
  { from: 't3', to: 's3', type: 'ENABLES_SKILL' },
  { from: 't3', to: 's6', type: 'ENABLES_SKILL' },
  { from: 't4', to: 's4', type: 'ENABLES_SKILL' },

  // ─── JobRole → Skill (REQUIRES_SKILL) ────────────────────────────────────

  // j1 - Junior Frontend Developer
  { from: 'j1', to: 's1', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 3 } },

  // j2 - Junior Backend Developer
  { from: 'j2', to: 's2', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 3 } },
  { from: 'j2', to: 's5', type: 'REQUIRES_SKILL', props: { importance: 'HIGH', requiredProficiency: 2 } },

  // j3 - Data Analyst (Entry)
  { from: 'j3', to: 's3', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 3 } },
  { from: 'j3', to: 's5', type: 'REQUIRES_SKILL', props: { importance: 'HIGH', requiredProficiency: 2 } },

  // j4 - Fullstack Developer (Mid)
  { from: 'j4', to: 's1', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j4', to: 's2', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j4', to: 's5', type: 'REQUIRES_SKILL', props: { importance: 'HIGH', requiredProficiency: 3 } },

  // j5 - Backend Engineer (Mid)
  { from: 'j5', to: 's2', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j5', to: 's5', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },

  // j6 - Data Scientist (Mid)
  { from: 'j6', to: 's3', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j6', to: 's6', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j6', to: 's5', type: 'REQUIRES_SKILL', props: { importance: 'HIGH', requiredProficiency: 3 } },

  // j7 - Senior Software Engineer
  { from: 'j7', to: 's2', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 5 } },
  { from: 'j7', to: 's5', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j7', to: 's1', type: 'REQUIRES_SKILL', props: { importance: 'HIGH', requiredProficiency: 3 } },

  // j8 - Graph Data Engineer (Senior)
  { from: 'j8', to: 's4', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j8', to: 's2', type: 'REQUIRES_SKILL', props: { importance: 'CRITICAL', requiredProficiency: 4 } },
  { from: 'j8', to: 's5', type: 'REQUIRES_SKILL', props: { importance: 'HIGH', requiredProficiency: 3 } },

  // ─── JobRole → Domain (IN_DOMAIN) ────────────────────────────────────────

  { from: 'j1', to: 'd1', type: 'IN_DOMAIN' },
  { from: 'j2', to: 'd2', type: 'IN_DOMAIN' },
  { from: 'j3', to: 'd4', type: 'IN_DOMAIN' },
  { from: 'j4', to: 'd3', type: 'IN_DOMAIN' },
  { from: 'j5', to: 'd2', type: 'IN_DOMAIN' },
  { from: 'j6', to: 'd4', type: 'IN_DOMAIN' },
  { from: 'j7', to: 'd2', type: 'IN_DOMAIN' },
  { from: 'j8', to: 'd5', type: 'IN_DOMAIN' },

  // ─── Person → JobRole (TARGETS_ROLE) ─────────────────────────────────────

  { from: 'p1', to: 'j1', type: 'TARGETS_ROLE' },
  { from: 'p1', to: 'j2', type: 'TARGETS_ROLE' },
  { from: 'p2', to: 'j1', type: 'TARGETS_ROLE' },
  { from: 'p3', to: 'j3', type: 'TARGETS_ROLE' },
  { from: 'p4', to: 'j2', type: 'TARGETS_ROLE' },
  { from: 'p5', to: 'j4', type: 'TARGETS_ROLE' },
  { from: 'p6', to: 'j5', type: 'TARGETS_ROLE' },
  { from: 'p7', to: 'j7', type: 'TARGETS_ROLE' },
  { from: 'p7', to: 'j8', type: 'TARGETS_ROLE' },
  { from: 'p8', to: 'j6', type: 'TARGETS_ROLE' }
];

module.exports = { nodes, relationships };
