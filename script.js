class Status {
  isActive = false;
  constructor(name, amount, growth, shrink) {
    this.name = name;
    this.amount = amount;
    this.growth = growth;
    this.shrink = shrink;
    this.default = { growth: growth, shrink: shrink };
  }

  update = () => {
    this.isActive ? this.amount += this.growth : this.amount -= this.shrink;
    this.amount = this.amount > 1000 ? 1000
      : this.amount = this.amount <= 0 ? 0
        : this.amount;
  }

  active = () => this.isActive = true;
  inactive = () => this.isActive = false;

  changeGrowth = (val) => { this.growth = val; }
  changeShrink = (val) => { this.shrink = val; }
  changeDefault = (growth, shrink) => { this.default = { growth: growth, shrink: shrink }; };

  reset = () => {
    [this.growth, this.shrink] = [this.default.growth, this.default.shrink];
  }
};

const Player = (inName, inAvatar, inLevel, inStatus) => {
  let name = inName;
  let avatar = inAvatar;
  let status = inStatus ? {
    obat: new Status(inStatus.obat.name, inStatus.obat.amount, inStatus.obat.growth, inStatus.obat.shrink),
    makan: new Status(inStatus.makan.name, inStatus.makan.amount, inStatus.makan.growth, inStatus.makan.shrink),
    main: new Status(inStatus.main.name, inStatus.main.famount, inStatus.main.growth, inStatus.main.shrink),
    tidur: new Status(inStatus.tidur.name, inStatus.tidur.amount, inStatus.tidur.growth, inStatus.tidur.shrink),
  }: {
    obat: new Status("obat", 500, 100, 4),
    makan: new Status("makan", 500, 100, 4),
    main: new Status("main", 500, 60, 8),
    tidur:  new Status("tidur", 500, 20, 1),
  }
    
  let level = inLevel ? inLevel : 1;

  const update = () => {
    status.obat.update();
    status.makan.update();
    status.main.update();
    status.tidur.update();
  }

  return {
    name,
    avatar,
    level,
    status,
    update,
  }
};

