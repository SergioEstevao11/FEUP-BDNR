import React, { useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

const nodeStyle = {
    backgroundColor: '#108768', 
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}   


const initialNodes = [
    { id: '1', data: { label: '-' }, position: { x: 500, y: 100 }, style: nodeStyle },
    { id: '2', data: { label: 'Node 2' }, position: { x: 500, y: 200 }, style: nodeStyle },
  ];
  
const initialEdges = [{ id: 'e1-2', source: '1', target: '2'}];

export default function NodeView() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [nodeName, setNodeName] = useState('Node 1');
    const proOptions = { hideAttribution: true };

    useEffect(() => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === '1') {
              // it's important that you create a new object here
              // in order to notify react flow about the change
              node.data = {
                ...node.data,
                label: nodeName,
              };
            }
    
            return node;
          })
        );
    }, [nodeName, setNodes]);

    return (
        <div className='w-full h-[600px] bg-gray-100'>
            <ReactFlow  proOptions={proOptions} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} minZoom={0.2} maxZoom={2} attributionPosition="bottom-left"/>
        </div>
    );
}
