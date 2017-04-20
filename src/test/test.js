var assert = require('chai').assert;


// Блокируем обращение к HTML
Lecture.prototype.render = function () {};

describe('TutorCollection', function () {
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

describe('ClassRoomCollection', function () {
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

describe('SchoolCollection', function () {
  describe('#Add() Добавление школы', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, schoolCollection.add('shri', 'Школа разработки интерфейсов', 120));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, schoolCollection.add('shd', 'Школа мобильного дизайна', 100));
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

describe('LectureCollection', function () {
  describe('#Add() Добавление лекции', function () {
    it('с корректыми данными (первая)', function () {
      assert.equal(true, lectureCollection.add('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z'));
    });
    it('с корректыми данными (вторая)', function () {
      assert.equal(true, lectureCollection.add('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z'));
    });
    it('с невалидным именем', function () {
      assert.throws(function () {lectureCollection.add(123, 'DDushkin', ['shri', 'shd'], 'Panda', '2017-05-10T13:10:00Z', '2017-05-10T15:00:00Z')}, TimetableError);
    });
    it('с невалидным id преподавателя', function () {
      assert.throws(function () {lectureCollection.add('Исследование, концепт', '', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с невалидным id аудитории', function () {
      assert.throws(function () {lectureCollection.add('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 123, '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с двумя одинаковыми школами', function () {
      assert.throws(function () {lectureCollection.add('Исследование, концепт', 'DDushkin', ['shri', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с массивом с пустой школой', function () {
      assert.throws(function () {lectureCollection.add('Исследование, концепт', 'DDushkin', ['', 'shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с пустым массивом школ', function () {
      assert.throws(function () {lectureCollection.add('Исследование, концепт', 'DDushkin', [], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с переполнением аудитории студентами', function () {
      assert.throws(function () {lectureCollection.add('Исследование, концепт', 'DDushkin', ['shri'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    it('с неверным форматом даты начала лекции', function () {
      assert.throws(function () {lectureCollection.add('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T13:10:00', '2017-04-10T15:00:00Z')}, TimetableError);
    });
    // it('в занятую аудиторию', function () {
    //   assert.throws(function () {lectureCollection.add('Исследование, концепт', 'ATen', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    // });
    // it('с занятым преподавателем', function () {
    //   assert.throws(function () {lectureCollection.add('Исследование, концепт', 'DDushkin', ['shd'], 'BlueWhale', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    // });
    // it('с занятой школой', function () {
    //   assert.throws(function () {lectureCollection.add('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z')}, TimetableError);
    // });
  })
});