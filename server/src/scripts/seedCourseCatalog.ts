// npm run seed:catalog

// Seeds a full course catalog:
//   10 categories, and 100 courses (10 per category) owned by the approved
//   instructor organizations that already exist (5 courses per organization).
//   For every course: 10 sections x 5 lectures = 50 lectures, 1-2 free.
//
// This script only writes data, it does not change any application logic.
// Reviews, lecture questions and the purchased counter are not invented here,
// they are written from real users by: npm run seed:enrollments
// Run: npm run seed:catalog            (dry run, prints the plan)
//      npm run seed:catalog -- --yes   (writes)
//      npm run seed:catalog -- --yes --reset (rebuild from scratch)
import "dotenv/config";
import mongoose from "mongoose";

import UserModel from "../models/user.model";
import CategoryModel from "../models/category.model";
import OrganizationModel from "../models/organization.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";
import CourseProgressModel from "../models/courseProgress.model";

const MARKER = "seed:catalog";

const arg = (name: string, fallback = "") => {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));

  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const flag = (name: string) => process.argv.includes(`--${name}`);

const CONFIRMED = flag("yes") || arg("confirm", "") === "yes";
const RESET = flag("reset");
const DEDUPE = flag("dedupe");

const PER_CATEGORY = Math.max(1, Number(arg("per-category", "10")) || 10);
const SECTIONS = Math.max(1, Number(arg("sections", "10")) || 10);
const LECTURES = Math.max(1, Number(arg("lectures", "5")) || 5);

// VdoCipher video ids, the client plays them from a bare id
const VIDEO_IDS = [
  "4574067e9bdb4423ad82edba960dc822",
  "82b2350d035bca04a2806467f53b6b51",
  "3eb2d7b0f8224620bdfb76cf174f36aa",
  "1baa2441413d4d8da3da8040309e95d2",
];

// real, whitelisted course images (images.unsplash.com is in next.config.ts)
const IMAGES = [
  "photo-1516321318423-f06f85e504b3",
  "photo-1461749280684-dccba630e2f6",
  "photo-1498050108023-c5249f4df085",
  "photo-1504639725590-34d0984388bd",
  "photo-1531297484001-80022131f5a1",
  "photo-1522202176988-66273c2fd55f",
  "photo-1523240795612-9a054b0db644",
  "photo-1524178232363-1fb2b075b655",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1541339907198-e08756dedf3f",
  "photo-1546410531-bb4caa6b424d",
  "photo-1519389950473-47ba0277781c",
  "photo-1522071820081-009f0129c71c",
  "photo-1552664730-d307ca884978",
  "photo-1600880292203-757bb62b4baf",
  "photo-1573164713988-8665fc963095",
  "photo-1517245386807-bb43f82c33c4",
  "photo-1531403009284-440f080d1e12",
  "photo-1516534775068-ba3e7458af70",
  "photo-1454165804606-c3d57bc86b40",
];

const image = (index: number) =>
  `https://images.unsplash.com/${IMAGES[index % IMAGES.length]}?auto=format&fit=crop&w=800&h=450&q=70`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ---------------------------------------------------------------------------
// catalog data
// ---------------------------------------------------------------------------

type Category = {
  title: string;
  summary: string;
  courseTitles: string[];
  sections: string[];
  topics: string[][];
};

