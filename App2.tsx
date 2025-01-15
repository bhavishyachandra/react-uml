import React, { useState, useRef, useEffect } from "react";
import { ApollonEditor, UMLModel, ApollonOptions, ApollonMode } from "@ls1intum/apollon";

const App2 = () => {
    const editorContainer = useRef(null);
    const [editor, setEditor] = useState<ApollonEditor | null>(null);
    const [diagramData, setDiagramData] = useState<UMLModel | null>(null);

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
                apollonEditor.destroy();
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
        </div>
    );
};

export default App2;
