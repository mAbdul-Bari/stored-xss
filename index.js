import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
// Array to store submitted messages
let messages = [];

// Route to handle form submission
app.post('/submit', (req, res) => {
  // Extract form data
  const { name, email, subject, message } = req.body;

  // Store the submitted message
  messages.push({ name, email, subject, message });

  // Redirect to the inner page
  res.redirect('/inner-page.html');
});

// Route to render inner-page.html and display stored messages
app.get('/inner-page.html', (req, res) => {
  // Construct HTML to display stored messages
  let messageHTML = '<ul>';
  messages.forEach(msg => {
    messageHTML += `<li>Name: ${msg.name}, Email: ${msg.email}, Subject: ${msg.subject}, Message: ${msg.message}</li>`;
  });
  messageHTML += '</ul>';

  // Read the inner-page.html file
  const innerPagePath = __dirname + '/inner-page.html';
  fs.readFile(innerPagePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading inner page');
      return;
    }

    // Inject the messages into the inner-page.html
    let renderedPage = data.replace('<!-- Messages Placeholder -->', messageHTML);
    
    // Send the rendered page
    res.send(renderedPage);
  });
});

// Serve the form HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
