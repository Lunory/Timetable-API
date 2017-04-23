var assert = require('chai').assert;


// Блокируем обращение к HTML
Lecture.prototype.render = function () {};

describe('tutorCollection', function () {
  describe('#Add() Добавление преподавателя', function () {
    it('с корректыми данными (первый)', function () {
      assert.equal(true, tutorCollection.add('ATen', 'Антон Тен', 'В Яндексе с 2014 года.', 'img/AntonTen'));
    });
    it('с корректыми данными (второй)', function () {
      assert.equal(true, tutorCollection.add('DDushkin', 'Дмитрий Душкин', 'В Яндексе с 2014 года.', 'img/DmitriyDushkin'));
    });
    it('с невалидным id', function () {
      assert.throws(function () {tutorCollection.add(5348, 'Антон Тен', 'В Янео.', 'img/AntonTen')}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {tutorCollection.add('ATen', '', 'В Янео.', 'img/AntonTen')}, TimetableError);
    });
    it('с невалидным описанием', function () {
      assert.throws(function () {tutorCollection.add('ATen', 'Антон Тен', 12345, 'img/AntonTen')}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {tutorCollection.add('ATen', 'Антон Тен', 'В Яндексе с 2014 года.', 'img/AntonTen')}, TimetableError);
    });
  })
});

describe('classRoomCollection', function () {
  describe('#Add() Добавление школы', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, classRoomCollection.add('BlueWhale', 'Синий кит', 300, 'Москва, ул. Льва Толстого, 300'));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, classRoomCollection.add('Panda', 'Панда', 100, 'Москва, ул. Льва Толстого, 100'));
    });
    it('с невалидным id', function () {
      assert.throws(function () {classRoomCollection.add('', 'Панда', 100, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 123, 100, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидной вместимостью', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 'Панда', 0, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидным расположением', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 'Панда', 100, 1020)}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {classRoomCollection.add('Panda', 'Жар-птица', 200, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
  })
});

describe('schoolCollection', function () {
  describe('#Add() Добавление школы', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, schoolCollection.add('shri', 'Школа разработки интерфейсов', 120));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, schoolCollection.add('shd', 'Школа мобильного дизайна', 100));
    });
    it('с корректыми данными (третья)', function () {
      assert.equal(true, schoolCollection.add('shmd', 'Школа мобильной разработки', 70));
    });
    it('с невалидным id', function () {
      assert.throws(function () {schoolCollection.add('', 'Школа мобильного дизайна', 100)}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {schoolCollection.add('shd', 1234, 100)}, TimetableError);
    });
    it('с отрицательным количеством студентов', function () {
      assert.throws(function () {schoolCollection.add('shd', 'Школа мобильного дизайна', -30)}, TimetableError);
    });
    it('с дробным количеством студентов', function () {
      assert.throws(function () {schoolCollection.add('shd', 'Школа мобильного дизайна', 1.5)}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {schoolCollection.add('shd', 'Школа мобильной разработки', 70)}, TimetableError);
    });
  })
});

describe('lectureCollection', function () {
  describe('#Add() Добавление лекции', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z'));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z'));
    });
    it('с корректыми данными (третья)', function () {
      assert.equal(true, dayCollection.addLecture('Исследование, концепт', 'ATen', ['shmd'], 'Panda', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z'));
    });
    it('с невалидным именем', function () {
      assert.throws(function () {dayCollection.addLecture(123, 'DDushkin', ['shri', 'shd'], 'Panda', '2017-05-10T13:10:00Z', '2017-05-10T15:00:00Z')}, TimetableError);
    });
    it('с невалидным id преподавателя', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', '', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с невалидным id аудитории', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 123, '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с двумя одинаковыми школами', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с массивом с пустой школой', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с пустым массивом школ', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', [], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с переполнением аудитории студентами', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с неверным форматом даты начала лекции', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('в занятую аудиторию', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с занятым преподавателем', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с занятой школой', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
  })
});

//Set
describe('classRoomCollection', function () {
  describe('#Set() Изменение вместимости школы, в которой уже назначена лекция', function () {
    it('на большое значение', function () {
      assert.equal(true, classRoomCollection.setCapacity('BlueWhale', 300));
    });
    it('на маленькое значение', function () {
      assert.throws(function () {classRoomCollection.setCapacity('BlueWhale', 50)}, TimetableError)
    });
  })
});

describe('schoolCollection', function () {
  describe('#Set() Изменение кол-ва учеников школы', function () {
    it('на маленькое значение', function () {
      assert.equal(true, schoolCollection.setStudentsCount('shri', 20));
    });
    it('на значение, которое не поместится в аудитории', function () {
      assert.throws(function () {schoolCollection.setStudentsCount('shri', 320)}, TimetableError)
    });
  })
});

describe('lectureCollection', function () {
  describe('#Set() Изменение в лекции', function () {
    it('преподавателя', function () {
      assert.equal(true, lectureCollection.setTutor('1', 'DDushkin'));
    });
    it('преподавателя на занятого', function () {
      assert.throws(function () {lectureCollection.setTutor('0', 'ATen')}, TimetableError)
    });
    it('школ', function () {
      assert.equal(true, lectureCollection.setSchoolList('0', ['shd', 'shri']));
    });
    it('школ на занятую', function () {
      assert.throws(function () {lectureCollection.setSchoolList('0', ['shd', 'shri', 'shmd'])}, TimetableError)
    });
    it('аудитории', function () {
      assert.equal(true, lectureCollection.setClassRoom('1', 'BlueWhale'));
    });
    it('аудитории на занятую', function () {
      assert.throws(function () {lectureCollection.setClassRoom('0', 'Panda')}, TimetableError)
    });
  });
  describe('#Set() Перенос лекции', function () {
    it('на свободное время', function () {
      assert.equal(true, lectureCollection.setDates('0', '2017-05-10T13:10:00Z', '2017-05-10T15:10:00Z'));
    });
    it('на время, когда школа занята', function () {
      assert.throws(function () {lectureCollection.setDates('0', '2017-04-10T12:00:00Z', '2017-04-10T15:00:00Z')}, TimetableError)
    });
    it('на время, когда аудитория занята', function () {
      assert.throws(function () {lectureCollection.setDates('1', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z')}, TimetableError)
    });
    it('на время, когда преподаватель занят', function () {
      assert.throws(function () {lectureCollection.setDates('2', '2017-04-10T14:10:00Z', '2017-04-10T17:00:00Z')}, TimetableError)
    });
  });
});