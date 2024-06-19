# 📡 SCSS (Security Control Simulation System)

## 📄 About
This program simulates four different types of advisory systems to evaluate how people respond to different types of advice in cyber defense tasks. Participants are randomly assigned to one of the following four experimental conditions:

1. **No Advisor (Control)**
2. **AI Advisor**
3. **Computer Advisor**
4. **Human Expert Advisor**

Participants are tasked as cyber defense experts to protect a network by classifying incoming requests as "Trusted," "Neutral," or "Hostile" based on provided rules. Misclassifications may lead to a security breach or prevent staff from accessing essential data.

The system utilizes a Battlespace Management Task (Hodgetts et al., 2015), adapted to fit the terminology of a cyber defense task. The network is at the center of the radar screen, surrounded by incoming internet traffic represented by radar dots. Participants must click on these dots to view their parameters (e.g., country of origin, packet size) and classify them accordingly.

**Advisor Panel**:  
Participants in advisory conditions receive advice on how to classify each data point via an additional panel, depending on their assigned advisor (AI, computer, or human).

**Eye Tracking**:  
Participants' eye movements will be recorded to monitor gaze patterns and fixation points during decision-making. This provides insights into how frequently and for how long they refer to the advisor's recommendations.

## 🎯 Aim
The objective of this experiment is to evaluate how people respond to advice from AI, computer, or human advisors and the impact of this advice on classification accuracy.

## 🔧 System Features

1. **Four Advisory Systems**:  
   Simulates four different types of advisors with varying advisory panels and recommendations.

2. **Radar Display**:  
   A visual representation of incoming network traffic for classification.

3. **Eye Tracking Integration**:  
   Analyzes participants' gaze patterns during decision-making tasks.

## 🛠️ Prerequisites
Ensure you have Node.js and npm 📦 installed on your system. Download and install them from [Node.js official website](https://nodejs.org/).

## 🚀 Installing

1. 🖥️ Clone the repository:  
   `git clone https://github.com/nestorvillap/SCSS.git`

2. 📁 Navigate to the project folder:  
   `cd SCSS`

3. ⬇️ Install dependencies:  
   `npm install`

## 🌍 Environment Setup

1. 📄 Create a `.env` file in the project's root directory.

2. 🔑 Add the following line to set your `SESSION_SECRET`:

SESSION_SECRET=your_secret_here
Replace `your_secret_here` with a unique, strong value.

3. 🔄 To make the environment variables accessible, type:

export $(cat .env | xargs)

## 🖥️ Usage

1. 🔥 Start the server:  
`npm run devStart`

2. 🌐 Open a browser and go to the configured port in `server.js`.

3. 🧭 Follow the on-screen instructions to engage with the simulation and answer the questionnaires.
