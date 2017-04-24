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
  };

  this.toJSON = function () {
    return {
      'id': this.id,
      'name': this.name,
      'about': this.about,
      'img': this.img
    }
  };
}

var tutorCollection = {
  collection: Object.create(null),

  validateName: function (newName) {
    if (typeof newName !== 'string') {
      throw new TimetableError('Имя должно быть строкой');
    }

    if ( newName.length === 0) {
      throw new TimetableError('Имя не должно быть пустое');
    }
  },

  validateAbout: function (newAbout) {
    if (typeof newAbout !== 'string') {
      throw new TimetableError('Информация о преподавателе должна быть строкой');
    }

    if (newAbout.length === 0) {
      throw new TimetableError('Информация о преподавателе не должна быть пустой');
    }
  },

  getById: function (id) {
    if (!(this.collection[id] instanceof Tutor)) {
      throw new TimetableError('Преподавателя с таким id не существует');
    }

    return this.collection[id];
  },

  add: function (id, name, about, img) {
    validateId(id, this.collection);
    this.validateName(name);
    this.validateAbout(about);
    this.collection[id] = new Tutor(id, name, about, img);

    return true;
  }
};