const CATEGORIES: Category[] = [
  {
    title: "Web Development",
    summary:
      "Build complete, production ready web applications from the browser all the way down to the database. Every course in this category is project based, so you finish with deployed work and a portfolio, not just notes.",
    courseTitles: [
      "Modern JavaScript From Zero to Job Ready",
      "React 19 Masterclass With Real Projects",
      "The Complete TypeScript Course For Developers",
      "Node.js And Express Backend Development",
      "Full Stack Next.js With PostgreSQL",
      "Advanced CSS Layouts And Responsive Design",
      "Web APIs And Asynchronous JavaScript In Depth",
      "Frontend Testing With Vitest And Playwright",
      "Progressive Web Apps That Feel Like Native",
      "Web Performance And Core Web Vitals Mastery",
    ],
    sections: [
      "Getting Started With The Modern Web",
      "Language Fundamentals In Practice",
      "Working With Data And APIs",
      "Building Reusable Interfaces",
      "State Management Patterns",
      "Styling And Responsive Layout",
      "Accessibility And UX Foundations",
      "Testing And Debugging Your Code",
      "Performance And Build Tooling",
      "Deployment And Production Workflows",
    ],
    topics: [
      ["Your First Project And Local Setup", "Values, Types And Operators", "Functions, Scope And Closures", "Arrays And Objects In Practice", "Modern Modules And Tooling"],
      ["Component Thinking And Props", "State, Events And Re-rendering", "Forms, Validation And UX", "Effects And Data Fetching", "Composition Patterns That Scale"],
      ["How HTTP Actually Works", "Fetching, Creating And Updating", "Error Handling And Retries", "Authentication Tokens End To End", "Caching Strategies And Optimistic UI"],
      ["Designing A Component API", "Reusable Layout Systems", "Theming And Design Tokens", "Accessibility Fundamentals", "Documentation And Storybook"],
      ["Local State And Derived Values", "Context And Composition", "Server State And Caching", "Global Stores Compared", "Persisting And Syncing State"],
      ["The Cascade And Specificity", "Flexbox In Depth", "Grid Layout Systems", "Responsive Type And Spacing", "Dark Mode And Theming"],
      ["Semantic Structure", "Keyboard And Screen Reader Support", "Colour And Contrast", "Focus Management", "Inclusive Forms And Feedback"],
      ["Unit Testing Pure Logic", "Component And Integration Tests", "End To End User Flows", "Test Data And Fixtures", "Reading Coverage Reports"],
      ["Bundle Size And Code Splitting", "Images, Fonts And Media", "Measuring Runtime Performance", "Build Configuration", "Profiling And Fixing Jank"],
      ["Environments And Secrets", "CI Checks On Every Push", "Containerising The App", "Deploying To Production", "Monitoring And Rollbacks"],
    ],
  },
  {
    title: "Data Science And Analytics",
    summary:
      "Turn raw data into decisions. These courses cover the full analytics workflow: clean and reshape data, explore it statistically, model it, then communicate the result so someone can act on it.",
    courseTitles: [
      "Python For Data Analysis Bootcamp",
      "Pandas And Data Cleaning Mastery",
      "Statistics For Data Professionals",
      "Data Visualisation With Matplotlib And Seaborn",
      "SQL For Analytics And Reporting",
      "Applied Machine Learning With Scikit Learn",
      "Time Series Forecasting In Practice",
      "Data Engineering Pipelines With Airflow",
      "Business Analytics And Metric Design",
      "Power BI Dashboards From Data To Decision",
    ],
    sections: [
      "The Analytics Toolkit",
      "Python Foundations For Data",
      "Getting Data Ready",
      "Exploring And Describing Data",
      "Statistical Foundations",
      "Visualisation And Storytelling",
      "SQL And Query Craft",
      "Machine Learning Workflows",
      "Pipelines And Production",
      "Reporting And Communication",
    ],
    topics: [
      ["The Data Analytics Landscape", "Setting Up Your Environment", "Jupyter And Reproducible Work", "Reading Data Files", "Project Structure"],
      ["Python Types And Collections", "Functions And Modules", "Numpy Arrays From Scratch", "Pandas Series Basics", "Reading And Writing Data"],
      ["Missing Values And Outliers", "Types And Categoricals", "Joins And Reshaping", "Deduplication And Validation", "Wrangling Large Datasets"],
      ["Summary Statistics", "Distributions And Outliers", "Grouping And Aggregation", "Correlation And Causation", "Sampling And Bias"],
      ["Descriptive Statistics", "Probability Basics", "Hypothesis Testing", "Confidence Intervals", "Regression Fundamentals"],
      ["Choosing The Right Chart", "Matplotlib Foundations", "Seaborn And Styling", "Interactive Charts", "Honest Axes And Labels"],
      ["Relational Concepts", "SELECT And Filtering", "Joins And Subqueries", "Window Functions", "Optimising Slow Queries"],
      ["The ML Workflow", "Feature Engineering", "Classification Models", "Regression Models", "Evaluation And Validation"],
      ["Batch And Streaming", "Scheduling And Orchestration", "Data Quality Checks", "Partitioning And Storage", "Cost And Performance"],
      ["Choosing A Metric", "Building A Dashboard", "Writing An Insight", "Presenting To Stakeholders", "Reproducing Results"],
    ],
  },
  {
    title: "Mobile App Development",
    summary:
      "Ship mobile applications people keep. Courses here cover platform fundamentals, state, networking, offline support and the release process for both major app stores.",
    courseTitles: [
      "Flutter From Zero To Published App",
      "React Native With TypeScript In Depth",
      "Android Development With Kotlin",
      "iOS Development With SwiftUI",
      "Mobile UI Patterns And Navigation",
      "Offline First Mobile Architecture",
      "Push Notifications And Deep Linking",
      "Mobile Performance And Profiling",
      "App Store Submission And Release",
      "Cross Platform State Management",
    ],
    sections: [
      "Mobile Development Setup",
      "Language And Widget Fundamentals",
      "Layout And Design Systems",
      "Navigation And Routing",
      "State And Data Management",
      "Networking And APIs",
      "Device Features And Permissions",
      "Storage, Offline And Sync",
      "Testing On Real Devices",
      "Release, Analytics And Updates",
    ],
    topics: [
      ["How Mobile Platforms Work", "Tooling And Emulators", "Project Anatomy", "Running On A Device", "Hot Reload Explained"],
      ["Language Core Syntax", "State And Lifecycle", "Composition Basics", "Common Widgets", "Custom Components"],
      ["Constraints And Flex", "Spacing And Scale", "Theming And Dark Mode", "Accessibility On Mobile", "Reusable Design Tokens"],
      ["Navigation Patterns", "Deep Links", "Passing Arguments", "Nested Navigators", "Transitions And Back Behaviour"],
      ["Local State", "Global State", "Server State Caching", "Forms And Validation", "Persisting User Preferences"],
      ["HTTP And REST", "Serialisation", "Auth And Tokens", "Uploads And Progress", "Error And Retry Handling"],
      ["Camera And Media", "Location Services", "Push Notifications", "Biometrics And Secure Storage", "Permissions Flow"],
      ["Local Databases", "Caching Strategies", "Sync Engines", "Conflict Resolution", "Migration And Versioning"],
      ["Unit And Widget Tests", "Integration Tests", "UI Automation", "Testing On Real Hardware", "Reading Crash Reports"],
      ["Build Configurations", "Signing And Provisioning", "Store Listing Assets", "Phased Rollouts", "Crash And Usage Monitoring"],
    ],
  },
  {
    title: "UI And UX Design",
    summary:
      "Design interfaces that are clear, usable and beautiful. Courses combine research, information architecture, interaction design and a strict focus on getting work in front of real users.",
    courseTitles: [
      "UI Design Fundamentals With Figma",
      "UX Research And User Interviews",
      "Design Systems From Scratch",
      "Wireframing And Prototyping Mastery",
      "Usability Testing And Iteration",
      "Web And Mobile Interface Design",
      "Motion And Micro-interactions",
      "Accessibility And Inclusive Design",
      "Information Architecture And Content Design",
      "Portfolio And Design Career Guidance",
    ],
    sections: [
      "What Makes An Interface Good",
      "Research And Discovery",
      "Structure And Flow",
      "Wireframes And Layout",
      "Visual Design Systems",
      "Interaction And Prototyping",
      "Usability And Feedback",
      "Accessibility And Inclusion",
      "Handoff And Delivery",
      "Building Your Design Career",
    ],
    topics: [
      ["Principles Of Good Design", "Visual Hierarchy", "Balance And Rhythm", "Consistency", "Design Critique Basics"],
      ["Research Questions", "Interview Techniques", "Usability Tests", "Analysing Findings", "Turning Insight Into Decisions"],
      ["User Personas", "User Journeys", "Task Flows", "Content Hierarchy", "Prioritising Requirements"],
      ["Low Fidelity First", "Layout Grids", "Skipping Straight To UI", "Interactive Prototypes", "Testing Wireframes Early"],
      ["Colour Systems", "Typography Scales", "Spacing Systems", "Elevation And Depth", "Iconography And Illustration"],
      ["Micro-interactions", "Feedback And Response", "Motion Principles", "Transitions That Guide", "Animation Timing"],
      ["Planning Usability Tests", "Writing Tasks", "Moderating A Session", "Measuring Success", "Prioritising Fixes"],
      ["Colour And Contrast", "Keyboard Navigation", "Screen Readers", "Cognitive Accessibility", "Inclusive Language"],
      ["Design Tokens", "Component Documentation", "Developer Collaboration", "Design QA", "Versioning A System"],
      ["Case Study Structure", "Presenting Your Work", "Portfolio Websites", "Finding Design Work", "Interview Preparation"],
    ],
  },
  {
    title: "Digital Marketing",
    summary:
      "Grow products with measurable marketing. These courses cover the channel mechanics, the analytics to prove it worked, and the strategy to decide where to spend next.",
    courseTitles: [
      "SEO Fundamentals That Actually Rank",
      "Google Ads And Paid Search Mastery",
      "Social Media Marketing Strategy",
      "Email Marketing And Automation",
      "Content Marketing For Growth",
      "Marketing Analytics And Attribution",
      "Conversion Rate Optimisation",
      "Marketing Automation Platforms",
      "Influencer And Affiliate Marketing",
      "Building A Full Funnel Marketing Plan",
    ],
    sections: [
      "Marketing Foundations",
      "Search And Discovery",
      "Paid Advertising",
      "Social And Community",
      "Content And Storytelling",
      "Email And Lifecycle",
      "Conversion And Optimisation",
      "Analytics And Measurement",
      "Automation And Tools",
      "Strategy And Budgeting",
    ],
    topics: [
      ["The Marketing Funnel", "Customer Personas", "Positioning And Messaging", "Goals And KPIs", "Market Research"],
      ["Keyword Research", "On Page SEO", "Technical SEO", "Link Building Ethics", "Measuring Rankings"],
      ["Campaign Structure", "Keyword Bidding", "Ad Copywriting", "Landing Page Alignment", "Budget Allocation"],
      ["Platform Strategy", "Content Calendars", "Community Management", "Short Form Video", "Creator Partnerships"],
      ["Content Strategy", "Topic Clusters", "Writing For Searchers", "Repurposing Content", "Editorial Workflows"],
      ["List Building", "Welcome Sequences", "Segmentation", "Deliverability", "Automation Flows"],
      ["Landing Page Structure", "A/B Testing Method", "Form Optimisation", "Checkout And Onboarding", "Trust And Social Proof"],
      ["Tracking Setup", "Key Metrics", "Attribution Models", "Cohort Analysis", "Reading Reports"],
      ["Marketing Automation Systems", "CRM Basics", "Lead Management", "Integrations And APIs", "Automation Pitfalls"],
      ["Channel Selection", "Budgeting And Forecasting", "Building A Campaign Plan", "Reporting To Leadership", "Scaling And Testing"],
    ],
  },
  {
    title: "Cybersecurity",
    summary:
      "Defend systems and respond to incidents. The material here is hands-on: labs, vulnerable machines, detection engineering and the process work that keeps an organisation secure.",
    courseTitles: [
      "Security Fundamentals For Everyone",
      "Ethical Hacking And Penetration Testing",
      "Network Security And Firewalls",
      "Web Application Security",
      "Incident Response And Forensics",
      "Cloud Security And IAM",
      "Secure Coding Practices",
      "Threat Intelligence And SOC Operations",
      "Cryptography Explained Properly",
      "Security Compliance And Risk Management",
    ],
    sections: [
      "How Security Works",
      "Threats And Vulnerabilities",
      "Network Defence",
      "Application Security",
      "Identity And Access",
      "Data Protection",
      "Detection And Response",
      "Secure Development",
      "Governance And Risk",
      "Hands On Labs",
    ],
    topics: [
      ["The CIA Triad", "Threats Actors And Motives", "Attack Surface", "Defence In Depth", "Security Vocabulary"],
      ["Vulnerability Classes", "Scanning And Enumeration", "Exploitation Basics", "Risk Rating", "Responsible Disclosure"],
      ["Network Topology Basics", "Firewalls And Segmentation", "VPNs And Remote Access", "IDS And IPS", "Hardening Devices"],
      ["OWASP Top Ten", "Injection Attacks", "Authentication Flaws", "Session Management", "Security Headers"],
      ["Authentication Patterns", "Multi-factor Authentication", "Least Privilege", "Role Design", "Access Reviews"],
      ["Encryption At Rest", "Key Management", "Secure File Handling", "Data Classification", "Backup And Recovery"],
      ["Logging And Monitoring", "SIEM Basics", "Writing Detection Rules", "Incident Triage", "Post Incident Reviews"],
      ["Secure SDLC", "Threat Modelling", "Code Review For Security", "Dependency Risk", "Secrets Management"],
      ["Risk Assessment", "Policy Writing", "Compliance Frameworks", "Awareness Training", "Third Party Risk"],
      ["Setting Up A Lab", "Practice Machines", "Capture The Flag Basics", "Documenting Findings", "Reporting To Customers"],
    ],
  },
  {
    title: "Cloud And DevOps",
    summary:
      "Ship software faster and keep it running. Courses here cover infrastructure as code, containers, continuous delivery, observability and the culture practices that make it sustainable.",
    courseTitles: [
      "Docker And Containers From Scratch",
      "Kubernetes In Production",
      "CI/CD Pipelines That Teams Trust",
      "Infrastructure As Code With Terraform",
      "AWS Cloud Practitioner To Solutions",
      "Monitoring And Observability",
      "Linux And Shell For DevOps",
      "Cloud Cost And Capacity Planning",
      "Platform Engineering Foundations",
      "Incident Response For SREs",
    ],
    sections: [
      "Cloud And DevOps Foundations",
      "Containers",
      "Orchestration",
      "Continuous Delivery",
      "Infrastructure As Code",
      "Cloud Provider Services",
      "Observability",
      "Reliability And Performance",
      "Security And Compliance",
      "Operating At Scale",
    ],
    topics: [
      ["Why DevOps", "Cloud Fundamentals", "The Deployment Pipeline", "Environments And Config", "Automation Mindset"],
      ["Images And Registries", "Writing Dockerfiles", "Docker Compose", "Image Size And Layers", "Container Security Basics"],
      ["Pods And Deployments", "Services And Networking", "ConfigMaps And Secrets", "Autoscaling", "Helm And Packaging"],
      ["Pipeline Stages", "Build And Test In CI", "Artifact Management", "Deployment Strategies", "Rollbacks And Gates"],
      ["Terraform Basics", "State Management", "Modules And Reuse", "Plan, Apply, Destroy", "Policy As Code"],
      ["Compute And Storage", "Networking And Load Balancing", "Managed Databases", "Identity And Access", "Cost Basics"],
      ["Metrics, Logs And Traces", "Instrumenting Applications", "Dashboards And SLOs", "Alerting Done Well", "Debugging Distributed Systems"],
      ["SLOs And Error Budgets", "Load And Stress Testing", "Caching And CDNs", "Capacity Planning", "Chaos Testing"],
      ["Secrets Management", "Network Policies", "Image And Supply Chain Security", "Audit Logging", "Compliance Automation"],
      ["Multi Region Design", "Database Scaling", "Queue And Batch Systems", "Cost Optimisation", "Runbooks And On Call"],
    ],
  },
  {
    title: "Artificial Intelligence And Machine Learning",
    summary:
      "Build models that work outside the notebook. The emphasis is on data preparation, evaluation, deployment and using the modern tooling that makes iteration fast and repeatable.",
    courseTitles: [
      "Machine Learning Foundations With Python",
      "Deep Learning With PyTorch",
      "Large Language Models And Prompt Engineering",
      "Natural Language Processing Practical",
      "Computer Vision With Modern Architectures",
      "Reinforcement Learning From Scratch",
      "MLOps And Model Deployment",
      "Feature Engineering And Data Prep",
      "Explainable AI And Model Interpretability",
      "Building AI Products End To End",
    ],
    sections: [
      "Machine Learning Foundations",
      "Data Preparation",
      "Supervised Learning",
      "Unsupervised Learning",
      "Deep Learning",
      "Generative And Language Models",
      "Model Evaluation",
      "Deployment And MLOps",
      "Responsible AI",
      "Applied AI Projects",
    ],
    topics: [
      ["What Machine Learning Is", "Models Versus Rules", "The Training Loop", "Common Problem Types", "Setting Up Notebooks"],
      ["Loading And Cleaning Data", "Handling Missing Values", "Encoding Categories", "Splitting Data Properly", "Data Leakage"],
      ["Linear Models", "Tree Based Models", "Ensembles And Boosting", "Hyperparameter Tuning", "Cross Validation"],
      ["Clustering", "Dimensionality Reduction", "Anomaly Detection", "Recommendation Systems", "Collaborative Filtering"],
      ["Neural Network Basics", "Training And Optimisers", "Regularisation", "Convolutional Architectures", "Transfer Learning"],
      ["Tokenisation And Context", "Prompt Design", "Retrieval Augmented Generation", "Fine Tuning Basics", "Evaluating Generations"],
      ["Accuracy And Its Traps", "Precision, Recall And F1", "ROC And AUC", "Error Analysis", "Fairness And Bias Checks"],
      ["Packaging Models", "Serving Patterns", "Batching And Latency", "Monitoring Drift", "Rollout Strategies"],
      ["Bias And Fairness", "Privacy And Consent", "Interpretability Methods", "Model Cards", "Human Oversight"],
      ["Framing A Problem", "Choosing An Approach", "Data And Feedback Loops", "Shipping To Users", "Measuring Impact"],
    ],
  },
  {
    title: "Business And Management",
    summary:
      "Lead teams and run products that matter. These courses cover hiring, delivery, strategy, finance basics and the communication skills that make any of it possible.",
    courseTitles: [
      "Product Management Essentials",
      "Project Management Professional",
      "Agile Delivery With Scrum And Kanban",
      "Team Leadership And Management",
      "Strategic Planning For Growing Companies",
      "Finance Basics For Non-Finance Managers",
      "Startup Fundamentals And Fundraising",
      "Negotiation And Stakeholder Management",
      "Data Driven Decision Making",
      "Change Management And Organisational Design",
    ],
    sections: [
      "How Organisations Work",
      "Product And Service Delivery",
      "Ways Of Working",
      "Leading People",
      "Strategy And Planning",
      "Finance And Measurement",
      "Communication And Influence",
      "Growth And Change",
      "Decision Making",
      "Case Studies",
    ],
    topics: [
      ["Business Models", "Organisational Structure", "How Decisions Get Made", "Understanding Stakeholders", "Reading The Landscape"],
      ["Product Discovery", "Writing Requirements", "Roadmaps And Priorities", "Defining Success", "Stakeholder Management"],
      ["Agile Principles", "Scrum In Practice", "Kanban And Flow", "Estimation Techniques", "Running Effective Retrospectives"],
      ["One To One Meetings", "Feedback And Delegation", "Hiring And Onboarding", "Performance Conversations", "Building Trust"],
      ["Vision And Mission", "Strategic Options", "Competitive Analysis", "OKRs And Goals", "Turning Strategy Into Plans"],
      ["Reading Financials", "Unit Economics", "Budgeting Basics", "Forecasting", "Understanding Cash Flow"],
      ["Clear Writing", "Presenting To Executives", "Managing Up", "Difficult Conversations", "Negotiation Preparation"],
      ["Building A Team", "Scaling Culture", "Change Communication", "Process Improvement", "Resisting And Adopting Change"],
      ["Decision Frameworks", "Reducing Uncertainty", "Experiments And Pilots", "Risk And Reversibility", "Documenting Decisions"],
      ["Reading A P&L", "Leading A Growing Team", "Handling Failure", "Strategic Trade-offs", "What Good Looks Like"],
    ],
  },
  {
    title: "Graphic Design",
    summary:
      "Make work that communicates. Courses here build the visual craft, the production skills and the business sense to deliver brand, print and digital design professionally.",
    courseTitles: [
      "Graphic Design Fundamentals",
      "Typography And Layout Mastery",
      "Brand Identity Design Essentials",
      "Adobe Photoshop For Designers",
      "Adobe Illustrator And Vector Art",
      "Print Design And Prepress Basics",
      "Motion Graphics And Animation",
      "Social Media Design Systems",
      "3D Design And Product Visuals",
      "Freelance Design Business",
    ],
    sections: [
      "Design Foundations",
      "Typography",
      "Colour And Image",
      "Layout And Composition",
      "Brand And Identity",
      "Digital Production",
      "Print Production",
      "Motion And 3D",
      "Working With Clients",
      "Running Your Practice",
    ],
    topics: [
      ["Elements Of Design", "Visual Balance", "Contrast And Emphasis", "Rhythm And Repetition", "Unity And Variety"],
      ["Anatomy Of Type", "Type Pairing", "Hierarchy And Scale", "Leading And Kerning", "Legibility Rules"],
      ["Colour Theory", "Colour Harmony", "Accessible Palettes", "Photography Basics", "Retouching And Correction"],
      ["Grids And Structure", "Alignment And Proximity", "White Space", "Composition Diagnostics", "Designing For Attention"],
      ["Brand Foundations", "Logo Construction", "Colour And Type Systems", "Brand Guidelines", "Applying A Brand"],
      ["Digital Design Tools", "Layer And Group Discipline", "Export Settings", "Responsive Assets", "Working With Developers"],
      ["Colour Management", "Bleed And Trim", "Paper And Materials", "Preflight Checks", "Sending To Print"],
      ["Animation Principles", "Motion Design Tools", "Storyboarding Motion", "Sound And Timing", "Rendering Video"],
      ["Briefing And Estimating", "Presenting Concepts", "Revisions And Feedback", "Pricing Projects", "Contracts And Invoices"],
      ["Building A Portfolio", "Finding Clients", "Rates And Revenue", "Time And Scope", "Growing A Studio"],
    ],
  },
];

