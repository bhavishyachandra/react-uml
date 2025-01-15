import React, { useState, useRef, useEffect } from "react";
import { ApollonEditor, UMLModel, ApollonOptions, ApollonMode } from "@ls1intum/apollon";

const App2 = () => {
    const editorContainer = useRef(null);
    const [editor, setEditor] = useState<ApollonEditor | null>(null);
    const [diagramData, setDiagramData] = useState<UMLModel | null>(null);
    const [plantUML, setPlantUML] = useState<string>("");

    useEffect(() => {
        if (editorContainer.current) {
            const options: ApollonOptions = {
                mode: ApollonMode.Modelling,
                model: diagramData || {
                    type: "ClassDiagram",
                    elements: {},
                    relationships: {},
                    interactive: { elements: {}, relationships: {} },
                    assessments: {},
                    size: { width: 1000, height: 1000 },
                    version: "3.0.0",
                },
            };

            const apollonEditor = new ApollonEditor(editorContainer.current, options);
            setEditor(apollonEditor);

            return () => {
                setTimeout(() => {
                    apollonEditor.destroy();
                }, 0);
            };
        }
    }, [diagramData]);

    const saveDiagram = () => {
        if (editor) {
            const model = editor.model;
            setDiagramData(model);
            const modelDataJson = JSON.stringify(model);
            localStorage.setItem('apollon-diagram', modelDataJson);
            console.log(modelDataJson); // Log to console
            alert("Diagram saved!");
        }
    };

    const loadDiagram = () => {
        const savedModel = localStorage.getItem('apollon-diagram');
        if (editor && savedModel) {
            const model = JSON.parse(savedModel);
            editor.model = model;
            setDiagramData(model);
            alert("Diagram loaded!");
        }
    };

    const convertToPlantUML = () => {
        const savedModel = localStorage.getItem('apollon-diagram');
        if (savedModel) {
            const model = JSON.parse(savedModel);
            const plantUMLCode = generatePlantUML(model);
            console.log(plantUMLCode);
            setPlantUML(plantUMLCode);
        }
    };

    const generatePlantUML = (model: UMLModel): string => {
        let plantUML = "@startuml\n";

        // Convert elements
        for (const elementId in model.elements) {
            const element = model.elements[elementId];
            if (element.type === "Class" || element.type === "AbstractClass" || element.type === "Interface") {
                const plantUmlText = element.type === "AbstractClass" ? "abstract class" : element.type;
                plantUML += `${plantUmlText} ${element.name} {\n`;
                if ('attributes' in element) {
                    element.attributes.forEach(attrId => {
                        const attr = model.elements[attrId];
                        plantUML += `  ${attr.name}\n`;
                    });
                }
                if ('methods' in element) {
                    element.methods.forEach(methodId => {
                        const method = model.elements[methodId];
                        plantUML += `  ${method.name}\n`;
                    });
                }
                plantUML += "}\n";
            }
        }

        // Convert relationships
        for (const relationshipId in model.relationships) {
            const relationship = model.relationships[relationshipId];
            const source = model.elements[relationship.source.element];
            const target = model.elements[relationship.target.element];
            plantUML += `${source.name} --> ${target.name}\n`;
        }

        plantUML += "@enduml";
        return plantUML;
    };

    return (
        <div>
            <h1>Apollon Editor Example in App2</h1>
            <div
                ref={editorContainer}
                style={{
                    width: "100%",
                    height: "500px",
                    border: "1px solid #ddd",
                    marginBottom: "20px",
                }}
            ></div>
            <button onClick={saveDiagram} style={{ marginRight: "10px" }}>
                Save Diagram
            </button>
            <button onClick={loadDiagram} disabled={!localStorage.getItem('apollon-diagram')}>
                Load Diagram
            </button>
            <button onClick={convertToPlantUML} style={{ marginLeft: "10px" }}>
                Convert to PlantUML
            </button>
            {plantUML && (
                <div style={{ marginTop: "20px" }}>
                    <h2>PlantUML Code</h2>
                    <pre>{plantUML}</pre>
                </div>
            )}
        </div>
    );
};

export default App2;
