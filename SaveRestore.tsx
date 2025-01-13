import { addEdge, Background, Panel, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import '@xyflow/react/dist/style.css';


const getNodeId = () => `randomnode_${+new Date()}`;

const flowKey = 'example-flow';

const initialNodes = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: -50 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 0, y: 50 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const SaveRestore = ({ onSaveFlow }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );
    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            const flowJson = JSON.stringify(flow, null, 2);
            console.log(flowJson);
            localStorage.setItem(flowKey, JSON.stringify(flow));
            onSaveFlow(flowJson);
        }
    }, [rfInstance, onSaveFlow]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(flowKey));
            onSaveFlow(JSON.stringify(flow, null, 2));

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [setNodes, setViewport]);

    const onAdd = useCallback(() => {
        const newNode = {
            id: getNodeId(),
            data: { label: 'Added node' },
            position: {
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
            },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            fitView
            fitViewOptions={{ padding: 2 }}
            style={{ backgroundColor: "#F7F9FB" }}
        >
            <Background />
            <Panel position="top-right">
                <button onClick={onSave}>save</button>
                <button onClick={onRestore}>restore</button>
                <button onClick={onAdd}>add node</button>
            </Panel>
        </ReactFlow>
    );
};

export default SaveRestore;