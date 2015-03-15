console.log("Game Object Helpers Invoked...");
// cmd f legend
/*
	TODO - future implementations
	***Feature - feature that may be added
	TEST - testing purposes only
	EFF? - potentially not the most efficient of practical solution
*/

// Level object
Level = {
	_level: null,
	// Keep track of remaining number of enemies in the level
	numEnemies: null,

	init: function(){
		this._level = 1;
		this.numEnemies = numEnemiesPerLevel();
	},
}
// Grid to be used for all Maps
Grid = {
	// canvas width and height
	width: null,
	height: null,
	// Columns width and row height
	cw: null,
	rh: null,
	// Number of columns on the grid
	cols: null,
	rows: null,
	// The grid array
	_grid: null,

	init: function(columns, rows, width, height){
		this.cols = columns;
		this.rows = rows;
		this.width = width;
		this.height = height;

		// calculating the columns width (cw) and row height (rh)
		this.cw = this.width/this.cols;
		this.rh = this.height/this.rows;
	},

	draw: function(){
		// Array for cells
		this._grid = [];
		this._grid.length = this.cols*this.rows;
		// variables...
		var
		// Colors
		c1 = "#a9a9a9",
		c2 = "#d4d4d4",
		// Assigning alternating row colours (using boolean)
		a = true,
		// Index for array
		i = 0;
		// Looping through each of the cells of the grid and assigning values
		for( var y = 0; y < this.rows; y++){
			// Changes bool value
			a = !a;
			for( var x = 0; x < this.cols; x++){
				// Alternating values
				if (a){
					this._grid[i] = 1;
				} else {
					this._grid[i] = 0;
				}
				// Colours to be used
				switch(this._grid[i]) {
					case 0:
						ctx.fillStyle = c1;
					break;
					case 1:
						ctx.fillStyle = c2;
					break;
				}
				ctx.fillRect(x*this.cw, y*this.rh, this.cw, this.rh);
				// Index array + 1
				i++;
			}
		}
	},

	// Testing purposes (changing the size of the canvas)
	// To be changed to a resize function to fit the browser ***Feature
	changeWidth: function(w){
		canvas.width = w;
	},

	changeHeight: function(h){
		canvas.height = h;
		},

	// Future maps will be designed here most likely
	// TODO
	map: {
		
		init: function(){

		}
	}

}

// Visual nav bar for ease of readability
Nav = {
	Content: null, 

	update: function(){
		// Will be cycled by 2's, so every two elements in the array are paired in draw
		Content	= ["FPS: ", FPS, "UPS: ", UPS, "LIVES: ", Player.lives, "SCORE: ", SCORE, "ENEMIES: ", Level.numEnemies, "Blue tokens: ", Player.blue, "Red tokens: ", Player.red, "Green tokens: ", Player.green];	
	},

	draw: function(){
		var alt = false;
		var xplace = 30;
		ctx.fillStyle = "black";
		ctx.font="20px Helvetica"
		// Pairing every two elements in the array for draw
		for(var i = 0; i < Content.length; i+=2){
			if (alt){
				ctx.fillText(Content[i] + Content[i+1], xplace, canvas.height - INFOBAR/2 + 40 );
				alt = false;
				xplace = 30 + i*50;
			} else {
				ctx.fillText(Content[i] + Content[i+1], xplace, canvas.height - INFOBAR/2);
				alt = true;
			}
		}
	}

}

// Gameplay Objects
// Player object
Player = {

	// Coordinates of object
	x: null, 
	y: null,
	// Dimensions
	width: null,
	height: null,
	// color
	c1: null,
	// game attributes
	lives: null,
	// Items collected
	blue: null,
	red: null,
	green: null,

	mouseIcon: {
		// mouse Coordinates
		x: null,
		y: null,
		// Icon dimensions
		width: null,
		height: null,
		// Display Color
		color: null,

		init: function(){
			this.width = 50;
			this.height = 50;
			this.color = "yellow";
		},
		// marking where the mouse currently is aimed
		mouseDraw: function(){
			ctx.fillStyle = "yellow";
			ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
		}
	},

	init: function(){
		this.resetPlayer();
		this.c1 = "#032149";
		this.lives = 5;
		this.blue = 0;
		this.red = 0;
		this.green = 0;
	},

	// Reset position and size for new level
	resetPlayer: function(){
		this.x = Grid.cw*1;
		this.y = Grid.rh*(Math.ceil(Grid.rows/2) - 1);
		this.width = Grid.cw;
		this.height = Grid.rh;
	},

	draw: function(){
		ctx.fillStyle = this.c1;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},

	// Movement functions
	moveUp: function(){
		this.y -= Grid.rh;
	},
	moveDown: function(){
		this.y += Grid.rh;
	}
};

// Bullet
function Bullet(x, y){
	this.x = x;
	this.y = y;
	this.width = 8;
	this.height = 8;
	this.damage = 10;
	this.speed = 8;
}
// Bullet position change
Bullet.prototype.update = function(){
	this.x += this.speed;
}
// Bullet draw
Bullet.prototype.draw = function(){
	ctx.fillStyle = "grey";
	ctx.fillRect(this.x + 10, this.y, this.width, this.height);
}

// Barricade (Defense)
function Barricade(x, y, width, height){
	this.x = x;
	this.y = y;
	// Width and height dependent on grid attributes
	this.width = width;
	this.height = height;
	this.health = 50;
}
// Barricade draw
Barricade.prototype.draw = function(){
	ctx.fillStyle = "black";
	ctx.fillRect(this.x, this.y + 1, this.width, this.height);
}

// Enemy
function Enemy(x, y, type){
	this.x = x;
	this.y = y;
	this.width = Grid.cw;
	this.height = Grid.rh;
	this.health = 100;
	this.damage = 1;
	this.speed = 5;
	// Marker for collision for enemy
	this.isColliding = false;
	// Indicator of type
	// TODO Types of enemies
	this.type = type;
}

Enemy.prototype.update = function(){
	this.x -= this.speed;
}
Enemy.prototype.draw = function(){
	ctx.fillStyle = "navy";
	ctx.fillRect(this.x, this.y, this.width, this.height);
}

// Item
function Item(x, y, type){
	// Size based on grid size
	this.width = Grid.cw/4;
	this.height = this.width;
	this.x = x + this.width/2;
	this.y = y + Grid.rh/2;
	this.type = type;
}
Item.prototype.draw = function(){
	switch(this.type){
		case 0:
			ctx.fillStyle = "blue";
		break;
		case 1:
			ctx.fillStyle = "red";
		break;
		case 2:
			ctx.fillStyle = "green";
		break;
	}
	ctx.fillRect(this.x, this.y, this.width, this.height);
}