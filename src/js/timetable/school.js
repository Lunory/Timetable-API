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