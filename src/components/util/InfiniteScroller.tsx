import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PulseLoader from 'react-spinners/PulseLoader';

export type Fetch = () => Promise<any[]>;
export interface P {
    pageSize: number;
    id?: string;
    fetchRequests?: Fetch[];
    getFetchRequests?: () => Promise<Fetch[]>;
    renderItem?: (item: any) => JSX.Element;
    renderItems?: (items: any[]) => JSX.Element;
    scrollableTarget?: React.ReactNode;
}

export default function InfiniteScroller(props: P) {

    const [loading, setLoading] = useState<boolean>(false);
    const [fetchRequestsIdx, setFetchRequestsIdx] = useState<number>(0);
    const [fetchedItems, setFetchedItems] = useState<any[]>([]);
    const [loadedItems, setLoadedItems] = useState<any[]>([]);
    const [error, setError] = useState<any | undefined>();
    const [gotFetchRequests, setGotFetchRequests] = useState<Fetch[]>([]);

    const fetchRequests = props.fetchRequests || gotFetchRequests;

    const id = props.id || '';
    useEffect(() => {
        async function fetch() {
            setFetchRequestsIdx(0);
            setFetchedItems([]);
            setLoadedItems([]);
            setError(undefined);
            setGotFetchRequests([]);
            if (props.getFetchRequests) {
                setLoading(true);
                try {
                    const gotFetchRequests = await props.getFetchRequests!();
                    setGotFetchRequests(gotFetchRequests);
                } catch (error) {
                    setError(error);
                }
                setLoading(false);
            }
        }
        fetch();
    }, [id, props.getFetchRequests]);

    async function fetchNext() {
        if (fetchRequestsIdx >= fetchRequests.length) {
            return;
        }
        const fetchRequest = fetchRequests[fetchRequestsIdx];
        let items: any[];
        try {
            items = await fetchRequest();
        } catch (error) {
            setError(error);
            return [];
        }
        setFetchRequestsIdx(fetchRequestsIdx + 1);
        setFetchedItems(fetchedItems.concat(items));
        setLoadedItems(loadedItems.concat(items.slice(0, Math.min(props.pageSize, items.length))));
    }

    async function nextPage() {
        if (fetchedItems.length > loadedItems.length) {
            const _loadedItems = loadedItems.concat(
                fetchedItems.slice(
                    loadedItems.length,
                    Math.min(loadedItems.length + props.pageSize, fetchedItems.length)
                )
            );
            setLoadedItems(_loadedItems);
        } else {
            await fetchNext();
        }
    }

    function renderItems() {
        if (props.renderItems) {
            return props.renderItems!(loadedItems);
        } else if (props.renderItem) {
            return loadedItems.map(i => props.renderItem!(i));
        }
    }

    if (fetchedItems.length === 0 && fetchRequests.length > 0) {
        fetchNext();
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                <PulseLoader color="#7086ff" size={10} />
            </div>
        );
    } else if (error) {
        return <p>{error.toString()}</p>
    } else {
        return (
            <InfiniteScroll
                dataLength={loadedItems.length}
                next={() => nextPage()}
                hasMore={fetchedItems.length > loadedItems.length || fetchRequestsIdx < fetchRequests.length}
                loader={
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                        <PulseLoader color="#7086ff" size={10} />
                    </div>
                }
                scrollableTarget={props.scrollableTarget}>
                {renderItems()}
            </InfiniteScroll>
        );
    }
}
