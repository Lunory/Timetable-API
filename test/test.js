function TimetableError (message) {
  this.name = "TimetableError";
  this.message = message;
  this.stack = (new Error()).stack;
}

TimetableError.prototype = Object.create(Error.prototype);
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

function getStartDay(date) {
  var startDate = new Date(date.getTime());
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  return startDate;
}
function Tutor (id, name, about, img) {
  this.id = id;
  this.name = name;
  this.about = about;
  this.img = img;

  this.getHtml = function () {
    return  '<a class="timetable__subject-tutor" data-tutor="' + this.id + '" href="' + this.hrefTutorPage + '">' +
      '<img ' +
      'src="' + this.img + '-icon@1x.jpg"' +
      'srcset="' + this.img + '-icon@1x.jpg 1x, ' + this.img + '-icon@2x.jpg 2x"' +
      'width="45" height="45" alt="' + this.name +
      '">' +
      '<span>' + this.name + '</span>' +
      '</a>';
  }
}

var tutorCollection = {

  collection: Object.create(null),

  validateName: function (newName) {

    if (typeof newName !== 'string') {
      throw new TimetableError('Имя должно быть строкой');
    }

    if ( newName.length === 0) {
      throw new TimetableError('Имя не должно быть пустое');
    }

  },

  validateAbout: function (newAbout) {

    if (typeof newAbout !== 'string') {
      throw new TimetableError('Информация о преподавателе должна быть строкой');
    }

    if (newAbout.length === 0) {
      throw new TimetableError('Информация о преподавателе не должна быть пустой');
    }

  },

  getById: function (id) {

    if (!(this.collection[id] instanceof Tutor)) {
      throw new TimetableError('Преподавателя с таким id не существует');
    }

    return this.collection[id];
  },

  add: function (id, name, about, img) {
    validateId(id, this.collection);
    this.validateName(name);
    this.validateAbout(about);
    this.collection[id] = new Tutor(id, name, about, img);

    return true;
  }
};
function School (id, name, studentsCount) {
  this.id = id;
  this.name = name;
  this.studentsCount = studentsCount;

  this.getHtml = function () {
    return '<p class="timetable__school">' + this.name +'</p>'
  };

  this.setName = function(newName) {
    this.name = newName;
  };

  this.setStudentsCount = function(newStudentsCount) {
    this.studentsCount = newStudentsCount;
  };
}

var schoolCollection = {

  collection : Object.create(null),

  validateName: function (newName) {

    if (typeof newName !== 'string') {
      throw new TimetableError('Имя должно быть строкой');
    }

    if ( newName.length === 0) {
      throw new TimetableError('Имя не должно быть пустое');
    }

    for (var key in this.collection) {
      if (this.collection[key].name === newName) {
        throw new TimetableError('Школа с таким именем уже существует');
      }
    }

  },

  validateStudentsCount: function (newStudentsCount) {

    if (!isNaturalNum(newStudentsCount)) {
      throw new TimetableError('Количество студентов должно быть числом');
    }

    if (newStudentsCount <= 0) {
      throw new TimetableError('Количество студентов должно быть больше 0');
    }

  },

  getById: function (id) {

    if (!(this.collection[id] instanceof School)) {
      throw new TimetableError('Такого id не существует');
    }

    return this.collection[id];
  },

  setName: function (id, newName) {
    this.validateName(newName);
    this.getById(id).setName(newName);
  },

  setStudentsCount: function (id, newStudentsCount) {
    this.validateStudentsCount(newStudentsCount);
    var school = this.getById(id);
    var diffCountStudents = newStudentsCount - school.studentsCount;

    for (var key in lectureCollection.collection) {
      var lecture = lectureCollection.collection[key];

      if (lecture.schoolList.indexOf(school) >= 0) {
        lectureCollection.validateCapacity(lecture.schoolList, lecture.classRoom.capacity - diffCountStudents, lecture);
      }
    }

    school.setStudentsCount(newStudentsCount);
    return true;
  },

  add: function (id, name, studentsCount) {
    validateId(id, this.collection);
    this.validateName(name);
    this.validateStudentsCount(studentsCount);
    this.collection[id] = new School(id, name, studentsCount);

    return true;
  },

  getHtml : function (schoolList) {
    var html = '';

    for (var i = 0; i < schoolList.length; i++) {
      html += schoolList[i].getHtml();
    }

    return html;
  }
};
function ClassRoom (id, name, capacity, location) {
  this.id = id;
  this.name = name;
  this.capacity = capacity;
  this.location = location;

  this.setName = function(newName) {
    this.name = newName;
  };

  this.setCapacity = function (newCapacity) {
    this.capacity = newCapacity;
  };

  this.setLocation = function (newLocation) {
    this.location = newLocation;
  };

  this.getHtml = function () {
    return '<p class="timetable__place">'+ this.location +'</p>';
  }
}

