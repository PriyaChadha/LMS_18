var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
 
var score=0;

var gameOver, restart;

localStorage['HighestScore'] = 0;

function preload(){
  trex_running =   loadAnimation("t1.png","t2.png","t3.png","t4.png");
  trex_collided = loadAnimation("c6.png");
  
  groundImage = loadImage("soil.png");
  bkgImg=loadImage("bkkg.png")
  cloudImage = loadImage("o1.png");
  
  obstacle1 = loadImage("o2.png");
  obstacle2 = loadImage("o3.png");
  obstacle3 = loadImage("o4.png");
  obstacle4 = loadImage("o5.png");
  obstacle5 = loadImage("o7.png");
  obstacle6 = loadImage("o7.png");
  
  gameOverImg = loadImage("govr.png");
  restartImg = loadImage("rstrt.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(80,height-70,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1.2;
  
  ground = createSprite(width/2,height+120,width,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /1.8;
  ground.depth=-1
  ground.scale=4.7
  ground.velocityX = -(1 + 3*score/100);
 
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.07;
  restart.scale = 0.05;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-30,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bkgImg);
  textSize(20)
  fill("black")
  text("Score: "+ score, width/2,150);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
 
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex) || cloudsGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.destroyEach();
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    trex.y=height-60
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var cloud = createSprite(width,180,10,40);
    cloud.y = Math.round(random(150,230));
    cloud.addImage(cloudImage);
    cloud.scale =1 ;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(width,height-40,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(2 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.81;
    obstacle.lifetime = width;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  //make the gameOver and restart non-visible
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
