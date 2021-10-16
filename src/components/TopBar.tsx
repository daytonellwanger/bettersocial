import React, { useRef } from 'react';
import { AppBar, Button, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography, Link as MaterialLink } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Link } from 'react-router-dom';
import { useAppInsightsContext, useTrackEvent } from '@microsoft/applicationinsights-react-js';

interface P {
    homeEnabled: boolean;
    signOut: () => void;
}

export default function TopBar(props: P) {

    const appInsights = useAppInsightsContext();
    const trackFund = useTrackEvent<any>(appInsights, 'Fund', {});
    const trackFeedback = useTrackEvent<any>(appInsights, 'Feedback', {});
    const trackContact = useTrackEvent<any>(appInsights, 'Contact', {});

    const classes = useStyles();
    const appBarRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

    return (
        <AppBar position="fixed" ref={appBarRef}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}><MaterialLink href="https://socialfreedom.life/mydata" target="_blank" color="secondary" underline="none">Better Social</MaterialLink></Typography>
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
                    <MenuItem onClick={() => { trackFund({}); window.open('https://www.buymeacoffee.com/socialfreedom', '_blank'); setIsMenuOpen(false); }}>Fund</MenuItem>
                    <MenuItem onClick={() => { trackFeedback({}); window.open('https://www.socialfreedom.life/feedback', '_blank'); setIsMenuOpen(false); }}>Feedback</MenuItem>
                    <MenuItem onClick={() => { trackContact({}); window.open('https://www.socialfreedom.life/contact', '_blank'); setIsMenuOpen(false); }}>Contact</MenuItem>
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
