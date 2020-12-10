//var mongojs = require("mongojs");
var db = null;//mongojs('localhost:27017/myGame', ['account','progress']);

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");

var GAME_LIST = {};
// var SOCKET_LIST = {};
var GLOBAL_SOCKETS = {};
var STARTED_GAMES = {};


var TILE_SIZE = 64;	

var numberName = 1000;


	isPositionWall = function(bumper, theGameId){

			var gridX = Math.floor(bumper.x / TILE_SIZE);
			var gridY = Math.floor(bumper.y / TILE_SIZE);


			// console.log(bumper);

			if(gridX < 0 || gridX >= GAME_LIST[theGameId].map.array2D[0].length)
				return true;
			if(gridY < 0 || gridY >= GAME_LIST[theGameId].map.array2D.length)
				return true;
			return GAME_LIST[theGameId].map.array2D[gridY][gridX];
		}


var StartGame = function(theGame){

	// var thisGame = {};
	// thisGame.id = Math.random();

	// GAME_LIST[theGame.id].map.array2D = [];

	// var initPack = {player:[], bomb:[], explotion:[],serverArray:GAME_LIST[theGame.id].map.array2D, tile:[], powerUp:[], enemy:[]};



	var initPack = {player:[], bomb:[], explotion:[], tile:[], powerUp:[], enemy:[]};
	var removePack = {player:[], bomb:[], explotion:[], tile:[], powerUp:[], enemy:[]};

	var spriteArrayIndex = 0;
	var playerNumber = 0;
	var charArray = [];

	var enemyMove = true;

	var Map = function(param){

		
		var self = {};
		self.id = Math.random();
		self.gameId = param.id;
		self.array2D = [];
		console.log(self.gameId);

			self.array =[

					1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1,
					1 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,2 ,12,1,
					1 ,0 ,1 ,10,1 ,0 ,1 ,10,1 ,0 ,1 ,0 ,1 ,10,1 ,2 ,1,
					1 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,2 ,0 ,0 ,2 ,0 ,2 ,10,1,
					1 ,11,1 ,2 ,1 ,0 ,1 ,2 ,1 ,0 ,1 ,2 ,1 ,2 ,1 ,2 ,1,
					1 ,0 ,0 ,0 ,0 ,12,0 ,0 ,0 ,0 ,0 ,12,0 ,0 ,2 ,0 ,1,
					1 ,0 ,1 ,0 ,1 ,0 ,1 ,2 ,1 ,0 ,1 ,2 ,1 ,2 ,1 ,0 ,1,
					1 ,0 ,2 ,2 ,10,2 ,12,0 ,10,2 ,0 ,0 ,0 ,0 ,2 ,0 ,1,
					1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1,
					1 ,0 ,0 ,0 ,10,0 ,0 ,0 ,10,2 ,0 ,0 ,0 ,0 ,2 ,0 ,1,
					1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1,
					
					//stupid fix, number under here has not meaning

					1 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,2 ,0 ,0 ,2 ,0 ,2 ,10,1,
					1 ,11,1 ,2 ,1 ,0 ,1 ,2 ,1 ,0 ,1 ,2 ,1 ,2 ,1 ,2 ,1,
					1 ,0 ,0 ,0 ,0 ,12,0 ,0 ,0 ,0 ,0 ,12,0 ,0 ,2 ,0 ,1,
					1 ,0 ,1 ,0 ,1 ,0 ,1 ,2 ,1 ,0 ,1 ,2 ,1 ,2 ,1 ,0 ,1,
					1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1,
					1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1,
					];
	
		self.transformArray = function(){

			self.array2D = [];

			for(var i = 0 ; i < 17; i++){
				self.array2D[i] = [];
				for(var j = 0 ; j < 17; j++){
					self.array2D[i][j] = self.array[i * 17 + j];
				}
			}
		}
		return self;
	}


	var initPack = {player:[], bomb:[], explotion:[], tile:[], powerUp:[], enemy:[]};
	var removePack = {player:[], bomb:[], explotion:[], tile:[], powerUp:[], enemy:[]};


	var self = {};
	self.map = Map({id:theGame.id});

	GAME_LIST[theGame.id].map = self.map;



	// console.log('Create map for THIS GAME ' + GAME_LIST[theGame.id].id);
	// GAME_LIST[theGame.id].map = Map({id:theGame.id});
	// console.log('This games Map ID' + GAME_LIST[theGame.id].map.id);


	 // Map({id:theGame.id});

	// theGame.map = Map({id:theGame.id});
	// tempMap.transformArray();
	// theGame.map.transformArray();
	// console.log(tempMap);

	// var TILE_SIZE = 64;	
	var explotionOffSetX = 24; 
	var explotionOffSetY = 28;

	var asp = [];

		// this.array =[

		// 			1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1,
		// 			1 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,12,1,
		// 			1 ,0 ,1 ,10,1 ,0 ,1 ,10,1 ,2 ,1,
		// 			1 ,0 ,0 ,2 ,0 ,0 ,2 ,0 ,2 ,10,1,
		// 			1 ,11,1 ,2 ,1 ,0 ,1 ,2 ,1 ,2 ,1,
		// 			1 ,0 ,0 ,0 ,0 ,12,0 ,0 ,2 ,0 ,1,
		// 			1 ,0 ,1 ,0 ,1 ,2 ,1 ,2 ,1 ,0 ,1,
		// 			1 ,0 ,2 ,2 ,10,2 ,0 ,0 ,2 ,0 ,1,
		// 			1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1,
		// 			1 ,11,0 ,0 ,10,0 ,12,0 ,0 ,10,1,
		// 			1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1,

		// 			];

	// GAME_LIST[theGame.id].map.array2D = [];


	// function transformArray(){

	// 	GAME_LIST[theGame.id].map.array2D = [];

	// 	for(var i = 0 ; i < 11; i++){
	// 		GAME_LIST[theGame.id].map.array2D[i] = [];
	// 		for(var j = 0 ; j < 11; j++){
	// 			GAME_LIST[theGame.id].map.array2D[i][j] = this.array[i * 11 + j];
	// 		}
	// 	}
	// }

	function hitTestRectangle(r1, r2) {

	  //Define the variables we'll need to calculate
	  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

	  //hit will determine whether there's a collision
	  hit = false;

	  //Find the center points of each sprite
	  r1.centerX = r1.x + r1.width / 2;
	  r1.centerY = r1.y + r1.height / 2;
	  r2.centerX = r2.x + r2.width / 2;
	  r2.centerY = r2.y + r2.height / 2;

	  //Find the half-widths and half-heights of each sprite
	  r1.halfWidth = r1.width / 2;
	  r1.halfHeight = r1.height / 2;
	  r2.halfWidth = r2.width / 2;
	  r2.halfHeight = r2.height / 2;

	  //Calculate the distance vector between the sprites
	  vx = r1.centerX - r2.centerX;
	  vy = r1.centerY - r2.centerY;

	  //Figure out the combined half-widths and half-heights
	  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

	  //Check for a collision on the x axis
	  if (Math.abs(vx) < combinedHalfWidths) {

	    //A collision might be occuring. Check for a collision on the y axis
	    if (Math.abs(vy) < combinedHalfHeights) {

	      //There's definitely a collision happening
	      hit = true;
	    } else {

	      //There's no collision on the y axis
	      hit = false;
	    }
	  } else {

	    //There's no collision on the x axis
	    hit = false;
	  }

	  //`hit` will be either `true` or `false`
	  return hit;
	};

	// isPositionWall = function(bumper){

	// 		var gridX = Math.floor(bumper.x / TILE_SIZE);
	// 		var gridY = Math.floor(bumper.y / TILE_SIZE);


	// 		// console.log(bumper);

	// 		if(gridX < 0 || gridX >= GAME_LIST[theGame.id].map.array2D[0].length)
	// 			return true;
	// 		if(gridY < 0 || gridY >= GAME_LIST[theGame.id].map.array2D.length)
	// 			return true;
	// 		return GAME_LIST[theGame.id].map.array2D[gridY][gridX];
	// 	}


	var Entity = function(param){
		var self = {
			x:100,
			y:100,
			spdX:0,
			spdY:0,
			id:"",
			map:'forest',
			wall: false,
		}
		if(param){
			if(param.x)
				self.x = param.x;
			if(param.y)
				self.y = param.y;
			if(param.map)
				self.map = param.map;
			if(param.id)
				self.id = param.id;		
		}
		
		self.update = function(){
			self.updatePosition();
		}
		self.updatePosition = function(){
			var oldX = self.x;
			var oldY = self.y;

			self.x += self.spdX;
			self.y += self.spdY;

		}
		self.getDistance = function(pt){
			return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
		}
		return self;
	}
	var Enemy = function(param){
		var self = {};
		self.id = Math.random();
		self.x = (param.gridX * TILE_SIZE) + 16;
		self.y = (param.gridY * TILE_SIZE) + 16;
		self.width = 32;
		self.height = 32;
		self.dead = false;

		// self.gridX = param.gridX;
		// self.gridY = param.gridY;

		self.maxSpd = 10;
		//left, up, right, down
		self.direction = [false, true, false, false];
		self.directionIndex = 0;

		self.isWall = [[-self.maxSpd,0],[0,-self.maxSpd],[self.maxSpd*8,0],[0,self.maxSpd*8]];

		// self.movmentSpeed = [[-self.maxSpd,0],[0,-self.maxSpd],[self.maxSpd,0],[0,self.maxSpd]];
		self.movmentSpeed = [[-TILE_SIZE,0],[0,-TILE_SIZE],[TILE_SIZE,0],[0,TILE_SIZE]];
		self.turn = Math.floor(Math.random()*16);



		self.move = function(){

			if(self.turn === 32 && self.dead === false){

				self.turn = 0;
				var possibleDirection = [];

				// if(Math.random() < 0.98){

				var gridX = Math.floor((self.x) / TILE_SIZE);
				var gridY = Math.floor((self.y) / TILE_SIZE);

				var gridCordX = gridX * TILE_SIZE;
				var gridCordY = gridY * TILE_SIZE;

				var lastWall = [];	
				var gridWall = [[-1,0],[0,-1],[1,0],[0,1]];
				var tempDir = false;
				var currentDirectionPossible = false;
				var random = Math.random();


				for (var i = 0; i < 4; i++) {
					
					gridWall[i][0] += gridX;
					gridWall[i][1] += gridY;
					var tempWall = [gridWall[i][0] * TILE_SIZE, gridWall[i][1] * TILE_SIZE];
					lastWall.push(tempWall);
				}
				

				for (var i = 0; i < lastWall.length; i++) {
					if(isPositionWall({x:lastWall[i][0], y:lastWall[i][1]}, theGame.id)){


					} else{

						if(self.directionIndex === i){
							currentDirectionPossible = true;
						} else{
							possibleDirection.push(i);
						}
					}
				}

				if(random < 0.6 && possibleDirection.length > 1){
						for (var i = 0; i < possibleDirection.length; i++) {
						var random = Math.random();

						if(random > 0.5){
						self.directionIndex = possibleDirection[i];
						self.x += self.movmentSpeed[possibleDirection[i]][0];
						self.y += self.movmentSpeed[possibleDirection[i]][1];
						break;
						}
					}
				}
				else if(currentDirectionPossible === true){
					// console.log(random + ':r  current ' + self.directionIndex);
					self.x += self.movmentSpeed[self.directionIndex][0];
					self.y += self.movmentSpeed[self.directionIndex][1];
				} else if(possibleDirection.length > 0){
						// console.log('new   ' + possibleDirection);

					for (var i = 0; i < possibleDirection.length; i++) {
						var random = Math.random();

						if(random > 0.5){
						self.directionIndex = possibleDirection[i];
						self.x += self.movmentSpeed[possibleDirection[i]][0];
						self.y += self.movmentSpeed[possibleDirection[i]][1];
						break;
						}
					}

				} else{
					console.log('failed enemy movment');
				}
			} 
			// else if(self.turn === ){

			// }else if(self.turn === ){

			// }else if(self.turn === ){

			// }
			else{
				self.turn += 1;
			}
		}


		// self.move();

		self.getInitPack = function(){
			return {
				id:self.id,
				x:self.x,
				y:self.y,	

			};		
		}

		self.getUpdatePack = function(){

			return {
				id:self.id,
				x:self.x,
				y:self.y,
			}	
		}	

		Enemy.list[self.id] = self;
		initPack.enemy.push(self.getInitPack());
		return self;
	}
	Enemy.list = {};

	Enemy.getAllInitPack = function(){
		var enemies = [];
		for(var i in Enemy.list)
			initPack.enemy.push(Enemy.list[i].getInitPack());

	}

	Enemy.update = function(){
		var pack = [];
		for(var i in Enemy.list){
			var enemy = Enemy.list[i];

			// console.log(' move ' + enemy.id);


			// //Move disable during dev !!!!!!
			if(enemyMove === true)
				enemy.move();





			// bomb.update();
			// if(explotion.toRemove){
			// 	delete Enemy.list[i];
			// 	removePack.enemy.push(enemy.id);
			// }
			pack.push(enemy.getUpdatePack());		
		}
		return pack;
	}
	var whatGridNumber = function(position){

			var gridX = Math.floor(position.x / TILE_SIZE);
			var gridY = Math.floor(position.y / TILE_SIZE);
			console.log(' ggridXN ' + gridX + ' ' + gridY);
			var gridNumber	= GAME_LIST[theGame.id].map.array2D[gridY][gridX];
			console.log(' gN ' + gridNumber);
			return	gridNumber;
	}
	var Player = function(param){
		var self = Entity(param);
		self.number = "" + Math.floor(10 * Math.random());
		self.pressingRight = false;
		self.pressingLeft = false;
		self.pressingUp = false;
		self.pressingDown = false;
		self.pressingAttack = false;
		self.dropBomb = false;
		self.mouseAngle = 0;
		self.maxSpd = 8;
		self.hp = 10;
		self.hpMax = 10;
		self.score = 0;
		self.gridX = 1;
		self.gridY = 1;
		self.x = 96;
		self.y = 96;
		self.killed = false;
		self.explodeLength = 1;
		self.bombs = [];
		self.amountBombsAllowed = 1;
		self.died = false;
		self.width = 30;
		self.height = 30;
		self.player = playerNumber;
		self.spriteArrayOffset;
		self.turn = 0;
		self.movingDown = false;
		self.movingUp = false;
		self.movingRight = false;
		self.movingLeft = false;

		self.speedDown = false;
		self.movementTic = 8;

		self.touchX = 1;
		// self.touchY = 1;
		self.TY = 1;

		self.touchAnchorX = 1;
		self.touchAnchorY = 1;

		self.touch = false;
		self.moveBomb = false;

		// self.

		// self.animationSkip = false;

		self.lastDirection = 'down';

		self.movingTurn = 0;

		self.spriteArrayOffset = playerNumber + 1;
		self.spriteArrayOffset *= 8;

		playerNumber += 1;

		var super_update = self.update;
		self.update = function(){
			self.updateSpd();
			
			super_update();
			
			if(self.pressingAttack){
				self.shootBullet(self.mouseAngle);
			}

			if(self.dropBomb && self.amountBombsAllowed > self.bombs.length && self.x > 0 && self.y > 0 && self.died === false){
				
				var tempBomb = Bomb(
						{x:self.x +16,
						y:self.y + 16,
						explodeLength:self.explodeLength,
						parent:self,
						});

				setTimeout(function(){
					var tB = self.bombs.indexOf(tempBomb);
					self.bombs.splice(tB, 1);
					self.dropBomb = false;
				}, tempBomb.fuse)

				// var tempBombObject = {id:Math.random} 

				self.bombs.push(tempBomb);

				self.dropBomb = false;
			}
		}

		self.shootBullet = function(angle){
			Bullet({
				parent:self.id,
				angle:angle,
				x:self.x,
				y:self.y,
				map:self.map,
			});
		}
		
		self.updateSpd = function(){


			// if(self.touch){
			// 	var gridTX = Math.floor(self.touchX / TILE_SIZE);
			// 	var gridTY =  Math.floor(self.TY / TILE_SIZE);

			// 	// var gridXPlayer =  Math.floor(self.x / TILE_SIZE);
			// 	// var gridYPlayer =  Math.floor(self.y / TILE_SIZE);
			// 	var gridXPlayer =  Math.floor(self.touchAnchorX / TILE_SIZE);
			// 	var gridYPlayer =  Math.floor(self.touchAnchorY / TILE_SIZE);


			// 	// if(gridTX === gridXPlayer && gridTY === gridYPlayer && self.moveBomb === false){
			// 	// 	self.dropBomb = true;
			// 	// 	console.log('bombdrop');
			// 	// } else{
			// 	// console.log(self.touchX + ' ' + self.TY);

			// 		var xDiff = self.touchX - self.touchAnchorX;
			// 		var yDiff = self.TY - self.touchAnchorY;

			// 		var tempXDiff = xDiff;
			// 		var tempYDiff = yDiff;			

			// 		if(xDiff < 0)
			// 			tempXDiff *= -1;

			// 		if(yDiff < 0)
			// 			tempYDiff *= -1;


			// 		if(tempXDiff > tempYDiff){
			// 			if(xDiff < 0){
			// 				self.pressingLeft = true;
			// 				self.pressingRight = false;
			// 				self.pressingDown = false;
			// 				self.pressingUp = false;					
			// 			}


			// 			else{
			// 				self.pressingRight = true;
			// 				self.pressingLeft = false;
			// 				self.pressingDown = false;
			// 				self.pressingUp = false;

			// 			}
			// 		} else if(tempXDiff < tempYDiff){
			// 			if(yDiff > 0){
			// 				self.pressingDown = true;
			// 				self.pressingRight = false;
			// 				self.pressingLeft = false;
			// 				self.pressingUp = false;

			// 			}
			// 			else{

			// 				self.pressingUp = true;
			// 				self.pressingRight = false;
			// 				self.pressingDown = false;
			// 				self.pressingLeft = false;
			// 			}
			// 		}					
			// 	// }

	
			// 	self.touch = false;
			// }
			// if(!self.pressingRight && !self.pressingDown && !self.pressingUp && !self.pressingLeft){
			// 	// console.log('aint moving dude');
			// } else 

				//[true, false]
			if(self.movingDown){
				self.y += self.maxSpd;

				self.movingTurn += 1;

				if(self.movingTurn >= self.movementTic){
					self.movingTurn = 0;
					self.movingDown = false;
					self.lastDirection = 'down';
				}

			} else if(self.movingRight){
				self.x += self.maxSpd;

				self.movingTurn += 1;

				if(self.movingTurn >= self.movementTic){
					self.movingTurn = 0;
					self.movingRight = false;
					self.lastDirection = 'right';
				}


			} else if(self.movingLeft){
				self.x -= self.maxSpd;

				self.movingTurn += 1;

				if(self.movingTurn >= self.movementTic){
					self.movingTurn = 0;
					self.movingLeft = false;
					self.lastDirection = 'left';
				}


			} else if(self.movingUp){
				self.y -= self.maxSpd;

				self.movingTurn += 1;

				if(self.movingTurn >= self.movementTic){
					self.movingTurn = 0;
					self.movingUp = false;
					self.lastDirection = 'up';
				}


			} 


			if(!self.movingDown && !self.movingLeft && !self.movingRight && !self.movingUp){
				moveFunc();
			}
		}

		function moveFunc(){


				

				// console.log('before, self  ' + self.speedDown + '   ' + speedDownTemp);
				if(self.speedDown === true){

					self.maxSpd = 8;
					self.movementTic = 8;
					self.speedDown = false;
					// console.log(self.maxSpd + ' speed after');
				}

				if(self.x > 0 && self.y > 0){
					// hitTestRectangle(r1, r2)

					var gridXold = Math.floor(self.x/TILE_SIZE);
					var gridYold = Math.floor(self.y/TILE_SIZE);	


					// console.log('gridXold ' + gridXold + ' gridYold ' + gridYold);
					// console.log('self.x ' + self.x + ' self.y ' + self.y);
					
					for (var i = 0; i < self.bombs.length; i++) {
						if(self.bombs[i])
						{	
							var diffX = self.bombs[i].x - self.x;
							var diffY = self.bombs[i].y - self.y;
							if(diffY > 64 || diffY*-1 > 64){
								self.bombs[i].parentCantWalk();
							} else if(diffX > 64 || diffX*-1 > 64)
								self.bombs[i].parentCantWalk();
						}
					}

						// var pressRightCord1 = {x:self.x + self.maxSpd + self.width, y:self.y - self.height};
						// var pressRightCord2 = {x:self.x + self.maxSpd + self.width, y:self.y + self.height};

						var pressRight1 = isPositionWall({x:self.x + self.maxSpd + self.width, y:self.y - self.height}, theGame.id);
						var pressRight2 = isPositionWall({x:self.x + self.maxSpd + self.width, y:self.y + self.height}, theGame.id);

						var pressLeft1 = isPositionWall({x:self.x - self.maxSpd - self.width, y:self.y + self.height}, theGame.id);
						var pressLeft2 = isPositionWall({x:self.x - self.maxSpd - self.width, y:self.y - self.height}, theGame.id);

						var pressUp1 = isPositionWall({x:self.x + self.width, y:self.y - self.maxSpd - self.height}, theGame.id);
						var pressUp2 = isPositionWall({x:self.x - self.width, y:self.y - self.maxSpd - self.height}, theGame.id);

						var pressDown1 = isPositionWall({x:self.x - self.width, y:self.y + self.maxSpd + self.height}, theGame.id);
						var pressDown2 = isPositionWall({x:self.x + self.width, y:self.y + self.maxSpd + self.height}, theGame.id);

					if(self.pressingRight){

						if(pressRight1	=== 0 && pressRight2 ===0)
							// self.x += self.maxSpd;
							self.movingRight = true;
						else if(pressRight1 === self.id && pressRight2 === self.id)
							// self.x += self.maxSpd;
							self.movingRight = true;

					}
					else if(self.pressingLeft){

						if(pressLeft1	=== 0 && pressLeft2 ===0)
							// self.x -= self.maxSpd;
							self.movingLeft = true;
						else if(pressLeft1 === self.id && pressLeft2 === self.id)
							// self.x -= self.maxSpd;
							self.movingLeft = true;
					} else if(self.pressingUp){

						if(pressUp1	=== 0 && pressUp2 ===0)
						// self.y -= self.maxSpd;
						self.movingUp = true;
						else if(pressUp1 === self.id && pressUp2 === self.id)
						// self.y -= self.maxSpd;
						self.movingUp = true;
					}
					else if(self.pressingDown){

						if(pressDown1	=== 0 && pressDown2 ===0)
						// self.y += self.maxSpd;
						self.movingDown = true;
						else if(pressDown1 === self.id && pressDown2 === self.id)
						// self.y += self.maxSpd;
						self.movingDown = true;
					}

					self.gridX = Math.floor(self.x/TILE_SIZE);
					self.gridY = Math.floor(self.y/TILE_SIZE);

					for(var i in PowerUp.list){
						var pU = PowerUp.list[i];
						if(pU.gridX === self.gridX && pU.gridY === self.gridY){

							if(pU.type === 'bombUp'){
								self.explodeLength += 1;					
							} else if(pU.type === 'amountUp'){
								self.amountBombsAllowed += 1;					
							} else if(pU.type === 'speedUp'){
								speedUp(self);					
							} 
		 
							delete PowerUp.list[i];
							removePack.powerUp.push(pU.id);
							GAME_LIST[theGame.id].map.array2D[pU.gridY][pU.gridX] = 0;	
						}
					}		

					for(var i in Enemy.list){
						var albert =  Enemy.list[i];
						if(hitTestRectangle(self, albert))
							Player.died(self);		
					}

				}

				if(self.animationSkip){
					self.animationSkip = false;
				} else{
					self.animationSkip = true;
				}
		}

		self.getInitPack = function(){
			return {
				id:self.id,
				x:self.x,
				y:self.y,	
				number:self.number,	
				hp:self.hp,
				hpMax:self.hpMax,
				score:self.score,
				map:self.map,
				player:self.player,
				pressingDown:self.pressingDown,
				pressingRight:self.pressingRight,
				pressingLeft:self.pressingLeft,
				pressingUp:self.pressingUp,
				spriteArrayOffset:self.spriteArrayOffset,
				movingUp:self.movingUp,
				movingLeft:self.movingLeft,
				movingDown:self.movingDown,
				movingRight:self.movingRight,
				lastDirection:self.lastDirection,
				// animationSkip:self.animationSkip
			};		
		}
		self.getUpdatePack = function(){

			return {
				id:self.id,
				x:self.x,
				y:self.y,
				hp:self.hp,
				score:self.score,
				dropBomb:self.dropBomb,
				died:self.died,
				player:self.player,
				pressingDown:self.pressingDown,
				pressingRight:self.pressingRight,
				pressingLeft:self.pressingLeft,
				pressingUp:self.pressingUp,
				spriteArrayOffset:self.spriteArrayOffset,
				movingUp:self.movingUp,
				movingLeft:self.movingLeft,
				movingDown:self.movingDown,
				movingRight:self.movingRight,	
				lastDirection:self.lastDirection,
				// animationSkip:self.animationSkip							
			}	
		}

		Player.list[self.id] = self;
		initPack.player.push(self.getInitPack());
		return self;


	}


	///////

	function speedUp(player){
		// player.maxSpd *= 2;
		player.movementTic = 4;
		player.maxSpd = 16

		setTimeout(function(){
			player.speedDown = true;
			// player.maxSpd /= 2;
		}, 5000)
	}
	Player.list = {};
	Player.onConnect = function(socket){
		var map = 'field';
		// if(Math.random() < 0.5)
		// 	map = 'forest';
		var player = Player({
			id:socket.id,
			map:map,
		});

		// var wtf = Tile.getAllInitPack();

		socket.emit('init',{
			player:Player.getAllInitPack(),
			// tile: wtf,
			
		});

		socket.on('disconnect', function(){
			delete Player.list[socket.id];
			removePack.player.push(socket.id);
		});

		socket.on('resetThisGame', function(data, callback){

			resetTheGame();

			// socket.emit('serverIsReset');
			// callback();

			// callback('rest', {asdf:'asd2 2 2', hej:'Hejhop'});

		});

		socket.on('enemyMove', function(data){
			console.log()
			if(enemyMove === false){
				enemyMove = true;
			} else{
				enemyMove = false;
			}
		});

		socket.on('keyPress',function(data){
			if(data.inputId === 'left')
				player.pressingLeft = data.state;
			else if(data.inputId === 'right')
				player.pressingRight = data.state;
			else if(data.inputId === 'up')
				player.pressingUp = data.state;
			else if(data.inputId === 'down')
				player.pressingDown = data.state;
			else if(data.inputId === 'mouseAngle')
				player.mouseAngle = data.state;		
			else if(data.inputId === 'attack')
				player.pressingAttack = data.state;
			else if(data.inputId === 'bomb')
				player.dropBomb = data.state;

		});
		socket.on('pan', function(data){
			if(data.additionalEvent === 'panleft'){
				player.pressingLeft = true;
				player.pressingRight = false;
				player.pressingDown = false;
				player.pressingUp = false;				
			} else if(data.additionalEvent === 'pandown'){
				player.pressingDown = true;
				player.pressingRight = false;
				player.pressingLeft = false;
				player.pressingUp = false;	
			} else if(data.additionalEvent === 'panup'){
				player.pressingUp = true;
				player.pressingRight = false;
				player.pressingDown = false;
				player.pressingLeft = false;	
			} else if(data.additionalEvent === 'panright'){
				player.pressingRight = true;
				player.pressingLeft = false;
				player.pressingDown = false;
				player.pressingUp = false;	
			}
		});

		socket.on('doubletap', function(data){
			player.dropBomb = true;
			// console.log('doubletap');
		});


		socket.on('touchstart',function(data){

			//offset
		    data.touchX -= 13;
		    data.touchY -= 9;

		    player.touchAnchorX = data.touchX;
		    player.touchAnchorY = data.touchY;


		});
		socket.on('touchend', function(data){
				player.pressingDown = false;
				player.pressingRight = false;
				player.pressingLeft = false;
				player.pressingUp = false;

				player.touch = false;

				player.dropBomb = data.dropBomb


				console.log('touchend');
		});
		socket.on('touchmove', function(data){
		    data.touchX -= 13;
		    data.touchY -= 9;

			player.touchX = data.touchX;
			player.TY = data.touchY;

			player.moveBomb = data.move;

			// console.log('player y ' + player.TY + '  data y ' + data.touchY)

			player.touch = true;
		});


	}


	Player.getAllInitPack = function(){
		var players = [];
		for(var i in Player.list)
			players.push(Player.list[i].getInitPack());
		return players;
	}

	Player.onDisconnect = function(socket){
		delete Player.list[socket.id];
		removePack.player.push(socket.id);
	}
	Player.update = function(){
		var pack = [];
		for(var i in Player.list){
			var player = Player.list[i];
			player.update();
			pack.push(player.getUpdatePack());		
		}
		return pack;
	}
	Player.died = function(player){
			player.gridX = -6;
			player.gridY = -6;
			player.x = -666;
			player.y = -666;
			player.hp = player.hpMax;
			player.explodeLength = 1;
			player.amountBombsAllowed = 1;
			player.died = true;
			player.dropBomb = false;

			var stillAlive = 0;


			for(var i in Player.list){

				var p = Player.list[i];
				if(p.died === false){
					stillAlive += 1;
					// console.log(i + ' still alive');
				}
									// console.log(i + ' what is I Alive');

			}
			
			if(stillAlive <= 0){
				resetTheGame();
			}


			// setTimeout(function() {
			// 	player.dropBomb = false;
			// 	player.gridX = 1;
			// 	player.gridY = 1;
			// 	player.x = 96;
			// 	player.y = 96;
			// 	player.hp = player.hpMax;
			// 	player.died = false;
			// }, 2000);



			

		}

	function resetTheGame(){
		for(var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i];
			socket.emit('removeStageChild');
		}
		

		for(var i in Bomb.list){
			var b =  Bomb.list[i];

			GAME_LIST[theGame.id].map.array2D[b.gridY][b.gridX] = 0;
			clearTimeout(b.explodeFunc);

			delete Bomb.list[b.id];
			removePack.bomb.push(b.id);
		}

		for(var i in Player.list){
			var p =  Player.list[i];
			p.bombs = [];
			p.dropBomb = false;
			p.died = false;
			// delete Player.list[p];
			removePack.player.push(p.id);
			p.x = 96;
			p.y = 96;
			initPack.player.push(p.id);	
		}

		for(var i in Enemy.list){

			var e =  Enemy.list[i];
			console.log('remove ' +  e.id);
			delete Enemy.list[e.id];
			removePack.enemy.push(e.id);	
		}



		for(var i in PowerUp.list){
			var pu =  PowerUp.list[i];
			delete PowerUp.list[pu.id];
			removePack.powerUp.push(pu.id);	
		}
		for(var i in Tile.list){
			var t =  Tile.list[i];
			delete Tile.list[t.id];
			removePack.powerUp.push(t.id);	
		}		

		GAME_LIST[theGame.id].map.transformArray();
		initMap();

				Enemy({gridX:10, gridY:7});
				Enemy({gridX:7, gridY:7});
				Enemy({gridX:4, gridY:5});
				Enemy({gridX:4, gridY:3});

		console.log('server reset');


		for(var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i];
			socket.emit('serverIsReset');
		}		
	}
	function checkImpact(data){


		if (data.y > 0 && data.y < 12 && data.x > 0 && data.x < 12) {
			var mapGrid = GAME_LIST[theGame.id].map.array2D[data.y][data.x];

			if (data.hit || mapGrid === 1) {
				data.hit = true;
			} else if(mapGrid === 2){
				data.removeBlock = true;
				data.hit = true;
				changeMap(data);
			} else if(mapGrid === 10){
				data.powerUp = 'bombUp';
				data.removeBlock = true;
				data.hit = true;
				changeMap(data);
			} else if(mapGrid === 11){
				data.powerUp = 'amountUp';
				data.removeBlock = true;
				data.hit = true;
				changeMap(data);			
			} else if(mapGrid === 12){
				data.powerUp = 'speedUp';
				data.removeBlock = true;
				data.hit = true;
				changeMap(data);			
			}

			if(!data.hit){
				timedExplotion(data);	
			}

			return(data.hit);
		}
	}

	var destroy = function(x, y, explodeLength){
		var gridX = Math.floor((x + explotionOffSetX) / TILE_SIZE);
		var gridY = Math.floor((y + explotionOffSetY) / TILE_SIZE);

		var cord = [];
		var timer = 0;

		Explotion({x:gridX, y:gridY});

		timer = 100;



		var rightHit = false;
		var leftHit = false;
		var upHit = false;
		var bottomHit = false;

		// console.log('destroy ' + explodeLength);

		var right = {x:(gridX + i), y:gridY, timer:timer*i, removeBlock:false, hit: false,};
		var down = {x:gridX, y:(gridY + i), timer:timer*i, removeBlock:false, hit: false,};
		var up = {x:gridX, y:(gridY - i), timer:timer*i, removeBlock:false, hit: false,};
		var left = {x:(gridX - i), y:gridY, timer:timer*i, removeBlock:false, hit: false,};	



		for (var i = 1; i < (explodeLength + 1); i++) {
			if(!rightHit)
			rightHit = checkImpact({x:(gridX + i), y:gridY, timer:timer*i, removeBlock:false, hit: false,});
			if(!bottomHit)
			bottomHit = checkImpact({x:gridX, y:(gridY + i), timer:timer*i, removeBlock:false, hit: false,});
			if(!upHit)
			upHit = checkImpact({x:gridX, y:(gridY - i), timer:timer*i, removeBlock:false, hit: false,});
			if(!leftHit)
			leftHit = checkImpact({x:(gridX - i), y:gridY, timer:timer*i, removeBlock:false, hit: false,});	
		}
	}
	function changeMap(data){
		// GAME_LIST[theGame.id].map.array2D[data.y][data.x] = 0;
		setTimeout(function(){
		var count = 0
			for(var i in Tile.list) {
				count+=1;
				var t = Tile.list[i];
				if(t.gridX === data.x && t.gridY === data.y){

					if(data.powerUp){
						PowerUp({gridX:t.gridX, gridY:t.gridY, type:data.powerUp})
					}

					GAME_LIST[theGame.id].map.array2D[data.y][data.x] = 0;
					console.log('remove tile' + theGame.id);
					delete Tile.list[i];
					removePack.tile.push(t.id);				
				}
			}

		console.log(count +  ' after remove, changemap');
		}, data.timer);



	}

	function timedExplotion(data){
		// setTimeout(function(){
			Explotion(data);
		// }, data.timer);
	}
	var PowerUp = function(param){
		var self = Entity(param);

		self.gridX = param.gridX;
		self.gridY = param.gridY;
		self.id = Math.random();
		self.type = param.type;
		self.burnTime = 10000;
		self.toRemove = false;

		setTimeout(function() {
			delete PowerUp.list[self];
			removePack.powerUp.push(self.id);
		}, self.burnTime);

		self.getInitPack = function(){
			return {
				id:self.id,
				gridX:self.gridX,
				gridY:self.gridY,
				type:self.type,
			};
		}	

		PowerUp.list[self.id] = self;
		initPack.powerUp.push(self.getInitPack());
		return self;
	}
	PowerUp.list = {};

	PowerUp.getAllInitPack = function(){
		var powerUps = [];
		for(var i in PowerUp.list){
			powerUps.push(PowerUp.list[i].getInitPack());
		}
		return powerUps;
	}

	var Explotion = function(param){
		var self = Entity(param);

		self.gridX = param.x;
		self.gridY = param.y;
		self.id = Math.random();
		self.toRemove;
		self.burnTime = 400;
		self.removeBlock = param.removeBlock;
		self.width = 64;
		self.height = 64;

		var anyLeft = 0;

		// self.timer = param.timer;
		// self.explosionCords = destroy(self.x, self.y, param.explodeLength);
		// Math.floor()

			for(var i in Player.list){
				var player = Player.list[i];

				if (player.gridX === self.gridX && player.gridY === self.gridY) {
									// console.log('hit  player  ' + player.gridX + ' ' + self.gridX);

					// player.hp -= 10;
					// if(player.hp <= 0){
						Player.died(player);
						anyLeft -= 1;

					// }
				}	
			}

								// console.log(' SELF   ' + self.gridX + ' ' + self.gridY);
		// var exp = {x:self.gridX*TILE_SIZE,y:self.gridY*TILE_SIZE, width:self.width, height:self.height};
			for(var i in Enemy.list){
				var enemy = Enemy.list[i];

								// console.log('miss  ENEMY   ' + enemy.gridX + ' ' + enemy.gridY);

				var gridX = Math.floor((enemy.x) / TILE_SIZE);
				var gridY = Math.floor((enemy.y) / TILE_SIZE);

				if (gridX === self.gridX && gridY === self.gridY) {
					// console.log('hit  ENEMY  ' + enemy.gridX + ' ' + self.gridX);
					enemy.dead = true;
					enemy.x = 0;
					enemy.y = 0;
					delete Enemy.list[enemy];
					removePack.enemy.push(enemy.id);

				} else{
					 // console.log(enemy.x + ' ' + self.gridX);
				}
			}



		// self.died = function(player){
		// 	player.gridX = -6;
		// 	player.gridY = -6;
		// 	player.x = -666;
		// 	player.y = -666;
		// 	player.hp = player.hpMax;
		// 	player.explodeLength = 1;
		// 	player.amountBombsAllowed = 1;
		// 	player.died = true;

		// 	setTimeout(function() {
		// 		player.gridX = 1;
		// 		player.gridY = 1;
		// 		player.x = 70;
		// 		player.y = 70;
		// 		player.hp = player.hpMax;
		// 		player.died = false;
		// 	}, 2000);
		// }


		self.explodeFunc = setTimeout(function() { 	
			self.toRemove = true;
		}, self.burnTime);

		self.getInitPack = function(){
			return {
				id:self.id,
				gridX:self.gridX,
				gridY:self.gridY,
				removeBlock:self.removeBlock,
			};
		}
		self.getUpdatePack = function(){
					return {
				id:self.id,
				x:self.x,
				y:self.y,
			}	
		}
		var anyLeft = 0;

		for(var i in Player.list){
			var p =  Player.list[i];
			console.log(i + ' asdf ' + p.died);
			if(p.died === false)
				anyLeft+=1;
		}

		console.log('player left ' + anyLeft);
		if(anyLeft > 0){
			initPack.explotion.push(self.getInitPack());
		}
		Explotion.list[self.id] = self;
		return self;

	}
	Explotion.list = {};

	Explotion.update = function(){
		var pack = [];
		for(var i in Explotion.list){
			var explotion = Explotion.list[i];
			// bomb.update();
			if(explotion.toRemove){
				delete Explotion.list[i];
				removePack.explotion.push(explotion.id);
			}
			pack.push(explotion.getUpdatePack());		
		}
		return pack;
	}

	var Bomb = function(param){
		var self = Entity(param);

		self.id = Math.random();
		self.parentId = param.parent.id;

		self.toRemove;
		self.fuse = 3000;
		self.explode = false;
		self.explodeLength = param.explodeLength;
		self.parent = param.parent;


		self.gridX = Math.floor(self.x / TILE_SIZE);
		self.gridY = Math.floor(self.y / TILE_SIZE);

		self.x = self.gridX	* TILE_SIZE + 16;
		self.y = self.gridY * TILE_SIZE + 16;


		GAME_LIST[theGame.id].map.array2D[self.gridY][self.gridX] = self.parentId;


		self.parentCantWalk = function(){
			// console.log('parent walk');
			GAME_LIST[theGame.id].map.array2D[self.gridY][self.gridX] = 66;
		}

		self.explodeFunc = setTimeout(function() { 
			self.toRemove = true;
			delete self.parent.bombs[self];
			destroy(
						self.x,
						self.y,
						self.explodeLength
						);
			GAME_LIST[theGame.id].map.array2D[self.gridY][self.gridX] = 0;
		}, self.fuse);



		self.getInitPack = function(){
			return {
				id:self.id,
				x:self.x,
				y:self.y,
				fuse:self.fuse,
			};
		}

		self.getUpdatePack = function(){
					return {
				id:self.id,
				x:self.x,
				y:self.y,
				explode:self.explode,
			}	
		}


		Bomb.list[self.id] = self;
		initPack.bomb.push(self.getInitPack());
		return self;
	}
	Bomb.list = {};

	Bomb.update = function(){
		var pack = [];
		for(var i in Bomb.list){
			var bomb = Bomb.list[i];
			// bomb.update();
			if(bomb.toRemove){
				delete Bomb.list[i];
				removePack.bomb.push(bomb.id);
			}
			pack.push(bomb.getUpdatePack());		
		}
		return pack;
	}

	var Tile = function(param){
		var self = {};
		self.id = Math.random();
		self.gridX = param.gridX;
		self.gridY = param.gridY;
		self.type = param.type;
		self.toRemove = false;

		self.getInitPack = function(){
			return {
				id:self.id,
				gridX:self.gridX,
				gridY:self.gridY,	
				type:self.type,
			};		
		}

		Tile.list[self.id] = self;
		initPack.tile.push(self.getInitPack());
		return self;
	}
	Tile.list = {};

	Tile.getAllInitPack = function(){
		var counts = 0;
		var tiles = [];
		for(var i in Tile.list){
			counts+=1;
			tiles.push(Tile.list[i].getInitPack());
		}
		return tiles;
	}

	var DEBUG = true;

	var isValidPassword = function(data,cb){
		return cb(true);
		/*db.account.find({username:data.username,password:data.password},function(err,res){
			if(res.length > 0)
				cb(true);
			else
				cb(false);
		});*/
	}
	var isUsernameTaken = function(data,cb){
		return cb(false);
		/*db.account.find({username:data.username},function(err,res){
			if(res.length > 0)
				cb(true);
			else
				cb(false);
		});*/
	}
	var addUser = function(data,cb){
		return cb();
		/*db.account.insert({username:data.username,password:data.password},function(err){
			cb();
		});*/
	}

	var SOCKET_LIST = {};

		var amount = 0;

		for(var i in theGame.players){
			// i is socket ID, same as in socket_list+

			console.log('starrt game ' + amount + '  '  + i);
			var tempSocket = GLOBAL_SOCKETS[i];
			tempSocket.gameID = theGame.id;
			SOCKET_LIST[i] = tempSocket;
			tempSocket.emit('startTheGame');

			Player.onConnect(tempSocket);

			console.log(i);
		}	


	function initMap() {
		for (var i = 0; i < GAME_LIST[theGame.id].map.array2D[0].length; i++) {
			for (var j = 0; j < GAME_LIST[theGame.id].map.array2D.length; j++) {
				if (GAME_LIST[theGame.id].map.array2D[i][j] === 1) {
					Tile({gridX:j, gridY:i, type:1,});
				} else if(GAME_LIST[theGame.id].map.array2D[i][j] === 2){
					Tile({gridX:j, gridY:i, type:2,});
				} else if(GAME_LIST[theGame.id].map.array2D[i][j] === 10){
					Tile({gridX:j, gridY:i, type:10,});
				} else if(GAME_LIST[theGame.id].map.array2D[i][j] === 11) {
					Tile({gridX:j, gridY:i, type:10,});				
				} else if(GAME_LIST[theGame.id].map.array2D[i][j] === 12) {
					Tile({gridX:j, gridY:i, type:10,});				
				} 

				
			}
		}
	}

	GAME_LIST[theGame.id].map.transformArray();
	initMap();

	Enemy({gridX:10, gridY:7});
	Enemy({gridX:7, gridY:7});
	Enemy({gridX:4, gridY:5});
	Enemy({gridX:4, gridY:3});



	setInterval(function(){


		// console.log(Date.now());
		var pack = {
			player:Player.update(),
			bomb:Bomb.update(),
			explotion:Explotion.update(),
			tile:Tile.getAllInitPack(),
			enemy:Enemy.update(),
			array2D:GAME_LIST[theGame.id].map.array2D,
		}


		
		for(var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i];
			socket.emit('init',initPack);
			socket.emit('update',pack);
			socket.emit('remove',removePack);
		}
		initPack.player = [];
		initPack.bomb = [];
		initPack.explotion = [];
		initPack.tile = [];
		initPack.powerUp = [];
		initPack.enemy = [];

		removePack.player = [];
		removePack.bomb = [];
		removePack.explotion = [];
		removePack.tile = [];
		removePack.powerUp = [];
		removePack.enemy = [];
		
	},1000/25);	


	


