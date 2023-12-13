import React, {useState} from 'react';
import * as Stomp from 'stompjs';
import ConnectionPanel from './ConnectionPanel';
import PublishMessage from './PublishMessage';
import SubscribeMessage from './SubscribeMessage';

export interface Message {
    body: string;
    timestamp: string;
}

const App: React.FC = () => {
    const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [userQueueMessages, setUserQueueMessages] = useState<Message[]>([]);

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
                setUserQueueMessages={setUserQueueMessages}
            />
            {isConnected && stompClient && (
                <div className="flex flex-col md:flex-row mt-8">
                    <div className="w-full xl:w-1/2">
                        <PublishMessage stompClient={stompClient}/>
                    </div>
                    <div className="w-full xl:w-1/2">
                        <SubscribeMessage stompClient={stompClient} userQueueMessages={userQueueMessages}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;