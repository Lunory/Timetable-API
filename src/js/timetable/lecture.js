function Lecture (id, name, tutor, schoolList, classRoom, dateBegin, dateEnd)   {
  this.id = id;
  this.name = name;
  this.tutor = tutor;
  this.schoolList = schoolList;
  this.classRoom = classRoom;
  this.dateBegin = dateBegin;
  this.dateEnd = dateEnd;

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

  //TODO for filters
  this.show = function () {

  };

  this.hide = function () {

  };
}

Lecture.prototype.render = function () {
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
      '</div>' +
    '</div>';

  wrap.innerHTML = innerHtml;
  board.appendChild(wrap);
};

var lectureCollection = {
  nextId : 0,
  collection : Object.create(null),
  dayList: [],

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
    ignoreLectureId = ignoreLectureId || null;

    if (lecture.tutor.id === tutorId && lecture.id !== ignoreLectureId){

      if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
        throw new TimetableError('C ' + lecture.dateBegin.toISOString() + ' по ' + lecture.dateEnd.toISOString() + ' преподаватель ' + lecture.tutor.name + ' ведёт лекцию ' + lecture.name);
      }

    }

  },

  validateFreeClassRoom : function (lecture, classRoomId, dateBegin, dateEnd, ignoreLectureId) {
    ignoreLectureId = ignoreLectureId || null;

    if (lecture.classRoom.id === classRoomId && lecture.id !== ignoreLectureId) {

      if (intersectionDates(dateBegin, dateEnd, lecture.dateBegin, lecture.dateEnd)) {
        throw new TimetableError('C ' + lecture.dateBegin.toISOString() + ' по ' + lecture.dateEnd.toISOString() + ' в аудитории идет лекция ' + lecture.name);
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
          throw new TimetableError('C ' + lecture.dateBegin.toISOString() + ' по ' + lecture.dateEnd.toISOString() + ' школа ' + lecture.schoolList[i].name + ' на лекции ' + lecture.name);
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
    this.getById(id).name = newName;
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
    return true;
  },

  setSchoolList : function (id, schoolListId) {
    var lecture = this.getById(id);
    this.validateSchoolListId(schoolListId);
    var schoolList = this.getSchoolList(schoolListId);
    this.validateCapacity(schoolList, lecture.classRoom.capacity);

    for (var key in this.collection) {
      this.validateFreeSchool(this.collection[key], schoolList, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.setSchoolList(schoolList);
    return true;
  },

  setClassRoom : function (id, classRoomId) {
    var lecture = this.getById(id);

    if (lecture.classRoom.id === classRoomId){
      return true;
    }

    var classRoom = classRoomCollection.getById(classRoomId);
    this.validateCapacity(lecture.schoolList, classRoom.capacity);

    for (var key in this.collection) {
      this.validateFreeClassRoom(this.collection[key], classRoomId, lecture.dateBegin, lecture.dateEnd, lecture.id);
    }

    lecture.setClassRoom(classRoom);
    return true;
  },

  setDates : function (id, dateBeginStr, dateEndStr) {
    var lecture = this.getById(id);
    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    if (lecture.dateBegin === dateBegin || lecture.dateEnd === dateEnd) {
      return true;
    }

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], lecture.tutor.id, dateBegin, dateEnd);
      this.validateFreeClassRoom(this.collection[key], lecture.classRoom.id, dateBegin, dateEnd);
      this.validateFreeSchool(this.collection[key], lecture.schoolList, dateBegin, dateEnd);
    }

    lecture.setDates(dateBegin, dateEnd);
    return true;
  },

  add : function (name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr) {
    this.validateName(name);
    var tutor = tutorCollection.getById(tutorId);
    var classRoom = classRoomCollection.getById(classRoomId);

    this.validateSchoolListId(schoolListId);
    var schoolList = this.getSchoolList(schoolListId);
    this.validateCapacity(schoolList, classRoom.capacity);

    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], tutorId, dateBegin, dateEnd);
      this.validateFreeClassRoom(this.collection[key], classRoomId, dateBegin, dateEnd);
      this.validateFreeSchool(this.collection[key], schoolList, dateBegin, dateEnd);
    }

    this.collection[this.nextId.toString()] = new Lecture (this.nextId.toString(), name, tutor, schoolList, classRoom, dateBegin, dateEnd);
    this.collection[this.nextId.toString()].render();
    this.nextId++;

    return true;
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