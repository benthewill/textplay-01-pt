"use client";

import FlowWithProvider from '@/components/flow/FlowProvider';
import { SequenceNode } from '@/components/flow/nodes/sequenceNode';
import { ShotInput } from '@/components/shot/ShotInput';
import { ShotSub } from '@/components/shot/ShotSub';
import { CurrentUser } from '@/components/user/CurrentUser';
import { addConnection, getAllSequences } from '@/lib/db/shots';
import { initEdges, initNodes, initSequenceNodes } from '@/utils/initNodes';
import { BreadcrumbItem, Breadcrumbs, Button, ScrollShadow } from '@nextui-org/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ReactFlow, { addEdge, useEdgesState, useNodesState, MiniMap, Background, Controls, applyNodeChanges, applyEdgeChanges, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { useEffectOnce } from 'usehooks-ts';

const nodeTypes = {
    sequenceNode: SequenceNode
}

const initialEdges:any[] = []

export default function Graph(props:any) {
    const queryClient = useQueryClient()

    const {mutate:addTargetShot} = useMutation({
        mutationFn: ({sourceHandleID, targetID}:any) => {
            return addConnection(sourceHandleID, targetID)
        }
    })

    const {data, isLoading, isError, refetch, isRefetching, isFetching} =  useQuery({
        queryFn: () => getAllSequences(),
        queryKey: ["sequences", "all"],
        notifyOnChangeProps: "all",
        refetchOnWindowFocus: false
    })

    const {data:initialNodes} = useQuery({
        queryFn: () => initSequenceNodes(data),
        queryKey: ['indexed', 'nodes', 'sequences'],
        enabled: !!data
    })

    // const {data:initialEdges} = useQuery({
    //     queryFn: () => (data),
    //     queryKey: ['indexed', 'edges'],
    //     enabled: !!data
    // })

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
    }, [initialNodes, setEdges, setNodes])

    console.log(initialEdges);

    return (
        <>
        <div style={{ width: '100vw', height: '100vh' }} className='flex flex-row border-y-5 border-x-5 border-zinc-500 border-double'>
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
                    className="bg-gradient-to-b from-red-950 to-zinc-950"
                >
                    <Panel position="top-left" className="">
                        <CurrentUser />
                    </Panel>
                    <Panel position='top-right' className='flex flex-col'>
                        <div>
                            <Breadcrumbs>
                                <BreadcrumbItem>Sequences</BreadcrumbItem>
                            </Breadcrumbs>
                        </div>
                        <div>
                            <p className=" text-end text-xl tracking-tight leading-tight">
                                01 - painting pretty.  <br/>
                                Sequences
                            </p>
                        </div>
                    </Panel>
                    <Panel position='bottom-center'>
                        <p className=' font-thin'>
                            <span className=' font-extrabold'></span> 
                        </p>
                    </Panel>
                    <Controls />
                    <Background gap={12} size={1}/>
                </FlowWithProvider>
            </div>
        </div>
        </>
    );
}