var classRoomCollection = {

  collection: Object.create(null),

  validateName: function (newName) {

    if (typeof newName !== 'string') {
      throw new TimetableError('Имя должно быть строкой');
    }

    if (newName.length === 0) {
      throw new TimetableError('Имя не должно быть пустое');
    }

    for (var key in this.collection) {

      if (this.collection[key].name === newName) {
        throw new TimetableError('Аудитория с таким именем уже существует');
      }

    }

  },

  validateCapacity: function (newCapacity) {

    if (!isNaturalNum(newCapacity)) {
      throw new TimetableError('Количество мест в аудитории должно быть числом');
    }

    if (newCapacity <= 0) {
      throw new TimetableError('Количество мест в аудитории должно быть больше 0');
    }

  },

  validateLocation: function (newLocation) {

    if (typeof newLocation !== 'string') {
      throw new TimetableError('Месторасположение аудитории должно быть строкой');
    }

    if (newLocation.length === 0) {
      throw new TimetableError('Месторасположение аудитории не должно быть пустым');
    }

  },

  getById: function (id) {

    if (!(this.collection[id] instanceof ClassRoom)) {
      throw new TimetableError('Аудитории с таким id не существует');
    }

    return this.collection[id];
  },

  setName: function (id, newName) {
    this.validateName(newName);
    this.getById(id).setName(newName);
  },

  setCapacity: function (id, newCapacity) {
    this.validateCapacity(newCapacity);
    var classRoom = this.getById(id);

    for (var key in lectureCollection.collection) {

      if (lectureCollection.collection[key].classRoom === classRoom) {
        var lecture = lectureCollection.collection[key]
        lectureCollection.validateCapacity(lecture.schoolList, newCapacity, lecture);
      }

    }

    classRoom.setCapacity(newCapacity);
    return true;
  },

  setLocation: function (id, newLocation) {
    this.validateLocation(newLocation);
    this.getById(id).setLocation(newLocation);
  },

  add: function (id, name, capacity, location) {
    validateId(id, this.collection);
    this.validateName(name);
    this.validateCapacity(capacity);
    this.validateLocation(location);

    this.collection[id] = new ClassRoom(id, name, capacity, location);

    return true;
  }

};
function Lecture (id, name, tutor, schoolList, classRoom, dateBegin, dateEnd)   {
  this.id = id;
  this.active = true;
  this.name = name;
  this.tutor = tutor;
  this.schoolList = schoolList;
  this.classRoom = classRoom;
  this.dateBegin = dateBegin;
  this.dateEnd = dateEnd;
  this.day = null;

  this.setActive = function (active) {
    this.active = active
    return true
  }

  this.setTutor = function (newTutor) {
    this.tutor = newTutor;
  };

  this.setSchoolList = function (newSchoolList) {
    this.schoolList = newSchoolList;
  };

  this.setClassRoom = function (newClassList) {
    this.classList = newClassList;
  };

  this.setDates = function (newDateBegin, newDateEnd) {
    this.dateBegin = newDateBegin;
    this.dateEnd = newDateEnd;
  };
  
  this.setAllParams = function (params, newTutor, newSchoolList, newClassList, newDateBegin, newDateEnd) {
    var tutor      = params.tutor      || this.tutor;
    var schoolList = params.schoolList || this.schoolList;
    var classRoom  = params.classRoom  || this.classRoom;
    var dateBegin  = params.dateBegin  || this.dateBegin;
    var dateEnd    = params.dateEnd    || this.dateEnd;
    this.setActive(false)
  }

  this.setDay = function (day) {
    this.day = day
  }

  this.getHtml = function () {
    return '<div class="timetable__inner">' +
              '<div class="timetable__column">' +
                schoolCollection.getHtml(this.schoolList) +
              '</div>' +
              '<div class="timetable__subject">' +
                '<p class="timetable__subject-theme">' +
                  this.name +
                '</p>' +
                this.tutor.getHtml() +
              '</div>' +
              this.classRoom.getHtml() +
              '<a class="timetable__status">с ' + getTime(this.dateBegin) + ' до ' + getTime(this.dateEnd) + '</a>' +
            '</div>';
  };

  //TODO for filters
  this.show = function () {

  };

  this.hide = function () {

  };
}

