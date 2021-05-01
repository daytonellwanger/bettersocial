import moment from 'moment';

export function getTimeString(timestamp: number) {
    return timestamp < 0
        ? ''
        : moment(timestamp * 1000).format('MMM Do, YYYY, h:mm A');
}

export function getTimeStringFirstLine(timestamp: number) {
    return timestamp < 0
        ? ''
        : moment(timestamp * 1000).format('MMM Do, YYYY');
}

export function getTimeStringSecondLine(timestamp: number) {
    return timestamp < 0
        ? ''
        : moment(timestamp * 1000).format('h:mm A');
}

export function decodeString(raw: string) {
    const arr = [];
    for (var i = 0; i < raw.length; i++) {
        arr.push(raw.charCodeAt(i));
    }
    return Buffer.from(arr).toString('utf8');
}
