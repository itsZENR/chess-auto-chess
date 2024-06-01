import { WebSocketHandler } from "./websocket.js";
import SessionManager from "./sessionStorage.js";
import { Chess } from "./chess.js";
const game = new Chess();

// Подключение к WebSocket
const chatSocket = new WebSocketHandler();
const roomName = JSON.parse(document.getElementById("room-name").textContent);
chatSocket.connect(roomName);

// Формирование доски
let config = {
  draggable: true,
  dropOffBoard: "snapback",
  position: "7k/8/8/8/8/8/8/K7",
  sparePieces: true,
  onDrop: onDrop,
};
let board = Chessboard("myBoard", config);

// Переменные для подсчета очков каждого игрока
const whitePoints = 10;
const blackPoints = 10;

// Находим очки игроков
let whitePlayerPoints = document.querySelector(".player-white-points strong");
let blackPlayerPoints = document.querySelector(".player-black-points strong");

// переворачиваем доску для второго игрока
if (whitePlayerPoints != null) {
  whitePlayerPoints.innerHTML = whitePoints;
  board.orientation("white");
} else if (blackPlayerPoints != null) {
  blackPlayerPoints.innerHTML = blackPoints;
  board.orientation("black");
}

// Элемент статуса
const gameStatusHtml = document.querySelector(".game-status");

// Переменные для подсчета количества ходов
let counterStep = 0;

// Статус игры
let gameStatus = false;
// Позиция элемента для отображения End
const gameStatusWinner = document.querySelector(".game-status-winner");
const gameStatusTie = document.querySelector(".game-status-tie");

// id доски
const boardById = document.getElementById("myBoard");

// Элемент ходов
const moveSpan = document.querySelector(".board__title span");

// имена игроков
const whitePlayer = document.querySelector(".player-white");
const blackPlayer = document.querySelector(".player-black");
console.log(whitePlayer.innerHTML);
console.log(blackPlayer.innerHTML);

// Заставка для отправки ссылки другому игроку
const hidden = document.querySelector(".hidden");

function checkSession() {
  const isChatOpen = chatSocket.onSocketOpen();
  // Инициализация сессии
  const sessionData = SessionManager.initSession(isChatOpen);
  let savedPositions = sessionData.savedPositions;
  const savedWhitePoints = sessionData.savedWhitePoints;
  const savedBlackPoints = sessionData.savedBlackPoints;

  try {
    // Обновляем очки в html
    if (savedWhitePoints != null) {
      whitePlayerPoints.innerHTML = savedWhitePoints;
    }
    // Обновляем очки в html
    if (savedBlackPoints != null) {
      blackPlayerPoints.innerHTML = savedBlackPoints;
    }
  } catch (err) {
    console.log("err", err);
  }

  if (savedPositions) {
    savedPositions = JSON.parse(savedPositions);
    // Установка позиций на доске
    board.position(savedPositions);
  }
}
// Инициализация/восстановление сессии
checkSession();

// Очки фигур
let pieceValue = {
  P: 1, // пешка
  N: 3, // конь
  B: 3, // слон
  R: 5, // ладья
  Q: 9, // ферзь
  p: 1, // пешка
  n: 3, // конь
  b: 3, // слон
  r: 5, // ладья
  q: 9, // ферзь
};

// Кнопка Готов
let saveButton = document.querySelector(".board-save"); // Получаем кнопку
saveButton.addEventListener("click", showPositions); // Добавляем обработчик события для отмены хода по клику на кнопку
// получить текущую позицию доски.
function showPositions() {
  // Блокировка доски
  if (boardById) {
    // boardById.classList.add('_block');
  }

  // Переключаем класса "green" для кнопки
  // saveButton.classList.toggle("green");
  saveButton.classList.add("green");

  // Проверка наличия класса "green" у кнопки
  if (saveButton.classList.contains("green")) {
    // Статус игры
    gameStatus = true;
  } else {
    // Статус игры
    gameStatus = false;
  }

  console.log("Готов");
  const message = "Готов";
  // Отправка позиции на сервер
  chatSocket.sendMessageToServer(message);
}

// Кнопка Назад
let exitButton = document.querySelector(".hidden__button"); // Получаем кнопку
exitButton.addEventListener("click", exitPopap); // Добавляем обработчик события для отмены хода по клику на кнопку
function exitPopap() {
  console.log(1);
  gameStatusHtml.classList.remove("_active");
}

