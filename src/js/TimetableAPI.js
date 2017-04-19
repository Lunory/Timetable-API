'use strict';

/*
Проверки:
Школа:
- имя должно быть строкой;
- длина имени должна быть больше 0;
- имена не должны дублироваться;
- кол-во студентов должно быть числом;
- кол-во студентов больше 0;

Аудитория:
- имя должно быть строкой;
- длина имени должна быть больше 0;
- имена не должны дублироваться;
- кол-во мест в аудитории должно быть числом;
- кол-во мест в аудитории больше 0;
- месторасположение аудитории должно быть строкой;
- длина месторасположения аудитории должна быть больше 0;
- месторасположения аудитории не должны дублироваться;

Преподаватель:
-

*/

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

  collection : Object.create(null),

  validateName : function (newName) {

    if (typeof newName !== 'string') {
      throw new TimetableError('Имя должно быть строкой');
    }

    if ( newName.length === 0) {
      throw new TimetableError('Имя не должно быть пустое');
    }

  },

  validateAbout : function (newAbout) {

    if (typeof newAbout !== 'string') {
      throw new TimetableError('Информация о преподавателе должна быть строкой');
    }

    if (newAbout.length === 0) {
      throw new TimetableError('Информация о преподавателе не должна быть пустой');
    }

  },

  getById : function (id) {

    if (!(this.collection[id] instanceof Tutor)) {
      throw new TimetableError('Преподавателя с таким id не существует');
    }

    return this.collection[id];
  },

  add : function (id, name, about, img) {
    validateId(id, this.collection);
    this.validateName(name);
    this.validateAbout(about);
    // TODO validate img
    this.collection[id] = new Tutor(id, name, about, img);
  }
};

function School (id, name, studentsCount) {
  this.id = id;
  this.name = name;
  this.studentsCount = studentsCount;

  this.getHtml = function () {
    return '<p class="timetable__school">' + this.name +'</p>'
  };

  this.render = function () {

  };

  this.editName = function(newName) {
    this.name = newName;
  };

  this.editStudentsCount = function(newStudentsCount) {
    this.studentsCount = newStudentsCount;
  };
}

