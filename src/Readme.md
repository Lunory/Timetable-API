# Пример работы с API

## Основные методы
(Все даты принимаются в формате ISO 8601 )

// Лектор
- dayCollection.tutor.add(id, name, about, img) - добавление преподавателя
  - id - string, id преподавателя;
  - name - string, имя преподавателя;
  - about - string, о преподавателе;
  - img - string, название фото.

// Школы
- dayCollection.school.add(id, name, studentsCount) - добавление школы
  - id - string, id школы;
  - name - string, название школы;
  - studentsCount - number, кол-во студентов в школе.
	
- dayCollection.school.setStudentsCount(id, newStudentsCount) - изменение кол-ва студентов
  - id - string, id школы;
  - newStudentsCount - number, новое кол-во студентов в школе.
	
- dayCollection.school.setName(id, newName) - изменение названия школы
  - id - string, id школы;
  - newName - string, новое название школы.

// Аудитории
- dayCollection.classRoom.add(id, name, capacity, location) - добавление аудитории
  - id - string, id аудитории;
  - name - string, название аудитории;
  - capacity - number, вместительность аудитории;
  - location - string, расположение аудитории.

- dayCollection.classRoom.setName(id, newName) - изменение названия аудитории
  - id - string, id аудитории;
  - newName - string, новое название аудитории.
	
- dayCollection.classRoom.setCapacity(id, newCapacity) - изменение вместимости аудитории
  - id - string, id аудитории;
  - newCapacity - number, новая вместительность аудитории.
	
- dayCollection.classRoom.setLocation(id, newLocation) - изменение расположения аудитории
  - id - string, id аудитории;
  - newLocation - string, новое расположение аудитории.

// Лекции
- dayCollection.addLecture(name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr, materialHref) - добавление лекции
  - name - string, название лекции;
  - tutorId - string, id преподавателя;
  - schoolListId - array[string], массив id школ;
  - classRoomId - string, id аудитории;
  - dateBeginStr - string, дата начала лекции;
  - dateEndStr - string, дата конца лекции;
  - materialHref - string/null, ссылка на материалы лекции, если их нет, то null.

- dayCollection.setLectureName(lectureId, newName) - изменение названия лекции
  - lectureId - string, id лекции;
  - newName - string, новое название лекции.

- dayCollection.setLectureTutor(lectureId, tutorId) - изменение преподавателя лекции
  - lectureId - string, id лекции;
  - tutorId - string, id преподавателя.

- dayCollection.setLectureSchoolList(lectureId, schoolListId) - изменение школ на лекции
  - lectureId - string, id лекции;
  - schoolListId - array[string], массив id школ.

- dayCollection.setLectureClassRoom(lectureId, classRoomId) - изменение места проведения лекции (аудитория)
  - lectureId - string, id лекции;
  - classRoomId - string, id аудитории.
	
- dayCollection.setLectureDate(lectureId, dateBeginStr, dateEndStr) - изменение даты лекции
  - lectureId - string, id лекции;	
  - dateBeginStr - string, новая дата начала лекции;
  - dateEndStr - string, новая дата конца лекции;
	
- dayCollection.setLectureMaterial(id, materialHref) - изменение ссылки на материалы лекции
  - lectureId - string, id лекции;
  - materialHref - string/null, ссылка на материалы лекции, если их нет, то null. 
	
- dayCollection.setAllParams(lectureId, name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr, materialHref) - изменение всех параметров
  - lectureId - string, id лекции;
  - name - string, новое имя лекции;
  - tutorId - string, id преподавателя;
  - schoolListId - array[string], массив id школ;
  - classRoomId - string, id аудитории;
  - dateBeginStr - string, дата начала лекции;
  - dateEndStr - string, дата конца лекции;
  - materialHref - string/null, ссылка на материалы лекции, если их нет, то null.

// Фильтры
- dayCollection.filterByClassRoomAndDates(classRoomId, dateBeginStr, dateEndStr) - показать лекции в аудитории за определенный период
  - classRoomId - string, id аудитории;
  - dateBeginStr - string, дата начала диапазона;
  - dateEndStr - string, дата конца диапазона.

- dayCollection.filterBySchoolAndDates(schoolId, dateBeginStr, dateEndStr) - показать лекции школы за определенный период
  - schoolId - string, id школы;
  - dateBeginStr - string, дата начала диапазона;
  - dateEndStr - string, дата конца диапазона.
	
- dayCollection.cancelFilter() - отменить фильтры

// Получить всю информацию о расписании
- dayCollection.getAllInfo() - получить всю информацию о расписании в формате JSON

## Пример использования

1) Добавляем преподавателей
dayCollection.tutor.add('ATen', 'Антон Тен', 'В Яндексе с 2014 года.', 'img/AntonTen')
dayCollection.tutor.add('DDushkin', 'Дмитрий Душкин', 'В Яндексе с 2014 года.', 'img/DmitriyDushkin')

2) Добавляем аудитории
dayCollection.classRoom.add('BlueWhale', 'Синий кит', 300, 'Москва, ул. Льва Толстого, 300')
dayCollection.classRoom.add('Panda', 'Панда', 100, 'Москва, ул. Льва Толстого, 100')

3) Добавляем школы
dayCollection.school.add('shri', 'Школа разработки интерфейсов', 120)
dayCollection.school.add('shd', 'Школа мобильного дизайна', 100)
dayCollection.school.add('shmd', 'Школа мобильной разработки', 70)

4) Добавляем лекции
dayCollection.addLecture('Исследование, концепт', 'DDushkin', ['shri', 'shd'], 'BlueWhale', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z', null)
dayCollection.addLecture('Исследование, концепт', 'ATen', ['shd'], 'Panda', '2017-04-10T13:10:00Z', '2017-04-10T15:00:00Z', null)
dayCollection.addLecture('Исследование, концепт', 'ATen', ['shmd'], 'Panda', '2017-04-10T10:00:00Z', '2017-04-10T13:00:00Z', null)

5) Изменим вместимость аудитории
dayCollection.classRoom.setCapacity('BlueWhale', 300)

6) Перенесем лекцию
dayCollection.setLectureDate('0', '2017-05-10T13:10:00Z', '2017-05-10T15:10:00Z')

7) Изменим список школ в лекции
dayCollection.setLectureSchoolList('0', ['shd', 'shri'])
