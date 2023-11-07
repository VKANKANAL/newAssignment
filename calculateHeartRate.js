let heartrates = require('./heartrate.json');

/*
* Method to get lowest heart rate
* @param data
*/
function getLowestHeartRateForTheDay(data){
  const lowestForTheDay = data.reduce(
    (acc, loc) =>
      acc.beatsPerMinute < loc.beatsPerMinute
        ? acc
        : loc
  )
  return lowestForTheDay.beatsPerMinute;
}

/*
* Method to get highest heart rate
* @param data
*/
function getHighestHeartRateForTheDay(data){
  const highestForTheDay = data.reduce(
    (acc, loc) =>
      acc.beatsPerMinute > loc.beatsPerMinute
        ? acc
        : loc
  )
  return highestForTheDay.beatsPerMinute;
}

/*
* Method to get median heart rate
* @param data
*/
function getMedianHeartRateForTheDay(data){
  const mid = Math.floor(data.length / 2),
    nums = [...data].sort((a, b) => a.beatsPerMinute - b.beatsPerMinute);
    const medianData = data.length % 2 !== 0 ? nums[mid].beatsPerMinute : (nums[mid - 1].beatsPerMinute + nums[mid].beatsPerMinute) / 2;
  return medianData;
};

/*
* Method to get final date of data
* @param data
*/
function getDateofData(data){
    const finalDate = data.split('T')[0];
    return finalDate;
}

/*
* Method to get latest time stamp
* @param data
*/
function getLatestTimestamp(data){
    const dateForTheDay = data.reduce(
      (acc, loc) =>
        acc.timestamps.startTime > loc.timestamps.startTime
          ? acc
          : loc
    );
    return dateForTheDay.timestamps.startTime;
}


/*
* Method to get all the dates
* @param arr
*/
function getAllDatesofHeartRates(arr) {
    const newDatesArr = [];
    arr.map((val, index)=> {
        const timeStamp = val.timestamps.startTime;
        const onlyDate = timeStamp.split('T')[0];
            newDatesArr.push(onlyDate);
    });
    const finalDates = [...new Set(newDatesArr)];
    return finalDates;
}

/*
* Method to get data of the day
* @param data
*/
function getDataOfTheDay(data, dataDate){
    let minData = [];
    data.map((val)=>{
        const timeStamp = val.timestamps.startTime;
        const onlyDate = timeStamp.split('T')[0];
        if(dataDate === onlyDate){
            minData = [...minData, val];
            return val;
        }
    });
    return minData;
}

/*
* Method to get required values of data
* @param arr
*/
function heartRateDataPerDay(arr) {
    const heartRateDates = getAllDatesofHeartRates(arr);
    let output = [];
    for(i=0; i<heartRateDates.length; i++){
        let dataOnDay = getDataOfTheDay(arr, heartRateDates[i]);
        requiredData = {
            date: getDateofData(heartRateDates[i]),
            min: getLowestHeartRateForTheDay(dataOnDay),
            max: getHighestHeartRateForTheDay(dataOnDay),
            median: getMedianHeartRateForTheDay(dataOnDay),
            latestDataTimestamp: getLatestTimestamp(dataOnDay)
        }
        output.push(requiredData);
    }  
    return output;  
}

const outputResult = heartRateDataPerDay(heartrates);

  var fs = require('fs');

  const jsonContent = JSON.stringify(outputResult);

  fs.writeFile("output.json", jsonContent, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
    console.log("output.json written successfully");
  });
