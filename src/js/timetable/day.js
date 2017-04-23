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
    this.render(day);

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

    var startDayBegin = getStartDay(dateBegin).getTime()
    var startDayEnd = getStartDay(dateEnd).getTime()

    for (var i = 0; i < this.dayList.length; i++){
      // if ((startDayBegin <= this.dayList[i].date.getTime()) &&
      //     (this.dayList[i].date.getTime() <= startDayEnd) &&
      //
      // ){
      //
      // }
    }

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
