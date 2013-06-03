calendar.js
===========

This library is intended to help you with a common problem: calendar view models. It maps your models into a monthly view of a calendar.

Usage:
    
    cal = new Calendar();
    month = cal.monthCalendar(year, month, weekStart, mapFun);

It creates a calendar array for the given year and month (0 to 11). Weeks start at the day specified in weekStart: 0 (Sunday) to 6 (Saturday).

You can use the mapping function to process your data model into the calendar days. Some helpful variables are exposed to your mapping function:

  * date: JS date object for 00:00:00h on the currently processed day
  * today: truthy, if the currently processed day equals today
  * thisMonth: truthy, if the currently processed day is inside the given month (the array contains 7 days for every week, so there might be days at the beginning or end of it that don't belong to the assessed month)

Example:

    myMonth = cal.monthCalendar(2013, 5, 1, function(date, today, thisMonth) {
      event = (myEvent.date === date.getDate()) ? myEvent : null;
      cssClass = today ? 'today' : 'day';
      return {
        events: [event]
        cssClass: cssClass
      }
    });
    
Results in a 5x7 grid array for the given month (June 2013) which contains your desired data (today's date is the 1st of june in our example):
    
                         May 27, May 28, May 29, May 30, May 31, Jun 01, Jun 02
                            |       |       |       |       |       |       |
    myMonth[0]      === [Object, Object, Object, Object, Object, Object, Object]
                         /   \                                    /   \
    e.g.:   events: [event]  cssClass: 'day'         events: [null]  cssClass: 'today'
    
    myMonth[1]      === [...]
    myMonth[...]    === [...]
    myMonth[4]      === [Object, Object, Object, Object, Object, Object, Object]
                            |       |       |       |       |       |       |
                         Jun 24, Jun 25, Jun 26, Jun 27, Jun 28, Jun 29, Jun 30
    
The method doesn't need any arguments:
  
    anotherMonth = cal.monthCalendar();

Defaults are:

* year: todays year
* month: todays month
* weekStart: 1 (Mondays)

The result is an array grid filled with the exposed variables as seen above for every single day: date, today and thisMonth.
