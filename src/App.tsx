import React, {useState} from 'react';
import * as Stomp from 'stompjs';
import ConnectionPanel from './ConnectionPanel';
import PublishMessage from './PublishMessage';
import SubscribeMessage from './SubscribeMessage';

const App: React.FC = () => {
    const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const handleConnect = (client: Stomp.Client) => {
        setStompClient(client);
        setIsConnected(true);
    };

    const handleDisconnect = () => {
        if (stompClient) {
            stompClient.disconnect(() => {
                setStompClient(null);
                setIsConnected(false);
            });
        }
    };

    return (
        <div className="App">
            <ConnectionPanel
                stompClient={stompClient}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                isConnected={isConnected}
            />
            {isConnected && stompClient && (
                <div className="flex mt-8">
                    <div className="w-1/2">
                        <PublishMessage stompClient={stompClient}/>
                    </div>
                    <div className="w-1/2">
                        <SubscribeMessage stompClient={stompClient}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
