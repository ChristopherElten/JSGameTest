// cmd f legend
/*
	TODO - future implementations
	***Feature - feature that may be added
	TEST - testing purposes only
	EFF? - potentially not the most efficient of practical solution
*/

// TODO Motion Blur/TWEEENING
// TODO Bug for limiting user movement based on boundries of level (height)
// TODO general size of cell to replace cw and rh
// TODO fix spawner (enemies)
// TODO add timer (countdown) to next level when level is beat

var
// Constants
/* The level affects:
* (1) the rate at which enemies spawn
* (2) the size of the grid for which the player traverses (does not affect the canvas size)
* 
*
*/
// Game Framework Constants
canvas,
ctx,
keystate,
// TODO Additions to canvas to fit nav
// WINDOW ELEMENTS
// Info bar height value to be added below grid: used to display the game information
INFOBAR,
// Trackers
COUNTER,
FPS,
UPS,
SCORE,
// Date object to be used to keep track of time difference of game
currTime,
prevTime,
// Keys (controls available)
w = 87,
s = 83,
UPARROW = 38,
DOWNARROW = 40,
SPACEBAR = 32,

// Game Objects
bullets,
barricades,
enemies,
items;


function main(){
	INFOBAR = 100;
	canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 500 + INFOBAR;
	ctx = canvas.getContext("2d");

	document.body.appendChild(canvas);

	// Key listener
	keystate = [];
	document.addEventListener("keydown", function(e){
		keystate[e.keyCode] = true;	
	} );

	document.addEventListener("keyup", function(e){
		keystate[e.keyCode] = false;
	});

	// adding mouse hover detection to get mouse x and y coordinates
	document.addEventListener("mousemove", function(e){
		Player.mouseIcon.x = e.offsetX;
		Player.mouseIcon.y = e.offsetY;
	});

	init();
	loop();
}

function init(){
	// Start at level 1
	Level.init();

	// Starts with level 1; Needs to be on top because variables are used elsewhere
	// TODO Take out coupling
	GenerateMap();

	// Instantiate Game Objects
	Player.init();
	Player.mouseIcon.init();
	bullets = [];
	barricades = [];
	enemies = [];
	items = [];

	buildLevel();

	// Getting the time of game start
	prevTime = new Date();
	// Setting FPS UPS to 0 initially
	FPS = 0;
	UPS = 0;
	COUNTER = 0;
	// Starting score of 0
	SCORE = 0;
}

function loop(){
	// Reset current time
	currTime = new Date().getTime();
	if ((currTime - prevTime.getTime()) > 1000 ){
		// TEST
		// console.log("1 second passed");
		// console.log("FPS: " + FPS + "UPS: " + UPS);
		prevTime = new Date();
		FPS = COUNTER, UPS = COUNTER;
		COUNTER = 0;
		// every second... The everySecond will trigger
		everySecond();
	}
	// 60 fps, 60 ups
	// TODO GUARENTEE for Every 1/60 of a second...
	COUNTER++;
	update();
	draw();
	requestAnimationFrame(loop);
}

function draw(){
	// CLEAR CANVAS
	// For refreshing of draw purposes
	// EFF?
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	Grid.draw();

	// Nav
	Nav.update();

	// Drawing barricades
	if (!(barricades.length===0)){
		for (var i = 0; i < barricades.length; i++) {
			if (barricades[i] !== null){
				barricades[i].draw();
			}
		};
	};
	// Drawing Enemies
	if (!(enemies.length===0)){
		for (var i = 0; i < enemies.length; i++) {
			enemies[i].draw();
		};
	};
	// Drawing all the items
	if (!(items.length===0)){
		for(var i = 0; i < items.length; i++){
			items[i].draw();
		};
	};
	// Drawing all the bullets
	if (!(bullets.length===0)){
		for (var i = 0; i < bullets.length; i++) {
			bullets[i].draw();
		};
	};

	Player.draw();
	Nav.draw();
	Player.mouseIcon.mouseDraw();
}

