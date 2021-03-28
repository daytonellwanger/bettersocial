import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import JSZip from 'jszip';
import Ticker from 'react-ticker'
import { getTimeString } from '../util';

interface P {
    zip: JSZip;
}

export default function YourInfo(props: P) {

    const [contactList, setContactList] = useState<string[]>([]);
    const [offFacebookActivity, setOffFacebookActivity] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);

    async function getFileContent(fileName: string): Promise<any> {
        const file = props.zip.files[fileName];
        if (!file) {
            return undefined;
        }
        const stringContent = await file.async('string');
        return JSON.parse(stringContent);
    }

    useEffect(() => {
        async function getContactList() {
            const content = await getFileContent('ads_and_businesses/advertisers_who_uploaded_a_contact_list_with_your_information.json');
            if (content) {
                const advertisers = content['custom_audiences'] as string[];
                setContactList(advertisers);
            }
        }

        async function getOffFacebookActivity() {
            const content = await getFileContent('ads_and_businesses/your_off-facebook_activity.json');
            if (content) {
                const offFacebookActivity = (content['off_facebook_activity'] as any[]).map(a => a.name) as string[];
                setOffFacebookActivity(offFacebookActivity);
            }
        }

        async function getLocations() {
            const content = await getFileContent('security_and_login_information/account_activity.json');
            if (content) {
                const locations = (content['account_activity'] as any[]).map(a => `${getTimeString(a.timestamp)} - ${a.city}, ${a.region}`);
                setLocations(locations);
            }
        }

        getContactList();
        getOffFacebookActivity();
        getLocations();
    }, []);

    function renderContactList() {
        if (contactList.length > 0) {
            return (
                <div style={{ marginTop: '3em' }}>
                    <Typography variant="body2" color="secondary" style={{ marginBottom: '1em' }}>Advertisers who uploaded a contact list with your information to Facebook: {contactList.length}</Typography>
                    <Ticker>
                        {({ index }) => (
                            <div style={{ marginRight: '3em' }}>
                                <Typography variant="h6" color="secondary">{contactList.length > 0 ? contactList[Math.floor(Math.random() * contactList.length)] : ''}</Typography>
                            </div>
                        )}
                    </Ticker>
                </div>
            );
        }
    }

    function renderOffFacebookActivity() {
        if (offFacebookActivity.length > 0) {
            return (
                <div style={{ marginTop: '3em' }}>
                    <Typography variant="body2" color="secondary" style={{ marginBottom: '1em' }}>Sites that reported your activities to Facebook: {offFacebookActivity.length}</Typography>
                    <Ticker>
                        {({ index }) => (
                            <div style={{ marginRight: '3em' }}>
                                <Typography variant="h6" color="secondary">{contactList.length > 0 ? offFacebookActivity[index % offFacebookActivity.length] : ''}</Typography>
                            </div>
                        )}
                    </Ticker>
                </div>
            );
        }
    }

    function renderLocations() {
        if (contactList.length > 0) {
            return (
                <div style={{ marginTop: '3em' }}>
                    <Typography variant="body2" color="secondary" style={{ marginBottom: '1em' }}>Locations and times when you interacted with Facebook</Typography>
                    <Ticker>
                        {({ index }) => (
                            <div style={{ marginRight: '3em' }}>
                                <Typography variant="h6" color="secondary">{locations.length > 0 ? locations[Math.floor(Math.random() * locations.length)] : ''}</Typography>
                            </div>
                        )}
                    </Ticker>
                </div>
            );
        }
    }

    return (
        <div style={{ marginBottom: '3em' }}>
            {renderContactList()}
            {renderOffFacebookActivity()}
            {renderLocations()}
        </div>
    );

}
