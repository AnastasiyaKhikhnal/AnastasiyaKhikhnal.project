'use strict';
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


// свойства и методы игрока
var player = {
  w: 90,
  h: 65,
  sx: 0,
  sy: 0,
  px: 205,
  py: 400,
  draw: function () {
    var img = new Image();
    img.src = 'img/ufo02.gif';
    context.drawImage(img, this.px, this.py, this.w, this.h);
  },
  update: function () {
    this.px += this.sx;
    this.py += this.sy;
    if (this.py + this.h > canvas.height) {
      this.py = (canvas.height + 4) - this.h;
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
};
