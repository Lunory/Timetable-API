'use strict';

var page = document.querySelector('.page');
var tutor = document.querySelectorAll('.timetable__subject-tutor');
var btnClose = document.querySelector('.popup__icon-close');

var popup = document.querySelector('.popup');
var popupTitle = popup.querySelector('.popup__header');
var popupText = popup.querySelector('.popup__text');
var popupImg = popup.querySelector('.popup__img');

//Данные для отображения информации об учителях в сплывающем окне
var tutorsData = {
    1 : {
      name: 'Антон Тен',
      text: 'В Яндексе с 2014 года. Ведущий дизайнер продукта в сервисах Переводчик, Расписания и Видео.',
      img: 'img/AntonTen'
    },

    2 : {
      name: 'Дмитрий Душкин',
      text: 'Кандидат технических наук, научный сотрудник ИПУ РАН с 2008 по 2013. Пришёл в Яндекс.Картинки в 2014 году, отвечал за мобильную версию и рост производительности сервиса. В 2016 перешёл в Yandex Data Factory, где разрабатывает интерфейсы и дизайн веб-приложений для B2B.',
      img: 'img/DmitriyDushkin'
    },

    3 : {
      name: 'Эдуард Мацуков',
      text: 'Разрабатываю приложения для Android с 2010 года. В 2014 делал высоконагруженное финансовое приложение. Тогда же начал осваивать АОП, внедряя язык в продакшн. В 2015 разрабатывал инструменты для Android Studio, позволяющие использовать aspectJ в своих проектах. В Яндексе занят на проекте Авто.ру.',
      img : 'img/EduardMatsukov'
    }
  };


var openPopup = function () {
  event.preventDefault();

  //Обновление информации во всплывающем окне
  var idTutor = this.getAttribute('data-tutor');
  popupTitle.innerText = tutorsData[idTutor].name;
  popupText.innerText = tutorsData[idTutor].text;
  popupImg.src = tutorsData[idTutor].img + '@1x.jpg';
  popupImg.srcset = tutorsData[idTutor].img + '@2x.jpg';
  popupImg.alt = tutorsData[idTutor].name;

  page.classList.add('page--popup-open');
  popup.classList.add('popup--open');

};

var closePopup = function () {
  event.preventDefault();
  page.classList.remove('page--popup-open');
  popup.classList.remove('popup--open');
};

// Вешаем обработчик события "клик" на блок timetable__subject-tutor
if (tutor.length > 0) {
  for (var i = 0; i < tutor.length; i++) {
    tutor[i].addEventListener('click', openPopup);
  }
}

// Вешаем обработчик события на крестик popup__icon-close
if (btnClose) {
  btnClose.addEventListener('click', closePopup);
}


