// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Import modules and configurations
const express = require("express");
const app = express();
const Experiment = require("./public/scripts/experiment.js");
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

// GET information view
app.get("/", (req, res) => {
  res.render("information.ejs");
});

// Consent route
app.get("/consent", (req, res) => {
  res.render("consent.ejs");
});

app.post("/consent", (req,res) => {
  res.redirect("/login");
} )

// Login route
app.get("/login", (req, res) => {
  res.render("login.ejs");
});


app.post("/login", (req, res) => {
  const username = req.body.ID;
  let experiment = Experiment.getInstance();

  if (!experiment.participant) {
    experiment.init(username);
  }

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
  req.session.experiment = experiment;

  // Redirect to the description page after login
  res.redirect('/description');
});

// GET Home: Display home view
app.get("/description", (req, res) => {
  res.render("description.ejs");
  
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
  const experiment = Experiment.getInstance();
  const packetArray = experiment.packetArray.map(x => x);
  console.log(packetArray.length);

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
  res.render('game.ejs', { group, recommendations, packetArray: JSON.stringify(packetArray) });
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





// GET rules view
app.get("/rules", (req, res) => {
  res.render("rules.ejs");
})

// get TIAS view
app.get("/tias", (req,res) => {
  res.render("tias.ejs");
});

// get sart view
app.get("/sart", (req,res) => {
  res.render("sart.ejs");
});

// get nasa view
app.get("/nasa", (req,res) => {
  res.render("nasa.ejs");
});

// get debrief view
app.get("/debrief", (req, res) => {
  res.render("debrief.ejs");
})

// Start the server
app.listen(5050, () => {
  console.log(`Server running at http://localhost:5050`);
});
