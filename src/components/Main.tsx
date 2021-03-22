import React, { useEffect, useRef, useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import APIClient from '../APIClient';
import Router from './Router';
import SignIn from './SignIn';
import Loading from './util/Loading';

export default function Main() {

    const [isSignedIn, setSignedIn] = useState<boolean | undefined>();
    const client = useRef(new APIClient((isSignedIn: boolean) => setSignedIn(isSignedIn)));
    useEffect(() => client.current.init(), []);

    function render() {
        if (typeof isSignedIn === 'undefined') {
            return <Loading />;
        } else {
            return isSignedIn
                ? <Router signOut={() => client.current.signOut()} />
                : <SignIn signIn={client.current.signIn} />;
        }
    }

    return <ThemeProvider theme={theme}>{render()}</ThemeProvider>;
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#fafafa',
            contrastText: '#263238'
        },
        secondary: {
            main: '#37474f',
            contrastText: '#eceff1'
        }
    },
    typography: {
        fontFamily: [
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
    }
});
