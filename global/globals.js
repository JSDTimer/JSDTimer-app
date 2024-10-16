//Maybe put analytics functions here idk 

// Utility function to parse the date string
function getDayString(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

//Implementing bubblesort
//TODO: Improve to a better sorting algorithm
function sortTimes(times) {
    const n = times.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (times[j] > times[j + 1]) {
                //Swap
                let temp = times[j + 1];
                times[j + 1] = times[j];
                times[j] = temp;
            }
        }
    }
}

//Function to parse through a list of times and return the mean, with the number of drops
//indicating the number removed from the start and end of the array
function getMean(times, numDropped) {
    const n = times.length;
    sortTimes(times);

    let i = numDropped;
    let j = n - 1 - numDropped;
    let total = 0;
    let total_elements = 0;

    while (i < j) {
        total += (times[i] + times[j]);
        i++;
        j--;
        total_elements++;
    }
    return total / total_elements;
}

//Function to show how well a user does at certain times of day
function performanceByTimeOfDay(times) {
    const timesOfDay = { morning: [], afternoon: [], evening: [] };
    times.forEach(({ time, timestamp }) => {
        const hours = new Date(timestamp).getHours();
        if (hours < 12) {
            timesOfDay.morning.push(time);
        } else if (hours < 18) {
            timesOfDay.afternoon.push(time);
        } else {
            timesOfDay.evening.push(time);
        }
    });

    return {
        morningMean: getMean(timesOfDay.morning, 0),
        afternoonMean: getMean(timesOfDay.afternoon, 0),
        eveningMean: getMean(timesOfDay.evening, 0),
    };
}