// the courses below are owned by the approved instructor organizations, not by
// new ones invented here: each real instructor who logs in must find their own
// courses and the students who purchased them. so this seed loads the
// organizations that already exist (created by db:repair / seed:approve)
// instead of creating new organizations.

// reviews, questions and the purchased counter are not made up here.
// they are written from real users by: npm run seed:enrollments

const RESOURCE_LINKS = [
  "Course notes and cheat sheets",
  "Starter project files",
  "Official documentation",
  "Reference implementation",
  "Practice exercise pack",
  "Sample data files",
  "Community discussion board",
  "Further reading list",
];

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

// deterministic pseudo random so repeated runs produce the same data
const makeRandom = (seed: number) => {
  let state = seed + 1;

  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;

    return state / 2147483648;
  };
};

const pick = <T,>(random: () => number, list: T[]): T =>
  list[Math.floor(random() * list.length) % list.length];

const buildParagraphs = (parts: string[], count: number) => {
  const out: string[] = [];

  for (let i = 0; i < count; i += 1) {
    out.push(parts[i % parts.length]);
  }

  return out.join(" ");
};

const buildLectureDescription = (
  topic: string,
  courseTitle: string,
  sectionTitle: string,
  sectionNumber: number,
  lectureNumber: number,
  random: () => number,
) => {
  const openings = [
    `In this lesson we walk through ${topic} as it applies to ${courseTitle}.`,
    `This lesson covers ${topic} and why it matters while working through ${sectionTitle}.`,
    `We start from first principles and build ${topic} step by step.`,
    `A practical look at ${topic} with the decisions you will actually face.`,
    `Here we work through ${topic} carefully, including the common mistakes.`,
  ];

  const middles = [
    "The examples are deliberately small so you can follow every step and then scale the idea up yourself.",
    "You will see the reasoning behind each choice, not just the final code, because the reasoning is what transfers.",
    "Follow along in your own editor; typing the examples yourself makes the material far easier to remember.",
    "By the end of this lesson the idea should feel obvious rather than something to memorise.",
    "Keep the example open beside you and change one thing at a time to see what breaks.",
  ];

  const closings = [
    `This is lecture ${lectureNumber} of section ${sectionNumber}, and it sets up the next part of the course.`,
    "The next lecture builds directly on this, so it is worth finishing this one first.",
    "There is a short exercise attached to this lesson to check the idea actually landed.",
    "Once you are comfortable with this, continue to the next lesson in the section.",
    "This lesson wraps up one part of the topic and prepares you for what comes next.",
  ];

  return buildParagraphs(
    [pick(random, openings), pick(random, middles), pick(random, closings)],
    3,
  );
};

