import React from 'react';
import { Container, Link, Typography } from '@material-ui/core';
import MainContainer from './MainContainer';

export default class About extends React.Component {

    render() {
        return (
            <MainContainer homeEnabled={true} betterSocialLink="/" openBetterSocialLinkInNewTab={false}>
                <div style={{ height: '100%', overflowY: 'scroll' }}>
                    <Container maxWidth="lg" style={{ padding: '2em' }}>
                        <Typography variant="h4" color="secondary">Own Your Facebook Data</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Your data is yours, not Facebook’s.</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Better Social lets you host your data so you’re in full control of it while still being able to view it as easily as if it were hosted on Facebook.</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">We hope this makes it easier for you to quit using Facebook.</Typography>
                        <br />
                        <br />
                        <Typography variant="h5" color="secondary">How your data is used by Facebook</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">You don’t pay for Facebook, so how does Facebook make billions of dollars? By selling advertisement spots to advertisers.</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">The longer Facebook can keep you on their site looking at ads, and the better they’re able to predict which ads you’ll interact with, the more money they make. Improvements in their ability to do these are fueled by your data. We won’t write more about it here, because it’s been written about extensively elsewhere, but in short: Facebook isn’t incentivized to make your life better, but to keep you glued to your screen.</Typography>
                        <br />
                        <Typography variant="h5" color="secondary">Why we don’t quit Facebook</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Most of us are now sold on the idea that Facebook doesn’t improve our lives. So why do we still use it? People generally give two reasons: wanting to stay in touch with their contacts — hearing about events, seeing updates, messaging — and wanting to maintain access to their data — posts, comments, photos, messages. For the former, we’d recommend the old-fashioned ways. For the latter, we built this tool.</Typography>
                        <br />
                        <Typography variant="h5" color="secondary">General Data Protection Regulation (GDPR)</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">The <Link color="secondary" href="https://en.wikipedia.org/wiki/General_Data_Protection_Regulation" underline="always" target="_blank">GDPR</Link> gives you something that may seem like an obvious right — the right to your data. Due to it, Facebook is required to hand over your data or delete it at your request. You can do both <Link color="secondary" href="https://www.facebook.com/dyi" underline="always" target="_blank">here</Link>.</Typography>
                        <br />
                        <Typography variant="h5" color="secondary">Why we built this tool</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">With Facebook’s Download Your Information tool you can get a dump of all your data. There’s even an HTML page included so you can browse it locally as if it were a website. So why use our tool? Because your data is valuable and hard drives crash. You probably also want to view it from multiple devices without having to copy it to each one. Our tool uploads your data to the cloud and lets you access it from any browser, including mobile, securely and easily.</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Facebook has no incentive to make the experience of viewing your data enjoyable or easy. In fact, they’re disincentivized from doing so. We believe we can provide you with a better experience.</Typography>
                        <br />
                        <Typography variant="h5" color="secondary" id="how-it-works">How it works</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">You log in with your Google account (more on that below) and upload your data that you got from Facebook. Your data is stored in your Google Drive — you can find it in the “facebook-data” folder. It never goes anywhere else. We don’t actually have any servers of our own, so it can’t.</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Then when you visit the site, it fetches your data from your Google Drive and displays it in your browser.</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Again, we have no servers — the site is simply requesting information from your Google Drive and displaying it in your browser. We just provide the glue that makes it happen.</Typography>
                        <br />
                        <Typography variant="h5" color="secondary" id="why-google">Why Google?</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Taking your data from one controversy-ridden tech behemoth whose business model is essentially using your data to sell ads and uploading it to another may seem like it doesn’t buy you much. However, while Google is mainly funded through ad revenue, Google Drive is mainly funded through selling you more storage. No one would use a cloud storage provider that snooped through their content. <Link color="secondary" href="https://www.google.com/drive/terms-of-service/" underline="always" target="_blank">Google Drive's Terms of Service</Link> state that "your content remains yours." In addition, according to <Link color="secondary" href="https://policies.google.com/privacy" underline="always" target="_blank">Google's Privacy Policy</Link>, your data is not shared with anyone else except your domain administrator, in the case that you have an organizational account, or in the case of legal matters.</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">Still, we understand not wanting to give these companies more data and more power. In an ideal world, there would be a decentralized cloud storage provider that was widely used and able to support our application. We plan to support more cloud storage providers in the future, but decided to prove out the concept of this tool with Google Drive because most people already have an account, it offers free storage, and has the APIs and capacity to power this application.</Typography>
                        <br />
                        <Typography variant="h5" color="secondary">How we’re funded</Typography>
                        <br />
                        <Typography variant="body1" color="secondary">We’re funded through donations, not your data. You can donate <Link color="secondary" href="https://www.buymeacoffee.com/bettersocial" underline="always" target="_blank">here</Link>.</Typography>
                        <br />
                    </Container>
                </div>
            </MainContainer>
        );
    }

}
