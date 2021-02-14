import React from 'react';
import './TopBar.css';

export default class TopBar extends React.Component {

    render() {
        return (
            <div id="bluebarRoot" className="_2t-8 _1s4v _2s1x _h2p _3b0a">
                <div aria-label="Facebook" className="_2t-a _26aw _5rmj _50ti _2s1y" role="banner">
                    <div className="_2t-a _50tj">
                        <div className="_2t-a _4pmj _2t-d">
                            <div className="_218o">
                                <div className="_2t-e">
                                    <div className="_4kny">
                                        <h1 className="_19ea" data-click="bluebar_logo"><a className="_19eb"
                                            data-gt="&#123;&quot;chrome_nav_item&quot;:&quot;logo_chrome&quot;&#125;"
                                            href="https://www.facebook.com/?ref=logo"
                                            title="Go to Facebook Home"><span className="_2md">Facebook</span></a>
                                        </h1>
                                    </div>
                                </div>
                                <div aria-label="Facebook" className="_2t-f" role="navigation">
                                    <div className="_cy6" id="bluebar_profile_and_home">
                                        <div className="_4kny _2s24">
                                            <a className="_2s25 _cy7" href="/" title="Home">Home</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
