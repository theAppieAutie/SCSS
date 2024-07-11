// import dataGenerator functions
const { generateRandomCheckSum, generateRandomTime, generateRandomIP, generateRandomCountry } = require('./dataGenerators.js');

// create overall packet - parameter = type of packet [hostile, safe , suspect]
function PacketFactory(type) {
    let packet = {
        checkSum : generateRandomCheckSum(),
        time : generateRandomTime(),
        ipAddress : generateRandomIP(),
        country : generateRandomCountry(),
        classification: 'unclassified',
        packetType : type,
    };
    let relevantInformation = getRelevantInformation(type);
    for (let key in relevantInformation) {
        packet[key] = relevantInformation[key];
    }
    return packet;
} 

// create relevant information according to the type of packet and return the object
function getRelevantInformation(type) {
    let values = {
        portNumber : {safe: 80, hostile: 4444},
        protocol : {safe: 'HTTPS', hostile: 'ICMP'},
        fragmentation : {safe: 'No', hostile: 'Yes'},
        certificates : {safe: 'Valid', hostile: 'Expired'}
    };
    let keys = Object.keys(values);
    keys = keys.sort(() => Math.random() - 0.5);
    let relevantInfo = {};
    switch (type) {
        case 'safe':
            keys.forEach(key => relevantInfo[key] = values[key].safe);
            break;
        case 'neutral':
            let numHostileMin1 = Math.floor(Math.random() * 2) + 1;
            keys.forEach(key => relevantInfo[key] = numHostileMin1-- > 0 ? values[key].hostile : values[key].safe);

            break;
        case 'hostile':
            let numHostileMin3 = Math.floor(Math.random() * 2) + 3;
            keys.forEach(key => relevantInfo[key] = numHostileMin3-- > 0 ? values[key].hostile : values[key].safe);
            break;
    
        default:
            break;
    }
    return relevantInfo;
}

function getLocationValues(quadrant) {
    let top;
    let left;
    const horizontalEdge = Math.random() < 0.5;
    switch (quadrant) {
        case "topLeft":
            if (horizontalEdge) {
                top = 0;
                left = Math.floor(Math.random() * 51);
            } else {
                top = Math.floor(Math.random() * 51);
                left = 0;
            }
            break;
        case "topRight":
            if (horizontalEdge) {
                top = 0;
                left = Math.floor(Math.random() * 50) + 51;
            } else {
                top = Math.floor(Math.random() * 51);
                left = 100;
            }
            break;
        case "bottomLeft":
            if (horizontalEdge) {
                top = 100;
                left = Math.floor(Math.random() * 51);
            } else {
                top = Math.floor(Math.random() * 50) + 51;
                left = 0;
            }
            break;
        case "bottomRight":
            if (horizontalEdge) {
                top = 100;
                left = Math.floor(Math.random() * 50) + 51;
            } else {
                top = Math.floor(Math.random() * 50) + 51;
                left = 100;
            }
            break;
        default:
            break;
    }
    return [left, top]
}

module.exports = {
    PacketFactory,
    getLocationValues
};