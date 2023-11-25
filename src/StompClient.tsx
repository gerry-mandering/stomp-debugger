import React, {useState} from 'react';
import * as Stomp from 'stompjs';

const StompClient: React.FC = () => {
    const [connectionPath, setConnectionPath] = useState<string>('');
    const [endpoint, setEndpoint] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [client, setClient] = useState<Stomp.Client | null>(null);

    const connect = () => {
        const stompClient = Stomp.client(connectionPath);
        stompClient.connect({}, () => {
            setClient(stompClient);
            console.log('Connected to the WebSocket');
        }, error => {
            console.error('Error connecting to WebSocket:', error);
        });
    };

    const sendMessage = () => {
        if (client) {
            client.send(endpoint, {}, content);
            console.log('Message sent:', content);
        } else {
            console.error('Client not connected');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <input
                type="text"
                placeholder="Connection Path (ws://localhost:8080/)"
                value={connectionPath}
                onChange={e => setConnectionPath(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            <input
                type="text"
                placeholder="STOMP Endpoint (/pub/test)"
                value={endpoint}
                onChange={e => setEndpoint(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-4"
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-4 h-32"
            />
            <button
                onClick={connect}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mr-2 hover:bg-blue-600">
                Connect
            </button>
            <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600">
                Send Message
            </button>
        </div>
    );
};

export default StompClient;
