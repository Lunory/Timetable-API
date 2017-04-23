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