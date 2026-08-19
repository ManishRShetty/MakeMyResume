export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  latex: string;
}

export const DEFAULT_TEMPLATES: ResumeTemplate[] = [
  {
    id: "jakes-resume",
    name: "Jake's Resume (FAANG Standard)",
    category: "Software Engineering & Tech",
    description: "The gold standard single-page ATS-optimized template widely used for campus placements and top tech applications.",
    latex: `%-------------------------
% Resume in LaTeX
% Author : Jake Gutierrez
% Based off of: https://github.com/jakegut/resume
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
\\input{glyphtounicode}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Alex Morgan} \\\\ \\vspace{1pt}
    \\small +1 (555) 123-4567 $|$ \\href{mailto:alex.morgan@email.com}{\\underline{alex.morgan@email.com}} $|$ 
    \\href{https://linkedin.com/in/alexmorgan}{\\underline{linkedin.com/in/alexmorgan}} $|$
    \\href{https://github.com/alexmorgan}{\\underline{github.com/alexmorgan}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {State University of Technology}{City, ST}
      {Bachelor of Science in Computer Science, GPA: 3.85/4.00}{Aug 2021 -- May 2025}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Java, Python, C/C++, TypeScript, JavaScript, SQL, HTML/CSS} \\\\
     \\textbf{Frameworks}{: React, Next.js, Node.js, Express, Spring Boot, FastAPI, TailwindCSS} \\\\
     \\textbf{Developer Tools}{: Git, Docker, Kubernetes, AWS (S3, EC2, Lambda), Postman, Linux} \\\\
     \\textbf{Libraries/Concepts}{: RESTful APIs, Microservices, Data Structures \\& Algorithms, System Design, CI/CD}
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {Software Engineer Intern}{May 2024 -- Aug 2024}
      {Acme Cloud Technologies}{Remote, USA}
      \\resumeItemListStart
        \\resumeItem{Architected and deployed a distributed caching layer using Redis and Go, reducing API p99 latency by 38\\% across 2M+ daily active requests.}
        \\resumeItem{Developed microservices in Node.js and TypeScript integrated with AWS SQS message queues, achieving 99.98\\% service uptime.}
        \\resumeItem{Implemented automated end-to-end integration test suites with Jest and GitHub Actions CI/CD pipelines, increasing branch coverage to 92\\%.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Undergraduate Research Fellow}{Jan 2024 -- Apr 2024}
      {Intelligent Systems Laboratory}{City, ST}
      \\resumeItemListStart
        \\resumeItem{Engineered real-time data processing pipelines in Python processing 500GB+ telemetry datasets for predictive anomaly detection.}
        \\resumeItem{Optimized SQL query performance and database indexing on PostgreSQL instances, slashing average execution time from 1.4s to 120ms.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      \\resumeSubheading
        {\\textbf{Distributed Task Queue \\& Workflow Engine} $|$ \\emph{Go, Redis, gRPC, Docker}}{Jan 2024 -- Mar 2024}
        {}{}
        \\vspace{-12pt}
        \\resumeItemListStart
          \\resumeItem{Built an asynchronous distributed task scheduling system capable of processing 10,000+ jobs/sec with exponential backoff retries.}
          \\resumeItem{Designed high-concurrency worker pools using Go goroutines and channels, eliminating thread contention and memory bottlenecks.}
          \\resumeItem{Containerized services with multi-stage Docker builds and orchestrated local cluster testing using Docker Compose.}
        \\resumeItemListEnd

      \\resumeSubheading
        {\\textbf{AI-Powered Code Review Assistant} $|$ \\emph{TypeScript, React, Next.js, Gemini API}}{Oct 2023 -- Dec 2023}
        {}{}
        \\vspace{-12pt}
        \\resumeItemListStart
          \\resumeItem{Constructed a real-time GitHub PR analysis bot delivering automated code quality audits and security vulnerability alerts.}
          \\resumeItem{Engineered dynamic context windows and prompt chains to provide actionable refactoring diffs with 85\\% developer acceptance rate.}
          \\resumeItem{Designed responsive, minimalist dark-mode UI with TailwindCSS and implemented streaming SSE responses for sub-second UI updates.}
        \\resumeItemListEnd
    \\resumeSubHeadingListEnd

%-----------LEADERSHIP & ACHIEVEMENTS-----------
\\section{Achievements \\& Leadership}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Winner}{: 1st Place at National Hackathon (out of 250+ collegiate teams) for real-time disaster relief routing app.} \\\\
     \\textbf{Competitive Programming}{: Candidate Master (Rating: 1950+) on Codeforces; Solved 700+ LeetCode algorithmic problems.} \\\\
     \\textbf{President}{: Computer Science Student Society -- organized tech talks, mock placement interviews, and workshops for 400+ members.}
    }}
 \\end{itemize}

\\end{document}
`
  },
  {
    id: "minimalist-modern",
    name: "Apple-Style Minimalist ATS",
    category: "Modern & Clean",
    description: "Ultra-clean modern typography with high contrast, precise spacing, and top recruiter readability.",
    latex: `\\documentclass[10pt,a4paper]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{titlesec}

\\hypersetup{colorlinks=true,urlcolor=black}
\\setlist[itemize]{noitemsep, topsep=0pt, leftmargin=12pt}

\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{4pt}

\\begin{document}
\\pagestyle{empty}

\\begin{center}
    {\\LARGE \\textbf{JORDAN SMITH}} \\\\ \\vspace{3pt}
    jordan.smith@email.com $\\cdot$ +1 (555) 987-6543 $\\cdot$ San Francisco, CA $\\cdot$ \\href{https://github.com/jordansmith}{github.com/jordansmith} $\\cdot$ \\href{https://linkedin.com/in/jordansmith}{linkedin.com/in/jordansmith}
\\end{center}

\\section{Summary}
Full-stack software engineer with a track record of building resilient web services, optimizing database queries, and shipping user-centric products. Passionate about developer tooling, performance engineering, and scalable distributed systems.

\\section{Technical Skills}
\\textbf{Languages:} TypeScript, JavaScript, Python, Go, Java, SQL, C++ \\\\
\\textbf{Frameworks \\& Libraries:} React, Next.js, Node.js, Express, Tailwind CSS, Redux, Prisma, GraphQL \\\\
\\textbf{Infrastructure \\& Tools:} Docker, Kubernetes, AWS, PostgreSQL, MongoDB, Redis, Git, GitHub Actions

\\section{Work Experience}
\\textbf{Senior Software Engineering Intern} \\hfill Jun 2024 -- Present \\\\
\\textit{Apex Systems Labs, San Francisco, CA}
\\begin{itemize}
    \\item Developed full-stack features using Next.js, Node.js, and TypeScript, improving web application load speed by 42\\%.
    \\item Designed and tuned PostgreSQL schemas and indexes, cutting complex analytical query runtimes by 55\\%.
    \\item Implemented OAuth2 and RBAC authorization middleware protecting sensitive user financial endpoints.
\\end{itemize}

\\vspace{4pt}
\\textbf{Software Developer Intern} \\hfill Jan 2024 -- May 2024 \\\\
\\textit{Nova Fintech Solutions, Austin, TX}
\\begin{itemize}
    \\item Built microservices in Go that ingested real-time market data over WebSockets with sub-5ms processing latency.
    \\item Created reusable React UI component libraries adopted by 4 internal engineering squads.
\\end{itemize}

\\section{Featured Projects}
\\textbf{Collaborative Real-Time Whiteboard} $|$ \\textit{Next.js, WebSockets, Canvas API, Redis} \\hfill 2024
\\begin{itemize}
    \\item Created high-performance infinite canvas supporting simultaneous multi-user cursor tracking and conflict-free data types (CRDT).
    \\item Handled 100+ concurrent active sessions per server instance with zero dropped state frames.
\\end{itemize}

\\vspace{4pt}
\\textbf{Automated API Load Testing Suite} $|$ \\textit{Python, Locust, Docker, Grafana} \\hfill 2023
\\begin{itemize}
    \\item Architected distributed stress-testing harness simulating 50,000 requests per minute with live latency visualization.
\\end{itemize}

\\section{Education}
\\textbf{Bachelor of Technology in Information Technology} \\hfill 2021 -- 2025 \\\\
Institute of Engineering \\& Technology \\hfill GPA: 3.9 / 4.0

\\end{document}
`
  }
];