var lectureCollection = {
  nextId: 0,
  collection: Object.create(null),

  getById : function (id) {

    if (!(this.collection[id] instanceof Lecture)) {
      throw new TimetableError('Лекции с таким id не существует');
    }

    return this.collection[id];
  },

  validateName : function (newName) {

    if (typeof newName !== 'string') {
      throw new TimetableError('Имя лекции должно быть строкой');
    }

    if (newName.length === 0) {
      throw new TimetableError('Имя лекции не должно быть пустое');
    }

  },

  validateFreeTutor : function (lecture, tutorId, dateBegin, dateEnd, ignoreLectureId) {
    if (lecture.active === false) {
      return
    }
    ignoreLectureId = ignoreLectureId || null;

    if (lecture.tutor.id === tutorId && lecture.id !== ignoreLectureId){

      if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
        throw new TimetableError('C ' + lecture.dateBegin.toISOString() + ' по ' + lecture.dateEnd.toISOString() + ' преподаватель ' + lecture.tutor.name + ' ведёт лекцию ' + lecture.name);
      }

    }

  },

  validateFreeClassRoom : function (lecture, classRoomId, dateBegin, dateEnd, ignoreLectureId) {
    if (lecture.active === false) {
      return
    }
    ignoreLectureId = ignoreLectureId || null;

    if (lecture.classRoom.id === classRoomId && lecture.id !== ignoreLectureId) {

      if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
        throw new TimetableError('C ' + lecture.dateBegin.toISOString() + ' по ' + lecture.dateEnd.toISOString() + ' в аудитории идет лекция ' + lecture.name);
      }

    }

  },

  validateFreeSchool : function (lecture, schoolList, dateBegin, dateEnd, ignoreLectureId) {
    if (lecture.active === false) {
      return
    }
    ignoreLectureId = ignoreLectureId || null;

    if (lecture.id === ignoreLectureId) {
      return;
    }

    for (var i = 0; i < lecture.schoolList.length; i++) {

      if (schoolList.indexOf(lecture.schoolList[i]) >= 0) {

        if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
          throw new TimetableError('C ' + lecture.dateBegin.toISOString() + ' по ' + lecture.dateEnd.toISOString() + ' школа ' + lecture.schoolList[i].name + ' на лекции ' + lecture.name);
        }

      }

    }

  },

  validateCapacity : function (schoolList, capacity, lecture) {
    if (lecture && lecture.active === false) {
      return
    }
    var studentsCount = 0;

    for (var i = 0; i < schoolList.length; i++) {
      studentsCount += schoolList[i].studentsCount;

    }

    if (studentsCount > capacity) {
      throw new TimetableError('Аудитория не вмещает данное кол-во студентов');
    }

  },

  validateSchoolListId : function (schoolListId) {

    if (!Array.isArray(schoolListId)) {
      throw new TimetableError('SchoolListId должен быть массивом');
    }

    if (schoolListId.length === 0) {
      throw new TimetableError('SchoolListId не должен быть пустым массивом');
    }

    var temp = Object.create(null);

    for (var i = 0; i < schoolListId.length; i++) {

      if (typeof schoolListId[i] !== 'string') {
        throw new TimetableError('SchoolId должен быть строкой');
      }

      if (schoolListId[i].length === 0) {
        throw new TimetableError('SchoolId не должен быть пустой строкой');
      }

      temp[schoolListId[i]] = true;
    }

    if (Object.keys(temp).length !== schoolListId.length) {
      throw new TimetableError('SchoolListId не должен содержать повторы');
    }

  },

  getSchoolList : function (schoolListId) {
    var schoolList = [];

    for (var i = 0; i < schoolListId.length; i++) {
      schoolList.push(schoolCollection.getById(schoolListId[i]));
    }

    return schoolList;
  },

  setName : function (id, newName) {
    this.validateName(newName);
    var lecture = this.getById(id);
    lecture.name = newName;

    return lecture;
  },

  setTutor : function (id, tutorId) {
    var lecture = this.getById(id);

    if (lecture.tutor.id === tutorId){
      return true;
    }

    var tutor = tutorCollection.getById(tutorId);

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], tutorId, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.setTutor(tutor);

    return lecture;
  },

  setSchoolList : function (id, schoolListId) {
    var lecture = this.getById(id);
    this.validateSchoolListId(schoolListId);
    var schoolList = this.getSchoolList(schoolListId);
    this.validateCapacity(schoolList, lecture.classRoom.capacity, lecture);

    for (var key in this.collection) {
      this.validateFreeSchool(this.collection[key], schoolList, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.setSchoolList(schoolList);
    return lecture;
  },

  setClassRoom : function (id, classRoomId) {
    var lecture = this.getById(id);

    if (lecture.classRoom.id === classRoomId){
      return true;
    }

    var classRoom = classRoomCollection.getById(classRoomId);
    this.validateCapacity(lecture.schoolList, classRoom.capacity, lecture);

    for (var key in this.collection) {
      this.validateFreeClassRoom(this.collection[key], classRoomId, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.setClassRoom(classRoom);
    return true;
  },

  setDates : function (id, dateBegin, dateEnd) {
    var lecture = this.getById(id);

    if (lecture.dateBegin.getTime() === dateBegin.getTime() || lecture.dateEnd.getTime() === dateEnd.getTime()) {
      return true;
    }

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], lecture.tutor.id, dateBegin, dateEnd);
      this.validateFreeClassRoom(this.collection[key], lecture.classRoom.id, dateBegin, dateEnd);
      this.validateFreeSchool(this.collection[key], lecture.schoolList, dateBegin, dateEnd);
    }

    lecture.setDates(dateBegin, dateEnd);

    return lecture;
  },

  create : function (name, tutorId, schoolListId, classRoomId, dateBegin, dateEnd) {
    this.validateName(name);
    var tutor = tutorCollection.getById(tutorId);
    var classRoom = classRoomCollection.getById(classRoomId);

    this.validateSchoolListId(schoolListId);
    var schoolList = this.getSchoolList(schoolListId);
    this.validateCapacity(schoolList, classRoom.capacity);

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], tutorId, dateBegin, dateEnd);
      this.validateFreeClassRoom(this.collection[key], classRoomId, dateBegin, dateEnd);
      this.validateFreeSchool(this.collection[key], schoolList, dateBegin, dateEnd);
    }

    var lecture = new Lecture (this.nextId.toString(), name, tutor, schoolList, classRoom, dateBegin, dateEnd);
    this.collection[lecture.id] = lecture;
    this.nextId++;

    return lecture;
  },

  remove : function (id) {
    this.getById(id)
    delete this.collection[id]
  },

};
function Day (startDay) {
  this.date = startDay;
  this.lectureList = [];
  this.htmlElement = null;

  this.addLecture = function (lecture) {
    if (this.lectureList.length === 0){
      this.lectureList.push(lecture)
    } else {
      for (var i = 0; i < this.lectureList.length; i++){
        if (this.lectureList[i].dateBegin > lecture.dateBegin){
          this.lectureList.splice(i, 0, lecture)
          break
        }
        if (i + 1 === this.lectureList.length){
          this.lectureList.push(lecture)
          break
        }
      }
    }
    lecture.setDay(this)
    return true
  };

  this.removeLecture = function (lecture) {
    var index = this.lectureList.indexOf(lecture);
    if (index > -1) {
      this.lectureList.splice(index, 1);
      lecture.day = null
    }
  };

  this.getHtml = function () {
    var wrap = document.createElement('div');
    wrap.classList.add('timetable__item');
    var innerHtml =
      '<div class="timetable__head">' +
        '<p class="timetable__day">' + getWeekDay(this.date) + ':</p>' +
        '<p class="timetable__date">' + getMonth(this.date) + ', ' + this.date.getDate().toString() + '</p>' +
      '</div>' +
      '<div class="timetable__body">';

      for (var i = 0; i < this.lectureList.length; i++) {
        innerHtml += this.lectureList[i].getHtml();
      }
      innerHtml += '</div>';

      wrap.innerHTML = innerHtml;
      return wrap;
  };
}

