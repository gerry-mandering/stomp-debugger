import React, {useState, FunctionComponent} from 'react';
import * as Stomp from 'stompjs';
import {Message} from './App';

interface ConnectionPanelProps {
    stompClient: Stomp.Client | null;
    onConnect: (client: Stomp.Client) => void;
    onDisconnect: () => void;
    isConnected: boolean;
    setUserQueueMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ConnectionPanel: FunctionComponent<ConnectionPanelProps> = ({
                                                                      stompClient,
                                                                      onConnect,
                                                                      onDisconnect,
                                                                      isConnected,
                                                                      setUserQueueMessages
                                                                  }) => {
    const [connectionPath, setConnectionPath] = useState<string>('ws://localhost:8080');
    const [subscription, setSubscription] = useState<Stomp.Subscription | null>(null);

    const handleConnect = () => {
        if (!isConnected && connectionPath) {
            const client = Stomp.client(connectionPath);
            client.connect({}, () => {
                onConnect(client);
                console.log('Connected to the WebSocket');

                const sub = client.subscribe('/user/queue', message => {
                    console.log('Received message:', message.body);
                    const timestamp = new Date().toLocaleTimeString();
                    setUserQueueMessages(prevMessages => [...prevMessages, { body: message.body, timestamp }]);
                });
                setSubscription(sub);

            }, error => {
                console.error('Error connecting to WebSocket:', error);
            });
        } else {
            if (stompClient) {
                // Unsubscribe before disconnecting
                if (subscription) {
                    subscription.unsubscribe();
                    setSubscription(null);
                }
                stompClient.disconnect(() => {
                    onDisconnect();
                    console.log('Disconnected from the WebSocket');
                });
            }
        }
    };

    return (
        <div className="flex items-center justify-center space-x-4 p-4 mt-4">
            <input
                type="text"
                value={connectionPath}
                onChange={(e) => setConnectionPath(e.target.value)}
                placeholder="WebSocket Connection Path"
                className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
                onClick={handleConnect}
                className={`px-4 py-2 rounded text-white ${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                {isConnected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    );
};

export default ConnectionPanel;