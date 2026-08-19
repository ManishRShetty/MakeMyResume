const https = require("https");
const fs = require("fs");

const fileContent = fs.readFileSync("./lib/templates/default-templates.ts", "utf8");
const startIdx = fileContent.indexOf("export const MANISH_MASTER_LATEX = `");
const endIdx = fileContent.indexOf("`;\n\nexport const DEFAULT_TEMPLATES");

const latexCode = fileContent.substring(startIdx + 36, endIdx);
console.log("LaTeX Code length:", latexCode.length);

const postData = "text=" + encodeURIComponent(latexCode);

const options = {
  hostname: "latexonline.cc",
  port: 443,
  path: "/compile",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(postData),
    "User-Agent": "Mozilla/5.0",
  },
};

console.log("Posting LaTeX code to compiler...");
const req = https.request(options, (res) => {
  console.log("Status:", res.statusCode, "Content-Type:", res.headers["content-type"]);
  const chunks = [];
  res.on("data", (d) => chunks.push(d));
  res.on("end", () => {
    const buf = Buffer.concat(chunks);
    console.log("Response size:", buf.length, "bytes");
    if (res.statusCode === 200 && res.headers["content-type"]?.includes("pdf")) {
      fs.writeFileSync("./public/sample_manish_resume.pdf", buf);
      console.log("SUCCESS! Real PDF compiled and saved to ./public/sample_manish_resume.pdf");
    } else {
      console.log("Compilation log:", buf.toString().substring(0, 1000));
    }
  });
});

req.on("error", (e) => console.error("Error:", e));
req.write(postData);
req.end();
