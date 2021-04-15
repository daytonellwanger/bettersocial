import React, { useRef } from 'react';
import { AppBar, Button, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Link } from 'react-router-dom';

interface P {
    homeEnabled: boolean;
    signOut: () => void;
}

export default function TopBar(props: P) {
    const classes = useStyles();
    const appBarRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

    return (
        <AppBar position="fixed" ref={appBarRef}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>Social Freedom</Typography>
                {props.homeEnabled ? <Button color="secondary" component={Link} to="/">Home</Button> : undefined}
                <IconButton onClick={() => setIsMenuOpen(true)}>
                    <ArrowDropDownIcon color="secondary" />
                </IconButton>
                <Menu 
                    anchorEl={appBarRef.current}
                    keepMounted
                    open={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => setIsMenuOpen(false)}>Fund</MenuItem>
                    <MenuItem onClick={() => { window.open('https://www.socialfreedom.life/complain', '_blank'); setIsMenuOpen(false); }}>Complain</MenuItem>
                    <MenuItem onClick={() => { window.open('https://www.socialfreedom.life/contact', '_blank'); setIsMenuOpen(false); }}>Contact</MenuItem>
                    <MenuItem onClick={() => { props.signOut(); setIsMenuOpen(false); }}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
}));
