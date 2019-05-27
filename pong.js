/*

|  _  \ /  _  \ |  \ | | /  ___| 
| |_| | | | | | |   \| | | |     
|  ___/ | | | | | |\   | | |  _  
| |     | |_| | | | \  | | |_| | 
|_|     \_____/ |_|  \_| \_____/ 

/___  \ /  _  \ |_  | /  _  \ 
 ___| | | | | |   | | | |_| | 
/  ___/ | |/| |   | | \___  | 
| |___  | |_| |   | |  ___| | 
|_____| \_____/   |_| |_____/ 

*/

//initialisation de canvas

const animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60) };

const canvas = document.createElement("canvas");
const width = 400;
const height = 600;
canvas.width = width;
canvas.height = height;
const context = canvas.getContext("2d");

const player = new Player();
const computer = new Computer();
const ball = new Ball(200, 300);

//appeler le canavas au chargement
window.onload = function () {
    document.body.appendChild(canvas);
    animate(step);
};

const step = function () {
    update();
    render();
    animate(step);
};

//Ajouter les paddles
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#3A9D23";
    context.fillRect(this.x, this.y, this.width, this.height);
};

//Position des deux paddles
function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
};

function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
};

// Affichage des Paddles

Player.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.render = function () {
    this.paddle.render();
};

//Créer la balle
function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 7;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#F7F70E";
    context.fill();
};

//Affichage
const render = function () {
    const img = new Image();
    //context.fillStyle = "#3AF24B";
    img.addEventListener('load',function(){
      context.drawImage(img,width,height);
    },false);
    img.src = './pictures/planet04.jpg'; 
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};

//Animation

const update = function () {
    computer.update(ball);
    player.update();
    ball.update(player.paddle,computer.paddle);
};

Ball.prototype.update = function(paddle1,paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    const top_x = this.x - 5;
    const top_y = this.y - 5;
    const bottom_x = this.x + 5;
    const bottom_y = this.y + 5;
  
    if(this.x - 5 < 0) { //lorsque la balle tape le mur de gauche
      this.x = 5;
      this.x_speed = -this.x_speed;
    } else if(this.x + 5 > 400) { //lorsque la balle tape le mur de droite
      this.x = 395;
      this.x_speed = -this.x_speed;
    }
  
    if(this.y < 0 || this.y > 600) { // a point was scored
      this.x_speed = 0;
      this.y_speed = 3;
      this.x = 200;
      this.y = 300;
    }
  
    if(top_y > 300) {
      if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
        //lorsque le paddle du joueur est touché
        this.y_speed = -3;
        this.x_speed += (paddle1.x_speed / 2);
        this.y += this.y_speed;
      }
    } else {
      if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
        //lorsque le paddle de l'ordinateur est touché
        this.y_speed = 3;
        this.x_speed += (paddle2.x_speed / 2);
        this.y += this.y_speed;
      }
    }
};

//Maintenant, les contrôles

const keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
    for(const key in keysDown) {
      const value = Number(key);
      if(value == 37) { // flêche gauche
        this.paddle.move(-4, 0);
      } else if (value == 39) { // flêche droite
        this.paddle.move(4, 0);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

  Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x < 0) { //tout sur la gauche
      this.x = 0;
      this.x_speed = 0;
    } else if (this.x + this.width > 400) { //tout sur la droite
      this.x = 400 - this.width;
      this.x_speed = 0;
    }
  };


Computer.prototype.update = function(ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if(diff < 0 && diff < -4) { // vitesse maximal gauche
      diff = -5;
    } else if(diff > 0 && diff > 4) { // vitesse maximal droite
      diff = 5;
    }
    this.paddle.move(diff, 0);
    if(this.paddle.x < 0) {
      this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
      this.paddle.x = 400 - this.paddle.width;
    }
  };