// Получаем сообщение с сервера
chatSocket.messageHandler = (data) => {
  console.log("==New message:==");
  // console.log("chatSocket gameStatus: " + data.gameStatus);
  // console.log("chatSocket message: " + data.message);
  // console.log("chatSocket user: " + data.user);
  let color = undefined;
  //   let prevPosition = undefined;
  //   let nextPosition = undefined;
  let position = undefined;
  let playerPoint = undefined;

  if (data.message === "Готов") {
    // Записываем позицию доски
    var boardFen = board.fen();
    boardFen = boardFen + " " + "w - - 0 1";
    // Записываем позицию в game
    board.position(game.load(boardFen, { skipValidation: true }));
  }

  // Узнать имя последнего зашедшего игрока
  if (data.user != undefined) {
    // blackPlayerName = data.user;
  }

  // если зашел второй игрок, обновляем имена игроков и снимаем блокировку
  if (data.gameStatus === "GameStart") {
    console.log("gameStatus:", "GameStart");
    // убираем неактив
    hidden.classList.remove("_active");

    // Обновляем имена
    // blackPlayer.innerHTML = blackPlayerName;
  } else if (data.gameStatus === "1-0") {
    //   White winner
    gameStatusWinner.classList.add("_active");
    EndGame();
  } else if (data.gameStatus === "0-1") {
    //   Black winner
    gameStatusWinner.classList.add("_active");
    EndGame();
  } else if (data.gameStatus === "1/2-1/2") {
    //   Tie
    gameStatusTie.classList.add("_active");
    EndGame();
  } else if (data.gameStatus === "none") {
    // игра окончена
    EndGame();
  }

  // Движение фигур движком
  if (data.move != undefined) {
    // Обновляем статус игры
    gameStatus = true;

    // Делаем кнопку неактивной
    saveButton.disabled = true;

    console.log("move: " + data.move);
    boardMove(data.move);
  }

  if (data.message != undefined) {
    // цвет игрока
    color = data.message[1];
    // очки игрока
    playerPoint = data.message[4];
    // позиция доски
    position = data.message[3];

    // предыдущая позиция
    // prevPosition = data.message[0];
    // след. позиция
    // nextPosition = data.message[2];

    // console.log("position" + ": " + position);

    // console.log("playerPoint" + ": " + playerPoint);
  } else {
    // data.message = ""
  }

  // Обновляем доски для двоих
  if (position !== undefined) {
    // Обновляем доску
    board.position(position);
    // Хранение позиций в sessionStorage
    SessionManager.storageBoardPosition(position);
  }

  // Функция, которая будет выполняться для разных цветов
  if (color != undefined) {
    // Хранение очков sessionStorage
    SessionManager.updatePlayerPoints(color.charAt(0), playerPoint);
  }
};

function EndGame() {
  gameStatusHtml.classList.add("_active");
  // Удаление сессии
  SessionManager.deleteSession();
}

// Создает ходы игроков для оттображения после начала игры
function createStepElement(sourceValue, targetValue, countStep) {
  if (countStep % 2 == 0) {
    const spanElement = document.querySelector(".step-target");
    if (spanElement) {
      spanElement.textContent = sourceValue + targetValue;
    } else {
      console.error("Element not found");
    }
    // Счетчик ходов
    counterStep += 1;
    // Вставка ходов в html
    moveSpan.innerHTML = counterStep;
  } else {
    // Создаем элемент хода слева
    const stepContainer = document.createElement("div");
    stepContainer.classList.add("board__step");
    const sourceSpan = document.createElement("span");
    sourceSpan.classList.add("step-source");
    sourceSpan.textContent = sourceValue + targetValue;
    // стрелка
    const arrowSpan = document.createElement("span");
    arrowSpan.textContent = " -> ";
    const targetSpan = document.createElement("span");
    targetSpan.classList.add("step-target");
    // Добавляем созданные элементы в DOM
    stepContainer.appendChild(sourceSpan);
    stepContainer.appendChild(arrowSpan);
    stepContainer.appendChild(targetSpan);
    // Получаем родительский элемент, в который хотим вставить созданную конструкцию
    const parentElement = document.querySelector(".board__steps");
    if (parentElement) {
      parentElement.prepend(stepContainer);
    } else {
      console.error("Parent element not found");
    }
  }
}

// функция, которая воспроизводит звук
function playPlacementSound() {
  const audio = document.getElementById("moveSound");
  audio.volume = 0.1;
  audio.play();
}

// Все ходы сделанные движком
const moveArray = [];
// Перемещение фигур
function boardMove(move) {
  var updatePiece = "q";

  // Проверяем длину строки, чтобы убедиться, что она корректна
  if (move.length == 5) {
    updatePiece = move.charAt(4);
  } else if (move.length !== 4) {
    return "Некорректный ход";
  }

  // функция воспроизведения звука передвижения фигуры
  playPlacementSound();

  // Массив всех сделанных движком ходов
  moveArray.push(move);

  // Разбиваем строку на начальное и конечное положение фигуры
  const source = move.substring(0, 2);
  const target = move.substring(2, 4);

  // Ходы в истории HTML, после начала игры
  createStepElement(source, target, moveArray.length);

  // ход на доске
  game.move({
    from: source,
    to: target,
    promotion: updatePiece,
  });
  board.position(game.fen());
}

