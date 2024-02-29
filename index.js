// import express from "express"; 
// import fs from "node:fs";
// import path from "node:path";
// import { nanoid } from "nanoid";
// import { fileURLToPath } from "node:url";

// const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const isURLValid = (url) => {
//   try {
//     new URL(url);
//     return true;
//   } catch (err) {
//     return false;
//   }
// };

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.get("/", (req, res) => {
//     console.log("Request received on /");
//   res.sendFile(__dirname + "/index.html");
// });

// app.post("/url-shortner", (req, res) => {
//     const longUrl = req.body.url;
//     const shortUrl = nanoid(10);
//     const isValid = isURLValid(longUrl);
//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid URL",
//       });
//     }
    
//     const fileResponse = fs.readFileSync("result.json");
//     const fileData = JSON.parse(fileResponse.toString());
  
//     fileData[shortUrl] = longUrl;
  
//     fs.writeFileSync("result.json", JSON.stringify(fileData));

//     res.send(`Shortened URL: http://localhost:5000/${shortUrl}`);
//   });

// app.get("/:shortUrl", (req, res) => {
//   const fileResponse = fs.readFileSync("result.json");
//   const fileData = JSON.parse(fileResponse.toString());
//   const longUrl = fileData[req.params.shortUrl];
//   res.redirect(longUrl);
// });

// app.listen(5000, () => console.log("App is up and running at port 5000"));

import express from "express"; 
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.post("/url-shortner", (req, res) => {
  const longUrl = req.body.url;
  const shortUrl = nanoid(10);
  const isValid = isURLValid(longUrl);
  
  if (!isValid) {
    return res.status(400).send("Invalid URL");
  }
  
  const fileData = JSON.parse(fs.readFileSync("result.json").toString());
  fileData[shortUrl] = longUrl;
  fs.writeFileSync("result.json", JSON.stringify(fileData));

  const shortenedUrl = `http://localhost:5000/${shortUrl}`;
  res.send(`Shortened URL: <a href="${shortenedUrl}">${shortenedUrl}</a>`);
});

app.get("/:shortUrl", (req, res) => {
  const fileData = JSON.parse(fs.readFileSync("result.json").toString());
  const longUrl = fileData[req.params.shortUrl];
  
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send("Shortened URL not found");
  }
});

app.listen(5000, () => {
  console.log("App is up and running at port 5000");
});
