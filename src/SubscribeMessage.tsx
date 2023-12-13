import React, {useState, useEffect, FunctionComponent} from 'react';
import * as Stomp from 'stompjs';
import {Message} from './App';

interface SubscribeMessageProps {
    stompClient: Stomp.Client | null;
    userQueueMessages: Message[];
}

const SubscribeMessage: FunctionComponent<SubscribeMessageProps> = ({stompClient, userQueueMessages}) => {
    const [endpoint, setEndpoint] = useState<string>('');
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [subscription, setSubscription] = useState<Stomp.Subscription | null>(null);
    const allMessages = [...userQueueMessages, ...messages];

    const subscribeToEndpoint = (ep: string) => {
        if (stompClient && !subscription) {
            const newSubscription = stompClient.subscribe(ep, (message) => {
                const timestamp = new Date().toLocaleTimeString();
                setMessages((prevMessages) => [...prevMessages, {body: message.body, timestamp}]);
            });
            setSubscription(newSubscription);
            setIsSubscribed(true);
        }
    };

    const unsubscribeFromEndpoint = () => {
        if (subscription) {
            subscription.unsubscribe();
            setSubscription(null);
            setIsSubscribed(false);
        }
    };

    const handleSubscriptionToggle = () => {
        if (isSubscribed) {
            unsubscribeFromEndpoint();
        } else {
            subscribeToEndpoint(endpoint);
        }
    };

    useEffect(() => {
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [endpoint, subscription]);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Subscribe Endpoint</label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        placeholder="Subscribe Endpoint"
                        className="flex-grow p-2 border border-gray-300 rounded mr-2"
                    />
                    <button
                        onClick={handleSubscriptionToggle}
                        className={`px-4 py-2 rounded text-white ${isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Messages:</label>
                <div
                    className={`p-2 border border-gray-300 rounded h-96 overflow-auto ${isSubscribed ? 'bg-white' : 'bg-gray-200'}`}>
                    {allMessages.map((msg, index) => (
                        <p key={index} className="text-gray-600">
                            <span className="font-bold mr-2">[{msg.timestamp}]</span>
                            {msg.body}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscribeMessage;