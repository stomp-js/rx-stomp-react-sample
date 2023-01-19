import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { useEffect, useState } from 'react';

export default function Status(rxStomp) {
    const [connectionStatus, setConnectionStatus] = useState(null);

    useEffect(() => {
        const subscriptionOb = rxStomp.rxStomp.connectionState$.subscribe((state) => {
            setConnectionStatus(RxStompState[state]);
        
        });

        return () => {
            subscriptionOb.unsubscribe();
        }
    }, []);

    return (
        <div>
            <h2>Connection Status: {connectionStatus} </h2>
        </div>
    );
}