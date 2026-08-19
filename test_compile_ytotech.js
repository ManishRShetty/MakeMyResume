const https = require("https");
const fs = require("fs");

const fileContent = fs.readFileSync("./lib/templates/default-templates.ts", "utf8");
const startIdx = fileContent.indexOf("export const MANISH_MASTER_LATEX = `");
const endIdx = fileContent.indexOf("`;\n\nexport const DEFAULT_TEMPLATES");
// Replace double escaped slashes if needed or use raw
let latexCode = fileContent.substring(startIdx + 36, endIdx);
// Fix double backslashes that were inside JS template literal string
latexCode = latexCode.replace(/\\\\/g, "\\");

const payload = JSON.stringify({
  compiler: "pdflatex",
  rootResourcePath: "main.tex",
  resources: [
    {
      path: "main.tex",
      content: latexCode,
    },
  ],
});

const options = {
  hostname: "latex.ytotech.com",
  port: 443,
  path: "/builds/sync",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
    "User-Agent": "Mozilla/5.0",
  },
};

console.log("Testing ytotech LaTeX compilation API with correct schema...");
const req = https.request(options, (res) => {
  console.log("Status:", res.statusCode, "Content-Type:", res.headers["content-type"]);
  const chunks = [];
  res.on("data", (d) => chunks.push(d));
  res.on("end", () => {
    const buf = Buffer.concat(chunks);
    console.log("Response length:", buf.length);
    if (res.statusCode === 200 && res.headers["content-type"]?.includes("pdf")) {
      fs.writeFileSync("./public/manish_resume_compiled.pdf", buf);
      console.log("SUCCESS! Perfect Overleaf-grade PDF compiled and saved to ./public/manish_resume_compiled.pdf");
    } else {
      console.log("Response text:", buf.toString().slice(0, 1000));
    }
  });
});
req.on("error", (e) => console.error("Error:", e));
req.write(payload);
req.end();
