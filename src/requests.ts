async function executeWithExponentialBackoff(executeRequest: () => Promise<any>, delay = 1000, attemptNumber = 1): Promise<any> {  
    let result: any;
    let error: any;

    try {
        result = await executeRequest();
    } catch (e) {
        error = e;
    }

    if (error || (typeof result.status === 'number' && result.status >= 400)) {
        attemptNumber++;
        if (attemptNumber === 8) {
            throw error || (new Error(result.toString()));
        }

        await new Promise<void>((resolve, reject) => {
            setTimeout(() => resolve(), delay);
        });

        return executeWithExponentialBackoff(executeRequest, 2*delay, attemptNumber);
    } else {
        return result;
    }
}

type PendingRequest = {
    executeRequest: () => Promise<any>,
    resolveResult: (result: any) => void,
    rejectRequest: (reason?: any) => void
};

class RequestQueue {

    private static readonly maxParallelRequests = 25;
    private activeRequests = 0;
    private pendingRequests: PendingRequest[] = [];

    public async request<T>(executeRequest: () => Promise<T>): Promise<T> {
        if (this.activeRequests < RequestQueue.maxParallelRequests) {
            this.activeRequests++;
            const result = await executeWithExponentialBackoff(executeRequest);
            this.activeRequests--;
            this.processNextRequest();
            return result;
        } else {
            let resolveResult: (result: any) => void;
            let rejectRequest: (reason?: any) => void;
            const result = new Promise<any>((resolve, reject) => {
                resolveResult = resolve;
                rejectRequest = reject;
            });
            const pendingRequest: PendingRequest = {
                executeRequest,
                resolveResult: resolveResult!,
                rejectRequest: rejectRequest!
            }
            this.pendingRequests.push(pendingRequest);
            return result;
        }
    }

    private async processNextRequest() {
        if (this.pendingRequests.length === 0) {
            return;
        }
        const nextRequest = this.pendingRequests.splice(0, 1)[0];
        try {
            const result = await this.request(nextRequest.executeRequest);
            nextRequest.resolveResult(result);
        } catch (e) {
            nextRequest.rejectRequest(e);
        }
    }

}

export const requestQueue = new RequestQueue();
