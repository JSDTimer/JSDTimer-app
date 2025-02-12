import * as AnalyticsUtil from "./Analytics.util";

export class Session {
    constructor(id, data = [], name="default") {
        this.name = name;
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

    //AO5
    ao5() {
        let result = 0;

        for(let i = 0; i < 5; i++) {
            let current = this.LyticsData.get(i);
            console.log(current);
            result += (current.time / 1000);
        }

        return (result/5);
    }

    //Gets the last time
    last() {
        let result = (this.LyticsData.peek().time) / 1000;
        return result;
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