const DOM = (() => {
  const updateButton = (() => {
      let buttons = document.querySelectorAll(".togglebutton");
      buttons.forEach(button => {
        button.addEventListener("click", (e) => {
          gameController.toggleActive(e.target.dataset.name);
          DOM.changeAvatarOverlay(e.target.dataset.name);
          button.classList.remove("btn-light");
          button.classList.add("btn-warning");
          buttons.forEach(button => {
            if (button != e.target) {
              button.classList.remove("btn-warning");
              button.classList.remove("active");
              button.classList.add("btn-light");
            }
          });
          if (!(button.classList.contains("active"))) {
            button.classList.remove("btn-warning");
            button.classList.add("btn-light");
            DOM.changeAvatarOverlay("none");
          }
        });
      })
    })();

  const greetingPlayer = (hour) => {
    let greeting = document.querySelector("#greeting-player");
    let greetingText = "";
    if (hour >= 5 && hour <= 10) greetingText = "Selamat Pagi";
    else if (hour >= 11 && hour <= 15) greetingText = "Selamat Siang";
    else if (hour >= 16 && hour <= 18) greetingText = "Selamat Sore";
    else if (hour >= 19 && hour <= 24) greetingText = "Selamat Malam";
    else if (hour >= 0 && hour <= 4) greetingText = "Selamat Malam";
    greeting.innerText = greetingText;
  };

  const getUserInit = (() => {
    let submitBtn = document.querySelector("#avatar-button");
    let textbox = document.querySelector("#name-input");
    submitBtn.addEventListener("click", () => {
      let name = textbox.value ? textbox.value : "Roxy";
      let image = document.querySelector(".carousel-item.active").querySelector("img").getAttribute("src");
      gameController.init(name, image);
    })

    textbox.addEventListener("keyup", (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
        submitBtn.click();
      }
    })
  })();
  const pauseMenu = (() => {
    let pause = document.querySelector("#pause-button");
    let resume = document.querySelector("#resume-btn");
    let restart = document.querySelector("#restart-btn");
    let save = document.querySelector("#save-btn");
    pause.addEventListener("click", () => {
      gameController.gameClock.stop();
    })
    resume.addEventListener("click", () => {
      gameController.gameClock.start();
    })
    restart.addEventListener("click", () => {
      gameController.reset();
      DOM.scene("avatar-selection");
    })
    save.addEventListener("click", () => {
      gameController.saveGame();
      DOM.addAlert("Game berhasil disave!", "save")
      setTimeout(() => {
        DOM.removeAlert("save");
      }, 2000);
    });
  })();
 
  return {
    updateButton,
    resetButton: () => {
      let buttons = document.querySelectorAll(".togglebutton");
      buttons.forEach(el => {
        el.classList.remove("btn-warning");
        el.classList.remove("active");
        el.classList.add("btn-light");
      });
    },
    greetingPlayer,
    gameOver: (status) => {
      DOM.scene("game-over");
      let gameOverMsg = document.querySelector("#gameover-message");
      let reset = document.querySelector("#gameover-resetbtn");

      switch (status) {
        case "makan": gameOverMsg.innerText = "Anda mati kelaparan!"; break;
        case "main": gameOverMsg.innerText = "Anda stress kurang hiburan!"; break;
        case "tidur": gameOverMsg.innerText = "Anda mati kurang tidur!"; break;
        case "obat": gameOverMsg.innerText = "Anda mati karena tidak minum obat!"; break;
      }
      reset.addEventListener("click", ()=> {
        gameController.reset();
        DOM.scene("avatar-selection");
      })
    },
    winGame: (avatar) => {
      DOM.scene("win-game");
      const img = document.querySelector("#win-img");
      const resetBtn = document.querySelector("#win-reset");
      img.src = avatar;
      resetBtn.addEventListener("click", () => {
        gameController.reset();
        DOM.scene("avatar-selection");
      });
    },
    changeAvatar: (url) => {
      let el = document.querySelector("#avatar");
      el.src = url;
    },
    changeAvatarOverlay: (status) => {
      let el = document.querySelector("#avatar-overlay");
      const makan = "./assetgambar/status/makan.png";
      const main = "./assetgambar/status/main.png";
      const obat = "./assetgambar/status/obat.png";
      const tidur = "./assetgambar/status/tidur.png";
      // console.log(status);
      switch (status) {
        case "makan": el.src = makan; break;
        case "main": el.src = main; break;
        case "obat": el.src = obat; break;
        case "tidur": el.src = tidur; break;
        case "none": el.src = ""; break;
      }
    },
    updateProgress: (status, val) => {
      const el = document.querySelector(`#${status}-progressBar`);
      el.style.width = `${val}%`;
      el.innerText = `${val}%`;
      if (val >= 20 && val <= 30) {
        el.classList.add("bg-warning");
        el.classList.remove("bg-danger");
      }
      else if (val < 20) {
        el.classList.add("bg-danger");
        el.classList.remove("bg-warning");
      } else {
        el.classList.remove("bg-danger");
        el.classList.remove("bg-warning");
      }
    },
    updateLevel: (val) => {
      const el = document.querySelector("#level-now");
      el.innerText = val;
    },

    updateClock: ([hours, minutes]) => {
      hours = hours >= 10 ? hours : "0" + hours;
      minutes = minutes >= 10 ? minutes : "0" + minutes;
      const clock = document.querySelector("#jam");
      clock.innerText = `${hours}:${minutes}`;
    },

    addAlert: (message, id) => {
      const el = document.querySelector("#game-alert");
      const alert = document.createElement("div");
      if(document.querySelector(`#alert-${id}`)) return;
      alert.className = "alert alert-danger fade show in";
      alert.innerText = message;
      alert.id = `alert-${id}`;
      el.appendChild(alert);
    },
    removeAlert: (id) => {
      const el = document.querySelector(`#game-alert`);
      const alert = document.querySelector(`#alert-${id}`);
      if (!alert) return;
      el.removeChild(alert);
    },

    changeBg: (url) => {
      const bg = document.querySelector("#bg-image");
      if(bg.style.backgroundImage.includes(url)) return;
      bg.style.backgroundImage = `url(${url})`;
    },

    changeName: (name) => {;
      const el = document.querySelector("#nama-player");
      el.innerText = name;
    },

    fadeOut: (el) => {
      const body = document.querySelector("body");
      el.classList.add("fadeOut");
      body.classList.add("overflow-hidden");
      setTimeout(() => {
        el.classList.add("d-none")
        body.classList.remove("overflow-hidden");
      }, 1000);
    },
    fadeIn: (el) => {
      const body = document.querySelector("body");
      el.classList.remove("d-none")
      body.classList.add("overflow-hidden");
      setTimeout(() => {
        el.classList.remove("fadeOut")
        body.classList.remove("overflow-hidden");
      }, 1000);
    },
    scene: (scene) => {
      const all = document.querySelectorAll(".fadeBase");
      all.forEach(el => {
        if (el.id === scene) {
          DOM.fadeIn(el);
        }
        else {
          DOM.fadeOut(el);
        }
      })
    },
  }
})();

