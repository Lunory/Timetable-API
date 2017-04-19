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