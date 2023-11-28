"use client";

import FlowWithProvider from '@/components/flow/FlowProvider';
import { ShotNode } from '@/components/flow/nodes/shotNode';
import { ShotInput } from '@/components/shot/ShotInput';
import { ShotSub } from '@/components/shot/ShotSub';
import { CurrentUser } from '@/components/user/CurrentUser';
import { addConnection, getAllShotsByScene } from '@/lib/db/shots';
import { initEdges, initNodes } from '@/utils/initNodes';
import { Button, ScrollShadow } from '@nextui-org/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ReactFlow, { addEdge, useEdgesState, useNodesState, MiniMap, Background, Controls, applyNodeChanges, applyEdgeChanges, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { useEffectOnce } from 'usehooks-ts';

const nodeTypes = {
    shotNode: ShotNode
}

export default function Graph({params}: {params: {
    sequenceID:string, sceneID:string
}}) {
    const queryClient = useQueryClient()

    const {mutate:addTargetShot} = useMutation({
        mutationFn: ({sourceHandleID, targetID}:any) => {
            return addConnection(sourceHandleID, targetID)
        }
    })

    // const {mutate:addShot} = useMutation({
    //     mutationFn: () => {
            
    //     }
    // })

    const {data, isLoading, isError, refetch, isRefetching, isFetching} =  useQuery({
        queryFn: () => getAllShotsByScene(params.sequenceID, params.sceneID),
        queryKey: ["indexShot"],
        notifyOnChangeProps: "all",
        refetchOnWindowFocus: false
    })

    const {data:initialNodes} = useQuery({
        queryFn: () => initNodes(data),
        queryKey: ['indexed', 'nodes'],
        enabled: !!data
    })

    const {data:initialEdges} = useQuery({
        queryFn: () => initEdges(data),
        queryKey: ['indexed', 'edges'],
        enabled: !!data
    })

    // const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), [])

    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [selectedShot, setSelectedShot] = useState('')

    const onNodesChange = useCallback(
        (changes:any) => setNodes((nds:any) => applyNodeChanges(changes, nds)),
        [setNodes]
    )

    const onEdgesChange = useCallback(
        (changes:any) => {
            setEdges((eds:any) => {
                console.log(eds);
                return applyEdgeChanges(changes, eds)
            })
            console.log(changes);
        },
        [setEdges]
    )

    const onConnect = useCallback(
        (connection:any) => {
            console.log(connection);
            addTargetShot({sourceHandleID: connection.sourceHandle, targetID: connection.target})
            setEdges((eds:any) => {
                console.log(eds);
                return addEdge({...connection}, eds)
            })
        },
        [addTargetShot, setEdges],
    );

    const onNodeClick = (event:any, node:any) => {
        setSelectedShot(node.id)
    }

    const onPaneClick = (event:any, node:any) => {
        setSelectedShot('')
    }
    
    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ["shot", selectedShot]})
        queryClient.refetchQueries({queryKey: ["shot", selectedShot]})
    }, [queryClient, selectedShot])

    useEffect(() => {
        if (initialNodes) {
            setNodes(initialNodes)
        }
        if (initialEdges) {
            setEdges(initialEdges)
            console.log(initialEdges);
        }
    }, [initialEdges, initialNodes, setEdges, setNodes])

    console.log(initialEdges);

    return (
        <>
        <div style={{ width: '100vw', height: '100vh' }} className='flex flex-row border-y-5 border-l-5 border-zinc-500 border-double'>

            <div className="w-full" >
                <FlowWithProvider
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    className="bg-gradient-to-b from-zinc-600 to-zinc-800"
                >
                    <Panel position="top-left" className="">
                        <CurrentUser />
                    </Panel>
                    <Panel position='top-right'>
                        <p className=" text-end text-xl tracking-tight leading-tight">
                            01 - painting pretty.  <br/>
                            Graph View
                        </p>
                    </Panel>
                    <Panel position='bottom-center'>
                        <p className=' font-thin'><span className=' font-extrabold'>Shot ID:</span> {selectedShot ? selectedShot : "None Selected"}</p>
                        <p className=' font-thin'><span className=' font-extrabold'>Sequence ID:</span> 1f8ymj4x3xacnoi</p>
                        <p className=' font-thin'><span className=' font-extrabold'>Scene ID:</span> o3kafqorvlk7qj0</p>
                    </Panel>
                    <Controls />
                    <Background gap={12} size={1}/>
                </FlowWithProvider>
            </div>
            <div className=" w-2/3 flex flex-col border-x-5 border-zinc-500 border-double">
                <div className=' max-h-[60vh]'>
                    <ScrollShadow size={20} className="h-[60vh]">
                        <ShotSub key={selectedShot} shotID={selectedShot} />
                    </ScrollShadow>
                </div>
                <div className='flex flex-col justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 border-t-5 border-zinc-500 border-double h-full'>
                    <p className=' font-mono text-2xl text-center font-semibold text-slate-600'>The preview would be here</p>
                    <p className='text-zinc-300 text-xs px-2'>{JSON.stringify(edges, null, 2)}</p>
                </div>
            </div>
        </div>
        </>
    );
}