var dayCollection = {
  dayList: [],

  getDay: function (lectureDateBegin) {
    var startDay = getStartDay(lectureDateBegin);
    var day;

    if (this.dayList.length === 0){
      day = new Day(startDay);
      this.dayList.push(day);
    } else {
      for (var i = 0; i < this.dayList.length; i++) {

        if (this.dayList[i].date.getTime() === startDay.getTime()) {
          day = this.dayList[i];
          break;
        }

        if (this.dayList[i].date.getTime() > startDay.getTime()) {
          day = new Day(startDay);
          this.dayList.splice(i, 0, day);
          break;
        }

        if (i + 1 == this.dayList.length) {
          day = new Day(startDay);
          this.dayList.push(day);
          break;
        }
      }
    }
    return day
  },

  render: function (day) {
    var elementBefore = null;
    var board = document.querySelector('.timetable');

    if (day.htmlElement !== null) {
      board.removeChild(day.htmlElement);
    }

    day.htmlElement = null;

    for (var i = this.dayList.indexOf(day); i < this.dayList.length; i++ ) {
      if (this.dayList[i].active === true && this.dayList[i].htmlElement !== null) {
        elementBefore = this.dayList[i].htmlElement;
        break;
      }
    }

    day.htmlElement = day.getHtml();
    board.insertBefore(day.htmlElement, elementBefore);
  },

  // User method

  addLecture: function (name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr) {

    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    var lecture = lectureCollection.create(name, tutorId, schoolListId, classRoomId, dateBegin, dateEnd);

    var startDay = getStartDay(dateBegin);
    var day = this.getDay(startDay);

    day.addLecture(lecture);
    //this.render(day);

    return lecture.id
  },

  removeLecture: function (id) {
    var lecture = lectureCollection.getById(id);
    if (lecture.day !== null){
      var day = lecture.day;
      day.removeLecture(lecture);
      this.render(day);
    }
    lectureCollection.remove(lecture.id);
    return true
  },

  setLectureName: function (id, newName) {
    var lecture = lectureCollection.setName(id, newName);
    this.render(lecture.day);

    return true;
  },

  setLectureTutor: function (id, tutorId) {
    var lecture = lectureCollection.setTutor(id, tutorId);
    this.render(lecture.day);

    return true;
  },

  setLectureSchoolList: function (id, schoolListId) {
    var lecture = lectureCollection.setSchoolList(id, schoolListId)
    this.render(lecture.day)
  },

  setLectureClassRoom: function (id, classRoomId){
    var lecture = lectureCollection.setClassRoom(id, classRoomId)
    this.render(lecture.day)
  },

  setLectureDate: function (id, dateBeginStr, dateEndStr) {
    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    var lecture = lectureCollection.getById(id);
    var oldDay = lecture.day;

    lectureCollection.setDates(id, dateBegin, dateEnd);
    var newDay = this.getDay(lecture.dateBegin);
    if (oldDay !== newDay){
      oldDay.removeLecture(lecture);
      newDay.addLecture(lecture)
    }
    this.render(oldDay);
    this.render(newDay);

    return true
  },

  setAllParams : function (id, name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr) {

    var lecture = lectureCollection.getById(id);
    lecture.setActive(false);
    var newLectureId;

    try {
      newLectureId = this.addLecture(name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr)
    } catch (e) {
      lecture.setActive(true);
      throw e
    }
    this.removeLecture(lecture.id);
    return newLectureId
  },

  filterBySchoolAndDates : function (schoolId, dateBeginStr, dateEndStr) {
    var school = schoolCollection.getById(schoolId);

    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    for (var key in lectureCollection.collection) {
      var lecture = lectureCollection.collection[key];

      if ((lecture.dateBegin > dateBegin) && (lecture.dateEnd < dateEnd) && (lecture.schoolList.indexOf(school) >= 0)) {
        lecture.show();
      } else {
        lecture.hide();
      }
    }
  },

  filterByClassRoomAndDates : function (classRoomId, dateBeginStr, dateEndStr) {
    var classRoom = classRoomCollection.getById(classRoomId);

    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    for (var key in lectureCollection.collection) {
      var lecture = lectureCollection.collection[key];

      if ((lecture.dateBegin > dateBegin) && (lecture.dateEnd < dateEnd) && (lecture.classRoom === classRoom)) {
        lecture.show();
      } else {
        lecture.hide();
      }
    }
  }
};

