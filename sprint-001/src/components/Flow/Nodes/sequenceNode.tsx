import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import Link from 'next/link';

const handleStyle = { left: 10 };

export function SequenceNode({ data, selected }:any) {
    const onChange = useCallback((evt:any) => {
        console.log(evt.target.value);
    }, []);

    return (
        <>
        <Handle type="target" position={Position.Top} className='z-50' />
            <Link href={`graph/sequences/${data.value.id}`}>
                <Card radius='none' className={`cursor-pointer border-3 border-zinc-500 border-double hover:border-solid hover:border-zinc-300 active:border-zinc-900 ${selected ? 'bg-gradient-to-br from-zinc-200 to-zinc-300' : 'bg-gradient-to-br from-zinc-300 to-zinc-400'} min-w-[200px]`}>
                    <CardHeader className="p-3 flex flex-col items-start">
                        <p className='text-left text-[0.6rem] font-thin text-black'>Sequence #{data.value.sequenceNum}</p>
                        <p className=' font-black'>{data.value.shotName}</p>
                    </CardHeader>
                    <Divider/>
                    <CardBody className="p-3 min-h-[50px]">
                        <div>
                            <p className=' text-zinc-900 whitespace-break-spaces text-[0.6rem]'>{data.value.sequenceName}</p>
                        </div>
                    </CardBody>
                    <Divider/>
                    <CardFooter className='p-3 flex flex-col'>
                        <div className='flex flex-col self-start'>
                            {/* <p className='text-zinc-300 text-[0.4rem]'>Narrations: {data.value.possibleNarrations.length}</p> */}
                            {/* <p className='text-zinc-300 text-[0.4rem]'>Decisions: {data.value.possibleDecisions.length}</p> */}
                        </div>
                        <div className='flex flex-row pt-1'>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        <Handle type="source" position={Position.Bottom} />
            
        </>
    );
}