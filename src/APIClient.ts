export default class APIClient {

    constructor (private isReadyCallback: () => void) {}

    public init() {
        gapi.load('client:auth2', () => this.initClient());
    }
    
    private async initClient() {
        await gapi.client.init({
            apiKey: 'AIzaSyB4SEgW3JCa8BcCJs7_85scJ_tFGnWD3NE',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            clientId: '1061292514174-dakput8vml1a9lk1o0qffgrg8mhtsvci.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.readonly'
        });
        gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn: boolean) => this.updateSigninStatus(isSignedIn));
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }
    
    private async updateSigninStatus(isSignedIn: boolean) {
        if (isSignedIn) {
            this.isReadyCallback();
        }
    }
    
    public signIn() {
        gapi.auth2.getAuthInstance().signIn();
    }

}
