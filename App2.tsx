import React, { useState, useRef, useEffect } from "react";
import { ApollonEditor, UMLModel, ApollonOptions, ApollonMode, UMLDiagramType } from "@ls1intum/apollon";

const App2 = () => {
    const editorContainer = useRef<HTMLDivElement>(null); // Type the ref correctly
    const [editor, setEditor] = useState<ApollonEditor | null>(null);
    const [savedDiagram, setSavedDiagram] = useState<UMLModel | null>(null);
    const [diagramData, setDiagramData] = useState<UMLModel | null>(null);
    const [plantUML, setPlantUML] = useState<string>("");
    const [diagramType, setDiagramType] = useState<UMLDiagramType>("ClassDiagram");
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        if (editorContainer.current) {
            const options: ApollonOptions = {
                type: diagramType,
                model: savedDiagram || {
                    type: diagramType,
                    elements: {},
                    relationships: {},
                    interactive: { elements: {}, relationships: {} },
                    assessments: {},
                    size: { width: editorContainer.current.clientWidth, height: editorContainer.current.clientHeight },
                    version: "3.0.0",
                },
            };

            const apollonEditor = new ApollonEditor(editorContainer.current, options);
            setEditor(apollonEditor);

            return () => {
                if (isMounted.current) {
                    apollonEditor.destroy();
                }
            };
        }

        return () => {
            isMounted.current = false;
        };
    }, [savedDiagram, diagramType]);

    useEffect(() => {
        // Automatically load diagram if there is one in localStorage
        const savedModel = localStorage.getItem('apollon-diagram');
        let modelInLocalStorage: UMLModel | null;
        if (savedModel) {
            modelInLocalStorage = JSON.parse(savedModel) as UMLModel;
            setSavedDiagram(modelInLocalStorage);
            setPlantUML(generatePlantUML(modelInLocalStorage));
        }
    }, []);

    useEffect(() => {
        if (diagramData) {
            const plantUMLCode = generatePlantUML(diagramData);
            setPlantUML(plantUMLCode);
        }
    }, [diagramData]);

    useEffect(() => {
        if (editor) {
            editor.subscribeToModelDiscreteChange(model => {
                setDiagramData(model);
            });
        }
    }, [editor]);

    const saveDiagram = () => {
        if (editor) {
            const model = editor.model;
            const modelDataJson = JSON.stringify(model);
            localStorage.setItem('apollon-diagram', modelDataJson);
            console.log(modelDataJson); // Log to console
            alert("Diagram saved! Check console for the model data in json format.");
        }
    };

    const loadDiagram = () => {
        const savedModel = localStorage.getItem('apollon-diagram');
        if (editor && savedModel) {
            const model = JSON.parse(savedModel);
            editor.model = model;
            setSavedDiagram(model);
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
            switch (element.type) {
                case "Class":
                case "AbstractClass":
                case "Interface":
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
                    break;
                case "Enumeration":
                    plantUML += `enum ${element.name} {\n`;
                    if ('attributes' in element) {
                        element.attributes.forEach(attrId => {
                            const attr = model.elements[attrId];
                            plantUML += `  ${attr.name}\n`;
                        });
                    }
                    plantUML += "}\n";
                    break;
                default:
                    break;
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

    const handleDiagramTypeChange = (event) => {
        setDiagramType(event.target.value as UMLDiagramType);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(plantUML);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div style={{ flex: 1, padding: "10px" }}>
                <h1>React UML Converter</h1>
                <div>
                    <label htmlFor="diagramType">Diagram Type: </label>
                    <select id="diagramType" value={diagramType} onChange={handleDiagramTypeChange}>
                        <option value="Flowchart">Flowchart</option>
                        <option value="ClassDiagram">Class Diagram</option>
                        <option value="ObjectDiagram">Object Diagram</option>
                        <option value="ActivityDiagram">Activity Diagram</option>
                        <option value="UseCaseDiagram">Use Case Diagram</option>
                        <option value="CommunicationDiagram">Communication Diagram</option>
                        <option value="ComponentDiagram">Component Diagram</option>
                        <option value="DeploymentDiagram">Deployment Diagram</option>
                        <option value="PetriNet">Petri Net</option>
                        <option value="ReachabilityGraph">Reachability Graph</option>
                        <option value="SyntaxTree">Syntax Tree</option>
                        <option value="BPMN">BPMN</option>
                    </select>
                </div>
                <div
                    ref={editorContainer}
                    style={{
                        width: "100%",
                        height: "calc(100% - 100px)",
                        border: "1px solid #ddd",
                        marginBottom: "20px",
                    }}
                ></div>
            </div>
            <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ marginBottom: "20px" }}>
                    <button onClick={saveDiagram} style={{ marginRight: "10px" }}>
                        Save Diagram
                    </button>
                    <button onClick={loadDiagram} disabled={!localStorage.getItem('apollon-diagram')}>
                        Load Diagram
                    </button>
                    <button onClick={convertToPlantUML} style={{ marginLeft: "10px" }} disabled={diagramType !== "ClassDiagram"}>
                        Convert to PlantUML
                    </button>
                </div>
                {plantUML && (
                    <div style={{ width: "100%", position: "relative", height: "100%" }}>
                        <h2>
                            PlantUML Code
                            <button onClick={copyToClipboard} style={{ marginLeft: "10px" }}>
                                Copy
                            </button>
                        </h2>
                        <textarea value={plantUML} readOnly style={{ width: "100%", height: "calc(100% - 50px)" }} />
                    </div>
                )}
                {diagramType !== "ClassDiagram" && (
                    <p style={{ color: "red" }}>Note: Saving to UML only works with Class Diagrams for now.</p>
                )}
            </div>
        </div>
    );
};

export default App2;
