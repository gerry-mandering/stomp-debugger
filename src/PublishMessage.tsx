import React, {useState, FunctionComponent} from 'react';
import * as Stomp from 'stompjs';

interface PublishMessageProps {
    stompClient: Stomp.Client | null;
}

const PublishMessage: FunctionComponent<PublishMessageProps> = ({stompClient}) => {
    const [endpoint, setEndpoint] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [format, setFormat] = useState<'text' | 'json'>('text');

    const isValidJson = (json: string) => {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSend = () => {
        if (!stompClient || !stompClient.connected) {
            alert('STOMP client is not connected');
            return;
        }

        if (format === 'json' && !isValidJson(message)) {
            alert('Invalid JSON format');
            return;
        }

        const headers = format === 'json' ? {'content-type': 'application/json'} : {};
        stompClient.send(endpoint, headers, message);
        console.log('Message sent:', message);
    };

    const [isJson, setIsJson] = useState(false);

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Publish Endpoint</label>
                <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="Publish Endpoint"
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Message Content</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Content"
                    className="w-full p-2 border border-gray-300 rounded h-64"
                />
            </div>
            <div className="mb-4 flex">
                <button
                    onClick={() => setFormat('text')}
                    className={`flex-1 mr-2 px-4 py-2 rounded ${format === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Text
                </button>
                <button
                    onClick={() => setFormat('json')}
                    className={`flex-1 px-4 py-2 rounded ${format === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    JSON
                </button>
            </div>

            <button
                onClick={handleSend}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
                Send Message
            </button>
        </div>
    );
};

export default PublishMessage;
