# Пример работы с API

## Основные методы
(Все даты принимаются в формате ISO 8601 )

// Лектор
- dayCollection.tutor.add(id, name, about, img) - добавление преподавателя

// Школы
- dayCollection.school.add(id, name, studentsCount) - добавление школы
- dayCollection.school.setStudentsCount(id, newStudentsCount) - изменение кол-ва студентов
- dayCollection.school.setName(id, newName) - изменение названия школы

// Аудитории
- dayCollection.classRoom.add(id, name, capacity, location) - добавление аудитории
- dayCollection.classRoom.setName(id, newName) - изменение названия аудитории
- dayCollection.classRoom.setCapacity(id, newCapacity) - изменение вместимости аудитории
- dayCollection.classRoom.setLocation(id, newLocation) - изменение расположения аудитории

// Лекции
- dayCollection.addLecture(name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr, materialHref) - добавление лекции
- dayCollection.setLectureName(lectureId, newName) - изменение названия лекции
- dayCollection.setLectureTutor(lectureId, tutorId) - изменение преподавателя лекции
- dayCollection.setLectureSchoolList(lectureId, schoolListId) - изменение школ на лекции
- dayCollection.setLectureClassRoom(lectureId, classRoomId) - изменение места проведения лекции (аудитории)
- dayCollection.setLectureDate(lectureId, dateBeginStr, dateEndStr) - изменение даты лекции
- dayCollection.setLectureMaterial(id, materialHref) - изменение ссылки на материалы лекции
- dayCollection.setAllParams(lectureId, name, tutorId, schoolListId, classRoomId, dateBeginStr, dateEndStr) - изменение всех параметров

// Фильтры
- dayCollection.filterByClassRoomAndDates(classRoomId, dateBeginStr, dateEndStr) - показать лекции в аудитории за определенный период
- dayCollection.filterBySchoolAndDates(schoolId, dateBeginStr, dateEndStr) - показать лекции школы за определенный период
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