// Функиця проверяет, достаточно ли очков
function addPieceWithPoints(colorPoints, pieceType, source, target) {
  // Очки игрока
  let totalPoints = Number(colorPoints);

  // Получаем тип фигуры
  pieceType = pieceType.charAt(1);
  let pieceVal = pieceValue[pieceType]; // Получаем значение фигуры из объекта pieceValue

  // Если фигуру выкинули за доску
  if (target === "offboard") {
    totalPoints += pieceVal; // Прибавляем очки за фигуру
    // totalPointsText.innerHTML = totalPoints; // Обновляем html

    console.log("Осталось очков: " + totalPoints);

    return totalPoints;
  }

  if (source === "spare") {
    totalPoints -= pieceVal; // Вычитаем очки за фигуру
    // totalPointsText.innerHTML = totalPoints; // Обновляем html

    // console.log("Осталось очков: " + totalPoints);
    return totalPoints;
  } else {
    // console.log("Осталось очков: " + totalPoints);
    return totalPoints;
  }
}

// Функция на проверку передвижение фигуры
function checkTargetRow(target, piece, orientation) {
  const targetRow = parseInt(target.charAt(1), 10);
  const targetColor = piece.charAt(0);

  if (
    (orientation === "white" && targetColor === "b") ||
    (orientation === "black" && targetColor === "w")
  ) {
    return true; // Фигура не соответствует ориентации игрока
  }

  if (
    (orientation === "white" && targetRow > 4) ||
    (orientation === "black" && targetRow < 5)
  ) {
    return true; // Позиция фигуры не соответствует ориентации игрока
  }

  return false;
}

// Функция на проверку занятости ячейки
function checkExistingPiece(target, board) {
  // Получаем элемент на целевой клетке
  const targetPiece = board.position()[target];
  return !!targetPiece;
}

// Возвращает фигуры
function snapbackMove() {
  return "snapback";
}

// Функция добавления класса при сенсорном запуске
function addClassOnTouchStart(event) {
  // Add a class to the body element
  document.body.classList.add("_block-page");
}

// Функция удаления класса при касании
function removeClassOnTouchEnd() {
  // Remove the class from the body element
  document.body.classList.remove("_block-page");
  // Повторная привязка обработчиков после изменений
  attachEventHandlers();
}

// Добавьте слушателей события touchstart, чтобы предотвратить стандартное поведение при касании
function attachEventHandlers() {
  // Получаем все элементы фигур на доске
  const pieceElements = document.querySelectorAll(".piece-417db");
  const pieceElementsDiv = document.querySelectorAll(".square-55d63");

  pieceElements.forEach((pieceElement) => {
    pieceElement.addEventListener("touchstart", addClassOnTouchStart);
    pieceElement.addEventListener("touchend", removeClassOnTouchEnd);
  });
  pieceElementsDiv.forEach((pieceElementDiv) => {
    pieceElementDiv.addEventListener("touchstart", addClassOnTouchStart);
    pieceElementDiv.addEventListener("touchend", removeClassOnTouchEnd);
  });
}

// Первоначальная привязка обработчиков к фигурам
attachEventHandlers();

// Функция срабатывает после отпуска фигуры
function onDrop(source, target, piece, newPos, oldPos, orientation) {
  // Если игры начата, запрещаем двиграть фигуры
  if (gameStatus) {
    return snapbackMove();
  }

  if (checkTargetRow(target, piece, orientation)) {
    return snapbackMove();
  }

  if (checkExistingPiece(target, board)) {
    return snapbackMove();
  }

  if (target === "offboard" && source === "spare") {
    return snapbackMove();
  }

  // Проверка для короля
  if (target === "offboard" && piece.charAt(1) === "K") {
    return snapbackMove();
  }

  if (target !== "offboard" && source === "spare") {
    // Получаем тип фигуры
    let pieceType = piece.charAt(1);
    let pieceVal = pieceValue[pieceType]; // Получаем значение фигуры из объекта pieceValue
    // Проверка на количество очков у черного и белого
    if (whitePlayerPoints != null) {
      if (whitePlayerPoints.textContent - pieceVal < 0) {
        console.log("Недостаточно очков для добавления фигуры.");
        return snapbackMove();
      }
    }
    if (blackPlayerPoints != null) {
      if (blackPlayerPoints.textContent - pieceVal < 0) {
        console.log("Недостаточно очков для добавления фигуры.");
        return snapbackMove();
      }
    }
  }

  // подсчет очков
  if (orientation === "white") {
    let points = addPieceWithPoints(
      whitePlayerPoints.textContent,
      piece,
      source,
      target
    );
    // Для отправки на сервер
    var playerPoints = points;
    // Обновляем очки
    whitePlayerPoints.innerHTML = points;
  }
  if (orientation === "black") {
    let points = addPieceWithPoints(
      blackPlayerPoints.textContent,
      piece,
      source,
      target
    );
    // Для отправки на сервер
    var playerPoints = points;
    // Обновляем очки
    blackPlayerPoints.innerHTML = points;
  }

  return handleValidMove(
    source,
    target,
    piece,
    newPos,
    oldPos,
    orientation,
    board,
    chatSocket,
    playerPoints
  );
}

