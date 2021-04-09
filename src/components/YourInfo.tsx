import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@material-ui/core';
import JSZip from 'jszip';
import Ticker from 'react-ticker'
import { decodeString, getTimeString } from '../util';

interface P {
    zip: JSZip;
}

type LocationAndTime = {
    location: string;
    time: string;
};

type LocationsMap = { [location: string]: LocationAndTime[] };

export default function YourInfo(props: P) {

    const [contactList, setContactList] = useState<string[]>([]);
    const [offFacebookActivity, setOffFacebookActivity] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationsMap>({});
    const locationKeysIdx = useRef<number>(0);

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
                const locationsList: LocationAndTime[] = (content['account_activity'] as any[]).map(a => ({ time: getTimeString(a.timestamp), location: `${a.city}, ${a.region}` }));
                const locationsMap: LocationsMap = {};
                for (let l of locationsList) {
                    if (!locationsMap[l.location]) {
                        locationsMap[l.location] = [];
                    }
                    locationsMap[l.location].push(l);
                }
                setLocations(locationsMap);
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
                                <Typography variant="h6" color="secondary">{contactList.length > 0 ? decodeString(contactList[Math.floor(Math.random() * contactList.length)]) : ''}</Typography>
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
                                <Typography variant="h6" color="secondary">{contactList.length > 0 ? decodeString(offFacebookActivity[index % offFacebookActivity.length]) : ''}</Typography>
                            </div>
                        )}
                    </Ticker>
                </div>
            );
        }
    }

    function getRandomLocation() {
        const locationKeys = Object.keys(locations);
        const specificLocations = locations[locationKeys[locationKeysIdx.current]];
        locationKeysIdx.current = (locationKeysIdx.current + 1) % locationKeys.length;
        const randomLocation = specificLocations[Math.floor(Math.random() * specificLocations.length)];
        return `${randomLocation.time} - ${randomLocation.location}`;
    }

    function renderLocations() {
        if (Object.keys(locations).length > 0) {
            return (
                <div style={{ marginTop: '3em' }}>
                    <Typography variant="body2" color="secondary" style={{ marginBottom: '1em' }}>Locations and times when you interacted with Facebook</Typography>
                    <Ticker>
                        {({ index }) => (
                            <div style={{ marginRight: '3em' }}>
                                <Typography variant="h6" color="secondary">{decodeString(getRandomLocation())}</Typography>
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
