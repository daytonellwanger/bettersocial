import React from 'react';
import './Home.css';

export default class Home extends React.Component {

    render() {
        return (
            <div className="_4-u2 _3-8o _4-u8">
                <div className="_4-u3 _5dwa _5dw9"><span className="_38my">Your Information<span
                    className="_c1c"></span></span>
                    <div className="_3s3-"></div>
                </div>
                <div className="_4-u3 _2pi0">
                    <div className="_4rt7">
                        <div style={{ backgroundColor: '#8C72CB' }} className="_4rtk"><img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEX///9MaXH///////////////////////////////////////+2I0voAAAAC3RSTlOAAHTdqgOD4wItpp12MDIAAABDSURBVAhbYxCEAgY4o8l6NxBs1mDQ3g0GmxisyxiAIH0zw25XkIqQ3Qy7oYBhN0RqNw4pLhDDGiglCTQRYSDcCgzbAVkOMGvtylXuAAAAAElFTkSuQmCC" />
                        </div>
                        <div className="_4rt8 _21op">
                            <div className="_4rt9">Posts</div>
                            <div className="_4rtj">Posts you&#039;ve shared on Facebook, posts that are hidden
                                            from your timeline and polls you have created</div>
                        </div>
                    </div>
                    <div className="_4rtp">
                        <table className="uiGrid _51mz _5f0n" cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr className="_51mx">
                                    <td className="_51m- vTop pbs _51mw"><a href="/posts"
                                        className="_4rtt">Your Posts</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}