const gameController = (() => {
  let clock = new Date();
  let player;

  const getPlayer = () => { return player; }
  const initClock = () => {
    clock.setHours(9);
    clock.setMinutes(55);
    clock.setSeconds(0);
  };

  const changeClock = (hours, minutes) => {
    clock.setHours(hours);
    clock.setMinutes(minutes);
    let day = "./assetgambar/morning.jpeg";
    let evening = "./assetgambar/evening.jpeg";
    let night = "./assetgambar/night.jpeg";
    if (clock.getHours() >= 6 && clock.getHours() < 16) {
      DOM.changeBg(day);
    } else if (clock.getHours() >= 16 && clock.getHours() < 19) {
      DOM.changeBg(evening);
    } else if ((clock.getHours() >= 19 && clock.getHours() <= 24) 
            || (clock.getHours() >= 0 && clock.getHours() < 6)) {
      DOM.changeBg(night);
    }
  };
  const updateClock = () => {
    const [hours, minutes] = [clock.getHours(), clock.getMinutes()];
    DOM.updateClock([hours, minutes]);
    changeClock(hours, minutes + 5);
  }

  const toggleActive = (status) => {
    player.status[status].isActive ?
      player.status[status].inactive() :
      player.status[status].active();
    Object.keys(player.status).forEach((obj) => {
      if (obj != status) {
        player.status[obj].inactive()
      }
    })
  }

  const Algorithm = (() => {
    let makanBoost = true;
    let alertDO = false;
    let changes = {
      obat: {makan: 0, main: 0},
      tidur: {obat: 0, main: 0, shrink: 0},
      makan: {obat: 0, main: 0, boost: 0},
      main: {obat20: 0, obat10: 0},
    };
    let countBeforeDO = 0;
    let alert = false;

    const toggleAlert = (status) => {
      let val = player.status[status].amount;
      if( val < 100) {
        alert = true;
      }
      if (alert === true) {
        DOM.addAlert(`Kondisi anda memburuk!`, "status");
      } else {
        DOM.removeAlert("status");
      }
      
    }

    const toggleAlertDO = () => {
      // console.log(countBeforeDO);
      if (countBeforeDO > 72) {
        gameController.gameOver("obat");
      } else if (countBeforeDO >= 36 && alertDO === false) {
        alertDO = true;
        DOM.addAlert("Segera minum obat sebelum mati!", "obat");
      } else if (countBeforeDO < 36 && alertDO === true) {
        alertDO = false;
        DOM.removeAlert("obat");
      }
    }

    return {
      getChanges: () => {
        return changes;
      },
      resetDOCount: () => {
        countBeforeDO = 0;
      },
      resetAlert: () => {alert = false},
      levelUp: () => {
        if (player.level > 3) {
          gameController.gameClock.stop();
          DOM.winGame(player.avatar);
        }
        if (player.status.obat.amount >= 1000) {
          player.level += 1;
          player.status["obat"].amount = 0;
        }     
        switch(player.level) {
          case 1:
            player.status["obat"].changeDefault(10, 0);
            player.status["makan"].changeDefault(100, 4);
            player.status["main"].changeDefault(60, 8);
            player.status["tidur"].changeDefault(20, 1);

            changes.obat.makan = 8;
            changes.obat.main = 10

            changes.tidur.obat = 10
            changes.tidur.main = 30
            changes.tidur.shrink = 10

            changes.makan.obat = 10
            changes.makan.main = 30;
            changes.makan.boost = 20;

            changes.main.obat20 = 20;
            changes.main.obat10 = 10;
            break;
          case 2:
            player.status["obat"].changeDefault(10, 0);
            player.status["makan"].changeDefault(50, 5);
            player.status["main"].changeDefault(50, 10);
            player.status["tidur"].changeDefault(20, 1);

            changes.obat.makan = 8;
            changes.obat.main = 10

            changes.tidur.obat = 10
            changes.tidur.main = 30
            changes.tidur.shrink = 10

            changes.makan.obat = 10
            changes.makan.main = 30;
            changes.makan.boost = 20;

            changes.main.obat20 = 20;
            changes.main.obat10 = 10;
            break;
          case 3:
            player.status["obat"].changeDefault(10, 0);
            player.status["makan"].changeDefault(50, 5);
            player.status["main"].changeDefault(50, 10);
            player.status["tidur"].changeDefault(20, 2);

            changes.obat.makan = 10;
            changes.obat.main = 12

            changes.tidur.obat = 8 
            changes.tidur.main = 30
            changes.tidur.shrink = 10

            changes.makan.obat = 10
            changes.makan.main = 30;
            changes.makan.boost = 20;

            changes.main.obat20 = 20;
            changes.main.obat10 = 10;
            break;

          case 4:
            player.status["obat"].changeDefault(10, 0);
            player.status["makan"].changeDefault(50, 6);
            player.status["main"].changeDefault(50, 10);
            player.status["tidur"].changeDefault(18, 2);

            changes.obat.makan = 10;
            changes.obat.main = 12

            changes.tidur.obat = 7
            changes.tidur.main = 32
            changes.tidur.shrink = 11

            changes.makan.obat = 8 
            changes.makan.main = 32;
            changes.makan.boost = 18;

            changes.main.obat20 = 18;
            changes.main.obst10 = 8;
            break;

          case 5:
            player.status["obat"].changeDefault(8, 0);
            player.status["makan"].changeDefault(40, 6);
            player.status["main"].changeDefault(45, 10);
            player.status["tidur"].changeDefault(18, 2);

            changes.obat.makan = 12;
            changes.obat.main = 14

            changes.tidur.obat = 7
            changes.tidur.main = 32
            changes.tidur.shrink = 13

            changes.makan.obat = 7 
            changes.makan.main = 32;
            changes.makan.boost = 16;

            changes.main.obat20 = 16;
            changes.main.obat10 = 7;
            break;
         
          case 6:
            player.status["obat"].changeDefault(8, 0);
            player.status["makan"].changeDefault(40, 6);
            player.status["main"].changeDefault(40, 12);
            player.status["tidur"].changeDefault(17, 2);

            changes.obat.makan = 13;
            changes.obat.main = 15

            changes.tidur.obat = 6
            changes.tidur.main = 33
            changes.tidur.shrink = 14

            changes.makan.obat = 7 
            changes.makan.main = 33;
            changes.makan.boost = 16;

            changes.main.obat20 = 16;
            changes.main.obat10 = 7;
            break;         
          case 7:
            player.status["obat"].changeDefault(7, 0);
            player.status["makan"].changeDefault(40, 6);
            player.status["main"].changeDefault(40, 12);
            player.status["tidur"].changeDefault(17, 2);

            changes.obat.makan = 13;
            changes.obat.main = 15

            changes.tidur.obat = 6
            changes.tidur.main = 33
            changes.tidur.shrink = 14

            changes.makan.obat = 6 
            changes.makan.main = 33;
            changes.makan.boost = 15;

            changes.main.obat20 = 15;
            changes.main.obat10 = 6;
            break;         
          case 8:
            player.status["obat"].changeDefault(6, 0);
            player.status["makan"].changeDefault(40, 7);
            player.status["main"].changeDefault(40, 14);
            player.status["tidur"].changeDefault(16, 3);

            changes.obat.makan = 14;
            changes.obat.main = 16

            changes.tidur.obat = 4
            changes.tidur.main = 35
            changes.tidur.shrink = 15

            changes.makan.obat = 5 
            changes.makan.main = 35;
            changes.makan.boost = 14;

            changes.main.obat20 = 12;
            changes.main.obat10 = 5;
            break;
        };

        DOM.updateLevel(player.level);
      },
      obat: () => {
        toggleAlertDO();
        if (player.status["obat"].isActive) {
          player.status["makan"].changeShrink(changes.obat.makan); 
          player.status["main"].changeShrink(changes.obat.main); 
          countBeforeDO--;
        } else {
          player.status["makan"].reset();
          player.status["main"].reset();
          countBeforeDO++;
        }
      },
      tidur: () => {
        let hours = clock.getHours();
        toggleAlert("tidur")
        if (player.status["tidur"].amount < 200) {
          player.status["obat"].changeGrowth(changes.tidur.obat); 
          player.status["main"].changeShrink(changes.tidur.main); 
        } else {
          player.status["obat"].reset();
          player.status["main"].reset();
        }

        if (!(hours > 6 && hours < 22)) {
          player.status["tidur"].changeShrink(changes.tidur.shrink);
        } else {
          player.status["tidur"].reset();
        }
      },
      makan: () => {
        toggleAlert("makan");
        if (player.status["makan"].amount < 200) {
          player.status["obat"].changeGrowth(changes.makan.obat); 
          player.status["main"].changeShrink(changes.makan.main);

        } else {
          player.status["obat"].reset();
          player.status["main"].reset();
        }

        if (player.status["makan"].amount === 1000 && makanBoost) {
          player.status["main"].amount += changes.makan.boost;
          makanBoost = false;
        }
        if(player.status["makan"].amount === 800) {
          makanBoost = true;
        }
      },
      main: () => {
        toggleAlert("main")
        if (player.status["main"].amount < 200) {
          player.status["obat"].changeGrowth(changes.main.obat20); 
        }
        else if (player.status["main"].amount < 100) {
          player.status["obat"].changeGrowth(changes.main.obat10); 
        } else {
          player.status["obat"].reset();
        }
      }
    }
  })();

  const gameClock = (() => {
    let interval;
    const callback = () => {
      player.update();
      updateClock();
      DOM.greetingPlayer(clock.getHours());

      Algorithm.levelUp();
      Algorithm.resetAlert();
      Algorithm.obat();
      Algorithm.tidur();
      Algorithm.makan();
      Algorithm.main();

      Object.keys(player.status).forEach(val => {
        DOM.updateProgress(
          val, Math.round(player.status[val].amount / 10)
        );
        if (val != "obat" && player.status[val].amount <= 0) gameOver(player.status[val].name);
        if((clock.getHours() === 0 && clock.getMinutes() === 0) 
         || (clock.getHours() === 12 && clock.getMinutes() === 0) ) saveGame();
      });
    };

    const start = () => {
      interval = setInterval(callback, 1000);
    }
    const stop = () => {
      clearInterval(interval);
    };
    return { start, stop }
  })();

  const saveGame = () => {
    let dataSave = JSON.stringify(player);
    let clockSave = JSON.stringify(clock);
    localStorage.setItem("player", dataSave);
    localStorage.setItem("clock", clockSave);
  }

  const loadGame = () => {
    let data = JSON.parse(localStorage.getItem("player"));
    let clockSave = new Date(JSON.parse(localStorage.getItem("clock")));
    if (data) {
      // console.log(clockSave);
      clock = clockSave;
      player = Player(data.name, data.avatar, data.level, data.status);
      
      // updateClock(clockSave.getHours, clockSave.getMinutes)
      DOM.changeName(player.name);
      DOM.changeAvatar(player.avatar);
      DOM.updateLevel(player.level);
      gameClock.start();
      return true;
    }
    return false;
  }

  const reset = () => {
    localStorage.removeItem("player");
    localStorage.removeItem("clock");
    player = {};
  }

  // TODO
  // Bikin message custom per status
  const gameOver = (status) => {
    gameClock.stop();
    DOM.gameOver(status);
  }

  const init = (playerName, avatar) => {
    player = Player(playerName, avatar);
    DOM.changeName(player.name);
    DOM.changeAvatar(player.avatar);
    DOM.updateLevel(player.level);
    Algorithm.resetDOCount();
    initClock();

    DOM.fadeOut(document.querySelector("#avatar-selection"));
    DOM.fadeIn(document.querySelector("#main-game"));
    DOM.resetButton();
    gameClock.start();
    saveGame();
  }

  return {
    init,
    reset,
    changeClock,
    saveGame,
    gameClock,
    loadGame,
    gameOver,
    toggleActive,
    getPlayer,
  }
})();

