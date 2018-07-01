"use strict";
// Enemy class
class Enemy {
    //Enemy constructor
    constructor(x, y, speed) {
        // The image/sprite for our enemies, this uses
        // a helper provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        //initial location
        this.x = x;
        this.y = y;
        //speed
        this.speed = speed;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    // AND handle collisions with player
    update(dt) {
        // Multiply any movement by the dt parameter will ensure the game runs at the same speed for all computers. 
        this.x += this.speed * dt;
        //when the enemy is out of the canvas, go back at the beginning and change its speed
        if (this.x > 600) {
            this.x = -200;
            this.speed = Math.floor(Math.random() * 100) + 100;
        }
        //handle collisions with player
        this.collision();
    }
    //collision method, between player and enemy position. Minus 1 live AND reset the player position. A collision sound is played.
    collision() {
        if (Math.abs(Math.floor(player.x) - Math.floor(this.x)) <= 60 &&
            Math.abs(Math.floor(player.y) - Math.floor(this.y)) <= 13) {
            collisionSound.play();
            player.lostLive();
            player.reset();
        }
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Player class
class Player {
    constructor(x, y) {
        //the image for the Player
        this.sprite = 'images/char-horn-girl.png';
        //initial location
        this.x = x;
        this.y = y;
        //player score
        this.score = 0;
        //player lives
        this.lives = 3;
    }

    //Update the Player position
    update() {}

    //Draw the Player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    //Handle Player moves, and play a step sound for each move.
    //Prevent from going out of the canvas AND handle success to the water with a winning sound played, one point added and player position at the beginning.
    handleInput(allowedKeys) {
        music.play();
        if (allowedKeys === 'left') {
            moveSound.play();
            this.x -= 100;
        }
        if (allowedKeys === 'right') {
            moveSound.play();
            this.x += 100;
        }
        if (allowedKeys === 'up') {
            moveSound.play();
            this.y -= 80;
        }
        if (allowedKeys === 'down') {
            moveSound.play();
            this.y += 80;
        }
        //prevent going out right
        if (this.x === 500) {
            this.x = 400;
        }
        //prevent going out left
        if (this.x === -100) {
            this.x = 0;
        }
        //prevent going out down
        if (this.y === 460) {
            this.y = 380;
        }
        //if succeed to go to the water
        if (this.y === -20) {
            winSound.play();
            this.onePoint();
            player.reset();
        }
    }
    //reset method, for the player to go back at the starting position
    reset() {
        this.x = 200;
        this.y = 380;
        music.play();
    }
    //method which add 1 point to the player score
    onePoint() {
        this.score += 1;
    }
    //method which substract 1 live to the player. If lives === 0, gameOver.
    lostLive() {
        this.lives -= 1;
        if (this.lives === 0) {
            gameOver();
        }
    }
}


//if Game Over, a gameOver modal appears WITH a try again button.
//the score and the lives count is given.
const gameOverModal = document.getElementById('gameOverModal');
const tryAgainButton = document.getElementById('tryAgainButton');
var scoreCount;

function gameOver() {
    allEnemies.forEach(function (enemy) {
        enemy.speed = 0;
    })

    if (player.score === 0) {
        scoreCount = '0 point';
    } else {
        scoreCount = player.score + ' points';
    }
    document.getElementById('scoreCount').textContent = scoreCount;
    gameOverModal.style.display = 'block';

};

tryAgainButton.onclick = function startAgain() {
    window.location.reload();
}

// Instantiate the objects
// All enemy objects are placed in allEnemies array
const allEnemies = [];
const enemy1 = new Enemy(-200, 60, Math.floor(Math.random() * 100) + 100);
const enemy2 = new Enemy(-170, 220, Math.floor(Math.random() * 100) + 100);
const enemy3 = new Enemy(-150, 140, Math.floor(Math.random() * 100) + 100);
const enemy4 = new Enemy(-700, 60, enemy1.speed);
const enemy5 = new Enemy(-600, 220, enemy2.speed);
const enemy6 = new Enemy(-650, 140, enemy3.speed);

allEnemies.push(enemy1, enemy2, enemy3, enemy4, enemy5, enemy6);

// The player object
const player = new Player(200, 380);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. Provided code.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


//Add sounds in the game
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

const moveSound = new sound('sounds/sfx_movement_footsteps1a.wav');
const winSound = new sound('sounds/sfx_sounds_powerup12.wav');
const collisionSound = new sound('sounds/sfx_sounds_damage2.wav');
const music = new sound('sounds/PimPoy.wav')