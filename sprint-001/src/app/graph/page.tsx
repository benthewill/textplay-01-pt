"use client";

import FlowWithProvider from '@/components/flow/FlowProvider';
import { TextUpdaterNode } from '@/components/flow/nodes/ShotNode';
import { CurrentUser } from '@/components/user/CurrentUser';
import React, {useCallback, useMemo} from 'react';
import ReactFlow, { addEdge, useEdgesState, useNodesState, MiniMap, Background, Controls, applyNodeChanges, applyEdgeChanges, Panel } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes:any[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    { id: '3', type: "textUpdater", position: { x: 0, y: 200 }, data: { value: "test" } }
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Graph() {
    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), [])

    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    const onNodesChange = useCallback(
        (changes:any) => setNodes((nds:any) => applyNodeChanges(changes, nds)),
        [setNodes]
    )

    const onEdgesChange = useCallback(
        (changes:any) => setEdges((eds:any) => applyEdgeChanges(changes, eds)),
        [setEdges]
    )

    const onConnect = useCallback(
        (connection:any) => setEdges((eds:any) => addEdge({...connection}, eds)),
        [setEdges],
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <FlowWithProvider
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="bg-zinc-100"
            >
                <Panel position="bottom-left" className="pl-12 pb-2">
                    <CurrentUser />
                    <h1 className=" text-5xl font-extrabold tracking-tight lg:text-5xl">Graph View</h1>
                    <h2 className=" text-3xl tracking-tight lg:text-3xl">01 - painting pretty.</h2>
                </Panel>
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1}/>
            </FlowWithProvider>
        </div>
    );
}