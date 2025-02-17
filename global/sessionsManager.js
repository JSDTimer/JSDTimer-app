import * as AnalyticsUtil from "./Analytics.util";

export class Session {
    constructor(id, data = [], name="default") {
        this.name = name;
        this.sessionID = id;
        this.analytics = new Analytics(data);
    }
}


export class Data {
    constructor(time, date, type, scramble) {
        this.time = time;
        this.date = date;
        this.type = type;
        this.scramble = scramble;
    }
}

class Analytics {
    constructor(data = []) {
        this.LyticsData = new Stack(data);
    }

    //AO5
    ao5() {
        if(this.LyticsData.size() < 5) return 0;
        let result = 0;

        for(let i = 0; i < 5; i++) {
            let current = this.LyticsData.get(i);
            result += (current.time / 1000);
        }

        return (result/5);
    }

    //AO12
    ao12() {
        if(this.LyticsData.size() < 12) return 0;
        let result = 0;

        for(let i = 0; i < 12; i++) {
            let current = this.LyticsData.get(i);
            result += (current.time / 1000);
        }

        return (result/12);
    }

    //Gets the last time
    last() {
        if(this.LyticsData.size() == 0) return 0;
        let result = (this.LyticsData.peek().time) / 1000;
        return result;
    }

    //Mean
    mean() {
        if(this.LyticsData.size() == 0) return 0;
        let result = 0;
        let total = this.LyticsData.size();

        for(let i = 0; i < total; i++) {
            let current = this.LyticsData.get(i);
            result += (current.time / 1000);
        }

        return (result/total);
    }

    //Solves
    solves() {
        return this.LyticsData.size();
    }

    //Best singles
    bestSingle() {
        if(this.LyticsData.size() == 0) return 0;
        let result = 0;
        let total = this.LyticsData.size();

        for(let i = 0; i < total; i++) {
            let current = this.LyticsData.get(i);
            let time = (current.time / 1000)
            
            if(result == 0) {
                result = time;
            } else if(result > time) {
                result = time;
            }
        }

        return result;
    }

    //The graph requires an array full of objects
    toGraphData() {
        let result = [];
        let incr = 0;
        let total = this.LyticsData.size();

        for(let i = total - 1; i >= 0; i--) {
            let current = this.LyticsData.get(i);
            result[i] = {time: (current.time / 1000), solveNum: incr + 1};
            incr++;
        }

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

    remove(index) {
        let actualIndex = this.data.length - (1 + index);

        this.data = this.data.filter((_, index) => index != actualIndex);
    }
}