Calendar = require('../calendar');
expect = require('chai').expect;


cal = new Calendar();
calCustom = new Calendar(new Date(2013, 5, 6));

describe('Month calendar', function() {

  it('creates a correct month calendar for a standard month', function() {
    // May 2013
    standardCal = cal.monthCalendar(new Date(2013, 4));
    expect(standardCal).to.have.length(5);
    expect(standardCal[0][0].date.getDate()).to.equal(29);
    expect(standardCal[standardCal.length-1][6].date.getDate()).to.equal(2);
  });

  it('handles special cases', function() {
    // Feb 28 days
    calFeb28 = cal.monthCalendar(new Date(2013, 1));
    expect(calFeb28[0][0].date.getDate()).to.equal(28);
    expect(calFeb28[calFeb28.length-1][6].date.getDate()).to.equal(3);
    // Feb 29 days
    calFeb29 = cal.monthCalendar(new Date(2016, 1));
    expect(calFeb29[0][0].date.getDate()).to.equal(1);
    expect(calFeb29[calFeb29.length-1][6].date.getDate()).to.equal(6);
    // Feb 28 days beginning with Monday (which is the default first day of a week)
    calFeb28first = cal.monthCalendar(new Date(2021, 1));
    expect(calFeb28first).to.have.length(4); // only 4 weeks are shown
    expect(calFeb28first[0][0].date.getDate()).to.equal(1);
    expect(calFeb28first[calFeb28first.length-1][6].date.getDate()).to.equal(28);
    // in some months 6 weeks are shown
    cal6Weeks = cal.monthCalendar(new Date(2013, 11));
    expect(cal6Weeks).to.have.length(6);
    expect(cal6Weeks[0][0].date.getDate()).to.equal(25);
    expect(cal6Weeks[cal6Weeks.length-1][6].date.getDate()).to.equal(5);
  });

  it('should start the month with the defined start of week', function() {
    weekStartSunday = cal.monthCalendar(new Date(2013,5), {weekStart:0}); //sunday
    expect(weekStartSunday).to.have.length(6); // it got longer!
    expect(weekStartSunday[0][0].date.getDate()).to.equal(26);
    expect(weekStartSunday[weekStartSunday.length-1][6].date.getDate()).to.equal(6);
    weekStartWednesday = cal.monthCalendar(new Date(2013,5), {weekStart:3}); // Wednesday
    expect(weekStartWednesday).to.have.length(5); // it got longer!
    expect(weekStartWednesday[0][0].date.getDate()).to.equal(29);
    expect(weekStartWednesday[weekStartWednesday.length-1][6].date.getDate()).to.equal(2);
  });

  it('should have a working mapping function', function() {
    thisDate = new Date(2013, 5, 6);
    mapMonthCal = calCustom.monthCalendar(thisDate, null, function(date, thisMonth, today, pastDay) {
      return {
        date: date,
        thisMonth: thisMonth,
        today: today,
        pastDay: pastDay
      };
    });
    week = Math.ceil(thisDate.getDate()/7);
    day = thisDate.getDay()-1; // -1 because of startWeek: 1 as default
    expect(mapMonthCal[week][day].date.getDate()).to.equal(thisDate.getDate());
    expect(mapMonthCal[week][day].today).to.be.ok;
    expect(mapMonthCal[week][day+1].today).to.not.be.ok;
    expect(mapMonthCal[week][day].thisMonth).to.be.ok;
    expect(mapMonthCal[0][4].thisMonth).to.not.be.ok;
    expect(mapMonthCal[week][day-1].pastDay).to.be.ok;
    expect(mapMonthCal[week][day+1].pastDay).to.not.be.ok;
  });

describe('Week calendar', function() {
  
  it('creates the correct number of weeks', function() {
    standardWeekCal = cal.weeksCalendar(new Date(2013, 5, 6), {weeks: 3}); // 2013/6/6
    expect(standardWeekCal).to.have.length(3);
  });
});

});