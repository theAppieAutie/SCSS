//  imports
import { Experiment } from "./experiment.js";



document.addEventListener('DOMContentLoaded', () => {
    let experiment = sessionStorage.getItem('experimentState');
    const username = sessionStorage.getItem('username');
    console.log(experiment)
    if (!experiment) {
        experiment = new Experiment();
        experiment.addId(username);
        experiment.saveState();
    } 
    console.log(experiment)
    

    
    if (window.location.pathname === '/game') {
        if (experiment.isExperimentComplete()) {
            // Handle experiment complete
        } else {
            // Start the trial
            startTrial(experiment);
        }
    } else if (window.location.pathname === '/home') {
        document.getElementById('goButton').addEventListener('click', () => {
            experiment.saveState();
            window.location.href = '/game';
        });
    }


})