var timetable = {
  init: function (data) {
    for (var i = 0; i < data.tutorList.length; i++) {
      tutorCollection.add(data.tutorList[i].id, data.tutorList[i].name, data.tutorList[i].about, data.tutorList[i].img);
    }

    for (var i = 0; i < data.classRoomList.length; i++) {
      classRoomCollection.add(data.classRoomList[i].id, data.classRoomList[i].name, data.classRoomList[i].capacity, data.classRoomList[i].location);
    }

    for (var i = 0; i < data.schoolList.length; i++) {
      schoolCollection.add(data.schoolList[i].id, data.schoolList[i].name, data.schoolList[i].studentsCount);
    }

    for (var i = 0; i < data.lectureList.length; i++) {
      dayCollection.addLecture(data.lectureList[i].name, data.lectureList[i].tutorId, data.lectureList[i].schoolListId, data.lectureList[i].classRoomId, data.lectureList[i].dateBeginStr, data.lectureList[i].dateEndStr);
    }
  }
};

var assert = require('chai').assert;


// Блокируем обращение к HTML
Lecture.prototype.render = function () {};

describe('tutorCollection', function () {
  describe('#Add() Добавление преподавателя', function () {
    it('с корректыми данными (первый)', function () {
      assert.equal(true, tutorCollection.add('ATen', 'Антон Тен', 'В Яндексе с 2014 года.', 'img/AntonTen'));
    });
    it('с корректыми данными (второй)', function () {
      assert.equal(true, tutorCollection.add('DDushkin', 'Дмитрий Душкин', 'В Яндексе с 2014 года.', 'img/DmitriyDushkin'));
    });
    it('с невалидным id', function () {
      assert.throws(function () {tutorCollection.add(5348, 'Антон Тен', 'В Янео.', 'img/AntonTen')}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {tutorCollection.add('ATen', '', 'В Янео.', 'img/AntonTen')}, TimetableError);
    });
    it('с невалидным описанием', function () {
      assert.throws(function () {tutorCollection.add('ATen', 'Антон Тен', 12345, 'img/AntonTen')}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {tutorCollection.add('ATen', 'Антон Тен', 'В Яндексе с 2014 года.', 'img/AntonTen')}, TimetableError);
    });
  })
});