const buildCourseDescription = (
  category: Category,
  title: string,
  level: string,
  sectionCount: number,
  lectureCount: number,
  random: () => number,
) => {
  const intro = [
    `${title} is a ${level} level course in ${category.title}, built around ${sectionCount} sections and ${sectionCount * lectureCount} practical lessons.`,
    `This ${level} level course takes you through ${category.title} from the fundamentals to shipping real work, across ${sectionCount} sections and ${sectionCount * lectureCount} lessons.`,
    `A complete ${level} level path through ${category.title}. ${sectionCount} sections and ${sectionCount * lectureCount} lessons take you from first principles to confident delivery.`,
  ];

  const method = [
    "Each section ends with a practical exercise so you apply what you just learned instead of only watching it.",
    "The course is heavily project based, with exercises and checkpoints after every section.",
    "Lessons are short and focused, and every section is finished with a real task you can show in a portfolio.",
    "You will build working examples as you go, because reading about a concept is not the same as using it.",
  ];

  const outcome = [
    "By the end you will have a complete project, a portfolio piece and the confidence to keep building on your own.",
    "You finish with a finished project, working notes of your own, and the judgement to know what to learn next.",
    "The goal is a finished piece of work you are proud of, plus the fundamentals you can apply to problems you have not seen before.",
    "You leave with real deliverables rather than a certificate, and a clear plan for continuing after the course.",
  ];

  return buildParagraphs(
    [pick(random, intro), category.summary, pick(random, method), pick(random, outcome)],
    4,
  );
};

