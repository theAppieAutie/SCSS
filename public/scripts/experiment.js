// import classes

// import { PacketFactory, getLocationValues } from "./packet.js";
// import { shuffleArray } from "./utils.js";
const {PacketFactory, getLocationValues} = require("./packet.js");
// const { shuffleArray } = require("./utils.js")


class Experiment {
    constructor() {
        if (Experiment.instance) {
            return Experiment.instance;
        }
        this.participant = null;
        this.condition = null;
        this.packetArray = this.setPacketArray();
        this.testTrial = [];
        this.trialData = [];
        this.scalesData = {'preExp' : {},
                            'midExp' : {},
                            'postExp' : {}};

        Experiment.instance = this;
    }

    static getInstance() {
        if (!Experiment.instance) {
            Experiment.instance = new Experiment();
        }
        return Experiment.instance;
    }

    init(participant, condition) {
        this.participant = participant;
        this.condition = condition;
    }

    addTestTrial(testTrial) {
        this.testTrial.push(testTrial);
    }

    addTrialInputToTrialData(trialInput) {
        this.trialData.push(trialInput);
    }
    
    addScalesData(category, scale, data) {
        this.scalesData[category][scale] = data;
    }

    setPacketArray() {
        let packets = [];
        let quadrants = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
        let types = ["hostile", "hostile", "safe", "safe", "neutral", "neutral"];

        for (let q of quadrants) {
            for (let t of types) {
            let packet = PacketFactory(t);
            packet['location'] = getLocationValues(q);
            packets.push(packet);
            }
        }
        this.shuffleArray(packets);
        return packets.map((x) => x);    
    }

    
    getStageOfExperiment() {
        if (this.testTrial.length < 1) {
            return "test";
        } else if (this.trialData.length < 2) {
            return "nextTrial";
        } else if (this.trialData.length === 2) {
            return "midExperiment";
        } else if (this.trialData.length === 4) {
            return "end";
        } else {
            console.log("error");
            return "error";
        }
        
    }

    // Fisher-Yates array shuffle algortihm
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

}

module.exports = Experiment;
