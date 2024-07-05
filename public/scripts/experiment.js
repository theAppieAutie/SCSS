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
        this.packetArray = this.setPacketArray();
        this.trialData = [];

        Experiment.instance = this;
    }

    static getInstance() {
        if (!Experiment.instance) {
            Experiment.instance = new Experiment();
        }
        return Experiment.instance;
    }

    init(participant) {
        this.participant = participant;
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
        this.shuffleArray(packets);
        return packets.map((x) => x);    
    }

    
    isExperimentComplete() {
        return this.trialData.length >= 4;
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