function handleValidMove(
  source,
  target,
  piece,
  newPos,
  oldPos,
  orientation,
  board,
  chatSocket,
  playerPoints
) {
  const message = [source, piece, target, newPos, playerPoints];
  // const positions = newPos;
  // Отправка сообщений на сервер
  chatSocket.sendMessageToServer(message);

  // Проверка на выброс фигуры
  if (target === "offboard") {
    return "trash";
  }

  // функция воспроизведения звука передвижения фигуры
  playPlacementSound();
}

// Кнопка копировать
let copyButton = document.querySelector(".btn-copy"); // Получаем кнопку
// формирование ссылки для копирования
copyButton.addEventListener("click", copyToClipboard); // Добавляем обработчик события для отмены хода по клику на кнопку
function copyToClipboard() {
  var copyText = document.getElementById("linkInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
}

// Получаем параметры из URL и вставляем их в input
window.onload = function () {
  var url = window.location.href;
  var linkInput = document.getElementById("linkInput");
  if (url) {
    linkInput.value = url;
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // Анимация появления SVG по кусочкам сверху вниз
  const timeline = anime.timeline({
    easing: "easeInOutQuad",
    duration: 1500,
    loop: true, // Зацикливаем анимацию
  });

  timeline
    .add({
      targets:
        "#A_-_139_x2C__Chess_x2C__computer_x2C__strategy_x2C__tactic_x2C__technology *",
      translateY: [100, 0],
      opacity: [0, 1],
      delay: anime.stagger(50), // Убрал начальную задержку, теперь анимация начнется сразу
    })
    .add({
      targets:
        "#A_-_139_x2C__Chess_x2C__computer_x2C__strategy_x2C__tactic_x2C__technology *",
      translateY: [0, 100],
      opacity: [1, 0],
      delay: anime.stagger(50), // Задержка перед исчезновением
    });

  // Функция для добавления эффекта нажатия на доске
  function addClickEffect(x, y) {
    const clickEffect = document.createElement("div");
    clickEffect.classList.add("click-effect"); // добавьте стили для этого класса в CSS

    // Установка позиции элемента на доске
    clickEffect.style.left = x + "px";
    clickEffect.style.top = y + "px";

    // Добавление элемента на доску
    boardContainer.appendChild(clickEffect);

    // Анимация нажатия
    setTimeout(() => {
      clickEffect.remove(); // убираем эффект через определенное время
    }, 1000); // 1 секунда
  }

  const boardContainer = document.querySelector(".board-b72b1");
  // При клике на доску вызывайте функцию для добавления эффекта
  boardContainer.addEventListener("click", (event) => {
    const boardRect = boardContainer.getBoundingClientRect();
    const x = event.clientX - boardRect.left - 10;
    const y = event.clientY - boardRect.top - 10;
    addClickEffect(x, y);
  });

  // Находим контейнер с нижними белыми фигурами
  const bottomWhitePiecesContainer = document.querySelector(
    ".spare-pieces-bottom-ae20f"
  );
  if (bottomWhitePiecesContainer) {
    const bottomWhitekPieces =
      bottomWhitePiecesContainer.querySelectorAll(".piece-417db");
    // Проверьте, не превышает ли ширина экрана 990 пикселей
    if (window.matchMedia("(max-width: 990px)").matches) {
      bottomWhitekPieces.forEach((pieceElement) => {
        pieceElement.style.height = "50px";
        pieceElement.style.width = "50px";
      });
    }
  }

  // Находим контейнер с верхними черными фигурами
  const topBlackPiecesContainer = document.querySelector(
    ".spare-pieces-top-4028b"
  );

  // Если найден контейнер, скрываем все его дочерние элементы
  if (topBlackPiecesContainer) {
    const topBlackPieces =
      topBlackPiecesContainer.querySelectorAll(".piece-417db");
    topBlackPieces.forEach((piece) => {
      piece.style.display = "none"; // Скрываем фигуру
    });
  }
});
