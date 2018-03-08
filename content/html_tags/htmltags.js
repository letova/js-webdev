"use strict";

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

//Пример

const root = document.getElementById('root');

const paragraph = createTag('p', 'paragraph');
const firstChild = createTag('div', 'text before', {class: 'anyclass', id: 'anyid'}, [paragraph], 'text after');

root.appendChild(firstChild);