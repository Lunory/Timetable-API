var timetable = {
  init: function (data) {
    for (var i = 0; i < data.tutorList.length; i++) {
      tutorCollection.add(data.tutorList[i].id, data.tutorList[i].name, data.tutorList[i].about, data.tutorList[i].img);
    }

    for (var i = 0; i < data.classRoomList.length; i++) {
      classRoomCollection.add(data.classRoomList[i].id, data.classRoomList[i].name, data.classRoomList[i].capacity, data.classRoomList[i].location);
    }

    for (var i = 0; i < data.schoolList.length; i++) {
      schoolCollection.add(data.schoolList[i].id, data.schoolList[i].name, data.schoolList[i].studentsCount);
    }

    for (var i = 0; i < data.lectureList.length; i++) {
      dayCollection.addLecture(data.lectureList[i].name, data.lectureList[i].tutorId, data.lectureList[i].schoolListId, data.lectureList[i].classRoomId, data.lectureList[i].dateBeginStr, data.lectureList[i].dateEndStr);
    }
  }
};