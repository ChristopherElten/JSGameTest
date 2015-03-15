console.log("Game Function Helpers Invoked...");

// Random timer for different purposes
// Returns a random number between the max and min params
function rand(max, min){
	return (Math.random()*(max - min)+min);
}

function everySecond(){
	// Spawn enemy based on random chance
	if (rand(1,0)<0.3*Level._level){
		spawnRandomRightCoor(1)
	}
}

// Randomly finding row to place enemy based on grid
// Coordinate generator and spawner for spawning from the Right
function spawnRandomRightCoor(type){
	// Boundries
	var 
	// Random y coordinate between boundries of canvas using grid
	randy = Math.floor(rand(Grid.rows, 0));
	// Creating Enemy with y coordinate generated
	enemies.push(new Enemy(canvas.width, Grid.rh*randy, type));
}

// TODO Confirm This Algo
// Axis-Alligned Bounding Box collistion check
function AABBIntersection(Ax, Ay, Aw, Ah, Bx, By, Bw, Bh){
	// Checking of collision Using top right restriction
	// Checking for collision Using bottom left restriction
	return ((Ax + Aw > Bx) && (Ay + Ah > By) && (Bx + Bw > Ax) && (By + Bh > Ay)); 
}

// Map calculator Based on 4:1 ratio
// params for grid: (columns, rows, width, height)
function GenerateMap(){
	Grid.init((Level._level - 1)*4 + 20, (Level._level - 1)+5, canvas.width, canvas.height - INFOBAR);
}

// Resets on the next level
function nextLevel(){
	clearLevel();
	Level._level++;
	Level.numEnemies = numEnemiesPerLevel();
	buildLevel();
}
// Builds level by regenerating the map and recreating buildings
function buildLevel(){
	GenerateMap();
	buildWall();
	Player.resetPlayer();
}
// Clears level by clearing arrays
function clearLevel(){
	enemies = [];
	barricades = [];
	bullets = [];
	items = [];
}
// Build Wall of barricades
function buildWall(){
	barricades = new Array(Grid.rows);
	// Creating barricades for Player from the top of the page to the bottom
	// Placing barricades based on the number of rows in the grid
	var i =0;
	while(i < barricades.length) {
		barricades[i] = new Barricade(Grid.cw*3, (i*Grid.rh), Grid.cw, Grid.rh-2);
		i++;
	}
}
// TODO Cell movement functions

// Item dropping in different circumstances
// Three types based on random int from 0 to 3
function itemDrop(x, y){
	// random type
	var type = Math.round(rand(2, 0));
	items.push(new Item(x, y, type));
}

// displays relevant information to user
function drawInfoBar(){
	
	ctx.fillText("test", canvas.width - 600, 40);
}
// Number of enemies on each level
function numEnemiesPerLevel(){
	return Math.pow(Level._level, 2)*10;
}


