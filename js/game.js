'use strict';
var score = 0;
var audio = document.querySelector('audio');
var startButton = document.getElementById('game');

// устанавливаем слушателя на startButton
startButton.addEventListener('click', startGame, false);


// обертка для RequestAnimationFrame
var requestAnimFrame = (function () {
  return window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();


// Игровая среда CANVAS и её размеры
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// var viewportWidth = window.innerWidth;
// var viewportHeight = window.innerHeight;
canvas.width = 800;
canvas.height = 500;

canvas.style.position = 'absolute';
canvas.style.left = 0;
canvas.style.top = 0;


// предзагруузка изображений
var preloadedImagesH = {};

function preloadImage(img) {
  // если такое изображение уже предзагружалось - ничего не делаем
  if (img in preloadedImagesH) {
    return;
  }
  // предзагружаем - создаём невидимое изображение
  var Img = new Image();
  Img.src = img;
  // запоминаем, что изображение уже предзагружалось
  preloadedImagesH[img] = true;
}

preloadImage( 'img/bg01.jpg');
preloadImage('img/ufo02.gif');
preloadImage('img/cakes/cake01.png');
preloadImage('img/cakes/cake02.png');
preloadImage('img/cakes/cake03.png');


// управление игроком с клавиатуры
window.addEventListener('keydown', function (EO) {
  EO = EO || window.event;
  EO.preventDefault();

  if (EO.keyCode === 40) {
    player.sy = 10;
  }

  if (EO.keyCode === 38) {
    player.sy = -10;
  }
  if (EO.keyCode === 39) {
    player.sx  = 10;
  }

  if (EO.keyCode === 37) {
    player.sx  = -10;
  }
});

window.addEventListener('keyup', function (EO) {
  EO = EO || window.event;
  EO.preventDefault();

  if (EO.keyCode === 40) {
    player.sy = 0;
  }

  if (EO.keyCode === 38) {
    player.sy = 0;
  }
  if (EO.keyCode === 39) {
    player.sx  = 0;
  }

  if (EO.keyCode === 37) {
    player.sx  = 0;
  }
});


// свойства и методы игрового поля
var gameFilde = {
  px: 0,
  py: 0,
  w: canvas.width,
  h: canvas.height,
  draw: function () {
    var bg = new Image();
    bg.src = 'img/bg011.jpg';
    context.drawImage(bg, this.px, this.py, this.w, this.h);
    drawScore();
    if (!isPlaying) {
      drawGameOver();
    }
  }
};

// свойства и методы игрока
var player = {
  w: 90,
  h: 65,
  sx: 0,
  sy: 0,
  px: 400 - this.w / 2,
  py: 300,
  draw: function () {
    var img = new Image();
    img.src = 'img/ufo02.gif';
    context.drawImage(img, this.px, this.py, this.w, this.h);
  },
  update: function () {
    if (isPlaying) {
      this.px += this.sx;
      this.py += this.sy;
      if (this.py + this.h > canvas.height) {
        this.py = canvas.height - this.h;
      }
      if (this.py < 0) {
        this.py = 0;
      }
      if (this.px + this.w > canvas.width) {
        this.px = canvas.width - this.w;
      }
      if (this.px < 0) {
        this.px = 0;
      }
    }
  }
};

var isPlaying = true;


// свойства и методы бонусных кексов
var cake = {
  w: 40,
  h: 40,
  sy: 3,
  px: Math.random() * (canvas.width - this.w),
  py: -40,
  draw: function () {
    var imgCake = new Image();
    imgCake.src = 'img/cakes/cake01.png';
    context.drawImage(imgCake, this.px, this.py, this.w, this.h);
  },
  update: function () {
    if (isPlaying) {
      this.py += this.sy;
      if (this.py + this.h > canvas.height) {
        this.py = 0;
        this.px = Math.random() * (canvas.width - this.w);
      }
      if (this.py < 0) {
        this.py = 0;
      }
    }
  }
};

var cake2 = {
  w: 35,
  h: 35,
  sy: 4,
  px: Math.random() * (canvas.width - this.w),
  py: -40,
  draw: function () {
    var imgCake2 = new Image();
    imgCake2.src = 'img/cakes/cake02.png';
    context.drawImage(imgCake2, this.px, this.py, this.w, this.h);
  },
  update: function () {
    if (isPlaying) {
      this.py += this.sy;
      if (this.py + this.h > canvas.height) {
        this.py = 0;
        this.px = Math.random() * (canvas.width - this.w);
      }
      if (this.py < 0) {
        this.py = 0;
      }
    }
  }
};

var cake3 = {
  w: 45,
  h: 45,
  sy: 2,
  px: Math.random() * (canvas.width - this.w),
  py: -45,
  draw: function () {
    var imgCake2 = new Image();
    imgCake2.src = 'img/cakes/cake03.png';
    context.drawImage(imgCake2, this.px, this.py, this.w, this.h);
  },
  update: function () {
    if (isPlaying) {
      this.py += this.sy;
      if (this.py + this.h > canvas.height) {
        this.py = 0;
        this.px = Math.random() * (canvas.width - this.w);
      }
      if (this.py < 0) {
        this.py = 0;
      }
    }
  }
};

// свойства и методы метеоритов-препятствий
var meteorits = {
  w: 80,
  h: 80,
  sy: 3,
  px: Math.random() * (canvas.width - this.w),
  py: -80,
  draw: function () {
    var imgMeteor = new Image();
    imgMeteor.src = 'img/meteor.png';
    context.drawImage(imgMeteor, this.px, this.py, this.w, this.h);
  },
  update: function () {
    if (isPlaying) {
      this.py += this.sy;
      if (this.py + this.h > canvas.height) {
        this.py = 0;
        this.px = Math.random() * (canvas.width - this.w);
      }
      if (this.py < 0) {
        this.py = 0;
      }
      collisionsCheck();
    }
  }
};


// Функция старта игры
function startGame() {
  isPlaying = true;
  score = 0;
  player.px = 400 - player.w / 2;
  player.py = 300;
  cake.px = Math.random() * (canvas.width - cake.w);
  cake.py = 0;
  cake2.px = Math.random() * (canvas.width - cake2.w);
  cake2.py = 0;
  cake3.px = Math.random() * (canvas.width - cake3.w);
  cake3.py = 0;
  meteorits.px = Math.random() * (canvas.width - meteorits.w);
  meteorits.py = 0;
}

// функция окончания игры
function gameOver() {
  isPlaying = false;
  drawGameOver();
}

// функция отрисовки счета игры
function drawScore() {
  context.save();
  context.font = '18px Arial';
  context.fillStyle = '#00afff';
  context.fillText('Score: ' + score, 8, 20);
  context.restore();
}

// функция отрисовки окончания игры
function drawGameOver() {
  context.save();
  context.font = '60px Arial';
  context.fillStyle = 'black';
  context.fillText('Game over', 250, 250);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.restore();
}

// общая функция для расчета столкновений
function collisions(a, b) {
  return a.px < b.px + b.w - 10 &&
    a.px + a.w - 10 > b.px &&
    a.py < b.py + b.h - 10 &&
    a.py + a.h - 10 > b.py;
}

// функция проверки столкновений с метеоритами-препятствиями и бонусными кексами
function collisionsCheck() {
  if (collisions(meteorits, player)) {
    gameOver();
  }
  if (collisions(cake, player)) {
    score += 10;
    audio.play();
    cake.py = 0;
    cake.px = Math.random() * (canvas.width - cake.w);
  }
  if (collisions(cake2, player)) {
    score += 10;
    audio.play();
    cake2.py = 0;
    cake2.px = Math.random() * (canvas.width - cake2.w);
  }
  if (collisions(cake3, player)) {
    score += 10;
    audio.play();
    cake3.py = 0;
    cake3.px = Math.random() * canvas.width - cake3.w;
  }
}


// отрисовка объектов на канвасе
function draw() {
  gameFilde.draw();
  player.draw();
  cake.draw();
  cake2.draw();
  cake3.draw();
  meteorits.draw();
}


// обновление сущностей
function update() {
  player.update();
  cake.update();
  cake2.update();
  cake3.update();
  meteorits.update();
}


// цикл, постоянно отрисовывающий и обнавляющий игру
function gameLoop() {
  update();
  draw();
  requestAnimFrame(gameLoop);
}

gameLoop();
