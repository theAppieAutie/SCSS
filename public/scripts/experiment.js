// import classes

import { PacketFactory, getLocationValues } from "./packet.js";
import { shuffleArray } from "./utils.js";


export class Experiment {
    constructor(data) {
        this.participant = data.participant;
        this.packetArray = data.packetArray ? data.packetArray.map((x) => x) : this.setPacketArray();
        this.trialData = data.trialData ? data.trialData.map((x) => x) : [];
    }

    addTrialInputToTrialData(trialInput) {
        this.trialData.push(trialInput);
    }

    setPacketArray() {
        let packets = [];
        let quadrants = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
        let types = ["hostile", "safe", "safe", "neutral", "neutral"];

        for (let q of quadrants) {
            for (let t of types) {
            let packet = PacketFactory(t);
            packet['location'] = getLocationValues(q);
            packets.push(packet);
            }
        }
        shuffleArray(packets);
        return packets.map((x) => x);    
    }

    
    isExperimentComplete() {
        return this.trialData.length >= 4;
    }

    saveState() {
        const state = {
            participant: this.participant,
            packetArray: this.packetArray,
            trialData: this.trialData,
        };
        sessionStorage.setItem('experimentState', JSON.stringify(state));
    }

    restoreState() {
        const state = sessionStorage.getItem('experimentState');
        if (state) {
            const parsedState = JSON.parse(state);
            this.participant = parsedState.participant;
            this.packetArray = parsedState.packetArray;
            this.trialData = parsedState.trialData;
        }
    }
}
//     startTrial() {
//         if(!this.participant.isExperimentComplete()) {
//             this.trial = new Trial(this.packetArray.packets);
//             setTimeout(this.runTrial(), 1000);
//         }
//     }

//     runTrial() {
//         let gameObj = document.getElementById('game');
//         let selectedDot = null;

//         const timeForTrial = config.trialLength * 60000;
//         const timePerPacket = timeForTrial / 20;

//         // Create and add the central point without click events
//         const visualCenterDot = document.createElement('div');
//         visualCenterDot.classList.add('center-dot');
//         gameObj.appendChild(visualCenterDot);


        
//         createPacketElement(this.packetArray);
        
//         this.participant.addTrial(trial);
//         sessionStorage.setItem('state', JSON.stringify(this));
//         if (this.participant.isExperimentComplete()) {
//             this.endExperiment();
//         } else {
//             this.endPhase();
//         }

//         // Define delay for packet release
//         function delay(milliseconds) {
//             return new Promise((resolve) => setTimeout(resolve, milliseconds));
//         }

//         // Create and display packets with delays
//         async function createPacketElement(packets) {
//             for (let packet of packets) {
//             const dot = document.createElement('div');
//             dot.classList.add('dot');
//             dot.style.left = `${packet.left}%`;
//             dot.style.top = `${packet.top}%`;
//             dot.style.animation = `dot-move ${timePerPacket}ms linear 1`;
//             gameObj.appendChild(dot);

//             // Add click event to update connection info and maintain reference
//             dot.addEventListener('click', function() {
//                 updateConnectionInfo(packet.data);
//                 selectedDotInfo = packet.data;
//                 dotElement = this;
//                 selectDot(this);
//             });
//             await delay(timePerPacket);
//             gameObj.removeChild(dot)
//             this.trial.addParticipantClassification(packet.data.classification)
//             }
//         }

//         // Function to select a single dot
//         const selectDot = (dotElement) => {
//             if (selectedDot) {
//             selectedDot.classList.remove('selected');
//             }
//             selectedDot = dotElement;
//             selectedDot.classList.add('selected');
//         };

//         // Function to update connection information
//         const updateConnectionInfo = (info) => {
//             document.getElementById('info-ip').textContent = `IP Address: ${info.ipAddress}`;
//             document.getElementById('info-country').textContent = `Country: ${info.country}`;
//             document.getElementById('info-checksum').textContent = `Checksum: ${info.checkSum}`;
//             document.getElementById('info-protocol').textContent = `Protocol: ${info.protocol}`;
//             document.getElementById('info-time').textContent = `Connection Time: ${info.time}`;
//             document.getElementById('info-certificates').textContent = `Certificates: ${info.certificates}`;
//             document.getElementById('info-portnumber').textContent = `Port Number: ${info.portNumber}`;
//             document.getElementById('info-fragmentation').textContent = `Fragmentation: ${info.fragmentation}`;
//             document.getElementById('info-classification').textContent = `Classification: ${info.classification}`;

//         };
//     }

//     endExperiment() {
//         // placeholder
//         window.location.href = '/login';
//         console.log("end of experiment");
//     }

//     endPhase(){
//         // placeholder
//         window.location.href = '/home';
//         console.log("end of phase");
//     }
// }