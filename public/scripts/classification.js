// Variable to hold the currently selected classification
let selectedClassification = null;

// Object containing classification button elements
const classificationButtons = {
  safe: document.getElementById("safe"),
  neutral: document.getElementById("neutral"),
  hostile: document.getElementById("hostile")
};

// Initialize classification buttons with click event listeners
export const initializeClassificationButtons = () => {
  classificationButtons.safe.addEventListener("click", () => setClassification("safe"));
  classificationButtons.neutral.addEventListener("click", () => setClassification("neutral"));
  classificationButtons.hostile.addEventListener("click", () => setClassification("hostile"));
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
export const confirmClassification = (dotElement, selectedDotInfo, advice=false) => {

  

  selectedClassification = advice ? selectedDotInfo.recommendation : selectedClassification;
  classificationButtons[selectedClassification].classList.remove('active');
  
  if ((selectedClassification && selectedDotInfo)) {

    // Update the corresponding dot element's class based on the classification
    
    dotElement.classList.remove('trusted', 'neutral', 'hostile');

    switch (selectedClassification) {
      case "safe":
        dotElement.classList.add('trusted');
        break;
      case "neutral":
        dotElement.classList.add('neutral');
        break;
      case "hostile":
        dotElement.classList.add('hostile');
        break;
    }

    // Update the classification field in the connection information panel
    document.getElementById('info-classification').textContent = `Classification: ${selectedClassification}`;
    
    // update packet data
    selectedDotInfo.classification = selectedClassification;
  } else {
    console.log("No classification selected.");
  }
};
