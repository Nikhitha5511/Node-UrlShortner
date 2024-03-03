
import express from "express";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resultFilePath = path.join(__dirname, "result.json");

const isURLValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/shorten", (req, res) => {
  const longUrl = req.body.url;
  const shortUrl = nanoid(10);
  const isValid = isURLValid(longUrl);
  
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL"
    });
  }
  
  try {
    const fileData = JSON.parse(fs.readFileSync(resultFilePath).toString());
    fileData[shortUrl] = longUrl;
    fs.writeFileSync(resultFilePath, JSON.stringify(fileData));

    const shortenedUrl = `http://localhost:5000/${shortUrl}`;
    res.redirect(`/success?shortenedUrl=${encodeURIComponent(shortenedUrl)}`);
  } catch (err) {
    console.error("Error writing to result.json:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

app.get("/success", (req, res) => {
  const shortenedUrl = req.query.shortenedUrl;
  res.send(`
    <h2>Shortened URL:</h2>
    <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a>
  `);
});

app.get("/:shortUrl", (req, res) => {
  try {
    const fileData = JSON.parse(fs.readFileSync(resultFilePath).toString());
    const longUrl = fileData[req.params.shortUrl];
    
    if (longUrl) {
      res.redirect(longUrl);
    } else {
      res.status(404).send("Shortened URL not found");
    }
  } catch (err) {
    console.error("Error reading from result.json:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  console.log("App is up and running at port 5000");
});


