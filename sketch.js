
var trex ,trex_running;
var edges;
var ground; 
var invisibleGround;
var groundImage;
var rand;
var cloud;
var cloudImage;
var obstacle, obstacle1, obstacle2,obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var obstaclesGroup, cloudsGroup;
var END = 0;
var PLAY = 1;
var gameState = PLAY;
var trex_collided;
var gameoverimg, restartimg,gameover, restart;
var jupSound, checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation ( "trex1.png"  ,"trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage ("obstacle1.png");
  obstacle2 = loadImage ("obstacle2.png");
  obstacle3 = loadImage ("obstacle3.png");
  obstacle4 = loadImage ("obstacle4.png");
  obstacle5 = loadImage ("obstacle5.png");
  obstacle6 = loadImage ("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameoverimg = loadImage ("gameOver.png");
  restartimg = loadImage ("restart.png");
  jumpSound = loadSound ("jump.mp3");
  dieSound = loadSound ("die.mp3");
  checkPointSound = loadSound ("checkpoint.mp3");
}

function setup(){
  //createCanvas(600,200);
  createCanvas(windowWidth,windowHeight);

  edges = createEdgeSprites();
  //crear sprite del t-rex.
 trex = createSprite(50,height-70,20,50);
 trex.addAnimation("running",trex_running);
 trex.addAnimation("collided",trex_collided);
 trex.setCollider("circle",0,0,45);
 //trex.setCollider("rectangle",0,0,400,trex.height)
 trex.debug = false
  //escala del t-rex
 trex.scale = 0.5
 trex.x = 50

 //crear suelo 
 ground = createSprite(width/2,height-80,width,20)
 ground.addImage("ground", groundImage)

 // crear un suelo invisible
 invisibleGround = createSprite (width/2,height-10,width,125)
 invisibleGround.visible = false

 obstaclesGroup = new Group()
 cloudsGroup = new Group()

 //rand = Math.round (random(1,100));
 //console.log(frameCount);

 //spritaa pa gameaover
 gameover = createSprite(width/2,height/2-50)
 gameover.addImage (gameoverimg)
 gameover.scale = 0.5

 //spritaa pa restarta
 restart = createSprite (width/2,height/2)
 restart.addImage (restartimg)
 restart.scale = 0.5 
}

function draw(){
  background("white")
  if (mousePressedOver(restart)){
    console.log ("reinicio del juego")
    reset()
  }

  fill ("black")
  text ("Score:" + score, width/2, 50)
  //console.log("este estado es " + gameState)

  if(gameState == PLAY){
    //esconder los spritas de game over y restart 
    gameover.visible = false;
    restart.visible = false;

    // generacion del suelo 
    
    if(ground.x < 0){
      ground.x = ground.width/2
    }
    // Suelo en movimineto
    ground.velocityX = -(6 + score / 100)

     // salto del t-rex
     if((touches.length > 0 || keyDown("space")) && trex.y >= 60){
      trex.velocityY = -10;
      jumpSound.play();
      touches = [];
    }

     trex.velocityY = trex.velocityY + 0.5

     score = score + Math.round(getFrameRate() / 60)
     if(score > 0 && score % 100 == 0){
      checkPointSound.play()
     }
     spawnClouds ();
     spawnObstacles();
     // cambiar estado cuando te toquen 
     if (obstaclesGroup.isTouching(trex)){
      gameState = END
      dieSound.play()
      //trex.velocityY=-12
      //jumpSound.play
     }



  }else if (gameState == END){
    // "visibilizar" los spritas de game over y restart 
    gameover.visible = true 
    restart.visible = true


    ground.velocityX = 0
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    // cambia la animacion del t-rex cuando c muere
    trex.changeAnimation("collided",trex_collided)    

    //ponele un ciclo du vida a los obbgetos.png, parra de nunca sea destruidos, "los inmoricibles"
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    trex.velocityY = 0
   /*if (mousePressedOver(restart)){
    console.log("reinicio de juego")
   }*/
   if (touches.length > 0 || keyDown ("space")){
    reset()
    touches = []
   }
  }

  // console.log (framecount)
  //console.log (trex.y);

  trex.collide(invisibleGround)

  drawSprites()
}

function spawnClouds(){
  if(frameCount % 60 == 0){
  cloud = createSprite (width + 20,height,40,10)
  cloud.addImage(cloudImage)
  cloud.scale = 0.4 
  cloud.y = Math.round (random(10,60))
  cloud.velocityX = -3;

  // asignar un ciclo de vida
  cloud.lifetime = 1000;

  //ajustar la profundidad
  cloud.depth = trex.depth;
  trex.depth += 1;
  cloudsGroup.add (cloud);
  }
}

function spawnObstacles(){
  if (frameCount % 60 == 0){
    obstacle = createSprite (width+30,height-95,10,40)
    obstacle.velocityX = -(7 + score / 100)
    
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1: obstacle.addImage(obstacle1)
        break
      case 2: obstacle.addImage(obstacle2)
        break
      case 3: obstacle.addImage(obstacle3)
        break
      case 4: obstacle.addImage(obstacle4)
        break
      case 5: obstacle.addImage(obstacle5)
        break
      case 6: obstacle.addImage(obstacle6)
        break
      default:break
    }
    //asignar escala y tiwmpo de vida 
    obstacle.scale = 0.5;
    obstacle.lifetime = 450;
    //Grupo de obstaculos 
    obstaclesGroup.add(obstacle)
  }
}

//funcion para reiniciar el juego 
function reset(){
  gameState = PLAY
  gameover.visible = false 
  restart.visible = false
  score = 0 

  obstaclesGroup.destroyEach() 
  cloudsGroup.destroyEach()

  trex.changeAnimation("running", trex_running)
}
