// Obtener el elemento del juego
const gameObj = document.getElementById("game");

// Función que genera direcciones IP aleatorias
const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// Función que genera países de una lista
const generateRandomCountry = () => {
  const countries = ["España", "México", "Estados Unidos", "Reino Unido", "Francia", "Alemania", "Japón", "Brasil", "Australia"];
  return countries[Math.floor(Math.random() * countries.length)];
};

// Función que genera tamaños de paquetes aleatorios
const generateRandomPacketSize = () => {
  return `${Math.floor(Math.random() * 1000) + 500} bytes`; // Tamaño entre 500 y 1500 bytes
};

// Función que genera protocolos de una lista
const generateRandomProtocol = () => {
  const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS"];
  return protocols[Math.floor(Math.random() * protocols.length)];
};

// Función que genera un tiempo de conexión aleatorio
const generateRandomConnectionTime = () => {
  return `${Math.floor(Math.random() * 60)} s`; // Tiempo de conexión entre 0 y 59 segundos
};

// Función que genera un estado de certificados SSL/TLS aleatorio
const generateRandomCertificates = () => {
  const statuses = ["Válido", "Inválido", "Auto-firmado", "Caducado"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Variables para mantener el estado de la clasificación y los botones
let selectedClassification = null;
let selectedDotInfo = null;
const classificationButtons = {
  Trusted: document.getElementById("Trusted"),
  Neutral: document.getElementById("Neutral"),
  Hostile: document.getElementById("Hostile")
};

// Función para preseleccionar la clasificación
const setClassification = (classification) => {
  // Quitar la clase 'active' de todos los botones
  Object.values(classificationButtons).forEach(button => button.classList.remove('active'));

  // Añadir la clase 'active' al botón preseleccionado
  selectedClassification = classification;
  classificationButtons[classification].classList.add('active');
};

// Asignar eventos a los botones de clasificación
classificationButtons.Trusted.addEventListener("click", () => setClassification("Trusted"));
classificationButtons.Neutral.addEventListener("click", () => setClassification("Neutral"));
classificationButtons.Hostile.addEventListener("click", () => setClassification("Hostile"));

// Evento para el botón de confirmación
document.getElementById("confirmButton").addEventListener("click", () => {
  if (selectedClassification && selectedDotInfo) {
    // Asignar la clasificación al objeto del punto seleccionado
    selectedDotInfo.classification = selectedClassification;

    // Actualizar el color del punto en función de la clasificación
    const dotElement = selectedDotInfo.element;
    dotElement.classList.remove('trusted', 'neutral', 'hostile');

    if (selectedClassification === "Trusted") {
      dotElement.classList.add('trusted');
    } else if (selectedClassification === "Neutral") {
      dotElement.classList.add('neutral');
    } else if (selectedClassification === "Hostile") {
      dotElement.classList.add('hostile');
    }

    // Actualizar la sección de información con la clasificación confirmada
    document.getElementById("info-classification").textContent = `Clasificación: ${selectedClassification}`;

    // Imprimir en consola el objeto actualizado
    console.log("Clasificación confirmada:", selectedDotInfo);
  } else {
    console.log("No se seleccionó ninguna clasificación.");
  }
});

// Definir la función `start`
const start = () => {
  const numberOfDots = 20;
  const dotSize = 10; // Tamaño del punto
  const minDistance = 15; // Distancia mínima entre centros de los puntos
  const radius = gameObj.clientWidth / 2 - dotSize; // Radio del círculo, ajustado por el tamaño del punto
  let selectedDot = null; // Almacena el punto seleccionado actualmente

  // Crear y añadir el punto central sin evento de click
  const visualCenterDot = document.createElement('div');
  visualCenterDot.classList.add('center-dot');
  visualCenterDot.style.left = `${radius}px`;
  visualCenterDot.style.top = `${radius}px`;
  gameObj.appendChild(visualCenterDot);

  // Lista de puntos con el punto central (no seleccionable)
  let existingDots = [{ x: radius, y: radius, element: visualCenterDot }];

  // Generar puntos aleatorios
  for (let i = 0; i < numberOfDots; i++) {
    let isValid = false;
    let retries = 100; // Número máximo de intentos para encontrar una posición válida
    let x, y, distance, angle;

    // Intentar encontrar una posición válida
    while (!isValid && retries > 0) {
      angle = Math.random() * 2 * Math.PI;
      distance = Math.random() * radius;
      x = distance * Math.cos(angle) + radius; // Ajuste para el centro
      y = distance * Math.sin(angle) + radius; // Ajuste para el centro

      isValid = isValidPosition(x, y, existingDots, minDistance);
      retries--;
    }

    // Si la posición es válida, crear el punto y su objeto de datos
    if (isValid) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      gameObj.appendChild(dot);

      // Crear un objeto con propiedades únicas para cada punto
      const dotInfo = {
        ip: generateRandomIP(),
        country: generateRandomCountry(),
        packetSize: generateRandomPacketSize(),
        protocol: generateRandomProtocol(),
        connectionTime: generateRandomConnectionTime(),
        certificates: generateRandomCertificates(),
        classification: "Sin Clasificación", // Inicialmente sin clasificación
        element: dot // Añadir la referencia al elemento HTML
      };

      // Añadir el punto a la lista de puntos existentes
      existingDots.push({ x, y, element: dot, data: dotInfo });

      // Añadir el evento click para actualizar la sección de información y mantener la referencia
      dot.addEventListener('click', function() {
        updateConnectionInfo(dotInfo);
        selectedDotInfo = dotInfo; // Almacenar el objeto del punto seleccionado
        selectDot(this);
      });
    }
  }

  // Función para seleccionar un solo punto
  const selectDot = (dotElement) => {
    // Quitar la clase de "selected" del punto previamente seleccionado
    if (selectedDot) {
      selectedDot.classList.remove('selected');
    }

    // Establecer el nuevo punto como seleccionado y añadirle la clase "selected"
    selectedDot = dotElement;
    selectedDot.classList.add('selected');
  };

  // Función para actualizar la información de conexión
  const updateConnectionInfo = (info) => {
    document.getElementById('info-ip').textContent = `Dirección IP: ${info.ip}`;
    document.getElementById('info-country').textContent = `País: ${info.country}`;
    document.getElementById('info-packet').textContent = `Tamaño del Paquete: ${info.packetSize}`;
    document.getElementById('info-protocol').textContent = `Protocolo: ${info.protocol}`;
    document.getElementById('info-time').textContent = `Tiempo de Conexión: ${info.connectionTime}`;
    document.getElementById('info-certificates').textContent = `Certificados SSL/TLS: ${info.certificates}`;
    document.getElementById('info-classification').textContent = `Clasificación: ${info.classification}`;
  };
};

// Función para verificar si la posición es válida
const isValidPosition = (newX, newY, existingDots, minDistance) => {
  return existingDots.every(dot => {
    const xDistance = newX - dot.x;
    const yDistance = newY - dot.y;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance) >= minDistance;
  });
};

// Retrasar la ejecución de `start` por 1 segundo
setTimeout(start, 1000);