describe('classRoomCollection', function () {
  describe('#Add() Добавление школы', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, classRoomCollection.add('BlueWhale', 'Синий кит', 300, 'Москва, ул. Льва Толстого, 300'));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, classRoomCollection.add('Panda', 'Панда', 100, 'Москва, ул. Льва Толстого, 100'));
    });
    it('с невалидным id', function () {
      assert.throws(function () {classRoomCollection.add('', 'Панда', 100, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 123, 100, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидной вместимостью', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 'Панда', 0, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидным расположением', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 'Панда', 100, 1020)}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 'Жар-птица', 200, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
  })
});

describe('schoolCollection', function () {
  describe('#Add() Добавление школы', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, schoolCollection.add('shri', 'Школа разработки интерфейсов', 120));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, schoolCollection.add('shd', 'Школа мобильного дизайна', 100));
    });
    it('с корректыми данными (третья)', function () {
      assert.equal(true, schoolCollection.add('shmd', 'Школа мобильной разработки', 70));
    });
    it('с невалидным id', function () {
      assert.throws(function () {schoolCollection.add('', 'Школа мобильного дизайна', 100)}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {schoolCollection.add('shd', 1234, 100)}, TimetableError);
    });
    it('с отрицательным количеством студентов', function () {
      assert.throws(function () {schoolCollection.add('shd', 'Школа мобильного дизайна', -30)}, TimetableError);
    });
    it('с дробным количеством студентов', function () {
      assert.throws(function () {schoolCollection.add('shd', 'Школа мобильного дизайна', 1.5)}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {schoolCollection.add('shd', 'Школа мобильной разработки', 70)}, TimetableError);
    });
  })
});

