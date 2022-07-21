
import { escapeKey } from './util.js';

const MAX_COMMENTS = 5;

const commentsList = document.querySelector('.social__comments');
const textCountComment = document.querySelector('.social__comment-count');
const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const buttonLoadMore = document.querySelector('.comments-loader');

let commentsHandler = null;

//Прячет модальное окно и убирает фиксацию с body, так же удаляет слушатели.
const closePopup = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', closePopupEsc);
  closeButton.removeEventListener('click', closePopup);
  buttonLoadMore.removeEventListener('click', commentsHandler);
};

function closePopupEsc (evt) {
  if(escapeKey(evt)) {
    evt.preventDefault();
    closePopup();
  }
}

//Создаёт элемент и передаёт параметр массива.
const createElement = (commentsData) => {
  const element = document.createElement('li');
  const img = document.createElement('img');
  const text = document.createElement('p');

  element.classList.add('social__comment');
  text.classList.add('social__text');
  text.textContent = commentsData.message;
  img.classList.add('social__picture');
  img.src = commentsData.avatar;
  img.width = '35';
  img.height = '35';
  img.alt = commentsData.name;

  element.append(img);
  element.append(text);
  return element;
};

//Генерирует комментарии и подставляет к каждому элементу.
const renderComments = (comments) => {
  comments.forEach ((comment) => {
    const createComment = createElement(comment);
    commentsList.append(createComment);

    textCountComment.querySelector('#of').textContent = `${commentsList.children.length } из `;
  });
};

//Генерирует новую копию и разбивает на 5.
const newRenderComments = (comments) => {
  const copyComments = comments.slice();
  commentsList.innerHTML = '';

  const onClickCommentsHandler = () => {
    addComments(copyComments);
  };

  commentsHandler = onClickCommentsHandler;

  if(copyComments.length <= MAX_COMMENTS) {
    buttonLoadMore.classList.add('hidden');
    renderComments(copyComments);

  } else {
    buttonLoadMore.classList.remove('hidden');
    renderComments(copyComments.splice(0, MAX_COMMENTS));

    buttonLoadMore.addEventListener('click', commentsHandler);
  }
};

//Добавляет новые комментарии
function addComments (copyComments) {
  if (copyComments.length <= MAX_COMMENTS) {
    buttonLoadMore.classList.add('hidden');
  }
  renderComments(copyComments.splice(0,MAX_COMMENTS));
}


//Показывает большое фото с переданным аргументом массива.
const showBigPicture = (data) => {
  const {url, likes, comments, description} = data;
  document.body.classList.add('modal-open');

  bigPicture.querySelector('.big-picture__img img').src = url;
  bigPicture.querySelector('.likes-count').textContent = likes;
  bigPicture.querySelector('.comments-count').textContent = comments.length;
  bigPicture.querySelector('.social__caption').textContent = description;
  bigPicture.classList.remove('hidden');
  bigPicture.focus();

  document.addEventListener('keydown', closePopupEsc);
  closeButton.addEventListener('click', closePopup);

  newRenderComments(comments);
};

export {
  showBigPicture,
};
