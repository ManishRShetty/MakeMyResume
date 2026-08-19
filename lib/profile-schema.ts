import { escapeLatex } from "./latex-utils";

export interface ExperienceItem {
  id: string;
  company: string;
  location: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  dates: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  dates: string;
  gpa?: string;
}

export interface LeadershipItem {
  id: string;
  organization: string;
  location: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface MasterProfile {
  personalInfo: {
    fullName: string;
    location: string;
    headline: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  education: EducationItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  leadership: LeadershipItem[];
  achievements: string[];
  skills: {
    languages: string;
    frameworks: string;
    cloudDevops: string;
    other: string;
  };
}

export const INITIAL_MANISH_PROFILE: MasterProfile = {
  personalInfo: {
    fullName: "Manish R Shetty",
    location: "Mangaluru, India",
    headline: "Systems Engineer specializing in Go, native B-Tree database architecture (bbolt), Agentic AI workflows (LangGraph), and high-performance Next.js applications",
    phone: "+91 8660775130",
    email: "mmanishrshetty@gmail.com",
    linkedin: "linkedin.com/in/manishrshetty",
    github: "github.com/manishrshetty",
    website: "manishshetty.dev",
  },
  summary: "Full-stack Product Engineer specializing in Agentic AI and scalable web architecture. Experienced in architecting zero-intervention LLM pipelines (LangGraph, FastAPI) and optimizing production-grade interfaces (Next.js). Proven track record of leveraging containerized deployment (Kubernetes, Docker) to drive full-lifecycle development, from automated forecasting models to high-traffic web applications.",
  education: [
    {
      id: "edu_1",
      institution: "Srinivas Institute of Technology",
      location: "Mangaluru, India",
      degree: "B.E in Computer Science and Business Systems",
      dates: "Aug. 2023 -- Present",
      gpa: "8.9",
    },
  ],
  experiences: [
    {
      id: "exp_1",
      company: "MyDblink",
      location: "Casablanca, Morocco (Remote)",
      role: "Frontend Developer Intern",
      dates: "Aug. 2025 -- Oct. 2025",
      bullets: [
        "Contributed to the redesign of a major production-level web application, improving overall user experience and visual consistency.",
        "Implemented responsive UI components using modern frontend best practices, significantly enhancing usability across mobile and tablet devices.",
        "Optimized frontend performance through code refactoring and asset optimization, achieving noticeable reductions in page load times ($\\approx$ 20\\%).",
      ],
    },
    {
      id: "exp_2",
      company: "Thaniya Technologies",
      location: "Mangaluru, India",
      role: "Product Engineer Intern",
      dates: "Oct. 2025 -- January 2026",
      bullets: [
        "Developed full-stack product features using Next.js, Node.js, and modern APIs, improving system performance by 30\\%.",
        "Implemented AI-driven modules using LLMs and automation workflows, enhancing product intelligence and reducing manual tasks by 40\\%.",
      ],
    },
  ],
  projects: [
    {
      id: "proj_1",
      title: "AI-Powered Flood Routing & Responder Dispatch System",
      techStack: "TypeScript, GIS/WebSocket, LangGraph",
      dates: "[July 2026 - Now]",
      bullets: [
        "Real-time GIS web app using A* pathfinding to route emergency responders around live, crowd-reported flood zones, rerouting ground vehicles and watercraft differently.",
      ],
    },
    {
      id: "proj_2",
      title: "Autonomous Multi-Agent Trivia System",
      techStack: "LangGraph, FastAPI, Redis, Kubernetes, Next.js",
      dates: "Dec. 2025 -- Feb. 2026",
      bullets: [
        "Zero-intervention LangGraph pipeline with adversarial LLM validation, FastAPI/Redis backend, and LLM-as-a-judge difficulty scaling for a multi-agent trivia system.",
      ],
    },
    {
      id: "proj_3",
      title: "FolkSpace",
      techStack: "Random Forest, Blockchain, n8n",
      dates: "Aug. 2025 -- Oct. 2025",
      bullets: [
        "AI-driven demand forecasting and dynamic pricing system for Nordic retail, with blockchain-based distributor transparency; led end-to-end development.",
      ],
    },
  ],
  leadership: [
    {
      id: "lead_1",
      organization: "Nexus Clubs",
      location: "Mangaluru, India",
      role: "Vice-President",
      dates: "March 2025 -- Present",
      bullets: [
        "Co-led Nexus tech club operations, driving community growth and strategic event planning.",
        "Organized a 24-hour national hackathon with 1,000+ participants, coordinating logistics, sponsors, and judging workflows.",
      ],
    },
  ],
  achievements: [
    "\\textbf{Winner} -- Coastal Innovation Hackathon (Sahyadri College), Code Sprint 2026 (St Aloysius College), Pilikula Innovation Fair, QuizIT (Mangalore Beach Festival)",
    "Top 100 Finalist, Microsoft Bhasha Bandhu; Top 30, Finspark (Bank of Maharashtra); Shortlisted, SAP Hackfest",
  ],
  skills: {
    languages: "Go, Python, TypeScript, JavaScript, SQL, C, Java, C++",
    frameworks: "Next.js, React.js, Express.js, Node.js",
    cloudDevops: "Docker, Kubernetes, AWS, Google Cloud, GitHub Actions, Git",
    other: "Machine Learning, CI/CD, Spoken Languages (English, Hindi, Kannada)",
  },
};

/**
 * Generates exact LaTeX code directly from MasterProfile state
 */
export function generateLatexFromProfile(p: MasterProfile): string {
  const sanitize = (str: string) => escapeLatex(str || "");

  const eduEntries = p.education
    .map(
      (e) => `    \\resumeSubheading
      {${sanitize(e.institution)}}{${sanitize(e.location)}}
      {${sanitize(e.degree)}${e.gpa ? ` [CGPA: ${sanitize(e.gpa)}]` : ""}}{${sanitize(e.dates)}}`
    )
    .join("\n");

  const expEntries = p.experiences
    .map((exp) => {
      const bullets = exp.bullets
        .filter((b) => b.trim())
        .map((b) => `        \\resumeItem{${b}}`)
        .join("\n");

      return `    \\resumeSubheading
      {${sanitize(exp.company)}}{${sanitize(exp.location)}}
      {${sanitize(exp.role)}}{${sanitize(exp.dates)}}
      \\resumeItemListStart
${bullets}
      \\resumeItemListEnd`;
    })
    .join("\n\n");

  const projEntries = p.projects
    .map((proj) => {
      const bullets = proj.bullets
        .filter((b) => b.trim())
        .map((b) => `            \\resumeItem{${b}}`)
        .join("\n");

      return `      \\resumeProjectHeading
          {\\textbf{${sanitize(proj.title)}} $|$ \\emph{${sanitize(proj.techStack)}}}{${sanitize(proj.dates)}}
          \\resumeItemListStart
${bullets}
          \\resumeItemListEnd`;
    })
    .join("\n\n");

  const leadEntries = p.leadership
    .map((lead) => {
      const bullets = lead.bullets
        .filter((b) => b.trim())
        .map((b) => `                \\resumeItem{${b}}`)
        .join("\n");

      return `        \\resumeSubheading{${sanitize(lead.organization)}}{${sanitize(lead.location)}}{${sanitize(lead.role)}}{${sanitize(lead.dates)}}
            \\resumeItemListStart
${bullets}
            \\resumeItemListEnd`;
    })
    .join("\n\n");

  const achEntries = p.achievements
    .filter((a) => a.trim())
    .map((a) => `        \\resumeItem{${a}}`)
    .join("\n");

  const linkedinUrl = p.personalInfo.linkedin.startsWith("http")
    ? p.personalInfo.linkedin
    : `https://${p.personalInfo.linkedin}`;
  const githubUrl = p.personalInfo.github.startsWith("http")
    ? p.personalInfo.github
    : `https://${p.personalInfo.github}`;
  const websiteUrl = p.personalInfo.website.startsWith("http")
    ? p.personalInfo.website
    : `https://${p.personalInfo.website}`;

  return `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez / Manish R Shetty
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\classesList}[4]{
    \\item\\small{
        {#1 #2 #3 #4 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\Huge \\scshape ${sanitize(p.personalInfo.fullName)}} \\\\ \\vspace{1pt}
    ${sanitize(p.personalInfo.location)} \\\\ \\vspace{1pt}
    \\small ${sanitize(p.personalInfo.headline)}\\\\ \\vspace{1pt} 
    \\small \\raisebox{-0.1\\height}\\faPhone\\ ${sanitize(p.personalInfo.phone)} ~ \\href{mailto:${sanitize(p.personalInfo.email)}}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{${sanitize(p.personalInfo.email)}}} ~ 
    \\href{${linkedinUrl}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{${sanitize(p.personalInfo.linkedin)}}}  ~
    \\href{${githubUrl}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{${sanitize(p.personalInfo.github)}}} ~
    \\href{${websiteUrl}}{\\raisebox{-0.2\\height}\\faGlobe\\ \\underline{${sanitize(p.personalInfo.website)}}}
    \\vspace{-8pt}
\\end{center}

%-----------SUMMARY-----------
\\section{Summary}
  \\small{${sanitize(p.summary)}}
  \\vspace{-10pt}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${eduEntries}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${expEntries}
  \\resumeSubHeadingListEnd
\\vspace{-16pt}

%-----------PROJECTS-----------
\\section{Projects}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
${projEntries}
    \\resumeSubHeadingListEnd
\\vspace{-15pt}

%-----------INVOLVEMENT---------------
\\section{Leadership / Extracurricular}
    \\resumeSubHeadingListStart
${leadEntries}
    \\resumeSubHeadingListEnd
\\vspace{-15pt}

%-----------ACHIEVEMENTS---------------
\\section{Achievements}
    \\resumeSubHeadingListStart
${achEntries}
    \\resumeSubHeadingListEnd

%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${sanitize(p.skills.languages)}} \\\\
     \\textbf{Frameworks}{: ${sanitize(p.skills.frameworks)}} \\\\
     \\textbf{Cloud \\& DevOps}{: ${sanitize(p.skills.cloudDevops)}} \\\\
     \\textbf{Other}{: ${sanitize(p.skills.other)}} \\\\
    }}
 \\end{itemize}
 \\vspace{-16pt}

\\end{document}
`;
}