const buildBenefits = (title: string, sectionCount: number, random: () => number) => {
  const pool = [
    { title: `Finish ${title} with a complete portfolio project` },
    { title: `${sectionCount} structured sections, ${sectionCount * LECTURES} focused lessons` },
    { title: "Exercises and checkpoints after every section" },
    { title: "Downloadable notes, starter files and reference solutions" },
    { title: "Learn at your own pace with lifetime access" },
    { title: "Practical patterns you can apply in real projects immediately" },
  ];

  const extra = pool.slice(4).sort(() => 0.5 - random()).slice(0, 1);

  return pool.slice(0, 4).concat(extra);
};

const buildPrerequisites = (level: string) => {
  if (level === "beginner") {
    return [
      { title: "No prior experience required" },
      { title: "A computer with internet access" },
      { title: "Willingness to practise after each lesson" },
    ];
  }

  if (level === "intermediate") {
    return [
      { title: "Comfortable with the basics of the field" },
      { title: "Experience building at least one small project" },
      { title: "Familiarity with a code editor or design tool" },
    ];
  }

  return [
    { title: "Solid practical experience with the fundamentals" },
    { title: "Experience shipping and maintaining a real project" },
    { title: "Familiarity with debugging, testing and version control" },
  ];
};

const buildLinks = (title: string, random: () => number) => {
  const chosen = [RESOURCE_LINKS[0]];
  let index = Math.floor(random() * RESOURCE_LINKS.length) % RESOURCE_LINKS.length;

  while (chosen.length < 2) {
    index = (index + 1 + Math.floor(random() * 3)) % RESOURCE_LINKS.length;

    if (!chosen.includes(RESOURCE_LINKS[index])) {
      chosen.push(RESOURCE_LINKS[index]);
    }
  }

  return chosen.map((resourceTitle) => ({
    title: `${resourceTitle} for ${title}`,
    url: `https://example.com/resources/${slugify(resourceTitle)}`,
  }));
};