return	self;
}





























var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();

	GLOBAL_SOCKETS[socket.id] = socket;
	// console.log(socket);

	// socket.on('signIn',function(data){
	// 	isValidPassword(data,function(res){
	// 		if(res){
	// 			// socket.emit('map', {GAME_LIST[theGame.id].map.array2D: GAME_LIST[theGame.id].map.array2D});
	// 			// startGame();
	// 			Player.onConnect(socket);

	// 			socket.emit('signInResponse',{success:true});
	// 		} else {
	// 			socket.emit('signInResponse',{success:false});			
	// 		}
	// 	});
	// });
	// socket.on('signUp',function(data){
	// 	isUsernameTaken(data,function(res){
	// 		if(res){
	// 			socket.emit('signUpResponse',{success:false});		
	// 		} else {
	// 			addUser(data,function(){
	// 				socket.emit('signUpResponse',{success:true});					
	// 			});
	// 		}
	// 	});		
	// });
	
	




	// socket.on('sendMsgToServer',function(data){
	// 	var playerName = ("" + socket.id).slice(2,7);
	// 	for(var i in SOCKET_LIST){
	// 		SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
	// 	}
	// });
	
	// socket.on('evalServer',function(data){
	// 	if(!DEBUG)
	// 		return;
	// 	var res = eval(data);
	// 	socket.emit('evalAnswer',res);		
	// });

	socket.on('createGame', function(data){


		// var creater = socket;
					// console.log(creater.id);

		var players = {};
		var GAME_SOCKETS ={};

		// GAME_SOCKETS[socket.id] = socket;


		var player = {id:socket.id, name:'albert'};
		// player[socket.id] = socket;

		players[socket.id] = player;

		var ranID = Math.random();

		var newGame = {gameName:numberName,id:ranID, players:players, map:{}};
		numberName +=1;
		GAME_LIST[newGame.id] = newGame;

		// socket.emit('addgameToList', newGame);
		
		for(var i in GLOBAL_SOCKETS){
			GLOBAL_SOCKETS[i].emit('addgameToList',newGame);

		}			

	});

	socket.on('joinGame', function(data){

		var player = {id:socket.id, name:data.playerName};
		// player[socket.id] = socket;		

		GAME_LIST[data.gameId].players[player.id] = player;
		// GAME_LIST[data.gameId].GAME_SOCKETS[socket.id] =

	});

	socket.on('startGame', function(data){

		console.log('starting game ' + data.gameId);

		// var game = GAME_LIST[data.gameId];

		STARTED_GAMES[data.gameId] = StartGame(GAME_LIST[data.gameId]);
		console.log(STARTED_GAMES[data.gameId] + 'started games');
		for(var i in GAME_LIST){
			// i is socket ID, same as in socket_list
			console.log(i);
		}			
	});
});




