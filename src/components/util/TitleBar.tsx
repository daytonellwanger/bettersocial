import React from 'react';

interface P {
    color: string;
    image: string;
    title: string;
    subtitle?: string;
    externalLink?: string;
}

export default class TitleBar extends React.Component<P> {
    
    render() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: this.props.color }} className="_3z-t">
                    <img src={`data:image/png;base64,${this.props.image}`} />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">{this.props.title}</div>
                    {this.props.subtitle ? <div className="_3b0e">{this.props.subtitle}</div> : undefined}
                    {this.props.externalLink ? <a href={this.props.externalLink} target="_blank">View on Google</a> : undefined }
                </div>
            </div>
        );
    } 

}
