import ReactFlow, { ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

function Flow(props:any) {
  // you can access the internal state here
    const reactFlowInstance = useReactFlow();
    return <ReactFlow {...props} />;
}

// wrapping with ReactFlowProvider is done outside of the component
function FlowWithProvider(props:any) {
    return (
        <ReactFlowProvider>
        <Flow {...props} />
        </ReactFlowProvider>
    );
}

export default FlowWithProvider;