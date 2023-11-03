import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

export function TextUpdaterNode({ data }:any) {
    const onChange = useCallback((evt:any) => {
    console.log(evt.target.value);
    }, []);

    return (
        <Card>
            <CardHeader className="p-3">
                <CardTitle>
                    Shot # x
                </CardTitle>
                <CardDescription>
                    Scene # y - Sequence # z
                </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
                <Handle type="target" position={Position.Top} />
                <div>
                    <label htmlFor="text">Text:</label>
                    <input id="text" name="text" onChange={onChange} className="nodrag" />
                </div>
                <Handle type="source" position={Position.Bottom} id="a" />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="b"
                    style={handleStyle}
                />
            </CardContent>
        </Card>
    );
}