const Debug = (() => {
  return {
    timetravel: (jam) => {
      switch(jam) {
        case "pagi":
          gameController.changeClock(9, 55);
          break;
        case "siang":
          gameController.changeClock(12, 55);
          break;
        case "sore":
          gameController.changeClock(15, 35);
          break;
        case "malam":
          gameController.changeClock(23, 55);
          break;
        default:
          console.log("Menunya tidak ada");
          break;
      }
    },
    turunin: (status) => {
      gameController.getPlayer().status[status].amount = 100
    },
    maxObat: () => {
      gameController.getPlayer().status["obat"].amount = 950;
    },
    turuninSemua: () => {
      gameController.getPlayer().status["tidur"].amount = 100;
      gameController.getPlayer().status["makan"].amount = 100;
      gameController.getPlayer().status["main"].amount = 100;
    },
    naikinSemua: () => {
      gameController.getPlayer().status["tidur"].amount = 900;
      gameController.getPlayer().status["makan"].amount = 900;
      gameController.getPlayer().status["main"].amount = 900;
    },
    gantiLevel: (val) => {
      gameController.getPlayer().level = val;
      DOM.updateLevel(gameController.getPlayer().level);
    }
  }
})();

const gameStart = (() => {
  if (gameController.loadGame()) {
    DOM.scene("main-game");
    return;
  }
  DOM.scene("avatar-selection");
})();
 
// Snake Game
let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let grid = 20;
let count = 0;

let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
let apple = {
    x: 320,
    y: 320
};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
    requestAnimationFrame(loop);

    if (++count < 5) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.drawImage = 'yellow';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        for (var i = index + 1; i < snake.cells.length; i++) {

            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 2;
                snake.dx = grid;
                snake.dy = 0;

                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

document.addEventListener('keydown', function (e) {

    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

requestAnimationFrame(loop);
// End Snake Game
