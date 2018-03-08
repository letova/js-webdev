"use strict";

const jsonData = [{"id":1,"title":"Фауст","amount":7,"cost":300},{"id":2,"title":"Война и мир","amount":6,"cost": 400},{"id":3,"title":"Анна Каренина","amount":8,"cost":500},{"id":4,"title":"Замок Броуди","amount":2,"cost":300},{"id":5,"title":"Звезды Эгера","amount":10,"cost":800},{"id":6,"title":"Мастер и Маргарита","amount":4,"cost":500},{"id":7,"title":"Мертвые души","amount":8,"cost":600}];

const createTableFromJson = (data) => {

    const root = document.querySelector('.root');

    //STATE

    let currentPage = 1,
        perPage = 4,
        shouldCreatePageButton = true,
        goOnPage; //will contain the pagination state

    //CREATE TABLE

    const createTData = (data) => {
        const td = document.createElement("td");
        td.innerText = data;
        return td;
    };

    const createTRow = (data) => {
        const tr = document.createElement("tr");
        const arrayOfItemKeys = Object.keys(data);

        for(let i = 0; i < arrayOfItemKeys.length; i++) {
            const key = arrayOfItemKeys[i];
            const td = createTData(data[key]);
            tr.appendChild(td);
        }
        return tr;
    };

    const createTHead = (data) => {
        const thead = document.createElement("thead");
        const headers = Object.keys(data[0]);
        const tr = document.createElement("tr");

        for(let i = 0; i < headers.length; i++) {
            const td = createTData(headers[i]);
            tr.appendChild(td);
        }
        thead.appendChild(tr);
        return thead;
    };

    const createTbody = (data) => {
        const tbody = document.createElement("tbody");

        for(let i = 0; i < data.length; i++) {
            const tr = createTRow(data[i]);
            tbody.appendChild(tr);
        }
        return tbody;
    };

    //SORT

    const doSort = (data, key) => {
        const copyData = data.slice();
        const tbody = table.querySelector('tbody');
    
        const sortMethod = (a, b) => {
            a = (isNaN(Number(a[key]))) ? a[key] : Number(a[key]);
            b = (isNaN(Number(b[key]))) ? b[key] : Number(b[key]);
    
            return (a > b) ? 1 : -1;
        };
    
        const sortedData = copyData.sort(sortMethod);
        goOnPage = createPagination(sortedData, perPage);
        goOnPage(currentPage);
        //dataState = sortedData.slice();
        //const newTbody = createTbody(sortedData);
        //table.replaceChild(newTbody, tbody);
    };

    //PAGINATION

    const createPagination = (data, perPage) => {
        const copyData = data.slice();
        const numOfPage = Math.ceil(data.length / perPage);

        const createPageButton = (numOfPage) => {
            const buttonBox = document.createElement('div');

            for(let i = 0; i < numOfPage; i++) {
                const button = document.createElement('button');
                button.setAttribute('class', 'page-button');
                button.setAttribute('data-value', i+1);
                button.innerHTML = i+1;
                buttonBox.appendChild(button);
            }
            return buttonBox;
        };

        const checkButtonsExist = (table) => {
            const next = table.nextSibling;
            if (next && next.getAttribute('data-id') === 'button-box') {
                return true;
            }
            return false;
        };

        const replaceButtonsBox = (elem, table) => {
            const next = table.nextSibling;
            const parent = table.parentNode;
            parent.replaceChild(elem, next);
        };

        const insertAfter = (elem, table) => {
            const parent = table.parentNode;
            const next = table.nextSibling;
            if (next) {
              return parent.insertBefore(elem, next);
            } else {
              return parent.appendChild(elem);
            }
        };

        if (shouldCreatePageButton) {
            const buttonBox = createPageButton(numOfPage);
            buttonBox.setAttribute('data-id', 'button-box');
            buttonBox.setAttribute('class', 'button-box');

            if (checkButtonsExist(table)) {
                replaceButtonsBox(buttonBox, table);
            } else {
                insertAfter(buttonBox, table);
            }
            shouldCreatePageButton = false;
        }

        return (currentPage) => {
            const tbody = table.querySelector('tbody');
            const start = (currentPage * perPage) - perPage;
            const end = (start + perPage) - 1;

            const viewData = copyData.filter((el, i) => (i >= start && i <= end));
            const newTbody = createTbody(viewData);
            table.replaceChild(newTbody, tbody);
        }
    };

    //PAGE BUTTONS

    const getButtons = () => {
        return document.querySelectorAll('.page-button');
    };

    const removeClassActive = (buttons) => {
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('button-active');
        }
    };

    const setClassActiveOnCurrentButton = (buttons, index) => {
        removeClassActive(buttons);
        buttons[index].classList.add('button-active');
    };

    //ACTION

    const setEventListenerOnButtons = (buttons) => {
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', (event) => {
                const eventTarget = event.target;
                const eventValue = eventTarget.getAttribute('data-value');
                
                currentPage = Number(eventValue);
                goOnPage(currentPage);

                setClassActiveOnCurrentButton(buttons, currentPage - 1);
            })
        }
    };

    const setEventListenerOnTable = (table) => {
        table.addEventListener('click', (event) => {
            const eventTarget = event.target;
            const eventSection = eventTarget.parentNode.parentNode;
            if (eventSection.tagName !== 'THEAD') return;
        
            doSort(data, eventTarget.innerText.toLowerCase());//err
        });
    };

    //INIT

    const table = document.createElement('table');
    const thead = createTHead(data);
    const tbody = createTbody(data);

    table.appendChild(thead);
    table.appendChild(tbody);
    root.appendChild(table);

    setEventListenerOnTable(table);

    goOnPage = createPagination(data, perPage);
    goOnPage(currentPage);

    const buttons = getButtons();
    setEventListenerOnButtons(buttons);
    setClassActiveOnCurrentButton(buttons, currentPage - 1);

};

createTableFromJson(jsonData);




