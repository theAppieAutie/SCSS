import { initializeClassificationButtons, confirmClassification } from './classification.js';
import { config } from "./config.js";

//  object holding censored item list to add blur
const censoredOptions = {
  'RIO' : {
        0 : 'info-portnumber',
        1 : 'info-protocol',
        2 : 'info-fragmentation',
        3 : 'info-certificates'
  },
  'SIO' : {
    0 : 'info-checksum',
    1 : 'info-time',
    2 : 'info-ip',
    3 : 'info-country'
  }
}

// Function to change game styles based on the group
const adjustGameStyles = () => {
const game = document.getElementById("game");
game.style.maxWidth = "60vw";
game.style.maxHeight = "60vh";
game.style.marginRight = "1vw";
};

document.addEventListener("DOMContentLoaded", adjustGameStyles);

// initiate advisor recommendations and attach to packets
const numberWrong= Math.round((100 - config.advisorAccuracy) / 100 * packetArray.length);
let advisorArray = packetArray.map((x) => x.packetType);
let count = 0;
while (count < numberWrong) {
  let index = Math.floor(Math.random() * advisorArray.length);
  if (advisorArray[index] === packetArray[index].packetType) {
    
    switch (advisorArray[index]) {
      case "hostile":
        advisorArray[index] = Math.random() < .50 ? "safe" : "neutral";
        break;
      case "safe":
        advisorArray[index] = Math.random() < .50 ? "neutral" : "hostile";
        break;
      case "neutral":
        advisorArray[index] = Math.random() < .50 ? "hostile" : "safe";
    }
    count++;
  }
}

for (let i = 0; i < packetArray.length; i++) {
  packetArray[i]["recommendation"] = advisorArray[i];
  packetArray[i]["acceptedRecommendation"] = false;
}


// Initialize variables and elements
const gameObj = document.getElementById("game");
const panelsElement = document.getElementsByClassName("panels")[0];
let selectedDotInfo = null;
let dotElement = null;

// const experiment = sessionStorage.getItem('experimentState');

// const data = JSON.parse(experiment);

// set up trial view
if (group !== "A") {
  panelsElement.style.flexDirection = "row-reverse";
}
document.getElementById(censoredOptions[censoredInfo][censoredArrayNumber]).classList.add("blur");

// Initialize classification buttons
initializeClassificationButtons();

// Attach confirmation event
document.getElementById("confirmButton").addEventListener("click", () => confirmClassification(dotElement, selectedDotInfo));

// Define the `start` function to initialize the game
const startTrial = () => {
  
    let selectedDot = null;
  
    const timeForTrial = config.trialLength * 60000;
    const timePerPacket = timeForTrial / packetArray.length;
  
    // Create and add the central point without click events
    const visualCenterDot = document.createElement('div');
    visualCenterDot.classList.add('center-dot');
    gameObj.appendChild(visualCenterDot);
  
  
    
    createPacketElement(packetArray);
  
   // Define delay for packet release
    function delay(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
  
    // Create and display packets with delays
    async function createPacketElement(packets) {
      for (let packet of packets) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.style.left = `${packet.location[0]}%`;
        dot.style.top = `${packet.location[1]}%`;
        dot.style.animation = `dot-move ${timePerPacket}ms linear 1`;
        gameObj.appendChild(dot);
  
        // Add click event to update connection info and maintain reference
        dot.addEventListener('click', function() {
          updateConnectionInfo(packet);
          document.getElementById("accept").addEventListener("click", function() {
            packet["acceptedRecommendation"] = true;
          } )
          selectedDotInfo = packet;
          dotElement = this;
          selectDot(this);
        });
        await delay(timePerPacket);
        gameObj.removeChild(dot)
      }
  }
  
    // Function to select a single dot
    const selectDot = (dotElement) => {
      if (selectedDot) {
        selectedDot.classList.remove('selected');
      }
      selectedDot = dotElement;
      selectedDot.classList.add('selected');
    };
  
    // Function to update connection information
    const updateConnectionInfo = (info) => {
      document.getElementById('info-ip').textContent = `IP Address: ${info.ipAddress}`;
      document.getElementById('info-country').textContent = `Country: ${info.country}`;
      document.getElementById('info-checksum').textContent = `Checksum: ${info.checkSum}`;
      document.getElementById('info-protocol').textContent = `Protocol: ${info.protocol}`;
      document.getElementById('info-time').textContent = `Connection Time: ${info.time}`;
      document.getElementById('info-certificates').textContent = `Certificates: ${info.certificates}`;
      document.getElementById('info-portnumber').textContent = `Port Number: ${info.portNumber}`;
      document.getElementById('info-fragmentation').textContent = `Fragmentation: ${info.fragmentation}`;
      document.getElementById('info-classification').textContent = `Classification: ${info.classification}`;
      document.getElementById('recommendation').textContent = `Recommendation: ${info.recommendation}`;
  
    };
    // End trial
    setTimeout(endTrial, timeForTrial + timePerPacket);
  };
  
// handle end of the trial
const endTrial = () => {
  
  let inputs = [];
  for (let [k,v] of packetArray.entries()) {
   inputs.push({user : v.classification, advisor : v.recommendation, accepted : v.acceptedRecommendation});
  }
  handleInput(inputs);

}

// handle participant input
async function handleInput(data) {
  await fetch('/addTrial', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({input:data})
  }).then((response) => {
    console.log(response);
    if (response.ok) {
      window.location.href = '/rules';
    }
  })

}

// Execute the `start` function after a delay
setTimeout(startTrial, 1000);
