import React from 'react';
import moment from 'moment';

interface PostData {
    post: string;
}

type Data = PostData | any;

interface ExternalContextAttachmentData {
    external_context: {
        url: string
    };
}

interface MediaAttachmentData {
    media: {
        title: string,
        description: string,
        uri: string,
        content: string
    };
}

type AttachmentData = ExternalContextAttachmentData | MediaAttachmentData;

interface Post {
    timestamp: number;
    title?: string;
    data?: Data[];
    tags?: string[]
}

interface PostWithAttachment extends Post {
    attachments: {
        data: AttachmentData[]
    }[];
}

interface S {
    posts: (Post | PostWithAttachment)[]
}

export default class Posts extends React.Component<{}, S> {

    state: S = {
        posts: []
    };

    private async getPosts() {
        const mainFolder = (await gapi.client.drive.files.list({ q: "mimeType = 'application/vnd.google-apps.folder' and name = 'facebookdata'" })).result.files!;
        if (!(mainFolder && mainFolder.length === 1)) {
            return;
        }
        const mainFolderId = mainFolder[0].id;

        const topicFolders = (await gapi.client.drive.files.list({ q: `mimeType = 'application/vnd.google-apps.folder' and "${mainFolderId}" in parents` })).result.files!;
        if (!topicFolders) {
            return;
        }

        const postsFolder = topicFolders.find(f => f.name === 'posts');
        if (!(postsFolder && postsFolder.id)) {
            return;
        }
        const postsFolderId = postsFolder.id;
        const postsFile = (await gapi.client.drive.files.list({ q: `"${postsFolderId}" in parents` })).result.files!;
        if (!(postsFile && postsFile.length === 1)) {
            return;
        }
        const postsFileId = postsFile[0].id!;
        if (!postsFileId) {
            return;
        }
        const posts = (await gapi.client.drive.files.get({ fileId: postsFileId, alt: 'media' })).result as PostWithAttachment[];

        // TODO download photos in parallel
        // TODO return posts immediately and do photo download in background
        for (let p of posts) {
            const pwa = p as PostWithAttachment;
            if (pwa.attachments) {
                for (let a of pwa.attachments) {
                    for (let d of a.data) {
                        let mad = d as MediaAttachmentData;
                        if (mad.media && mad.media.uri) {
                            mad.media.content = await this.downloadPhoto(mad.media.uri);
                        }
                    }
                }
            }
        }

        this.setState({ ...this.state, posts });
    }

    private async downloadPhoto(uri: string): Promise<string> {
        const uriPieces = uri.split('/');
        const fileName = uriPieces[uriPieces.length - 1];
        const photoFile = (await gapi.client.drive.files.list({ q: `name = '${fileName}'` })).result.files!;
        if (!(photoFile && photoFile.length === 1)) {
            return '';
        }
        const photoFileId = photoFile[0].id!;
        if (!photoFileId) {
            return '';
        }
        const photo = await gapi.client.drive.files.get({ fileId: photoFileId, alt: 'media' });
        return photo.body;
    }

    componentDidMount() {
        this.getPosts();
    }

    renderTopBar() {
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
                                            <a className="_2s25 _cy7" href="index.html" title="Home">Home</a>
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

    renderPostsTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#8C72CB' }} className="_3z-t"><img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEX///9MaXH///////////////////////////////////////+2I0voAAAAC3RSTlOAAHTdqgOD4wItpp12MDIAAABDSURBVAhbYxCEAgY4o8l6NxBs1mDQ3g0GmxisyxiAIH0zw25XkIqQ3Qy7oYBhN0RqNw4pLhDDGiglCTQRYSDcCgzbAVkOMGvtylXuAAAAAElFTkSuQmCC" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">Your Posts</div>
                </div>
            </div>
        );
    }

    renderPost(post: Post | PostWithAttachment) {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                {
                    post.title
                        ? <div className="_3-96 _2pio _2lek _2lel">{post.title}</div>
                        : undefined
                }
                {this.renderTags(post)}
                <div className="_3-96 _2let">
                    {this.renderAttachments(post as PostWithAttachment)}
                    {this.renderData(post)}
                </div>
                <div className="_3-94 _2lem">{moment(post.timestamp*1000).format('MMM Do, YYYY, h:mm A')}</div>
            </div>
        );
    }

    renderData(post: Post) {
        if (post.data) {
            const postData = post.data.find(d => !!(d as PostData).post);
            if (postData) {
                return this.renderPostData(postData);
            } 
        }
        return undefined;
    }

    renderPostData(data: PostData) {
        return (
            <div>
                <div className="_2pin">
                    <div>{data.post}</div>
                </div>
            </div>
        );
    }

    renderTags(post: Post) {
        if (post.tags && post.tags.length > 0) {
            return (
                <div>
                    <div className="_u14">You tagged {post.tags[0]}</div>
                </div>
            )
        }
        return undefined;
    }

    renderAttachments(post: PostWithAttachment) {
        if (post.attachments) {
            const attachment = post.attachments[0];
            const attachmentData = attachment.data[0];
            if ((attachmentData as ExternalContextAttachmentData).external_context) {
                return this.renderExternalContextAttachmentData(attachmentData as ExternalContextAttachmentData);
            } else if ((attachmentData as MediaAttachmentData).media) {
                return this.renderMediaAttachmentData(attachmentData as MediaAttachmentData);
            }
        }
        return undefined;
    }

    renderExternalContextAttachmentData(data: ExternalContextAttachmentData) {
        return (
            <div className="_2pin">
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <a href={data.external_context.url}>{data.external_context.url}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderMediaAttachmentData(data: MediaAttachmentData) {
        return (
            <div className="_2pin">
                <div>
                    <div>
                        <table className="uiGrid _51mz" cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr className="_51mx">
                                    <td className="_51m- pas">
                                        <div>
                                            <a href="index.html">
                                                <img src={`data:image/jpeg;base64,${btoa(data.media.content)}`} className="_2yuc _3-96" />
                                            </a>
                                            <div className="_3-95">{data.media.description}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="clearfix _ikh">
                <div className="_4bl9">
                    <div className="_li">
                        {this.renderTopBar()}
                        <div className="_3a_u">
                            {this.renderPostsTopBar()}
                            <div className="_4t5n" role="main">
                                {this.state.posts.map(p => this.renderPost(p))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