// ---------------------------------------------------------------------------
// build
// ---------------------------------------------------------------------------

const buildCourse = (
  category: Category,
  categoryIndex: number,
  courseIndex: number,
  categoryDoc: { _id: mongoose.Types.ObjectId },
  organization: { _id: mongoose.Types.ObjectId; instructor: mongoose.Types.ObjectId },
  imageIndex: number,
) => {
  const random = makeRandom(categoryIndex * 1000 + courseIndex * 17);
  const title = category.courseTitles[courseIndex % category.courseTitles.length];
  const level = LEVELS[(categoryIndex + courseIndex) % LEVELS.length];
  const sectionCount = Math.min(SECTIONS, category.sections.length);
  const freeLessons = 1 + ((categoryIndex + courseIndex) % 2);

  const price = 45 + Math.floor(random() * 9) * 15;
  const estimatePrice = price + 40 + Math.floor(random() * 6) * 20;

  const courseData = [];

  for (let s = 0; s < sectionCount; s += 1) {
    const sectionTitle = category.sections[s];
    const topics = category.topics[s % category.topics.length];

    for (let l = 0; l < LECTURES; l += 1) {
      const topic = topics[(l + courseIndex) % topics.length];
      const lectureTitle = `${String(l + 1).padStart(2, "0")}. ${topic}`;
      // 1 or 2 free lessons at the very start of the course
      const isFree = s === 0 && l < freeLessons;

      courseData.push({
        title: lectureTitle,
        description: buildLectureDescription(
          topic,
          title,
          sectionTitle,
          s + 1,
          l + 1,
          random,
        ),
        videoUrl: VIDEO_IDS[(categoryIndex + courseIndex + s + l) % VIDEO_IDS.length],
        videoSection: sectionTitle,
        videoLength: 4 + Math.floor(random() * 26),
        videoPlayer: "VdoCipher",
        links: buildLinks(title, random),
        suggestion: `Pause here and try the exercise for "${topic}" before moving on. Once it works, change one detail and predict what happens.`,
        isFree,
        questions: [],
      });
    }
  }

  const tagBase = `${category.title}, ${title}, ${level}`;

  return {
    name: title,
    description: buildCourseDescription(category, title, level, sectionCount, LECTURES, random),
    category: categoryDoc._id,
    price,
    estimatePrice,
    organization: organization._id,
    instructor: organization.instructor,
    createdBy: organization.instructor,
    thumbnail: {
      public_Id: `courses/${slugify(title)}`,
      url: image(imageIndex),
    },
    tags: `${tagBase}, ${MARKER}`,
    level,
    demoUrl: VIDEO_IDS[courseIndex % VIDEO_IDS.length],
    benefits: buildBenefits(title, sectionCount, random),
    prerequisites: buildPrerequisites(level),
    reviews: [],
    courseData,
    ratings: 0,
    purchased: 0,
    reviewsCount: 0,
    totalLectures: courseData.length,
  };
};

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------

