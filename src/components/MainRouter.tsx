import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './Main';
import About from './About';

export default function MainRouter() {

    function render() {
        return (
            <BrowserRouter>
                <Route exact path="/" render={() => <Main />} />
                <Route exact path="/about" render={() => <About />} />
            </BrowserRouter>
        );
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
