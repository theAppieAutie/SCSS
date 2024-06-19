// Generate a random IP address
export const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// Generate random CheckSum value
export const generateRandomCheckSum = () => {
  const values = ['Valid', 'Invalid', 'Zero'];
  return values[Math.floor(Math.random() * values.length)];
}

//  Generate random 24hr clock time
export const generateRandomTime = () => {
  let hours = Math.floor(Math.random() * 24);
  let minutes = Math.floor(Math.random() * 60);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours} : ${minutes}`;
}

// Generate a random country from a predefined list
export const generateRandomCountry = () => {
  const countries = [
    "Itarnia",
    "Dinlan",
    "Audadstan",
    "Norlandmar",
    "Crentotaninia",
    "Axphain",
    "The Republic of Hraintiasey",
    "Fisker",
    "Andri Caba",
    "United Nitreareia",
    "Isanuai Island",
    "Slandsprus",
    "Belgardia",
    "Hansland",
    "Adol",
    "The Democratic Republic of Eastern Barando",
    "Cogo",
    "Donovia",
    "Novoselic",
    "Limenisland"
];

  return countries[Math.floor(Math.random() * countries.length)];
};

// Generate a random packet size between 500 and 1500 bytes
export const generateRandomPacketSize = () => {
  return `${Math.floor(Math.random() * 1000) + 500} bytes`;
};

// Generate a random protocol from a predefined list
export const generateRandomProtocol = () => {
  const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS"];
  return protocols[Math.floor(Math.random() * protocols.length)];
};

// Generate a random connection time between 0 and 59 seconds
export const generateRandomConnectionTime = () => {
  return `${Math.floor(Math.random() * 60)} s`;
};

// Generate a random SSL/TLS certificate status
export const generateRandomCertificates = () => {
  const statuses = ["Valid", "Invalid", "Self-signed", "Expired"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