describe('lectureCollection', function () {
  describe('#Add() Добавление лекции', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z'));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z'));
    });
    it('с корректыми данными (третья)', function () {
      assert.equal(true, dayCollection.addLecture('Исследование, концепт', 'ATen', ['shmd'], 'Panda', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z'));
    });
    it('с невалидным именем', function () {
      assert.throws(function () {dayCollection.addLecture(123, 'DDushkin', ['shri', 'shd'], 'Panda', '2017-05-10T13:10:00Z', '2017-05-10T15:00:00Z')}, TimetableError);
    });
    it('с невалидным id преподавателя', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', '', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с невалидным id аудитории', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 123, '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с двумя одинаковыми школами', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с массивом с пустой школой', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с пустым массивом школ', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', [], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с переполнением аудитории студентами', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с неверным форматом даты начала лекции', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('в занятую аудиторию', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с занятым преподавателем', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с занятой школой', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
  })
});

//Set
describe('classRoomCollection', function () {
  describe('#Set() Изменение вместимости школы, в которой уже назначена лекция', function () {
    it('на большое значение', function () {
      assert.equal(true, classRoomCollection.setCapacity('BlueWhale', 300));
    });
    it('на маленькое значение', function () {
      assert.throws(function () {classRoomCollection.setCapacity('BlueWhale', 50)}, TimetableError)
    });
  })
});

describe('schoolCollection', function () {
  describe('#Set() Изменение кол-ва учеников школы', function () {
    it('на маленькое значение', function () {
      assert.equal(true, schoolCollection.setStudentsCount('shri', 20));
    });
    it('на значение, которое не поместится в аудитории', function () {
      assert.throws(function () {schoolCollection.setStudentsCount('shri', 320)}, TimetableError)
    });
  })
});

describe('lectureCollection', function () {
  describe('#Set() Изменение в лекции', function () {
    it('преподавателя', function () {
      assert.equal(true, lectureCollection.setTutor('1', 'DDushkin'));
    });
    it('преподавателя на занятого', function () {
      assert.throws(function () {lectureCollection.setTutor('0', 'ATen')}, TimetableError)
    });
    it('школ', function () {
      assert.equal(true, lectureCollection.setSchoolList('0', ['shd', 'shri']));
    });
    it('школ на занятую', function () {
      assert.throws(function () {lectureCollection.setSchoolList('0', ['shd', 'shri', 'shmd'])}, TimetableError)
    });
    it('аудитории', function () {
      assert.equal(true, lectureCollection.setClassRoom('1', 'BlueWhale'));
    });
    it('аудитории на занятую', function () {
      assert.throws(function () {lectureCollection.setClassRoom('0', 'Panda')}, TimetableError)
    });
  });
  describe('#Set() Перенос лекции', function () {
    it('на свободное время', function () {
      assert.equal(true, lectureCollection.setDates('0', '2017-05-10T13:10:00Z', '2017-05-10T15:10:00Z'));
    });
    it('на время, когда школа занята', function () {
      assert.throws(function () {lectureCollection.setDates('0', '2017-04-10T12:00:00Z', '2017-04-10T15:00:00Z')}, TimetableError)
    });
    it('на время, когда аудитория занята', function () {
      assert.throws(function () {lectureCollection.setDates('1', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z')}, TimetableError)
    });
    it('на время, когда преподаватель занят', function () {
      assert.throws(function () {lectureCollection.setDates('2', '2017-04-10T14:10:00Z', '2017-04-10T17:00:00Z')}, TimetableError)
    });
  });
});