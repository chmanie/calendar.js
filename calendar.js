(function () {
  function Calendar (date) {
    // a custom 'today' date can be injected
    this.now = date || new Date();
  }

  Calendar.prototype.monthCalendar = function(date, options, action) {
    if (options) {
      options.view = 'month';
    } else {
      options = { view: 'month' };
    }
    return this.createCalendar(date, options, action);
  };

  Calendar.prototype.weeksCalendar = function(date, options, action) {
    if (options) {
      options.view = 'weeks';
    } else {
      options = { view: 'weeks' };
    }
    return this.createCalendar(date, options, action);
  };

  Calendar.prototype.createCalendar = function (dateObj, options, action) {
    var date = dateObj || this.now;
    options.view = options.view || 'month';
    var cYear = date.getFullYear();
    var cMonth = date.getMonth();
    var cDate = date.getDate();
    var cWeekStart = (options.weekStart === 0) ? 0 : options.weekStart || 1; // week starts on monday by default, sunday: 0
    // TODO: switch
    var cWeeks, firstDayOfView, firstDayOffset;
    // --- monthCalendar ---
    if (options.view === 'month') {
      var firstDayOfMonth = new Date(cYear, cMonth, 1).getDay(); // weekday of first month
      var lastDateOfMonth = new Date(cYear, cMonth+1, 0).getDate(); // number of days in current month
      firstDayOffset = cWeekStart > firstDayOfMonth ? cWeekStart-7 : cWeekStart; // set offset for first day of view
      firstDayOfView =  new Date(cYear, cMonth, firstDayOffset-firstDayOfMonth+1); //  first day in first row
      // calculate rows of view
      // TODO: simplify!
      if(firstDayOfView.getDate() === 1) {
        // Month starts at row 1 in column 1
        cWeeks = Math.ceil(lastDateOfMonth / 7);
      } else {
        var lastDateOfLastMonth = new Date(cYear, cMonth, 0).getDate();
        var additionalDays = lastDateOfLastMonth - firstDayOfView.getDate() + 1;
        cWeeks = Math.ceil((lastDateOfMonth + additionalDays) / 7);
      }
    // --- weeksCalendar ---
    } else if (options.view === 'weeks') {
      cWeeks = options.weeks || 4; // show 4 weeks by default
      firstDayOfView = new Date(cYear, cMonth, cDate);
      firstDayOffset = cWeekStart > firstDayOfView.getDay() ? cWeekStart-7 : cWeekStart;
      firstDayOfView.setDate(cDate - firstDayOfView.getDay() + parseInt(firstDayOffset, 10));
    }

    var currentDate = firstDayOfView;
    var cal = [];

    // create calendar model
    for (var week = 0; week < cWeeks; week++) {
      cal[week] = [];
      for (var day = 0; day < 7; day++) {
        // determine exposed parameters
        var today = (this.now.getFullYear() === currentDate.getFullYear() &&
                    this.now.getMonth() === currentDate.getMonth() &&
                    this.now.getDate() === currentDate.getDate());

        // implementation of already past days
        var pastDay = (currentDate.valueOf() < this.now.valueOf() && !today);

        var thisMonth = (cMonth === currentDate.getMonth());

        // TODO: thisWeek?

        var contents = {
          date: currentDate,
          isInCurrentMonth: thisMonth,
          isToday: today,
          isPastDate: pastDay
        };

        // if action is defined results of the action function are pushed into the calendar array
        if ('function' === typeof action) {
          contents.entries = action(currentDate, thisMonth, today, pastDay) || [];
        }
        
        cal[week].push(contents);
        
        // increment day
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1);
      }
    }

    function populate(fn) {
      for (var i = cal.length - 1; i >= 0; i--) {
        for (var j = cal[i].length - 1; j >= 0; j--) {
          cal[i][j].entries = fn(cal[i][j].date, cal[i][j].isInCurrentMonth, cal[i][j].isToday, cal[i][j].isPastDate);
        }
      }
    }

    return {
      calendar: cal,
      populate: populate
    };

  };

  // for node.js
  if (typeof(module) !== 'undefined') {
    module.exports = Calendar;
  } else {
    window.Calendar = Calendar;
  }
})();