const reset = async () => {
  // grab the ids first, the purchases of these courses have to go as well
  const courseIds = await CourseModel.find({ tags: new RegExp(MARKER) })
    .select("_id")
    .lean();
  const ids = courseIds.map((course: any) => course._id);

  const courses = await CourseModel.deleteMany({ tags: new RegExp(MARKER) });

  // cleanup of the organizations/instructors created by older seed runs.
  // they are safe to remove: the courses that used them are deleted above.
  const legacyOrgIds = await OrganizationModel.find({
    slug: { $regex: "^(heliopolis-code-academy|zamalek-tech-lab|maadi-software-institute|giza-cloud-academy|alexandria-data-school|cairo-security-institute|luxor-design-academy|aswan-innovation-hub|port-said-ai-center|dahab-digital-academy)$" },
  })
    .select("_id instructor")
    .lean();
  const legacyInstructorIds = legacyOrgIds.map((org) => org.instructor);
  await OrganizationModel.deleteMany({ _id: { $in: legacyOrgIds.map((org) => org._id) } });
  await UserModel.deleteMany({ _id: { $in: legacyInstructorIds } });

  const categories = await CategoryModel.deleteMany({
    slug: { $in: CATEGORIES.map((category) => slugify(category.title)) },
  });
  const users = await UserModel.deleteMany({
    email: { $in: [/^instructor\..*@lms\.test$/] },
  });

  // the catalog courses are about to disappear, so their purchases and progress
  // must go too, otherwise orders would point at courses that no longer exist
  const orders = await OrderModel.deleteMany({ course: { $in: ids } });
  const progress = await CourseProgressModel.deleteMany({ course: { $in: ids } });
  await UserModel.updateMany({}, { $pull: { courses: { $in: ids } } });

  console.log(
    `  reset: ${courses.deletedCount} courses, ${legacyOrgIds.length} old catalog organizations, ${categories.deletedCount} categories, ${users.deletedCount} old catalog instructor users`,
  );
  console.log(
    `  reset: ${orders.deletedCount} orders and ${progress.deletedCount} progress rows removed with the courses`,
  );
};

