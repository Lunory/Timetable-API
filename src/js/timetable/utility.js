var weekDayName = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
var monthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

function TimetableError (message) {
  this.name = "TimetableError";

  this.message = message;

  this.stack = (new Error()).stack;
}

function isNumeric (num) {
  return typeof num === 'number' && !isNaN(parseFloat(num)) && isFinite(num);
}

function intersectionDates (dateBegin1, dateEnd1, dateBegin2, dateEnd2) {
  if (dateBegin1 > dateEnd2 || dateEnd1 < dateBegin2) {
    return false;
  }

  return true;
}

function validateId (id, collection) {
  if (typeof id !== 'string') {
    throw new TimetableError('id должен быть строкой');
  }

  if (id.length === 0) {
    throw new TimetableError('id не должен быть пустым');
  }

  if (collection[id] !== undefined) {
    throw new TimetableError('Объект с таким id существует');
  }
}

function getTime (date) {
  var minute = date.getMinutes().toString()
  if (minute.length < 2) {
    minute = '0' + minute;
  }

  return date.getHours().toString() + ':' + minute;
}

function getWeekDay (date) {
  return weekDayName[date.getDay()];
}

function getMonth (date) {
  return monthName[date.getMonth()];
}
