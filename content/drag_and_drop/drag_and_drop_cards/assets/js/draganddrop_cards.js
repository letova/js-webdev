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
    const playerStatus = (player['player_status'] === true) ? 'Подтвержден' : 'Не подтвержден';
    const playerStatusStyle = (player['player_status'] === true) ? 'draggable status_true' : 'status_false';

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

    return createTag('div', {'class': 'person-card ' + playerStatusStyle}, 
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
                        createTag('div', {'class': 'person-card__status'}, 
                            [createTag('span', playerStatus)]
                        )
                        ]
                    ),
                    createTag('div', {'class': 'person-card__close-wrap person-card__close-wrap_hidden'},
                        [createTag('button', {'class': 'person-card__close-button'})]
                    )]
                )]
            );
};

const toggleCloseButtonVisibility = (button) => {
    button.classList.toggle('person-card__close-wrap_hidden');
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

const getSize = (element) => {
    const box = element.getBoundingClientRect();
    return {
        height: box.bottom - box.top,
        width: box.right - box.left
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
      position: avatar.style.position || '',
      left: avatar.style.left || '',
      top: avatar.style.top || '',
      zIndex: avatar.style.zIndex || ''
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
    droppable.appendChild(dragObject.element);

    dragObject.element.style.position = 'static';
    dragObject.element.style.height = 'auto';
    dragObject.element.style.width = 'auto';

    dragObject.element.classList.add('person-card_third');

    const button = dragObject.element.querySelector('.person-card__close-wrap');
    toggleCloseButtonVisibility(button);
    button.addEventListener('click', removeFromDropZone);
};
  
const onDragCancel = function(dragObject) {
    dragObject.avatar.rollback();
};

const startDrag = function(event) { 
    const avatar = dragObject.avatar;
  
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
    avatar.style.height = dragObject.height + 'px';
    avatar.style.width = dragObject.width + 'px';
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
    dragObject.height = getSize(element).height;
    dragObject.width = getSize(element).width;
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

const addToDropZone = function(event) {
    if (event.which != 1) return; 

    const element = event.target.closest('.draggable');
    droppable.appendChild(element);
    element.classList.add('person-card_third');

    const button = element.querySelector('.person-card__close-wrap');
    toggleCloseButtonVisibility(button);
    button.addEventListener('click', removeFromDropZone);
};

const removeFromDropZone = function(event) {
    if (event.which != 1) return; 

    const button = event.target.closest('.person-card__close-wrap');
    const element = event.target.closest('.draggable');

    toggleCloseButtonVisibility(button);
    cardsWrap.appendChild(element);
    element.classList.remove('person-card_third');
};

//document.body.onselectstart = function() {return false};
cardsWrap.addEventListener('click', addToDropZone);
cardsWrap.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);