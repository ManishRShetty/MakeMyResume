export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  latex: string;
}

export const MANISH_MASTER_LATEX = `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
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


%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}


\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
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

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
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

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\Huge \\scshape Manish R Shetty} \\\\ \\vspace{1pt}
    Mangaluru, India \\\\ \\vspace{1pt}
    % Added Headline Description
    \\small Systems Engineer specializing in Go, native B-Tree database architecture (bbolt), Agentic AI workflows (LangGraph), and high-performance Next.js applications\\\\ \\vspace{1pt} 
    \\small \\raisebox{-0.1\\height}\\faPhone\\ +91 8660775130 ~ \\href{mailto:mmanishrshetty@gmail.com}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{mmanishrshetty@gmail.com}} ~ 
    \\href{https://linkedin.com/}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{linkedin.com/in/manishrshetty}}  ~
    \\href{https://github.com/}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{github.com/manishrshetty}} ~
    % Added Website Link

    \\href{https://manishshetty.dev}{\\raisebox{-0.2\\height}\\faGlobe\\ \\underline{manishshetty.dev}}
    \\vspace{-8pt}
\\end{center}

%-----------SUMMARY-----------
\\section{Summary}
  \\small{Full-stack Product Engineer specializing in Agentic AI and scalable web architecture. Experienced in architecting zero-intervention LLM pipelines (LangGraph, FastAPI) and optimizing production-grade interfaces (Next.js). Proven track record of leveraging containerized deployment (Kubernetes, Docker) to drive full-lifecycle development, from automated forecasting models to high-traffic web applications.}
  \\vspace{-10pt}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Srinivas Institute of Technology}{Mangaluru, India}
      {B.E in Computer Science and Business Systems [CGPA: 8.9]}{Aug. 2023 -- Present}
  \\resumeSubHeadingListEnd


%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {MyDblink}{Casablanca, Morocco (Remote)}
      {Frontend Developer Intern}{Aug. 2025 -- Oct. 2025}
      \\resumeItemListStart
        \\resumeItem{Contributed to the redesign of a major production-level web application, improving overall user experience and visual consistency.}
        \\resumeItem{Implemented responsive UI components using modern frontend best practices, significantly enhancing usability across mobile and tablet devices.}
        \\resumeItem{Optimized frontend performance through code refactoring and asset optimization, achieving noticeable reductions in page load times ($\\approx$ 20\\%).}
      \\resumeItemListEnd

    \\resumeSubheading
      {Thaniya Technologies}{Mangaluru, India}
      {Product Engineer Intern}{Oct. 2025 -- January 2026}
      \\resumeItemListStart
        \\resumeItem{Developed full-stack product features using Next.js, Node.js, and modern APIs, improving system performance by 30\\%.}
        \\resumeItem{Implemented AI-driven modules using LLMs and automation workflows, enhancing product intelligence and reducing manual tasks by 40\\%.}
        % \\resumeItem{Built reusable UI components and optimized user flows with UX best practices, increasing user satisfaction and feature adoption.}
        % \\resumeItem{Automated deployment pipelines with CI/CD and containerization, reducing release time and improving deployment reliability.}
      \\resumeItemListEnd
      
  \\resumeSubHeadingListEnd
\\vspace{-16pt}

%-----------PROJECTS-----------
\\section{Projects}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart

      \\resumeProjectHeading
          {\\textbf{AI-Powered Flood Routing \\& Responder Dispatch System} $|$ \\emph{TypeScript, GIS/WebSocket, LangGraph}}{[July 2026 - Now]}
          \\resumeItemListStart
            \\resumeItem{Real-time GIS web app using A* pathfinding to route emergency responders around live, crowd-reported flood zones, rerouting ground vehicles and watercraft differently.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{Autonomous Multi-Agent Trivia System} $|$ \\emph{LangGraph, FastAPI, Redis, Kubernetes, Next.js}}{Dec. 2025 -- Feb. 2026}
          \\resumeItemListStart
            \\resumeItem{Zero-intervention LangGraph pipeline with adversarial LLM validation, FastAPI/Redis backend, and LLM-as-a-judge difficulty scaling for a multi-agent trivia system.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{FolkSpace} $|$ \\emph{Random Forest, Blockchain, n8n}}{Aug. 2025 -- Oct. 2025}
          \\resumeItemListStart
            \\resumeItem{AI-driven demand forecasting and dynamic pricing system for Nordic retail, with blockchain-based distributor transparency; led end-to-end development.}
          \\resumeItemListEnd

    \\resumeSubHeadingListEnd
\\vspace{-15pt}


%-----------INVOLVEMENT---------------
\\section{Leadership / Extracurricular}
    \\resumeSubHeadingListStart
        \\resumeSubheading{Nexus Clubs}{Mangaluru, India}{Vice-President}{March 2025 -- Present}
            \\resumeItemListStart
                \\resumeItem{Co-led Nexus tech club operations, driving community growth and strategic event planning.}
                \\resumeItem{Organized a 24-hour national hackathon with 1,000+ participants, coordinating logistics, sponsors, and judging workflows.}
                
            \\resumeItemListEnd
    \\resumeSubHeadingListEnd
\\vspace{-15pt}

%-----------ACHIEVEMENTS---------------
\\section{Achievements}
    \\resumeSubHeadingListStart
        \\resumeItem{\\textbf{Winner} -- Coastal Innovation Hackathon (Sahyadri College), Code Sprint 2026 (St Aloysius College), Pilikula Innovation Fair, QuizIT (Mangalore Beach Festival)}
        \\resumeItem{Top 100 Finalist, Microsoft Bhasha Bandhu; Top 30, Finspark (Bank of Maharashtra); Shortlisted, SAP Hackfest}
    \\resumeSubHeadingListEnd


%
%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Go, Python, TypeScript, JavaScript, SQL, C, Java, C++} \\\\
     \\textbf{Frameworks}{: Next.js, React.js, Express.js, Node.js} \\\\
     \\textbf{Cloud \\& DevOps}{: Docker, Kubernetes, AWS, Google Cloud, GitHub Actions, Git} \\\\
     \\textbf{Other}{: Machine Learning, CI/CD, Spoken Languages (English, Hindi, Kannada)} \\\\
    }}
 \\end{itemize}
 \\vspace{-16pt}

\\end{document}
`;

export const DEFAULT_TEMPLATES: ResumeTemplate[] = [
  {
    id: "manish-shetty-master",
    name: "Manish R Shetty (Your Master Resume)",
    category: "Personal Master Template",
    description: "Your official master placement resume with systems engineering, Agentic AI, full-stack experiences, and exact LaTeX commands.",
    latex: MANISH_MASTER_LATEX,
  },
  {
    id: "jakes-resume-standard",
    name: "Jake's Resume Standard",
    category: "Tech & Software",
    description: "Classic single-page ATS-optimized template.",
    latex: MANISH_MASTER_LATEX,
  }
];
