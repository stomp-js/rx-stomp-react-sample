import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { useEffect, useState } from 'react';

export default function Status(props) {
    const [connectionStatus, setConnectionStatus] = useState(null);

    useEffect(() => {
        const subscriptionOb = props.rxStomp.connectionState$.subscribe((state) => {
            setConnectionStatus(RxStompState[state]);
        
        });

        return () => {
            subscriptionOb.unsubscribe();
        };
    }, []);

    return (
        <div>
            <h2>Connection Status: {connectionStatus} </h2>
        </div>
    );
}