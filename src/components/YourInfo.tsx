import React, { useEffect, useRef, useState } from 'react';
import { Tooltip, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Ticker from 'react-ticker'
import { useAppInsightsContext, useTrackMetric } from '@microsoft/applicationinsights-react-js';
import { decodeString, getTimeString } from '../util';

const zip = (window as any).zip;

interface P {
    zips: any[];
}

type LocationAndTime = {
    location: string;
    time: string;
};

type LocationsMap = { [location: string]: LocationAndTime[] };

export default function YourInfo(props: P) {

    const appInsights = useAppInsightsContext();
    const trackComponent = useTrackMetric(appInsights, 'YourInfo');
    trackComponent();

    const [contactList, setContactList] = useState<string[]>([]);
    const [offFacebookActivity, setOffFacebookActivity] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationsMap>({});
    const locationKeysIdx = useRef<number>(0);
    const [searches, setSearches] = useState<string[]>([]);

    async function getFileContent(fileName: string): Promise<any> {
        let file: any | undefined = undefined;
        for (let zip of props.zips) {
            const entries = await zip.getEntries();
            file = entries.filter((f: any) => f.filename === fileName)[0];
            if (file) {
                break;
            }
        }
        if (!file) {
            return undefined;
        }
        const stringContent = await file.getData(new zip.TextWriter());
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

        async function getSearches() {
            const content = await getFileContent('search_history/your_search_history.json');
            if (content) {
                const searchList = (content['searches'] as any[]).map(s => {
                    try {
                        return (s.data[0].text as string).toUpperCase();
                    } catch {
                        return '';
                    }
                });
                const counts: { [search: string]: number } = {};
                for (let s of searchList) {
                    counts[s] = (counts[s] || 0) + 1;
                }
                const searchesAndCounts = Object.keys(counts).map(search => ({ search, count: counts[search] }));
                searchesAndCounts.sort((a, b) => b.count - a.count);
                const searches = searchesAndCounts.map(sac => `${sac.search} x${sac.count}`);
                searches.unshift('', '', '');
                setSearches(searches);
            }
        }

        getContactList();
        getOffFacebookActivity();
        getLocations();
        getSearches();
    // eslint-disable-next-line
    }, []);

    function renderContactList() {
        if (contactList.length > 0) {
            return (
                <div style={{ marginTop: '3em' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1em' }}>
                        <Typography variant="body2" color="secondary">Advertisers who uploaded a contact list with your information to Facebook: {contactList.length}</Typography>
                        <Tooltip title="Advertisers can upload lists of email addresses to Facebook to help with targeting ads. These advertisers uploaded a list that contained your email address.">
                            <InfoIcon color="secondary" fontSize="small" style={{ marginLeft: '.2em' }} />
                        </Tooltip>
                    </div>
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
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1em' }}>
                        <Typography variant="body2" color="secondary">Sites that reported your activities to Facebook: {offFacebookActivity.length}</Typography>
                        <Tooltip title="Sites report your activity to Facebook to track the effectiveness of their ads. These sites reported your activity to Facebook.">
                            <InfoIcon color="secondary" fontSize="small" style={{ marginLeft: '.2em' }} />
                        </Tooltip>
                    </div>
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
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1em' }}>
                        <Typography variant="body2" color="secondary">Locations and times when you interacted with Facebook</Typography>
                        <Tooltip title="Facebook stores the time of your logins and the IP address of the device that you logged in from, which can be mapped to a geographical location with decent accuracy.">
                            <InfoIcon color="secondary" fontSize="small" style={{ marginLeft: '.2em' }} />
                        </Tooltip>
                    </div>
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

    function renderSearches() {
        if (searches.length > 0) {
            return (
                <div style={{ marginTop: '3em' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1em' }}>
                        <Typography variant="body2" color="secondary">Your searches</Typography>
                        <Tooltip title="Facebook stores the text and time of all queries you enter in the search bar.">
                            <InfoIcon color="secondary" fontSize="small" style={{ marginLeft: '.2em' }} />
                        </Tooltip>
                    </div>
                    <Ticker>
                        {({ index }) => (
                            <div style={{ marginRight: '3em' }}>
                                <Typography variant="h6" color="secondary">{searches.length > 0 ? decodeString(searches[index % searches.length]) : ''}</Typography>
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
            {renderSearches()}
        </div>
    );

}
