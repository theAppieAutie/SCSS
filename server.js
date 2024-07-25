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
// const { v4: uuidv4 } = require("uuid");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const { Pool } = require('pg');
const { config } = require("dotenv");



// Configure views and static files
app.set("views", path.join(__dirname, "./views"));
app.set("view-engine", "ejs");

// Static files
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public")));

// Set up connection to DB and CRUD ops
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error("Connection error", err.stack));

const insertParticipant = async (username, condition, groupNumber, censoredInfo) => {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO participants (condition, group_number, censorship_group, experiment_start_time) VALUES ($1, $2, $3, $4) RETURNING participant_id;';
    const time = new Date().toISOString();
    const values = [condition, groupNumber, censoredInfo, time];
    const result = await client.query(query, values);
    // return result.rows[0].participant_id;
  } finally {
    client.release();
  }
  
}

const getNextId = async () => {
  const client = await pool.connect();
  try {
    const query = 'SELECT MAX(participant_id) AS max_id FROM participants;'
    const result = await client.query(query);
    const maxId = result.rows[0].max_id;
    return maxId !== null ? Number(maxId) + 1 : 1;
  } finally {
    client.release();
  }
  
};

const insertTrial = async (participant, type, number, start, end) => {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO trials (participant_id, trial_type, trial_number, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING trial_id;';
    const values = [participant, type, number, start, end];
    const result = await client.query(query, values);
    return result.rows[0].trial_id;
  } finally {
    client.release();
  }
}

const insertPacket = async (trial, user, advisor, accepted, time) => {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO packets (trial_id, user_input, advisor_recommendation, accepted, classified_time) VALUES ($1, $2, $3, $4, $5);';
    const values = [trial, user, advisor, accepted, time];
    const result = await client.query(query, values);
    // return result.rows[0].trial_id;
  } catch (err) {
    console.error("coulnt add packet input", err.stack); 
  } finally {
    client.release();
  }
}

const insertScale = async (participant, type, phase) => {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO scales (participant_id, scale_type, scale_phase) VALUES ($1, $2, $3) RETURNING scale_id;';
    const values = [participant, type, phase];
    const result = await client.query(query, values);
    return result.rows[0].scale_id;
  } finally {
    client.release();
  }
}

const insertItem = async (itemNumber, scale, value) => {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO items (item_id, scale_id, item_value) VALUES ($1, $2, $3);';
    const values = [itemNumber, scale, value];
    const result = await client.query(query, values);
  } finally {
    client.release();
  }
}


// Middleware and helpers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(methodOverride('_method'));

// restore experiment object
const restoreExperiment = (req,res,next) => {
  
  if (req.session.experiment) {
    req.experiment = new Experiment();
    Object.assign(req.experiment, req.session.experiment);
    
  } else {
    req.experiment = new Experiment();
    
    
  }
  
  next();
}

// save experiment instance to session
const saveExperiment = (req,res,next) => {
  
  req.session.experiment = req.experiment;
  next();
}

// check for routing purposes experiment state
const checkStageOfExperiment = (req, res, next) => {
  
  const stage = req.experiment.getCurrentStage();
  
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


// pre route 
app.use(restoreExperiment);
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

// create participant
app.post("/login", async (req, res) => {

  const participantId = await getNextId();
  const conditionNumber= participantId % 3;
  const groupNumber = parseInt(participantId) % 2;
  const censoredInfoNumber = Math.floor(participantId / 4) % 2;

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

  let experiment = new Experiment();
  experiment.init(participantId, condition, groupName, censoredInfo);
  
  
  const censoredArrayNumber = censoredInfo === 'RIO' ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4); // made a check here to account for the differing lengths of RIO and SIO conditions. RIO condition has 3 items and SIO still has 4 

  // Save the group in the user's session
  req.session.username = participantId;
  req.session.condition = condition;
  req.session.experiment = experiment;
  req.session.censoredArrayNumber = censoredArrayNumber;

  insertParticipant(participantId, condition, groupNumber, censoredInfo)

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
  
  const condition = req.experiment.condition;
  const group = req.experiment.group;
  const censorship = req.experiment.censoredInfo;
  let conditionText = '';
  const censoredArrayNumber = req.session.censoredArrayNumber;
  req.session.trialStartTime = new Date().toISOString();
  
  const packetArray = req.experiment.packetArray.map(x => x);
  req.experiment.setCurrentStage();

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
app.post("/addTrial", async (req, res) => {
  // get request
  const inputs = req.body['input'];

  // create and insert trial data
  const stage = req.session.stage;
  req.session.trialEndTime = new Date().toISOString();
  let trialNumber = 0;
  let trialType = '';
  if (stage === 'test') {
    req.experiment.addTestTrial(inputs);
    trialType = 'test';
  } else {
    trialNumber = req.experiment.getTrialDataArrayLength() + 1;
    trialType = 'main';
    req.experiment.addTrialInputToTrialData(inputs);
  }
  req.experiment.setCurrentStage();
  const trialId = await insertTrial(req.session.username, trialType, trialNumber, req.session.trialStartTime, req.session.trialEndTime);
  console.log(trialId);
  
  // insert packet data
  
  for (let input of inputs) {
    if (!input.time) {
      input["time"] = new Date().toISOString();
    }
    insertPacket(trialId, input.user, input.advisor, input.accepted, input.time);
  }


  saveExperiment(req, res, () => {
    res.sendStatus(200);
  });
})

//  get scales views
app.get("/scales", (req, res) => {
  let scales = ['/sart', '/nasa'];
  if (req.session.condition !== 'noAdvisor') {
    scales.push('/tias');
  }
  shuffleArray(scales);
  req.session.scales = scales;
  let nextScale = scales.pop();
  req.session.currentScale = nextScale;
  res.redirect(nextScale);
})

// handle scales posts
app.post("/scales", async (req, res) => {
  let data = req.body;
  
  let category = req.experiment.getCurrentStage();
  let firstDataEle = Object.keys(data)[0];
  let typeOfScale = firstDataEle.slice(0,4);
  let inputs = Object.values(data);
  req.experiment.addScalesData(category, typeOfScale, inputs);
  let scaleId = await insertScale(req.session.username, typeOfScale, category);
  for (let i = 0; i < inputs.length; i++){
    insertItem(i+1, scaleId, inputs[i]);
  }
  
  if (req.session.scales.length === 0) { // check if scales complete
    req.experiment.setCurrentStage();
    saveExperiment(req, res, () => {
      res.redirect("/rules");
    });
  } else {
    let scales = req.session.scales
    let nextScale = scales.pop();
    req.session.currentScale = nextScale;
    saveExperiment(req, res, () => {
      res.redirect(nextScale);
    });
  }
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
  res.render("debrief.ejs");
});

app.post("/debrief", (req, res) => {
  console.log(req.session.experiment);
  res.render("thanks.ejs");
})

// get feedback view
app.get("/feedback", (req,res) => {
  res.render("feedback.ejs");
})

app.post("/feedback", (req, res) => {
  let feedback = req.body;
  
  req.experiment.addFeedback(feedback);
  saveExperiment(req, res, () => {
    res.redirect("/debrief")
  });
})

// post route
app.use(saveExperiment);

// Start the server
app.listen(5050, () => {
  console.log(`Server running at http://localhost:5050`);
});
