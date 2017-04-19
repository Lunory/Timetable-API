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