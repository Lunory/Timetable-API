function School (id, name, studentsCount) {
  this.id = id;
  this.name = name;
  this.studentsCount = studentsCount;

  this.getHtml = function () {
    return '<p class="timetable__school">' + this.name +'</p>'
  };

  this.toJSON = function () {
    return {
      'id': this.id,
      'name': this.name,
      'studentsCount': this.studentsCount
    }
  };

  this.setName = function(newName) {
    this.name = newName;
  };

  this.setStudentsCount = function(newStudentsCount) {
    this.studentsCount = newStudentsCount;
  };
}

var schoolCollection = {
  collection: Object.create(null),

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

  getHtml: function (schoolList) {
    var html = '';

    for (var i = 0; i < schoolList.length; i++) {
      html += schoolList[i].getHtml();
    }

    return html;
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
  }
};