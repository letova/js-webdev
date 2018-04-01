"use strict";

// TAGS

const propertyActions = [
    {
      //'text node'
      check: arg => typeof arg === 'string',
      process: (str, tag) => {
          tag.appendChild(document.createTextNode(str));
      }
    },
    {
      //'element node'
      check: arg => arg instanceof Array,
      process: (arr, tag) => {
          arr.forEach(e => tag.appendChild(e));
      }
    },
    {
      //'attributes',
      check: arg => arg instanceof Object,
      process: (obj, tag) => {
          const keys = Object.keys(obj);
          keys.forEach(e => tag.setAttribute(e, obj[e]));
      }
    },
];

const getPropertyAction = arg => propertyActions.find(({ check }) => check(arg));

const createTag = (tagname, ...options) => {
    const tag = document.createElement(tagname);
    options.forEach((option) => {
        const { process } = getPropertyAction(option);
        process(option, tag);
    });
    return tag;
};

// CARDS

const data = [
    {"id": "1", "name": "Chris Martin", "img": "assets/img/men-1.jpg","sex": "male", "age": "34", "rank": "2", "games": "12","victory": "8", "player_status": true},
    {"id": "1", "name": "Normann Murray", "img": "assets/img/men-2.jpg","sex": "male", "age": "30", "rank": "4", "games": "5","victory": "2", "player_status": true},
    {"id": "1", "name": "David Baczor", "img": "assets/img/men-3.jpg","sex": "male", "age": "31", "rank": "1", "games": "15","victory": "14", "player_status": false},
    {"id": "1", "name": "Veronica Denman", "img": "assets/img/women-4.jpg","sex": "female", "age": "27", "rank": "1", "games": "15","victory": "14", "player_status": true},
    {"id": "1", "name": "Kim Smith", "img": "assets/img/women-5.jpg","sex": "female", "age": "33", "rank": "1", "games": "15","victory": "14", "player_status": true}];

const createPlayerCard = (player) => {
    const playerStatus = (player['player_status'] === true) ? 'Подтвержден' : 'Неподтвержден';
    const playerStatusStyle = (player['player_status'] === true) ? 'person-card__status status_true' : 'person-card__status status_false';

    const createPlayerStat = (title, value) => {
        return createTag('div', {'class': 'person-card__collumn_third'}, 
                [
                    createTag('h3', {'class': 'person-card__subtitle'}, title),
                    createTag('span', {'class': 'person-card__value'}, value)
                ]);
    };

    const cardLeftCol = createTag('div', {'class': 'person-card__image-wrap'}, 
                            [createTag('img', {
                                'class': 'person-card__image', 
                                'src': player['img'],
                                'alt': player['name']
                            })]
                        );

    const cardRightCol = createTag('ul', {'class': 'person-card__describe'}, 
                            [
                                createTag('li', {'class': 'person-card__name'}, player['name']),
                                createTag('li', {'class': 'person-card__sex'}, 'Sex: ' + player['sex']),
                                createTag('li', {'class': 'person-card__age'}, 'Age: ' + player['age'])
                            ]
                        );

    return createTag('div', {'class': 'person-card draggable'}, 
                [createTag('div', {'class': 'person-card__in-wrap'}, 
                    [createTag('div', {'class': 'person-card__main-content'}, 
                        [
                            createTag('div', {'class': 'person-card__collumn_fix'}, [cardLeftCol]), 
                            createTag('div', {'class': 'person-card__collumn_stretch'}, [cardRightCol])
                        ]
                    ),
                    createTag('div', {'class': 'person-card__row'}, 
                        [createTag('div', {'class': 'person-card__statistics'}, 
                            [
                                createPlayerStat('Rank', player['rank']),
                                createPlayerStat('Games', player['games']),
                                createPlayerStat('Victory', player['victory'])
                            ]
                        ),
                        createTag('div', {'class': playerStatusStyle}, 
                            [createTag('span', playerStatus)]
                        )
                        ]
                    )]
                )]
            );
};

const cardsWrap = document.querySelector('.cards-wrap');
data.forEach(el => cardsWrap.appendChild(createPlayerCard(el)));

// DRAG AND DROP
const droppable = document.querySelector('.droppable');

const getPosition = (element) => {
    const box = element.getBoundingClientRect();
    return {
        top: box.top + window.pageYOffset, 
        left: box.left + window.pageXOffset
    };
};

const getClosest = (element) => {
    //
};

const createAvatar = function(event) {
    const avatar = dragObject.element;
    const old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || ''
    };
  
    // функция для отмены переноса
    avatar.rollback = function() {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };
  
    return avatar;
};

const findDroppable = function(event) {
    dragObject.avatar.hidden = true;

    const elem = document.elementFromPoint(event.clientX, event.clientY);
  
    dragObject.avatar.hidden = false;
  
    if (elem == null) {
      return null;
    }
  
    return elem.closest('.droppable');
};

const onDragEnd = function(dragObject, dropElement) {
    //dragObject.element.hidden = true;
    droppable.appendChild(dragObject.element);
    dragObject.element.style.position = 'static';
    dropElement.classList.add('any-style');
  
    setTimeout(function() {
        dropElement.classList.remove('any-style');
    }, 200);
};
  
const onDragCancel = function(dragObject) {
    dragObject.avatar.rollback();
};

