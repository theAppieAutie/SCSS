// Variable to hold the currently selected classification
let selectedClassification = null;

// Object containing classification button elements
const classificationButtons = {
  Trusted: document.getElementById("Trusted"),
  Neutral: document.getElementById("Neutral"),
  Hostile: document.getElementById("Hostile")
};

// Initialize classification buttons with click event listeners
export const initializeClassificationButtons = () => {
  classificationButtons.Trusted.addEventListener("click", () => setClassification("Trusted"));
  classificationButtons.Neutral.addEventListener("click", () => setClassification("Neutral"));
  classificationButtons.Hostile.addEventListener("click", () => setClassification("Hostile"));
};

// Set the currently selected classification and update button states
export const setClassification = (classification) => {
  // Remove 'active' class from all buttons
  Object.values(classificationButtons).forEach(button => button.classList.remove('active'));

  // Set the new classification and add 'active' class to the selected button
  selectedClassification = classification;
  classificationButtons[classification].classList.add('active');
};

// Confirm the classification for the selected point
export const confirmClassification = (selectedDotInfo) => {
  if (selectedClassification && selectedDotInfo) {
    // Assign the selected classification to the data object
    selectedDotInfo.classification = selectedClassification;

    // Update the corresponding dot element's class based on the classification
    const dotElement = selectedDotInfo.element;
    dotElement.classList.remove('trusted', 'neutral', 'hostile');

    switch (selectedClassification) {
      case "Trusted":
        dotElement.classList.add('trusted');
        break;
      case "Neutral":
        dotElement.classList.add('neutral');
        break;
      case "Hostile":
        dotElement.classList.add('hostile');
        break;
    }

    // Update the classification field in the connection information panel
    document.getElementById('info-classification').textContent = `Classification: ${selectedClassification}`;
  } else {
    console.log("No classification selected.");
  }
};
