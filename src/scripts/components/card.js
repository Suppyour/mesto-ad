// Функция удаления карточки из DOM
export const deleteCard = (cardElement) => {
  cardElement.remove();
};

// Функция создания карточки
export const createCardElement = (
  data,
  userId,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);

  const likeButton = cardElement.querySelector(".card__like-button");
  const unLikeButton = cardElement.querySelector(".card__like-button_is-active");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  // Отображение количества лайков
  cardLikeCount.textContent = data.likes.length;

  // Проверка, лайкнул ли пользователь карточку
  const isLiked = data.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Слушатель лайка
  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      onLikeIcon(likeButton, cardLikeCount, data._id);
    });
  }

  // Проверка владельца карточки для удаления
  if (data.owner._id !== userId) {
    deleteButton.remove();
  } else if (onDeleteCard) {
    deleteButton.addEventListener("click", () => {
      onDeleteCard(data._id, cardElement);
    });
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: data.name, link: data.link })
    );
  }

  return cardElement;
};

// Удаляем экспорт likeCard, так как логика изменилась и теперь управляется извне через callback

