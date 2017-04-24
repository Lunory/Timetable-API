var assert = require('chai').assert;
// Блокируем обращение к HTML
dayCollection.render = function () {};
describe('tutorCollection', function () {
  describe('#Add() Добавление преподавателя', function () {
    it('с корректыми данными (первый)', function () {
      assert.equal(true, dayCollection.tutor.add('ATen', 'Антон Тен', 'В Яндексе с 2014 года.', 'img/AntonTen'));
    });
    it('с корректыми данными (второй)', function () {
      assert.equal(true, dayCollection.tutor.add('DDushkin', 'Дмитрий Душкин', 'В Яндексе с 2014 года.', 'img/DmitriyDushkin'));
    });
    it('с невалидным id', function () {
      assert.throws(function () {dayCollection.tutor.add(5348, 'Антон Тен', 'В Янео.', 'img/AntonTen')}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {dayCollection.tutor.add('ATen', '', 'В Янео.', 'img/AntonTen')}, TimetableError);
    });
    it('с невалидным описанием', function () {
      assert.throws(function () {dayCollection.tutor.add('ATen', 'Антон Тен', 12345, 'img/AntonTen')}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {dayCollection.tutor.add('ATen', 'Антон Тен', 'В Яндексе с 2014 года.', 'img/AntonTen')}, TimetableError);
    });
  })
});
describe('classRoomCollection', function () {
  describe('#Add() Добавление школы', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, dayCollection.classRoom.add('BlueWhale', 'Синий кит', 300, 'Москва, ул. Льва Толстого, 300'));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, dayCollection.classRoom.add('Panda', 'Панда', 100, 'Москва, ул. Льва Толстого, 100'));
    });
    it('с невалидным id', function () {
      assert.throws(function () {dayCollection.classRoom.add('', 'Панда', 100, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {dayCollection.classRoom.add('Panda', 123, 100, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидной вместимостью', function () {
      assert.throws(function () {dayCollection.classRoom.add('Panda', 'Панда', 0, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
    it('с невалидным расположением', function () {
      assert.throws(function () {dayCollection.classRoom.add('Panda', 'Панда', 100, 1020)}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {dayCollection.classRoom.add('Panda', 'Жар-птица', 200, 'Москва, ул. Льва Толстого, 100')}, TimetableError);
    });
  })
});
describe('schoolCollection', function () {
  describe('#Add() Добавление школы', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, dayCollection.school.add('shri', 'Школа разработки интерфейсов', 120));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, dayCollection.school.add('shd', 'Школа мобильного дизайна', 100));
    });
    it('с корректыми данными (третья)', function () {
      assert.equal(true, dayCollection.school.add('shmd', 'Школа мобильной разработки', 70));
    });
    it('с невалидным id', function () {
      assert.throws(function () {dayCollection.school.add('', 'Школа мобильного дизайна', 100)}, TimetableError);
    });
    it('с невалидным именем', function () {
      assert.throws(function () {dayCollection.school.add('shd', 1234, 100)}, TimetableError);
    });
    it('с отрицательным количеством студентов', function () {
      assert.throws(function () {dayCollection.school.add('shd', 'Школа мобильного дизайна', -30)}, TimetableError);
    });
    it('с дробным количеством студентов', function () {
      assert.throws(function () {dayCollection.school.add('shd', 'Школа мобильного дизайна', 1.5)}, TimetableError);
    });
    it('добавление с существующим id', function () {
      assert.throws(function () {dayCollection.school.add('shd', 'Школа мобильной разработки', 70)}, TimetableError);
    });
  })
});
describe('lectureCollection', function () {
  describe('#Add() Добавление лекции', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(lectureCollection.nextId.toString(), dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z', null));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(lectureCollection.nextId.toString(), dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null));
    });
    it('с корректыми данными (третья)', function () {
      assert.equal(lectureCollection.nextId.toString(), dayCollection.addLecture('Исследование, концепт', 'ATen', ['shmd'], 'Panda', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z', null));
    });
    it('с невалидным именем', function () {
      assert.throws(function () {dayCollection.addLecture(123, 'DDushkin', ['shri', 'shd'], 'Panda', '2017-05-10T13:10:00Z', '2017-05-10T15:00:00Z', null)}, TimetableError);
    });
    it('с невалидным id преподавателя', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', '', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с невалидным id аудитории', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 123, '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с двумя одинаковыми школами', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с массивом с пустой школой', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с пустым массивом школ', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', [], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с переполнением аудитории студентами', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с неверным форматом даты начала лекции', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('в занятую аудиторию', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с занятым преподавателем', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
    it('с занятой школой', function () {
      assert.throws(function () {dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)}, TimetableError);
    });
  })
});
//Set
describe('classRoomCollection', function () {
  describe('#Set() Изменение вместимости школы, в которой уже назначена лекция', function () {
    it('на большое значение', function () {
      assert.equal(true, dayCollection.classRoom.setCapacity('BlueWhale', 300));
    });
    it('на маленькое значение', function () {
      assert.throws(function () {dayCollection.classRoom.setCapacity('BlueWhale', 50)}, TimetableError)
    });
  })
});
describe('schoolCollection', function () {
  describe('#Set() Изменение кол-ва учеников школы', function () {
    it('на маленькое значение', function () {
      assert.equal(true, dayCollection.school.setStudentsCount('shri', 20));
    });
    it('на значение, которое не поместится в аудитории', function () {
      assert.throws(function () {dayCollection.school.setStudentsCount('shri', 320)}, TimetableError)
    });
  })
});
describe('dayCollection', function () {
  describe('#Set() Изменение в лекции', function () {
    it('преподавателя', function () {
      assert.equal(true, dayCollection.setLectureTutor('1', 'DDushkin'));
    });
    it('преподавателя на занятого', function () {
      assert.throws(function () {dayCollection.setLectureTutor('0', 'ATen')}, TimetableError)
    });
    it('школ', function () {
      assert.equal(true, dayCollection.setLectureSchoolList('0', ['shd', 'shri']));
    });
    it('школ на занятую', function () {
      assert.throws(function () {dayCollection.setLectureSchoolList('0', ['shd', 'shri', 'shmd'])}, TimetableError)
    });
    it('аудитории', function () {
      assert.equal(true, dayCollection.setLectureClassRoom('1', 'BlueWhale'));
    });
    it('аудитории на занятую', function () {
      assert.throws(function () {dayCollection.setLectureClassRoom('0', 'Panda')}, TimetableError)
    });
  });
  describe('#Set() Перенос лекции', function () {
    it('на свободное время', function () {
      assert.equal(true, dayCollection.setLectureDate('0', '2017-05-10T13:10:00Z', '2017-05-10T15:10:00Z'));
    });
    it('на время, когда школа занята', function () {
      assert.throws(function () {dayCollection.setLectureDate('0', '2017-04-10T12:00:00Z', '2017-04-10T15:00:00Z')}, TimetableError)
    });
    it('на время, когда аудитория занята', function () {
      assert.throws(function () {dayCollection.setLectureDate('1', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z')}, TimetableError)
    });
    it('на время, когда преподаватель занят', function () {
      assert.throws(function () {dayCollection.setLectureDate('2', '2017-04-10T14:10:00Z', '2017-04-10T17:00:00Z')}, TimetableError)
    });
  });
});