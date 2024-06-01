const SessionManager = {
  storageBoardPosition: (position) => {
    // Хранение позиций в sessionStorage
    sessionStorage.setItem("savedPositions", JSON.stringify(position));
  },

  updatePlayerPoints: (color, playerPoint) => {
    if (color === "w") {
      console.log("white, points:", playerPoint);
      // Хранение очков в sessionStorage
      sessionStorage.setItem("whitePlayerPoints", JSON.stringify(playerPoint));
    } else if (color === "b") {
      console.log("black");
      // Хранение очков в sessionStorage
      sessionStorage.setItem("blackPlayerPoints", JSON.stringify(playerPoint));
    }
  },

  // Удаление сессии
  deleteSession: () => {
    sessionStorage.removeItem("whitePlayerPoints");
    sessionStorage.removeItem("blackPlayerPoints");
    sessionStorage.removeItem("savedPositions");
    console.log("Сессия удалена");
  },

  initSession: (isChatOpen) => {
    if (isChatOpen) {
      const result = {
        savedPositions: null,
        savedWhitePoints: null,
        savedBlackPoints: null,
      };

      // Восстановление данных с сессии
      if (sessionStorage.getItem("savedPositions") !== null) {
        // Получение сохраненных позиций и очков из sessionStorage
        result.savedPositions = sessionStorage.getItem("savedPositions");
        result.savedWhitePoints = sessionStorage.getItem("whitePlayerPoints");
        result.savedBlackPoints = sessionStorage.getItem("blackPlayerPoints");

        console.log("Данные востановлены");
      }
      // Убираем неактив
      // hidden.classList.remove("_active-socket");

      return result;
    } else {
      console.log("Данные не восстановлены, проблемы с сервером...");
    }
  },
};

export default SessionManager;
