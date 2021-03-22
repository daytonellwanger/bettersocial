import React, { useEffect, useRef, useState } from 'react';
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

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any | undefined>();
    let [loadedItems, setLoadedItems] = useState<any[]>([]);

    const fetchRequestsIdx = useRef<number>(0);
    const fetchedItems = useRef<any[]>([]);
    const fetchRequests = useRef<Fetch[] | undefined>(props.fetchRequests);

    const id = props.id || '';
    useEffect(() => {
        async function reset() {
            setLoading(true);
            setError(undefined);
            // eslint-disable-next-line
            loadedItems = [];
            setLoadedItems([]);
            fetchRequestsIdx.current = 0;
            fetchedItems.current = [];
            if (props.getFetchRequests) {
                try {
                    fetchRequests.current = await props.getFetchRequests!();
                } catch (error) {
                    setError(error);
                }
            }
            await fetchNext();
            setLoading(false);
        }
        reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, props.getFetchRequests]);

    async function fetchNext() {
        if (fetchRequestsIdx.current >= fetchRequests.current!.length) {
            return;
        }
        const fetchRequest = fetchRequests.current![fetchRequestsIdx.current];
        let items: any[];
        try {
            items = await fetchRequest();
        } catch (error) {
            setError(error);
            return [];
        }
        fetchRequestsIdx.current = fetchRequestsIdx.current + 1;
        fetchedItems.current = fetchedItems.current.concat(items);
        setLoadedItems(loadedItems.concat(items.slice(0, Math.min(props.pageSize, items.length))));
    }

    async function nextPage() {
        if (fetchedItems.current.length > loadedItems.length) {
            setLoadedItems(loadedItems.concat(
                fetchedItems.current.slice(
                    loadedItems.length,
                    Math.min(loadedItems.length + props.pageSize, fetchedItems.current.length)
                )
            ));
        } else {
            await fetchNext();
        }
    }

    function renderItems() {
        if (props.renderItems) {
            return props.renderItems!(loadedItems);
        } else if (props.renderItem) {
            return loadedItems.map((item, index) => (
                <div key={index}>
                    {props.renderItem!(item)}
                </div>
            ));
        }
    }

    if (error) {
        return <p>{error.toString()}</p>
    } else if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                <PulseLoader color="#7086ff" size={10} />
            </div>
        );
    } else {
        return (
            <InfiniteScroll
                dataLength={loadedItems.length}
                next={() => nextPage()}
                hasMore={fetchedItems.current.length > loadedItems.length || fetchRequestsIdx.current < fetchRequests.current!.length}
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
