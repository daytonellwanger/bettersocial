import React from 'react';
import { AppBar, Button, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface P {
    homeEnabled: boolean;
    signOut: () => void;
}

export default function TopBar(props: P) {
    const classes = useStyles();
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>Social Freedom</Typography>
                {props.homeEnabled ? <Button color="inherit" component={Link} to="/">Home</Button> : undefined}
                <Button color="inherit" onClick={props.signOut}>Log Out</Button>
            </Toolbar>
        </AppBar>
    );
}

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
}));
