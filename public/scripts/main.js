//  imports
import { Experiment } from "./experiment.js";



document.addEventListener('DOMContentLoaded', () => {
    let experiment = sessionStorage.getItem('experimentState');
    
    if (!experiment) {
        const participant = sessionStorage.getItem('username');
        let data = {participant:participant}
        
        experiment = new Experiment(data);
    } else {
        
        experiment = new Experiment(JSON.parse(experiment));
        
    }

    let trial = sessionStorage.getItem("trial");
    if (sessionStorage.getItem("trial")) {
        experiment.addTrialInputToTrialData(JSON.parse(trial));
        experiment.saveState();
        console.log(experiment.isExperimentComplete());
        console.log(experiment.trialData.length);
    }
    
    

    
    if (window.location.pathname === '/game') {
        if (experiment.isExperimentComplete()) {
            // Handle experiment complete
            console.log("experiment complete")
        } else {
            // Start the trial
            startTrial(experiment);
        }
    } else if (window.location.pathname === '/home') {
        document.getElementById('goButton').addEventListener('click', () => {
            experiment.saveState();
            if (experiment.isExperimentComplete()) {
                console.log("end of experiment");
            } else {
                window.location.href = '/game';
            }
        });
    }


})