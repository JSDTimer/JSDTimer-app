import * as AnalyticsUtil from "./Analytics.util";

export class Session {
    constructor(id, data = []) {
        this.sessionID = id;
        this.analytics = new Analytics(data);
    }
}


export class Data {
    constructor(time, date) {
        this.time = time;
        this.date = date;
    }
}

class Analytics {
    constructor(data = []) {
        this.LyticsData = new Stack(data);
    }    
}


class Stack {
    constructor(data = []) {
        this.data = data
    }

    push(arg) {
        this.data.push(arg);
    }

    peek() {
        return this.data[this.data.length - 1];
    }

    size() {
        return this.data.length;
    }

    get(index) {
        return this.data[this.data.length - (1 + index)];
    }

    isEmpty() {
        return this.data.length == 0;
    }

    pop() {
        return this.data.pop();
    }
}