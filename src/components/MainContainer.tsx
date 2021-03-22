import React from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import TopBar from './TopBar';

interface P {
    children: React.ReactNode;
    homeEnabled: boolean;
    signOut: () => void;
}

export default function MainContainer(props: P) {

    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <TopBar signOut={props.signOut} homeEnabled={props.homeEnabled} />
            <div className={classes.toolbar} />
            <div>
                {props.children}
            </div>
        </ThemeProvider>
    );

}

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#455a64',
            main: '#fafafa',
            dark: '#002884',
            contrastText: '#37474f',
        },
        secondary: {
            light: '#459393',
            main: '#d7ccc8',
            dark: '#ba000d',
            contrastText: '#fafafa',
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