const run = async () => {
  await mongoose.connect(process.env.DB_URL as string);

  const totalCourses = CATEGORIES.length * PER_CATEGORY;
  const lecturesPerCourse = Math.min(SECTIONS, 10) * LECTURES;

  console.log("");
  console.log("=== course catalog plan ===");
  console.log(`  categories      : ${CATEGORIES.length}`);
  console.log(`  organizations   : the approved instructor organizations`);
  console.log(`  courses         : ${totalCourses} (${PER_CATEGORY} per category, spread over the real organizations)`);
  console.log(`  per course      : ${Math.min(SECTIONS, 10)} sections x ${LECTURES} lectures = ${lecturesPerCourse} lectures`);
  console.log(`  free lectures   : 1 or 2 per course`);
  console.log(`  total lectures  : ${totalCourses * lecturesPerCourse}`);
  console.log(`  videos          : ${VIDEO_IDS.length} VdoCipher ids, rotated across all lectures`);

  if (!CONFIRMED) {
    console.log("");
    console.log("  DRY RUN, nothing was written. re-run with --yes.");
    console.log("  add --reset to rebuild previously seeded data.\n");
    await mongoose.disconnect();
    process.exit(0);
  }

  if (DEDUPE) {
    console.log("\n--- dedupe ---");

    const groups = await CourseModel.aggregate([
      { $match: { tags: new RegExp(MARKER) } },
      {
        $group: {
          _id: { name: "$name", organization: "$organization" },
          keep: { $first: "$_id" },
          extra: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    let removed = 0;

    for (const group of groups) {
      const duplicates = group.extra.filter((id: any) => String(id) !== String(group.keep));

      if (duplicates.length) {
        removed += (
          await CourseModel.deleteMany({ _id: { $in: duplicates } })
        ).deletedCount;
      }
    }

    console.log(`  removed ${removed} duplicate course(s)`);
  }

  if (RESET) {
    console.log("\n--- reset ---");
    await reset();
  }

  // categories
  console.log("\n--- categories ---");
  const categoryDocs = [];

  for (const category of CATEGORIES) {
    const slug = slugify(category.title);
    const doc = await CategoryModel.findOneAndUpdate(
      { slug },
      {
        $setOnInsert: {
          title: category.title,
          slug,
          status: "approved",
          requestedBy: null,
          reviewedBy: null,
          reviewedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    categoryDocs.push(doc);
  }

  console.log(`  ${categoryDocs.length} categories ready`);

  // organizations and their instructors: the real approved ones, resolved from
  // the instructor user so every logged in instructor owns their own courses
  console.log("\n--- organizations and instructors ---");

  const approvedInstructors = await UserModel.find({
    role: "instructor",
    email: { $regex: "^inst\\." },
  })
    .select("_id email")
    .lean();

  if (!approvedInstructors.length) {
    throw new Error(
      "No approved instructor organizations found. Run the instructor application seed and approval first (npm run seed:users, npm run seed:applications, npm run seed:approve).",
    );
  }

  const organizationDocs = await OrganizationModel.find({
    instructor: { $in: approvedInstructors.map((user) => user._id) },
  })
    .select("_id name instructor")
    .lean();

  console.log(`  ${organizationDocs.length} real organizations ready`);

  // courses
  console.log("\n--- courses ---");
  let written = 0;
  let imageIndex = 0;

  for (let c = 0; c < CATEGORIES.length; c += 1) {
    const category = CATEGORIES[c];
    const categoryDoc = categoryDocs[c];
    const batch = [];

    for (let i = 0; i < PER_CATEGORY; i += 1) {
      // the 100 courses are spread evenly over the real organizations (5 per
      // organization with 20 organizations), so every instructor owns the
      // courses shown on their dashboard
      const organization = organizationDocs[(c * PER_CATEGORY + i) % organizationDocs.length];

      batch.push(
        buildCourse(category, c, i, categoryDoc as any, organization as any, imageIndex++),
      );
    }

    // running the script twice must not create the catalog twice
    const names = batch.map((course) => course.name);
    const existing = await CourseModel.find({
      tags: new RegExp(MARKER),
      organization: { $in: organizationDocs.map((org) => org._id) },
      name: { $in: names },
    })
      .select("name organization")
      .lean();

    const taken = new Set(
      existing.map((row: any) => `${String(row.name)}::${String(row.organization)}`),
    );
    const missing = batch.filter(
      (course) => !taken.has(`${course.name}::${String(course.organization)}`),
    );

    if (missing.length) {
      await CourseModel.insertMany(missing, { ordered: false });
    }

    written += missing.length;

    console.log(
      `  ${category.title.padEnd(34)} ${missing.length} added${
        batch.length - missing.length ? `, ${batch.length - missing.length} already there` : ""
      }`,
    );
  }

  console.log(`\n  ${written} courses inserted`);

  // verify
  const total = await CourseModel.countDocuments({ tags: new RegExp(MARKER) });
  const perOrg = await CourseModel.aggregate([
    { $match: { tags: new RegExp(MARKER) } },
    { $group: { _id: "$organization", count: { $sum: 1 } } },
  ]);
  const perCategory = await CourseModel.aggregate([
    { $match: { tags: new RegExp(MARKER) } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  console.log("\n=== verification ===");
  console.log(`  seeded courses      : ${total}`);
  console.log(`  courses per org     : ${perOrg.map((row) => row.count).join(", ")}`);
  console.log(`  courses per category: ${perCategory.map((row) => row.count).join(", ")}`);

  const sample = await CourseModel.findOne({ tags: new RegExp(MARKER) })
    .populate("category", "title")
    .populate("organization", "name")
    .lean();

  if (sample) {
    const sections = new Set((sample.courseData || []).map((d: any) => d.videoSection));

    console.log(
      `  sample              : "${(sample as any).name}" / ${(sample as any).category?.title} / ${(sample as any).organization?.name}`,
    );
    console.log(
      `  sample content      : ${(sample.courseData || []).length} lectures across ${sections.size} sections, ${(sample.courseData || []).filter((d: any) => d.isFree).length} free`,
    );
  }

  console.log("\n  done\n");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error("\nFAILED:", error && error.message);
  process.exitCode = 1;

  try {
    await mongoose.disconnect();
  } catch {
    // ignore shutdown errors
  }

  process.exit(1);
});
