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


function Tutor (id, name, about, img) {
  this.id = id;
  this.name = name;
  this.about = about;
  this.img = img;
}

var tutorCollection = {
  collection : {},

  getById : function (id) {

    if (!(this.collection[id] instanceof Tutor)) {
      throw new TimetableError('Преподавателя с таким id не существует');
    }

    return this.collection[id];
  }
};



function School (id, name, studentsCount) {
  this.id = id;
  this.name = name;
  this.studentsCount = studentsCount;

  this.editName = function(newName) {
    this.name = newName;
  };

  this.editStudentsCount = function(newStudentsCount) {
    this.studentsCount = newStudentsCount;
  };
}

var schoolCollection = {
  // TODO delete obj

  nextId : 0,
  collection : {},

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

  },

  addSchool : function (name, studentsCount) {

    this.validateName(name);

    this.validateStudentsCount(studentsCount);

    this.collection[this.nextId.toString()] = new School(this.nextId.toString(), name, studentsCount);

    this.nextId++;

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
}

var classRoomCollection = {

  nextId : 0,
  collection : {},

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

    this.getById(id).editCapacity(newCapacity);

  },

  editLocation : function (id, newLocation) {

    this.validateLocation(newLocation);

    this.getById(id).editLocation(newLocation);

  },

  addClassRoom : function (name, capacity, location) {

    this.validateName(name);

    this.validateCapacity(capacity);

    this.validateLocation(location);

    this.collection[this.nextId.toString()] = new ClassRoom(this.nextId.toString(), name, capacity, location);

    this.nextId++;

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
  }
}

var lectureCollection = {

  nextId : 0,
  collection : {},

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

  validateCapacity : function (schoolList, classRoom) {

    var studentsCount = 0;

    for (var i = 0; i < schoolList.length; i++) {
      studentsCount += schoolList[i].studentsCount;
    }

    if (studentsCount > classRoom.capacity) {
      throw new TimetableError('Аудитория не вмещает данное кол-во студентов');
    }

  },

  validateSchoolListId : function (schoolListId) {

    if (!Array.isArray(schoolListId)) {
      throw new TimetableError('SchoolListId должен быть массивом');
    }

    var temp = {};

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

    this.validateCapacity(schoolList, lecture.classRoom);

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

    this.validateCapacity(lecture.schoolList, classRoom);

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

  addLecture : function (name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr) {

    this.validateName(name);

    var tutor = tutorCollection.getById(tutorId);

    var classRoom = classRoomCollection.getById(classRoomId);

    this.validateSchoolListId(schoolListId);

    var schoolList = this.getSchoolList(schoolListId);

    this.validateCapacity(schoolList, classRoom);

    var dateBegin = this.createDate(dateBeginStr);

    var dateEnd = this.createDate(dateEndStr);

    this.validateDates(dateBegin, dateEnd);

    for (var key in this.collection) {
      this.validateFreeTutor(this.collection[key], tutorId, dateBegin, dateEnd);

      this.validateFreeClassRoom(this.collection[key], classRoomId, dateBegin, dateEnd);

      this.validateFreeSchool(this.collection[key], schoolList, dateBegin, dateEnd);
    }

    this.collection[this.nextId.toString()] = new Lecture (this.nextId.toString(), name, tutor, schoolList, classRoom, dateBegin, dateEnd);
  }

};