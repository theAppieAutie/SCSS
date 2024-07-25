// import classes


const {PacketFactory, getLocationValues} = require("./packet.js");

class Experiment {
    constructor() {
        this.participant = null;
        this.condition = null;
        this.group = null;
        this.censoredInfo = null;
        this.packetArray = null;
        this.testTrial = [];
        this.trialData = [];
        this.scalesData = {'preExperiment' : {},
                            'midExperiment' : {},
                            'postExperiment' : {}};
        this.stage = 'test';
        this.feedback;

        
    }

    init(participant, condition, group, censoredInfo) {
        this.participant = participant;
        this.condition = condition;
        this.group = group;
        this.censoredInfo = censoredInfo;
        this.packetArray = this.setPacketArray();
    }

    addTestTrial(testTrial) {
        this.testTrial.push(testTrial);
    }

    addTrialInputToTrialData(trialInput) {
        this.trialData.push(trialInput);
    }

    getTrialDataArrayLength() {
        return this.trialData.length;
    }
    
    addScalesData(category, scale, data) {
        this.scalesData[category][scale] = data; 
    }

    addFeedback(feedback) {
        this.feedback = feedback;
    }

    setPacketArray() {
        let packets = [];
        let quadrants = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
        let types = ["neutral", "neutral", "safe", "safe", "hostile","hostile"];
 
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

    getCurrentStage() {
        return this.stage
    }

    setCurrentStage() {
        this.stage = this.getNextStage();
    }
    getNextStage() {
        if (this.stage === 'test') {
            return "preExperiment";
        } else if (this.stage === 'preExperiment') {
            return "trial1";
        } else if (this.stage === 'trial1') {
            return "trial2";
        } else if (this.stage === 'trial2') {
            return "midExperiment";
        } else if (this.stage === 'midExperiment') {
            return "trial3";
        } else if (this.stage === 'trial3') {
            return "trial4";
        } else if (this.stage === 'trial4') {
            return "postExperiment";
        } else if (this.stage === "postExperiment" ) {
           return "debrief";
        } else {
            return "error"
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
