function Day (startDay) {
  this.date = startDay;
  this.lectureList = [];
  this.htmlElement = null;

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

  this.toJSON = function () {
    return {'date': this.date.toISOString(), lectureList: this.lectureList}
  };

  this.addLecture = function (lecture) {
    if (this.lectureList.length === 0){
      this.lectureList.push(lecture)
    } else {

      for (var i = 0; i < this.lectureList.length; i++){

        if (this.lectureList[i].dateBegin > lecture.dateBegin){
          this.lectureList.splice(i, 0, lecture);
          break;
        }

        if (i + 1 === this.lectureList.length){
          this.lectureList.push(lecture);
          break;
        }

      }
    }

    lecture.setDay(this);

    return true;
  };

  this.removeLecture = function (lecture) {
    var index = this.lectureList.indexOf(lecture);

    if (index > -1) {
      this.lectureList.splice(index, 1);
      lecture.day = null;
    }
  };

  this.hide = function () {
    this.htmlElement.classList.add('timetable__item--hide');
  };

  this.show = function (filter, value) {
    var needShow = true;

    if (filter) {
      needShow = false;

      for (var i = 0; i < this.lectureList.length; i++) {

        switch (filter) {

          case 'schoolId':
            if (this.lectureList[i].hasSchoolId(value)) {
              this.lectureList[i].show();
              needShow = true;
            } else {
              this.lectureList[i].hide();
            }
            break;

          case 'classRoomId':
            if (this.lectureList[i].hasClassRoomId(value)) {
              this.lectureList[i].show();
              needShow = true;
            } else {
              this.lectureList[i].hide();
            }
            break;

          default:
            throw new TimetableError('Такого фильтра не сущестует')
        }

      }
    } else {
      for (var i = 0; i < this.lectureList.length; i++) {
        this.lectureList[i].show();
      }
    }

    if (needShow){

      this.htmlElement.classList.remove('timetable__item--hide');

    } else {
      this.hide();
    }
  };
}

var dayCollection = {
  dayList: [],
  tutor: tutorCollection,
  school: schoolCollection,
  classRoom: classRoomCollection,

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

        if (i + 1 === this.dayList.length) {
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

    if (day.lectureList.length < 1 && day.htmlElement !== null){
      board.removeChild(day.htmlElement);
      day.htmlElement = null;
      return
    }

    if (day.htmlElement !== null) {
      board.removeChild(day.htmlElement);
    }

    day.htmlElement = null;

    for (var i = this.dayList.indexOf(day); i < this.dayList.length; i++ ) {
      if (this.dayList[i].htmlElement !== null) {
        elementBefore = this.dayList[i].htmlElement;
        break;
      }
    }

    day.htmlElement = day.getHtml();
    board.insertBefore(day.htmlElement, elementBefore);
  },

  filterByDates : function (filter, value, dateBeginStr, dateEndStr) {
    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);
    var startDayBegin = getStartDay(dateBegin).getTime();
    var startDayEnd = getStartDay(dateEnd).getTime();

    for (var i = 0; i < this.dayList.length; i++){
      if ((startDayBegin <= this.dayList[i].date.getTime()) && (this.dayList[i].date.getTime() <= startDayEnd)){
        this.dayList[i].show(filter, value);
      } else {
        this.dayList[i].hide();
      }
    }
  },

  // User methods

  getAllInfo: function () {
    return JSON.stringify(this.dayList);
  },

  addLecture: function (name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr, materialHref) {

    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    var lecture = lectureCollection.create(name, tutorId, schoolListId, classRoomId, dateBegin, dateEnd, materialHref);

    var startDay = getStartDay(dateBegin);
    var day = this.getDay(startDay);

    day.addLecture(lecture);
    this.render(day);

    return lecture.id;
  },

  removeLecture: function (id) {
    var lecture = lectureCollection.getById(id);

    if (lecture.day !== null){
      var day = lecture.day;
      day.removeLecture(lecture);
      this.render(day);
    }

    lectureCollection.remove(lecture.id);

    return true;
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
    var lecture = lectureCollection.setSchoolList(id, schoolListId);
    this.render(lecture.day);

    return true;
  },

  setLectureClassRoom: function (id, classRoomId){
    var lecture = lectureCollection.setClassRoom(id, classRoomId);
    this.render(lecture.day);

    return true;
  },

  setLectureDate: function (id, dateBeginStr, dateEndStr) {
    var dateBegin = createDate(dateBeginStr);
    var dateEnd = createDate(dateEndStr);
    validateDates(dateBegin, dateEnd);

    var lecture = lectureCollection.getById(id);
    var oldDay = lecture.day;

    lectureCollection.setDate(id, dateBegin, dateEnd);
    var newDay = this.getDay(lecture.dateBegin);

    if (oldDay !== newDay){
      oldDay.removeLecture(lecture);
      newDay.addLecture(lecture)
    }

    this.render(oldDay);
    this.render(newDay);

    return true;
  },

  setLectureMaterial: function (id, materialHref) {
    var lecture = lectureCollection.getById(id);

    lectureCollection.setMaterialHref(id, materialHref);

    this.render(lecture.day);
    return true;
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

    return newLectureId;
  },

  filterBySchoolAndDates : function (schoolId, dateBeginStr, dateEndStr) {
    schoolCollection.getById(schoolId);
    this.filterByDates('schoolId', schoolId, dateBeginStr, dateEndStr);

    return true;
  },

  filterByClassRoomAndDates : function (classRoomId, dateBeginStr, dateEndStr) {
    classRoomCollection.getById(classRoomId);
    this.filterByDates('classRoomId', classRoomId, dateBeginStr, dateEndStr);

    return true;
  },

  cancelFilter: function () {
    for (var i = 0; i < this.dayList.length; i++){
      this.dayList[i].show();
    }
  }
};
