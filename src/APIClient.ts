export default class APIClient {

    constructor (private updateSignInStatus: (isSignedIn: boolean) => void) {}

    public init() {
        gapi.load('client:auth2', () => this.initClient());
    }
    
    private async initClient() {
        await gapi.client.init({
            apiKey: 'AIzaSyB4SEgW3JCa8BcCJs7_85scJ_tFGnWD3NE',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            clientId: '1061292514174-dakput8vml1a9lk1o0qffgrg8mhtsvci.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file'
        });
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);
        this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }
    
    public signIn() {
        gapi.auth2.getAuthInstance().signIn();
    }

    public signOut() {
        gapi.auth2.getAuthInstance().signOut();
    }

}
