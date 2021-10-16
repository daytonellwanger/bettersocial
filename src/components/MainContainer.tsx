import React from 'react';
import { makeStyles } from '@material-ui/core';
import TopBar from './TopBar';

interface P {
    children: React.ReactNode;
    homeEnabled: boolean;
    signOut?: () => void;
}

export default function MainContainer(props: P) {

    const classes = useStyles();

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TopBar signOut={props.signOut} homeEnabled={props.homeEnabled} />
            <div className={classes.toolbar} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {props.children}
            </div>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar
}));
