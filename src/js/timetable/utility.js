var weekDayName = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
var monthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
var dateRegExp = new RegExp(/^[12]\d{3}-[0-1]\d-[0-3]\dT[0-2]\d:[0-6]\d:[0-6]\d(\.{1}\d{1,3})?(([+-][0-1]\d:[0-6]\d)|Z)$/);

function isNaturalNum (num) {
  return typeof num === 'number' && !isNaN(parseFloat(num)) && isFinite(num) && (num % 1 === 0);
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

function validateDates (dateBegin, dateEnd) {

  if (isNaN(dateBegin.getTime()) || isNaN(dateEnd.getTime())) {
    throw new TimetableError('Неверная дата');
  }

  if (dateBegin > dateEnd){
    throw new TimetableError('Дата начала больше даты конца');
  }

}

function createDate (date) {

  if (!dateRegExp.test(date)) {
    throw new TimetableError('Неверный формат даты');
  }

  return new Date(date);
}

function getTime (date) {
  var minute = date.getMinutes().toString();

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
