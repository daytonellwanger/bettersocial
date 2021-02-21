import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PulseLoader from 'react-spinners/PulseLoader';

interface P {
    pageSize: number;
    allItems: any[];
    renderItem: (item: any) => JSX.Element;
}

interface S {
    loadedItems: any[];
}

export default class InfiniteScroller extends React.Component<P, S> {

    state: S = {
        loadedItems: this.props.allItems.slice(0, Math.min(this.props.pageSize, this.props.allItems.length))
    }

    render() {
        return (
            <InfiniteScroll
                dataLength={this.state.loadedItems.length}
                next={() => {
                    const loadedItems = this.state.loadedItems.concat(
                        this.props.allItems.slice(
                            this.state.loadedItems.length,
                            Math.min(this.state.loadedItems.length + this.props.pageSize, this.props.allItems.length)
                        )
                    );
                    this.setState({ loadedItems });
                }}
                hasMore={this.props.allItems.length > this.state.loadedItems.length}
                loader={
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                        <PulseLoader color="#7086ff" size={10} />
                    </div>
                }
            >
                {this.state.loadedItems.map((i, idx) => (
                    <div key={idx}>
                        {this.props.renderItem(i)}
                    </div>
                ))}
            </InfiniteScroll>
        );
    }

}