var schoolCollection = {

  collection : Object.create(null),

  validateName : function (newName) {

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

  validateStudentsCount : function (newStudentsCount) {

    if (!isNumeric(newStudentsCount)) {
      throw new TimetableError('Количество студентов должно быть числом');
    }

    if (newStudentsCount <= 0) {
      throw new TimetableError('Количество студентов должно быть больше 0');
    }

  },

  getById : function (id) {

    if (!(this.collection[id] instanceof School)) {
      throw new TimetableError('Такого id не существует');
    }

    return this.collection[id];

  },

  editName : function (id, newName) {

    this.validateName(newName);

    this.getById(id).editName(newName);

  },

  editStudentsCount : function (id, newStudentsCount) {
    this.validateStudentsCount(newStudentsCount);
    this.getById(id).editStudentsCount(newStudentsCount);
    var school = this.getById(id);
    var diffCountStudents = school.studentsCount - newStudentsCount;
    for (var key in lectureCollection.collection) {
      var lecture = lectureCollection.collection[key];
      if (lecture.schoolList.indexOf(school) >= 0) {
        lectureCollection.validateCapacity(lecture.schoolList, lecture.classRoom.capacity + diffCountStudents);
      }
    }

    School.editStudentsCount(newStudentsCount);


  },

  add : function (id, name, studentsCount) {

    validateId(id, this.collection);
    this.validateName(name);
    this.validateStudentsCount(studentsCount);
    this.collection[id] = new School(id, name, studentsCount);

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

  this.editName = function(newName) {
    this.name = newName;
  };

  this.editCapacity = function (newCapacity) {
    this.capacity = newCapacity;
  };

  this.editLocation = function (newLocation) {
    this.location = newLocation;
  };

  this.getHtml = function () {
    return '<p class="timetable__place">'+ this.location +'</p>';
  }
}

var classRoomCollection = {

  collection : Object.create(null),

  validateName : function (newName) {

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

  validateCapacity : function (newCapacity) {

    if (!isNumeric(newCapacity)) {
      throw new TimetableError('Количество мест в аудитории должно быть числом');
    }

    if (newCapacity <= 0) {
      throw new TimetableError('Количество мест в аудитории должно быть больше 0');
    }

  },

  validateLocation : function (newLocation) {

    if (typeof newLocation !== 'string') {
      throw new TimetableError('Месторасположение аудитории должно быть строкой');
    }

    if (newLocation.length === 0) {
      throw new TimetableError('Месторасположение аудитории не должно быть пустым');
    }

  },

  getById : function (id) {

    if (!(this.collection[id] instanceof ClassRoom)) {
      throw new TimetableError('Аудитории с таким id не существует');
    }

    return this.collection[id];

  },

  editName : function (id, newName) {

    this.validateName(newName);
    this.getById(id).editName(newName);

  },

  editCapacity : function (id, newCapacity) {

    this.validateCapacity(newCapacity);
    var classRoom = this.getById(id);
    for (var key in lectureCollection.collection) {
      if (lectureCollection.collection[key].classRoom === classRoom) {
        lectureCollection.validateCapacity(lectureCollection.collection[key].schoolList, newCapacity);
      }
    }
    classRoom.editCapacity(newCapacity);
  },

  editLocation : function (id, newLocation) {

    this.validateLocation(newLocation);
    this.getById(id).editLocation(newLocation);

  },

  add : function (id, name, capacity, location) {

    validateId(id, this.collection)
    this.validateName(name);
    this.validateCapacity(capacity);
    this.validateLocation(location);

    this.collection[id] = new ClassRoom(id, name, capacity, location);

  }

};

function Lecture (id, name, tutor, schoolList, classRoom, dateBegin, dateEnd)   {
  this.id = id;
  this.name = name;
  this.tutor = tutor;
  this.schoolList = schoolList;
  this.classRoom = classRoom;
  this.dateBegin = dateBegin;
  this.dateEnd = dateEnd;

  this.editTutor = function (newTutor) {
    this.tutor = newTutor;
  };

  this.editSchoolList = function (newSchoolList) {
    this.schoolList = newSchoolList;
  };

  this.editClassRoom = function (newClassList) {
    this.classList = newClassList;
  };

  this.editDates = function (newDateBegin, newDateEnd) {
    this.dateBegin = newDateBegin;
    this.dateEnd = newDateEnd;
  };

  this.render = function () {
    var board = document.querySelector('.timetable');
    var wrap = document.createElement('div');
    wrap.classList.add('timetable__item');

    var innerHtml =
      '<div class="timetable__head">' +
        '<p class="timetable__day">' + getWeekDay(this.dateBegin) + ':</p>' +
        '<p class="timetable__date">' + getMonth(this.dateBegin) + ', ' + this.dateBegin.getDate().toString() + '</p>' +
      '</div>' +
      '<div class="timetable__body">' +
        '<div class="timetable__inner">' +
          schoolCollection.getHtml(this.schoolList) +
          '<div class="timetable__subject">' +
            '<p class="timetable__subject-theme">' +
              this.name +
            '</p>' +
            this.tutor.getHtml() +
        '</div>' +
        this.classRoom.getHtml() +
        '<a class="timetable__status">с ' + getTime(this.dateBegin) + ' до ' + getTime(this.dateEnd) + '</a>' +
      '</div>' +
    '</div>';

    wrap.innerHTML = innerHtml;
    board.appendChild(wrap);

  };

  this.show = function () {

  };


  this.hide = function () {

  }
}

var lectureCollection = {

  nextId : 0,
  collection : Object.create(null),

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
  // TODO во всех выводах дат. выводить их в верном формате
  validateFreeTutor : function (lecture, tutorId, dateBegin, dateEnd, ignoreLectureId) {

    ignoreLectureId = ignoreLectureId || null;

    if (lecture.tutor.id === tutorId && lecture.id !== ignoreLectureId){
      if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
        throw new TimetableError('C ' + lecture.dateBegin + ' по ' + lecture.dateEnd + ' преподаватель ' + lecture.tutor.name + ' ведёт лекцию ' + lecture.name);
      }
    }

  },

  validateFreeClassRoom : function (lecture, classRoomId, dateBegin, dateEnd, ignoreLectureId) {

    ignoreLectureId = ignoreLectureId || null;

    if (lecture.classRoom.id === classRoomId && lecture.id !== ignoreLectureId) {
      if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
        throw new TimetableError('C ' + lecture.dateBegin + ' по ' + lecture.dateEnd + ' в аудитории идет лекция ' + lecture.name);
      }
    }

  },

  validateFreeSchool : function (lecture, schoolList, dateBegin, dateEnd, ignoreLectureId) {

    ignoreLectureId = ignoreLectureId || null;

    if (lecture.id === ignoreLectureId) {
      return;
    }

    for (var i = 0; i < lecture.schoolList.length; i++) {
      if (schoolList.indexOf(lecture.schoolList[i]) >= 0) {
        if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
          throw new TimetableError('C ' + lecture.dateBegin + ' по ' + lecture.dateEnd + ' школа ' + lecture.schoolList[i].name + ' на лекции ' + lecture.name);
        }
      }
    }

  },

  validateCapacity : function (schoolList, capacity) {

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

    var temp = Object.create(null);

    for (var i = 0; i < schoolListId.length; i++) {
      if (typeof schoolListId[i] !== 'string') {
        throw new TimetableError('SchoolId должен быть строкой');
      }

      if (schoolListId[i] == null) {
        throw new TimetableError('SchoolId не должен быть пустой строкой');
      }

      temp[schoolListId[i]] = true;
    }

    if (Object.keys(temp).length !== schoolListId.length) {
      throw new TimetableError('SchoolListId не должен содержать повторы');
    }

  },

  validateDates : function (dateBegin, dateEnd) {
    // TODO VALIDATION INVALID
    if (dateBegin > dateEnd){
      // TODO text error
      throw new TimetableError('Дата начала больше даты конца');
    }
  },

  createDate : function (date) {
    // TODO REGEXP
    return new Date(date);
  },

  getSchoolList : function (schoolListId) {

    var schoolList = [];

    for (var i = 0; i < schoolListId.length; i++) {
      schoolList.push(schoolCollection.getById(schoolListId[i]));
    }

    return schoolList;

  },

  editName : function (id, newName) {

    this.validateName(newName);

    this.getById(id).name = newName;

  },

  editTutor : function (id, tutorId) {

    var lecture = this.getById(id);

    if (lecture.tutor.id === tutorId){
      return true;
    }

    var tutor = tutorCollection.getById(tutorId);

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], tutorId, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.editTutor(tutor);

    return true;

  },

  editSchoolList : function (id, schoolListId) {

    var lecture = this.getById(id);

    this.validateSchoolListId(schoolListId);

    var schoolList = this.getSchoolList(schoolListId);

    this.validateCapacity(schoolList, lecture.classRoom.capacity);

    for (var key in this.collection) {
      this.validateFreeSchool(this.collection[key], schoolList, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.editSchoolList(schoolList);

    return true;

  },

  editClassRoom : function (id, classRoomId) {
    var lecture = this.getById(id);


    if (lecture.tutor.id === classRoomId){
      return true;
    }

    var classRoom = classRoomCollection.getById(classRoomId);

    this.validateCapacity(lecture.schoolList, classRoom.capacity);

    for (var key in this.collection) {
      this.validateFreeClassRoom(this.collection[key], classRoomId, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.editClassRoom(classRoom);

    return true;

  },

  editDates : function (id, dateBeginStr, dateEndStr) {

    var lecture = this.getById(id);

    var dateBegin = this.createDate(dateBeginStr);

    var dateEnd = this.createDate(dateEndStr);

    this.validateDates(dateBegin, dateEnd);

    if (lecture.dateBegin === dateBegin || lecture.dateEnd === dateEnd) {
      return true;
    }

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], lecture.tutor.id, dateBegin, dateEnd);

      this.validateFreeClassRoom(this.collection[key], lecture.classRoom.id, dateBegin, dateEnd);

      this.validateFreeSchool(this.collection[key], lecture.schoolList, dateBegin, dateEnd);
    }

    lecture.editDates(dateBegin, dateEnd);

  },

  add : function (name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr) {

    this.validateName(name);
    var tutor = tutorCollection.getById(tutorId);
    var classRoom = classRoomCollection.getById(classRoomId);

    this.validateSchoolListId(schoolListId);
    var schoolList = this.getSchoolList(schoolListId);
    this.validateCapacity(schoolList, classRoom.capacity);

    var dateBegin = this.createDate(dateBeginStr);
    var dateEnd = this.createDate(dateEndStr);
    this.validateDates(dateBegin, dateEnd);

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], tutorId, dateBegin, dateEnd);
      this.validateFreeClassRoom(this.collection[key], classRoomId, dateBegin, dateEnd);
      this.validateFreeSchool(this.collection[key], schoolList, dateBegin, dateEnd);
    }

    this.collection[this.nextId.toString()] = new Lecture (this.nextId.toString(), name, tutor, schoolList, classRoom, dateBegin, dateEnd);
    this.collection[this.nextId.toString()].render();
    this.nextId++;
  },

  filterBySchoolAndDates : function (schoolId, dateBeginStr, dateEndStr) {
    var school = schoolCollection.getById(schoolId);

    var dateBegin = this.createDate(dateBeginStr);
    var dateEnd = this.createDate(dateEndStr);
    this.validateDates(dateBegin, dateEnd);

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

    var dateBegin = this.createDate(dateBeginStr);
    var dateEnd = this.createDate(dateEndStr);
    this.validateDates(dateBegin, dateEnd);

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
      lectureCollection.add(data.lectureList[i].name, data.lectureList[i].tutorId, data.lectureList[i].schoolListId, data.lectureList[i].classRoomId, data.lectureList[i].dateBeginStr, data.lectureList[i].dateEndStr);
    }
  }
};