// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Import modules and configurations
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

// User Configuration
let users = [];

// Configure views and static files
app.set("views", path.join(__dirname, "./views"));
app.set("view-engine", "ejs");

// Static files
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(methodOverride('_method'));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Routes

// GET Login: Render the login page
app.get("/", (req, res) => {
  res.render("login.ejs");
});

// GET /game: Render the game page based on user group
app.get('/game', (req, res) => {
  // Ensure session is defined
  if (!req.session.group) {
    return res.redirect('/');
  }

  // Retrieve user group from the session
  const group = req.session.group;
  let recommendations = [];

  // Define recommendations based on group
  switch (group) {
    case "noAdvisor":
      recommendations = []; // No recommendations for this group
      break;
    case "aiAdvisor":
      recommendations = ["AI-based recommendations."];
      break;
    case "computerAdvisor":
      recommendations = ["Computer-based recommendations."];
      break;
    case "humanAdvisor":
      recommendations = ["Human-based recommendations."];
      break;
    default:
      recommendations = []; // Default to no recommendations
  }

  // Pass recommendations to the view
  res.render('game.ejs', { group, recommendations });
});

// POST Login: Handle login and assign user group
app.post("/", (req, res) => {
  const username = req.body.ID;
  const groupNumber = (parseInt(username) - 1) % 4 + 1;

  let groupName = '';
  switch (groupNumber) {
    case 1:
      groupName = "noAdvisor";
      break;
    case 2:
      groupName = "aiAdvisor";
      break;
    case 3:
      groupName = "computerAdvisor";
      break;
    case 4:
      groupName = "humanAdvisor";
      break;
    default:
      groupName = "noAdvisor"; // Default to noAdvisor
  }

  // Save the group in the user's session
  req.session.username = username;
  req.session.group = groupName;

  // Redirect to the home page after login
  res.redirect('/home');
});

// GET Home: Display home view
app.get("/home", (req, res) => {
  res.render("home.ejs");
});

// POST Test Scenario: Save data to a file
app.post("/testScenario", (req, res) => {
  const dataToBeLogged = JSON.stringify(req.body);

  // Create a write stream to append data to the log file
  const logger = fs.createWriteStream('log.json', {
    flags: 'a' // 'a' means append mode
  });

  logger.write(`${dataToBeLogged}\n`);
  res.json({ msg: 'Data saved successfully' });
});

// Start the server
app.listen(5050, () => {
  console.log(`Server running at http://localhost:5050`);
});