const startDrag = function(event) { 
    const avatar = dragObject.avatar;
  
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
};

const finishDrag = function(event) { 
    const dropElement = findDroppable(event);

    if (!dropElement) {
      onDragCancel(dragObject);
    } else {
      onDragEnd(dragObject, dropElement);
    }
};

// DRAG AND DROP ACTION

let dragObject = {};

const onMouseDown = function(event) {
    if (event.which != 1) return; 

    const element = event.target.closest('.draggable');
    if (!element) return;

    dragObject.element = element;
    dragObject.downX = event.pageX;
    dragObject.downY = event.pageY;
};

const onMouseMove = function(event) {
    if (!dragObject.element) return; 

    if (!dragObject.avatar) { 
        // посчитать дистанцию, на которую переместился курсор мыши
        const moveX = event.pageX - dragObject.downX;
        const moveY = event.pageY - dragObject.downY;
        if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
            return;
        } 

        dragObject.avatar = createAvatar(event); 
        if (!dragObject.avatar) {
            dragObject = {}; 
            return; 
        }

        const coords = getPosition(dragObject.avatar);
        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;

        startDrag(event); 
    }   

    // отобразить перенос объекта при каждом движении мыши
    dragObject.avatar.style.left = event.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = event.pageY - dragObject.shiftY + 'px';

    return false;
};

const onMouseUp = function(event) {
    if (dragObject.avatar) { 
        finishDrag(event);
    }

    dragObject = {};
};

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);


  

/*
  var DragManager = new function() {
  

    var dragObject = {};
  
    var self = this;
  
    function onMouseDown(e) {
  
      if (e.which != 1) return;
  
      var elem = e.target.closest('.draggable');
      if (!elem) return;
  
      dragObject.elem = elem;
  
      // запомним, что элемент нажат на текущих координатах pageX/pageY
      dragObject.downX = e.pageX;
      dragObject.downY = e.pageY;
  
      return false;
    }
  
    function onMouseMove(e) {
      if (!dragObject.elem) return; // элемент не зажат
  
      if (!dragObject.avatar) { // если перенос не начат...
        var moveX = e.pageX - dragObject.downX;
        var moveY = e.pageY - dragObject.downY;
  
        // если мышь передвинулась в нажатом состоянии недостаточно далеко
        if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
          return;
        }
  
        // начинаем перенос
        dragObject.avatar = createAvatar(e); // создать аватар
        if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
          dragObject = {};
          return;
        }
  
        // аватар создан успешно
        // создать вспомогательные свойства shiftX/shiftY
        var coords = getCoords(dragObject.avatar);
        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;
  
        startDrag(e); // отобразить начало переноса
      }
  
      // отобразить перенос объекта при каждом движении мыши
      dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
      dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
  
      return false;
    }
  
    function onMouseUp(e) {
      if (dragObject.avatar) { // если перенос идет
        finishDrag(e);
      }
  
      // перенос либо не начинался, либо завершился
      // в любом случае очистим "состояние переноса" dragObject
      dragObject = {};
    }
  
    function finishDrag(e) {
      var dropElem = findDroppable(e);
  
      if (!dropElem) {
        self.onDragCancel(dragObject);
      } else {
        self.onDragEnd(dragObject, dropElem);
      }
    }
  
    function createAvatar(e) {
  
      // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
      var avatar = dragObject.elem;
      var old = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextSibling,
        position: avatar.position || '',
        left: avatar.left || '',
        top: avatar.top || '',
        zIndex: avatar.zIndex || ''
      };
  
      // функция для отмены переноса
      avatar.rollback = function() {
        old.parent.insertBefore(avatar, old.nextSibling);
        avatar.style.position = old.position;
        avatar.style.left = old.left;
        avatar.style.top = old.top;
        avatar.style.zIndex = old.zIndex
      };
  
      return avatar;
    }
  
    function startDrag(e) {
      var avatar = dragObject.avatar;
  
      // инициировать начало переноса
      document.body.appendChild(avatar);
      avatar.style.zIndex = 9999;
      avatar.style.position = 'absolute';
    }
  
    function findDroppable(event) {
      // спрячем переносимый элемент
      dragObject.avatar.hidden = true;
  
      // получить самый вложенный элемент под курсором мыши
      var elem = document.elementFromPoint(event.clientX, event.clientY);
  
      // показать переносимый элемент обратно
      dragObject.avatar.hidden = false;
  
      if (elem == null) {
        // такое возможно, если курсор мыши "вылетел" за границу окна
        return null;
      }
  
      return elem.closest('.droppable');
    }
  
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;
  
    this.onDragEnd = function(dragObject, dropElem) {};
    this.onDragCancel = function(dragObject) {};
  
  };
  
  
  function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();
  
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  
  }


  DragManager.onDragEnd = function(dragObject, dropElem) {

    // скрыть/удалить переносимый объект
    dragObject.elem.hidden = true;
  
    // успешный перенос, показать улыбку классом computer-smile
    dropElem.className = 'computer computer-smile';
  
    // убрать улыбку через 0.2 сек
    setTimeout(function() {
      dropElem.classList.remove('computer-smile');
    }, 200);
  };
  
  DragManager.onDragCancel = function(dragObject) {
    // откат переноса
    dragObject.avatar.rollback();
  };

  */

