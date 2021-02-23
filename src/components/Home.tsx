import React from 'react';
import { Link } from 'react-router-dom';
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
                                    <td className="_51m- vTop pbs _51mw">
                                        <Link to="/posts" className="_4rtt">Your Posts</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="_4-u3 _2pi0">
                    <div className="_4rt7">
                        <div style={{ backgroundColor: '#FCD872' }} className="_4rtk">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==" />
                        </div>
                        <div className="_4rt8 _21op">
                            <div className="_4rt9">Photos and Videos</div>
                            <div className="_4rtj">Photos and videos you've uploaded and shared</div>
                        </div>
                    </div>
                    <div className="_4rtp">
                        <table className="uiGrid _51mz _5f0n" cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr className="_51mx">
                                    <td className="_51m- vTop pbs _51mw">
                                        <Link to="/photos" className="_4rtt">Your Photos</Link>
                                    </td>
                                </tr>
                                <tr className="_51mx">
                                    <td className="_51m- vTop pbs _51mw">
                                        <Link to="/videos" className="_4rtt">Your Videos</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="_4-u3 _2pi0">
                    <div className="_4rt7">
                        <div style={{ backgroundColor: '#F7923B' }} className="_4rtk">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhsBIAbc+avSAAAAjUlEQVQoz62ROw7CMBBEnxPCERDHCb3Pyl04QVJQBgkJUSBsHoUV8ZEcGnaaleYVs7NBlqcBYMeJhG9KjEQAxGhtekEcqsAkQUi0lQCZVRCWcobmxxH8B8hVNxfgXAWOpai+2kMsRWF0MKv68K5qcrKXGcBO1ZuTWxFbu+K8/qNXD27kU/PSenHv+tuWJ8EkvUiVqwYRAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAyLTI3VDA5OjMyOjA2LTA4OjAw49wxUAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMi0yN1QwOTozMjowNi0wODowMJKBiewAAAAASUVORK5CYII=" />
                        </div>
                        <div className="_4rt8 _21op">
                            <div className="_4rt9">Comments</div>
                            <div className="_4rtj">Comments you've posted on your own posts, on other people's posts or in groups you belong to</div>
                        </div>
                    </div>
                    <div className="_4rtp">
                        <table className="uiGrid _51mz _5f0n" cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr className="_51mx">
                                    <td className="_51m- vTop pbs _51mw">
                                        <Link to="/comments" className="_4rtt">Comments</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}
