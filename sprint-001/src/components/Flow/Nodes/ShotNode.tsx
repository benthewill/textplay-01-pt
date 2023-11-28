import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

export function ShotNode({ data, selected }:any) {
    const onChange = useCallback((evt:any) => {
        console.log(evt.target.value);
    }, []);

    const possibleDecisions = data?.value?.expand?.possibleDecisions
    const totalDecisions = data?.value?.expand?.possibleDecisions.length
    console.log(totalDecisions);

    function calculateLocation(index:number) {
        const max = totalDecisions + 1
        let loc = (index + 1) * (100/max)
        return `${loc}%`
    }

    return (
        <>
            <Handle type="target" position={Position.Top} className='z-50' />
            <Card radius='sm' className={`cursor-pointer border-3 border-zinc-500 border-double hover:border-solid hover:border-zinc-300 active:border-zinc-900 ${selected ? 'bg-gradient-to-br from-zinc-600 to-zinc-700' : 'bg-gradient-to-br from-zinc-700 to-zinc-950'} min-w-[200px]`}>
                <CardHeader className="p-1 flex flex-col items-start">
                    <p className='text-left text-[0.6rem] font-thin text-zinc-400'>Shot #{data.value.shotNum}</p>
                    <p className=' font-black'>{data.value.shotName}</p>
                </CardHeader>
                <Divider/>
                <CardBody className="p-1 min-h-[50px]">
                    <div>
                        <p className=' text-zinc-300 whitespace-break-spaces text-[0.6rem]'>{data.value.shotDetail}</p>
                    </div>
                </CardBody>
                <Divider/>
                <CardFooter className='p-1 flex flex-col'>
                    <div className='flex flex-col self-start'>
                        <p className='text-zinc-300 text-[0.4rem]'>Narrations: {data.value.possibleNarrations.length}</p>
                        <p className='text-zinc-300 text-[0.4rem]'>Decisions: {data.value.possibleDecisions.length}</p>
                    </div>
                    <div className='flex flex-row pt-1'>
                        {
                            possibleDecisions?.map((posDec:any, posDecIdx:any) => {
                                return (
                                    <div key={posDec.id}>
                                        <p className='text-zinc-300 text-[0.4rem] line-clamp-1 px-2'>{posDec.decisionContent.slice(0,15)}...</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </CardFooter>
            </Card>
            {
                possibleDecisions?.map((posDec:any, posDecIdx:any) => {
                    return (
                        <div key={posDec.id + posDecIdx} className='flex flex-col'>
                            
                            <Handle type="source" position={Position.Bottom} id={posDec.id} style={{left: calculateLocation(posDecIdx)}} />
                        </div>
                    )
                })
            }
        </>
    );
}