function update(){
	// Key controller (CONTROLS)
	if ((keystate[UPARROW] === true) || (keystate[w] === true)){
		// Can only move if the y coordinate will not pass upper boundry or grid
		// TODO CHANGE TO CELL CHECKING!
		// 3 is for rounding errors
		if ((Player.y > 3)){
			Player.moveUp();
			keystate[UPARROW] = false;
			keystate[w] = false;
		}
	} else if ((keystate[DOWNARROW] === true) || (keystate[s] === true)) {
		if ((Player.y + Player.height < Grid.height -3)){
			Player.moveDown();
			keystate[DOWNARROW] = false;
			keystate[s] = false;
		}
	};
	if (keystate[SPACEBAR] === true){
		// TODO Figure out most efficient way
		// TODO Change the bullet according to what is equiped
		// Create bullet
		bullets.push(new Bullet((Player.x + Player.width)/2 + Player.width, (Player.y + Player.height/2 - 4)));
	};
	// Checking if mouse coordinates intersect with any items
	for (var i = 0; i < items.length; i++) {
		var it = items[i];
		if (AABBIntersection(it.x, it.y, it.width, it.height, Player.mouseIcon.x - Player.mouseIcon.width/2, Player.mouseIcon.y - Player.mouseIcon.height/2, Player.mouseIcon.width, Player.mouseIcon.height)){
			// Adding items to player score
			switch(it.type){
				case 0:
					Player.blue++;
				break;
				case 1:
					Player.red++;
				break;
				case 2:
					Player.green++;
				break;
			}
			items.splice(i, 1);
		}
	};

	// Bullet update dynamics
	if (!(bullets.length===0)){
		for (var i = 0; i < bullets.length; i++) {
			// Variable used for current bullet specified. Only for readability
			var b = bullets[i];
			// movement of bullet
			b.update();

			// Collision with enemy
			for (var j = 0; j < enemies.length; j++){
				var en = enemies[j];
				if (AABBIntersection(b.x, b.y, b.width, b.height, en.x, en.y, en.width, en.height)){
					// Do damage to enemy
					en.health -= b.damage;
					// Delete bullet
					bullets.splice(i, 1);
				}
			}
			// Deleting on exit of screen
			if(b.x>canvas.width){
				// Splicing to remove element without leaving hole in array
				bullets.splice(i, 1);
			}
		}
	}

	// Enemy update dynamics
	if (!(enemies.length===0)){
		for (var i = 0; i < enemies.length; i++){
			// Variable used for current bullet specified. Only for readability
			var en = enemies[i];

			// Check if health is below 0
			if (en.health <= 0){
				itemDrop(en.x, en.y);
				enemies.splice(i, 1);
				// TODO LEVEL CHANGE WHEN NUMBER OF ENEMIES DIES (AS PER LEVEL)
				Level.numEnemies--;
				SCORE += 10;

				// Next level if the number of enemies required per level is killed
				if(Level.numEnemies === 0){
					nextLevel();
				}
			}
			// Check to delete the enemy if exit the canvas
			if (en.x + en.width < 0){
				enemies.splice(i, 1);
				Player.lives -= 1;
				// Restart if lives = -1 (no more remaining lives)
				if (Player.lives === -1){
					init();
				}

				if (SCORE >= 100){
					SCORE -= 100;
				} else {
					SCORE = 0;
				}
			}
			if (!en.isColliding){
				// Update enemies (for movement)
				en.update();
			}
			// Checking for collision with barricade
			for (var j = 0; j < barricades.length; j++){ 
				// Variable used for current barricade specified. Only for readability
				var ba = barricades[j];
				// Checking for collision with barricade
				if (!(ba === null)){
					if (AABBIntersection(en.x, en.y, en.width, en.height, ba.x, ba.y, ba.width, ba.height)){
						// Marking that enemy is colliding
						en.isColliding = true;
						// TODO Find better placement of deletion (more than one occurance, look for efficiency somewhere)
						// Damage to barricade
						ba.health -= en.damage;
						// Check if health drops below 0, if so, delete barricade and start the motion of enemy
						if (ba.health <= 0){
							barricades[j] = null;
							en.isColliding = false;
						}
					}
				}
			}
		}
	}

}

main();