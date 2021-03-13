import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PulseLoader from 'react-spinners/PulseLoader';

type Fetch = () => Promise<any[]>;
interface P {
    pageSize: number;
    fetchRequests: Fetch[];
    getFetchRequests?: () => Promise<Fetch[]>;
    renderItem: (item: any) => JSX.Element;
}

interface S {
    loading: boolean;
    fetchRequestsIdx: number;
    fetchedItems: any[];
    loadedItems: any[];
    error?: any;
}

export default class InfiniteScroller extends React.Component<P, S> {

    fetchRequests = this.props.fetchRequests;

    state: S = {
        loading: false,
        fetchRequestsIdx: 0,
        fetchedItems: [],
        loadedItems: []
    };

    async componentDidMount() {
        if (this.props.getFetchRequests) {
            this.setState({ loading: true });
            try {
                this.fetchRequests = await this.props.getFetchRequests();
            } catch (error) {
                this.setState({ error });
            }
            this.setState({ loading: false });
        }
        await this.fetchNext();
    }

    async fetchNext() {
        if (this.state.fetchRequestsIdx >= this.fetchRequests.length) {
            return;
        }
        const fetchRequest = this.fetchRequests[this.state.fetchRequestsIdx];
        let items: any[];
        try {
            items = await fetchRequest();
        } catch(error) {
            this.setState({ error });
            return [];
        }
        this.setState({
            ...this.state,
            fetchRequestsIdx: this.state.fetchRequestsIdx + 1,
            fetchedItems: this.state.fetchedItems.concat(items),
            loadedItems: this.state.loadedItems.concat(items.slice(0, Math.min(this.props.pageSize, items.length)))
        });
    }

    async nextPage() {
        if (this.state.fetchedItems.length > this.state.loadedItems.length) {
            const loadedItems = this.state.loadedItems.concat(
                this.state.fetchedItems.slice(
                    this.state.loadedItems.length,
                    Math.min(this.state.loadedItems.length + this.props.pageSize, this.state.fetchedItems.length)
                )
            );
            this.setState({ ...this.state, loadedItems });
        } else {
            await this.fetchNext();
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                    <PulseLoader color="#7086ff" size={10} />
                </div>
            );
        } else if (this.state.error) {
            return <p>{this.state.error.toString()}</p>
        } else {
            return (
                <InfiniteScroll
                    dataLength={this.state.loadedItems.length}
                    next={() => this.nextPage()}
                    hasMore={this.state.fetchedItems.length > this.state.loadedItems.length || this.state.fetchRequestsIdx < this.fetchRequests.length}
                    loader={
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                            <PulseLoader color="#7086ff" size={10} />
                        </div>
                    }>
                    {this.state.loadedItems.map((i, idx) => (
                        <div key={idx}>
                            {this.props.renderItem(i)}
                        </div>
                    ))}
                </InfiniteScroll>
            ); 
        }
    }

}
