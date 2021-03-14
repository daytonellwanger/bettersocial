async function executeWithExponentialBackoff(executeRequest: () => Promise<any>, delay = 1000, attemptNumber = 1): Promise<any> {
    if (attemptNumber === 6) {
        throw new Error('Could not upload'); 
    }
    let didThrow = false;
    let result: any;
    try {
        result = await executeRequest();
    } catch {
        didThrow = true;
    }
    if (didThrow || (typeof result.status === 'number' && result.status !== 200)) {
        await new Promise<void>((resolve, reject) => {
            setTimeout(() => resolve(), delay);
        });
        attemptNumber++;
        delay = 2*delay;
        return executeWithExponentialBackoff(executeRequest, delay, attemptNumber);
    } else {
        return result;
    }
}

type PendingRequest = {
    executeRequest: () => Promise<any>,
    resolveResult: (result: any) => void
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
            const result = new Promise<any>((resolve, reject) => {
                resolveResult = resolve;
            });
            const pendingRequest: PendingRequest = {
                executeRequest,
                resolveResult: resolveResult!
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
        const result = await this.request(nextRequest.executeRequest);
        nextRequest.resolveResult(result);
    }

}

export const requestQueue = new RequestQueue();
