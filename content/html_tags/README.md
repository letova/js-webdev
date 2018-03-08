# BUILD HTML TAGS

Функция создания HTML тегов.

```javascript
createTag('div', {id: 'anyid', class: 'anyclass'}, [p], 'any text');
```

Результат:

```
<div id="anyid" class="anyclass">
    <p></p>
    "any text"
</div>
```

Первый элемент всегда имя тэга.
Очередность остальных параметров не важна, однако в DOM дереве они будут в том же порядке, в каком заданы в функции (не относится к атрибутам).
Параметров может быть любое количество.

**Синтаксис параметров:**

* Аttributes:

```javascript
{id: 'anyid', class: 'anyclass'}
```

* Element node:

```javascript
[p, div, table]
//В примере перечислены переменные (ссылки на созданные Element node)
```

* Text node:

```javascript
'any text here'
```