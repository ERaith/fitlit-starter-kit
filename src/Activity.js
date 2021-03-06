class Activity {
  constructor(activityData) {
    this.activityData = activityData;
  }

  calcMilesToday(userID, date, strideLength) {
    let currentUser = this.activityData.filter(data => data.userID === userID);
    let distance = currentUser.find(stride => stride.date === date).numSteps * strideLength;
    return Number((distance / 5280).toFixed(2));
  }

  getMinutesActive(userID, date) {
    let currentUser = this.activityData.filter(data => data.userID === userID);
    return currentUser.find(minute => minute.date === date).minutesActive;
  }
  getSteps(userID, date) {
    let currentUser = this.activityData.filter(data => data.userID === userID);
    return currentUser.find(minute => minute.date === date).numSteps;
  }
  getPrevDaysData(userID, startDate, typeOfData) {
    let startDateParsed = new Date(startDate);
    let endDateParsed = new Date(startDate);
    endDateParsed.setDate(startDateParsed.getDate() - 7);
    let userActiveData = this.activityData.filter(userEntry => userEntry.userID === userID);
    let userActiveDaysData = userActiveData.filter((activeDayData) => {
      let day = new Date(activeDayData.date);
      if (day <= startDateParsed && day >= endDateParsed) {
        return true;
      }
    });
    return userActiveDaysData.map(data => data[typeOfData]);
  }
  calcActiveAverage(userID, startDate) {
    let prevMinutesActive = this.getPrevDaysData(userID, startDate, 'minutesActive');
    let totalActiveMinutes = prevMinutesActive.reduce((total, curVal) => {
      total += curVal;
      return total
    }, 0);
    return Number((totalActiveMinutes / prevMinutesActive.length).toFixed(2));
  }

  checkReachedStepGoal(userData, date) {
    let currentUser = this.activityData.filter(data => data.userID === userData.id);
    let steps = currentUser.find(step => step.date === date)
    if (userData.dailyStepGoal > steps.numSteps) {
      return false
    } else {
      return true
    }
  }

  getExceededStepGoal(userData) {
    let currentUser = this.activityData.filter(data => data.userID === userData.id);
    let daysThatExceededStepGoal = currentUser.reduce((acc, activity) => {
      if (userData.dailyStepGoal <= activity.numSteps) {
        acc.push(activity.date);
      }
      return acc;
    }, [])
    return daysThatExceededStepGoal;
  }

  findHighestClimbingRecord(userID) {
    let currentUser = this.activityData.filter(data => data.userID === userID);
    let climbingRecord = currentUser.sort((a, b) => {
      return b.flightsOfStairs - a.flightsOfStairs;
    })
    return climbingRecord[0].flightsOfStairs;
  }

  calcUsersAverage(date, type) {
    let dailyActivity = this.activityData.filter(data => data.date === date);
    return dailyActivity.reduce((acc, user) => {
      return acc += user[type];
    }, 0) / dailyActivity.length;
  }


  findStreaks(userID) {
    let userActivityData = this.activityData.filter(data => data.userID === userID);
    let streaks = [];
    let streak = userActivityData.reduce((acc, day) => {
      if (acc.prevNumSteps < day.numSteps) {
        acc.curStreak.push(day)
      } else if (acc.curStreak.length >= 3) {
        streaks.push({
          endDate: day.date,
          streakRun: acc.curStreak.length
        });
        acc.curStreak = [day];
      } else {
        acc.curStreak = [day];
      }
      acc.prevNumSteps = day.numSteps;
      return acc;
    }, {
      prevNumSteps: 0,
      curStreak: []
    })
    return streaks;
  }
  /*
  streaks [{
  endDate : ;
  days in Streak: ;
  }]
  */

  calcProgressToMntTop(userID) {
    let currentUser = this.activityData.filter(data => data.userID === userID);
    let total = currentUser.reduce((acc, day) => {
      return acc += day.flightsOfStairs;
    }, 0)
    return (Math.round((total / 1400) * 100)) / 100;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Activity;
}
