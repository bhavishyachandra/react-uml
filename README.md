# React UML

[![GitHub Workflow Status](https://github.com/bhavishyachandra/react-uml/actions/workflows/production.yml/badge.svg)](https://github.com/bhavishyachandra/react-uml/actions/workflows/production.yml)

This project demonstrates a React application that integrates the Apollon editor for creating UML diagrams. It allows you to save and load diagrams, and convert them to PlantUML format.

### Deployment

This project is deployed to Vercel. You can access the live application at [https://react-uml.vercel.app/](https://react-uml.vercel.app/).

## Features

- Create UML diagrams using the Apollon editor
- Save and load diagrams from localStorage
- Convert diagrams to PlantUML format
- Copy PlantUML code to clipboard

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/bhavishyachandra/react-uml.git
   cd react-uml
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

### Running the Application

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`.

### Usage

- Use the Apollon editor to create UML diagrams.
- Click the "Save Diagram" button to save the diagram to localStorage.
- Click the "Load Diagram" button to load the diagram from localStorage.
- Click the "Convert to PlantUML" button to convert the diagram to PlantUML format.
- Copy the PlantUML code by clicking the "Copy" button next to the "PlantUML Code" heading.

### Project Structure

- `App2.tsx`: Main component that integrates the Apollon editor and provides functionality to save, load, and convert diagrams.
- `index.jsx`: Entry point of the application.
- `SaveRestore.tsx`: Component for saving and restoring diagrams using React Flow.
- `App.tsx`: Another main component that integrates React Flow for drag-and-drop functionality.

### License

This project is licensed under the MIT License.
