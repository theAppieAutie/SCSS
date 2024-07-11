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

// Middleware and helpers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(methodOverride('_method'));

// check for routing purposes experiment state
const checkStageOfExperiment = (req, res, next) => {
  const experiment = Experiment.getInstance()
  const stage = experiment.getCurrentStage();
  req.session.stage = stage;
  if (stage.includes('Experiment')) {
    res.redirect('/scales');
  } else if (stage.includes('debrief')) {
    res.redirect('/feedback');
  } else {
    next()
  }
}



// Fisher-Yates array shuffle algortihm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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
  const conditionNumber= parseInt(username) % 3;
  const groupNumber = parseInt(username) % 2;
  const censoredInfoNumber = Math.floor(parseInt(username) / 4) % 2;

  let condition = '';
  switch (conditionNumber) {
    case 0:
      condition = "noAdvisor";
      break;
    case 1:
      condition = "humanAdvisor";
      break;
    case 2:
      condition = "aiAdvisor";
      break;
    default:
      condition = "noAdvisor"; // Default to noAdvisor
  }

  let groupName = groupNumber === 0 ? "A" : 'B';
  let censoredInfo = censoredInfoNumber === 0 ? 'RIO' : 'SIO';

  if (!experiment.participant) {
    experiment.init(username, condition, groupName, censoredInfo);
  }
  
  const censoredArrayNumber = Math.floor(Math.random() * 4);

  // Save the group in the user's session
  req.session.username = username;
  req.session.condition = condition;
  req.session.experiment = experiment;
  req.session.censoredArrayNumber = censoredArrayNumber

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
  if (!req.session.condition) {
    return res.redirect('/');
  }

  // Retrieve experiment info
  const experiment = Experiment.getInstance();
  const condition = experiment.condition;
  const group = experiment.group;
  const censorship = experiment.censoredInfo;
  let conditionText = '';
  const censoredArrayNumber = req.session.censoredArrayNumber;
  
  const packetArray = experiment.packetArray.map(x => x);
  experiment.setCurrentStage();

  // Define recommendations based on group
  switch (condition) {
    case "noAdvisor":
      conditionText = "No Advisor"; // No recommendations for this group
      break;
    case "aiAdvisor":
      conditionText = "AI Advisor";
      break;
    case "humanAdvisor":
      conditionText = "Human Advisor";
      break;
    default:
      conditionText = ''; // Default to no recommendations
  }

  // Pass recommendations to the view
  res.render('game.ejs', { conditionText, group, censorship, censoredArrayNumber, packetArray: JSON.stringify(packetArray)});
});

//  handle adding data to Experiment
app.post("/addTrial", (req, res) => {
  const experiment = Experiment.getInstance();
 
  const inputs = req.body['input'];
  console.log(inputs);
  const stage = req.session.stage;
  if (stage === 'test') {
    experiment.addTestTrial(inputs);
  } else {
    experiment.addTrialInputToTrialData(inputs);
  }

  return res.send().status(200);
})





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


//  get scales views
app.get("/scales", (req, res) => {
  let scales = ['/tias', '/sart', '/nasa'];
  shuffleArray(scales);
  req.session.scales = scales;
  let nextScale = scales.pop();
  req.session.currentScale = nextScale;
  res.redirect(nextScale);
})

// handle scales posts
app.post("/scales", (req, res) => {
  let data = req.body;
  let experiment = Experiment.getInstance();
  let category = experiment.getCurrentStage();
  let firstDataEle = Object.keys(data)[0];
  let typeOfScale = firstDataEle.slice(0,4);
  let inputs = Object.values(data);
  experiment.addScalesData(category, typeOfScale, inputs);
  
  if (req.session.scales.length === 0) { // check if scales complete
    experiment.setCurrentStage();
    return res.redirect("/rules");
  }
  let scales = req.session.scales
  let nextScale = scales.pop();
  req.session.currentScale = nextScale;
  res.redirect(nextScale);

})


// GET rules view
app.get("/rules", checkStageOfExperiment, (req, res) => {
  res.render("rules.ejs");
});

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
  let experiment = Experiment.getInstance();
  console.log(experiment);
  res.render("debrief.ejs");
});

// get feedback view
app.get("/feedback", (req,res) => {
  res.render("feedback.ejs");
})

app.post("/feedback", (req, res) => {
  let feedback = req.body;
  let experiment = Experiment.getInstance();
  experiment.addFeedback(feedback);
  return res.redirect("/debrief")
})
// Start the server
app.listen(5050, () => {
  console.log(`Server running at http://localhost:5050`);
});
