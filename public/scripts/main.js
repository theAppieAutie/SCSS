// Import functions from other modules (assuming an ES6 environment)
import { initializeClassificationButtons, confirmClassification } from './classification.js';
import { shuffleArray } from './utils.js';
import { PacketFactory, getLocationValues } from './packet.js';
import { config } from './config.js';

// Function to change game styles based on the group
const adjustGameStyles = () => {
  const game = document.getElementById("game");
  game.style.maxWidth = "60vw";
  game.style.maxHeight = "60vh";
  game.style.marginRight = "1vw";
};

// Apply style adjustments based on the user's group
// const applyGroupStyles = () => {
//   if (userGroup === "noAdvisor") {
//     adjustGameStyles();
//   }
//   // Add conditions for other groups if needed
// };

// Execute `applyGroupStyles` when the page is fully loaded
// document.addEventListener("DOMContentLoaded", applyGroupStyles);
document.addEventListener("DOMContentLoaded", adjustGameStyles);

// Initialize variables and elements
const gameObj = document.getElementById("game");
const panelsElement = document.getElementsByClassName("panels")[0];
let selectedDotInfo = null;
let dotElement = null;

if (!config.packetInfoOnLeft) {
  panelsElement.style.flexDirection = "row-reverse";
}



// Initialize classification buttons
initializeClassificationButtons();

// Attach confirmation event
document.getElementById("confirmButton").addEventListener("click", () => confirmClassification(dotElement, selectedDotInfo));



// Define the `start` function to initialize the game
const start = () => {
  let selectedDot = null;

  const timeForTrial = config.trialLength * 60000;
  const timePerPacket = timeForTrial / 20;

  // Create and add the central point without click events
  const visualCenterDot = document.createElement('div');
  visualCenterDot.classList.add('center-dot');
  gameObj.appendChild(visualCenterDot);

  // set up packets and location starts
  let packets = [];
  let quadrants = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
  let types = ["hostile", "safe", "safe", "neutral", "neutral"];

  for (let q of quadrants) {
    for (let t of types) {
      let packet = PacketFactory(t);
      let [left, top] = getLocationValues(q);
      packets.push({left, top, data: packet });
    }
  }
  
  // mix up order of packets
  shuffleArray(packets);
  
  createPacketElement(packets);

 // Define delay for packet release
  function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  // Create and display packets with delays
  async function createPacketElement(packets) {
    for (let packet of packets) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.style.left = `${packet.left}%`;
      dot.style.top = `${packet.top}%`;
      dot.style.animation = `dot-move ${timePerPacket}ms linear 1`;
      gameObj.appendChild(dot);

      // Add click event to update connection info and maintain reference
      dot.addEventListener('click', function() {
        updateConnectionInfo(packet.data);
        selectedDotInfo = packet.data;
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

  };
  // End trial
  setTimeout(endTrial, timeForTrial);
};

// handle end of the trial
const endTrial = () => {
  window.location.href = './home';
}

// Execute the `start` function after a delay
setTimeout(start, 1000);
