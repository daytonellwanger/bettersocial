import React, { useEffect, useRef, useState } from 'react';
import APIClient from '../APIClient';
import Router from './Router';
import SignIn from './SignIn';
import Loading from './util/Loading';

export default function Main() {

    const [isSignedIn, setSignedIn] = useState<boolean | undefined>();
    const client = useRef(new APIClient((isSignedIn: boolean) => setSignedIn(isSignedIn)));
    useEffect(() => client.current.init(), []);

    if (typeof isSignedIn === 'undefined') {
        return <Loading />;
    } else {
        return isSignedIn
            ? <Router signOut={() => client.current.signOut()} />
            : <SignIn signIn={client.current.signIn} />;
    }

}
