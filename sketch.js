//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bot, botRunning, botCollided
var ground, groundImage
var invisibleGround

var GrassGroup, grass1, grass2, grass3, grass4
var CandyGroup, candyImage
var RocksGroup, rock1, rock2, rock3

var gameOver, gameOverImage
var restart, restartImage

var score = 0;

var checkPoint
var jump
var die

function preload() {
  botRunning = loadAnimation("bot_run.jpg", "bot_collided.jpg");
  botCollided = loadImage("bot_collided.jpg");
  groundImage = loadImage("ground.jpg");
  candyImage = loadImage("lollipop.jpg");
  grass1 = loadImage("grass1.jpg");
  grass2 = loadImage("grass2.jpg");
  grass3 = loadImage("grass3.jpg");
  grass4 = loadImage("grass4.jpg");
  rock1 = loadImage("rock1.jpg");
  rock2 = loadImage("rock2.jpg");
  rock3 = loadImage("rock3.jpg");
  gameOverImage = loadImage("gameOver.jpg");
  restartImage = loadImage("restart.jpg");
  checkPoint = loadSound('checkPoint.mp3');
  jump = loadSound('jump.mp3');
  die = loadSound('die.mp3');
}

function setup() {
  
  createCanvas(400, 400);
  
  //create a bot sprite
    bot = createSprite(50,350,20,50);
    bot.addAnimation("running", botRunning);
    bot.addAnimation("collided", botCollided);
  
  //scale and position the bot  
    bot.scale = 0.6;

  //set collision radius for the bot
    bot.setCollider("rectangle",0,0,50, bot.height);
    bot.debug = true;

//create a ground sprite
  ground = createSprite(200,380,400,20);
  ground.addImage("ground2", groundImage);
  ground.x = ground.width /2;

//invisible Ground to support bot
  invisibleGround = createSprite(200,385,400,5);
  invisibleGround.visible = false;

//place gameOver and restart icon on the screen
  gameOver = createSprite(200,300);
  restart = createSprite(200,340);

  gameOver.addImage("game over.jpg");
  gameOver.scale = 0.5;
  restart.addImage("restart.jpg");
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  //create Grass , Rock and Candy Groups
    GrassGroup = new Group();
    RocksGroup = new Group();
    CandyGroup = new Group();
  
  //set text
    textSize(20);
    textFont("Georgia");
    //textStyle(BOLD);

}

function draw() {
  background(220);
  
  //display score
  text("Score: "+ score, 250, 100);
  
  //console.log(gameState);
  
  if(gameState === PLAY){
    
    if (score > 0 && score % 100 === 0){
      checkPoint.play();
    }
    
    //move the ground
    ground.velocityX = -(6 + score/100);
    
    //scoring
    score = score + Math.round(World.frameRate/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && bot.y >= 332){
       bot.velocityY = -16 ;
       jump.play();
      
      //change the bot animation
        bot.changeAnimation("collided", botCollided);
    }
    else {
      
      //change the bot animation
        bot.changeAnimation("runnning", botRunning);
    }
    
    //change the bot animation when in air
    if(bot.y <= 329){
      
      //change the bot animation
        bot.changeAnimation("collided", botCollided);
    }
    else if(bot.y >= 329){
      
      //change the bot animation
        bot.changeAnimation("runnning", botRunning);
    }
    
    //add gravity
    bot.velocityY = bot.velocityY + 0.8;
    
    //spawn the rocks
    spawnRocks();
  
    //spawn the candies
    spawnCandy();
  
    //spawn grass
    spawnGrass();
    
    //End the game when bot is touching a rock
    if(RocksGroup.isTouching(bot)){
      gameState = END;
      die.play();
    }
  }
  
  else if(gameState === END) {
    
    //reset the bot to its original place
    //bot.x = 50;
    //bot.y = 350;
    
    //change the bot animation
    bot.changeAnimation("bot_collided");
    
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    bot.velocityY = 0;
    GrassGroup.setVelocityXEach(0);
    RocksGroup.setVelocityXEach(0);
    CandyGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    GrassGroup.setLifetimeEach(-1);
    CandyGroup.setLifetimeEach(-1);
    RocksGroup.setLifetimeEach(-1);
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  console.log(bot.y);
  
  //stop bot from falling down
  bot.collide(invisibleGround);
  
  drawSprite();
}

function reset(){
  
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  GrassGroup.destroyEach();
  RocksGroup.destroyEach();
  CandyGroup.destroyEach();
  
  acore = 0;
  
  //change the bot animation
    bot.changeAnimation("bot_run");
}

function spawnCandy() {
  //write code here to spawn the candy
  if (frameCount % 70 === 0) {
    var candy = createSprite(400,randomNumber(150,250),40,10);
    candy.addAnimation("lollipop");
    candy.scale = 0.5;
    candy.velocityX = -3;
    
    //assign lifetime to the variable
    candy.lifetime = 134;
    
    //adjust the depth
    candy.depth = bot.depth;
    bot.depth = bot.depth + 1;
    
    //candy.debug = true;
    
    //add each candy to the group
    CandyGroup.add(candy);
  }
}

function spawnGrass() {
  if(frameCount % 50 === 0) {
    var grass = createSprite(400,350,10,40);
    grass.velocityX = -6;
    
    //generate random grass
    var rand = randomNumber(1,4);
    grass.setAnimation("grass" + rand);
    
    //assign scale and lifetime to the grass           
    grass.scale = 0.5;
    grass.lifetime = 70;
    
    //adjust the depth
    grass.depth = bot.depth;
    bot.depth = bot.depth + 1;
    
    //add each grass to the group
    GrassGroup.add(grass);
  }
}

function spawnRocks() {
  if(frameCount % 110 === 0) {
    var rock = createSprite(400,350,10,40);
    rock.velocityX = -6;
    
    //generate random grass
    var rand = randomNumber(1,3);
    rock.setAnimation("rock" + rand);
    
    //assign scale and lifetime to the grass           
    rock.scale = 0.5;
    rock.lifetime = 70;
    
    //adjust the depth
    rock.depth = bot.depth;
    bot.depth = bot.depth + 1;
    
    rock.setCollider("rectangle",0,0,90,50);
    rock.debug = true;
    
    //add each rock to the group
    RocksGroup.add(rock);
  }
}
