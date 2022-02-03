var canvas, player, mountain, gun, bullet;
var ground, lowerGround, cloud, coin, sun;
var bird, bin, restartBtn, amazing, unmute_Btn;
var mute_Btn,pipe;

var pipeImg, lavaImg, cloudImg, birdImg, bin_img;
var bk_img, player_img, groundImg, groundImg1, amazingImg;

var pipeGroup, coinGroup, cloudGroup, birdGroup;
var coinGroup1, binGroup;

var jump_sound, amazingSound, background_music;
var score = 0;
var sound1=50;

var PLAY = 0;
var END = 1;
var gameState = PLAY;

function preload() {
    bk_img = loadImage("./images/background11.png");
    player_img = loadImage("./images/player_image.png");
    cloudImg = loadImage("./images/cloud.png");
    pipeImg = loadImage("./images/pipe.png");
    lavaImg = loadImage("./images/lava.png");
    coinImg = loadImage("./images/coin.png");
    groundImg = loadImage("./images/ground.jpg");
    groundImg1 = loadImage("./images/ground1.jpg");
    birdImg = loadImage("./images/bird.png");
    bin_img = loadImage("./images/bin.png");
    amazingImg = loadImage("./images/amazing_img.png")

    jump_sound = loadSound("./sounds/jump.mp3");
    amazingSound = loadSound("./sounds/amazing.mp3");
    background_music = loadSound("./sounds/backgroundMusic.mp3");
}

function setup() {
    canvas = createCanvas(windowWidth-20, windowHeight);

    background_music.play();
    background_music.setVolume(0.5);

    pipeGroup = createGroup();
    coinGroup = createGroup();
    coinGroup1 = createGroup();
    cloudGroup = createGroup();
    birdGroup = createGroup();
    binGroup = createGroup();

    player = createSprite(windowWidth / 5 - 100, windowHeight - 330, 20, 50);
    player.addImage(player_img);
    player.scale = 0.06;
    player.setCollider("rectangle", 50, -50, player.width - 650, player.height - 10);
    // player.debug = true;

    ground = createSprite(width - 600, height - 60, windowWidth + 600, 20);
    ground.addImage(groundImg1);

    lowerGround = createSprite(width - 600, height - 20, windowWidth + 600, 20);
    lowerGround.addImage(groundImg);

    amazing = createSprite(windowWidth / 2, windowHeight / 3)
    amazing.addImage(amazingImg);
    amazing.scale = 0.2;
    amazing.visible = false;

    unmute_Btn = createImg("./images/unmute1.png");
    unmute_Btn.position(windowWidth - 70, 10);
    unmute_Btn.size(40, 40);
    unmute_Btn.mouseClicked(mute);
}

function draw() {
    background(bk_img);

    if (gameState === PLAY) {
        //Giving velocity to the ground
        ground.velocityX = -5;
        lowerGround.velocityX = -5

        //Key movements
        if (keyDown("space") && player.y >= 580) {
            player.velocityY = -12;
            jump_sound.play();
        }

        player.velocityY += 2.5;

        //Infinite ground
        if (ground.x < 500) {
            ground.x = ground.width / 2;
        }

        if (lowerGround.x < 500) {
            lowerGround.x = lowerGround.width / 2;
        }

        player.collide(ground);
        player.collide(pipeGroup);

        spawnClouds();
        creatingPipesAndCoins();

        //collision between player and obstacles
        if (pipeGroup.isTouching(player)) {
            pipeGroup.setVelocityXEach(0);
            cloudGroup.setVelocityXEach(0);
            coinGroup.setVelocityXEach(0);
            coinGroup1.setVelocityXEach(0);
            gameState = END;
            restart();
        }

        if (coinGroup.isTouching(player) || coinGroup1.isTouching(player)) {
            score = score + Math.round(getFrameRate() / 40);
        }

        if (score >= 150) {
            phase2();
            pipeGroup.destroyEach();
            coinGroup.destroyEach();
        }

        if (score % 100 === 0 && score >= 100) {
            amazingSound.play();
            amazingSound.setVolume(150);

            amazing.visible = true;
        }
        else {
            amazing.visible = false;
        }

        if(score%10>=0){
            pipeGroup.setVelocityXEach ( -(10 + 3* score/40) )
            coinGroup.setVelocityXEach ( -(10 + 3* score/40) )
            coinGroup1.setVelocityXEach ( -(10 + 3* score/40) )
        }
    }
    if (gameState === END) {
        ground.velocityX = 0;
        lowerGround.velocityX = 0;
    }

    //Text score
    textSize(30);
    fill("red");
    text("Score:" + score, 30, 30);

    drawSprites();
}

function spawnClouds() {
    if (frameCount % 130 === 0) {
        cloud = createSprite(windowWidth + 30, 100, 100, 50);
        cloud.addImage(cloudImg);
        cloud.velocityX = -5;
        cloud.scale = 0.2;
        cloud.y = Math.round(random(50, 200));
        cloudGroup.add(cloud);
    }

}

function creatingPipesAndCoins() {
    if (frameCount % 80 === 0) {
        pipe = createSprite(windowWidth, height - 100, 30, 100);
        pipe.addImage(pipeImg);
        pipe.scale = 0.15;
        pipe.velocityX = -8;
        pipe.setCollider("rectangle", -10, 0, pipe.width - 280, pipe.height - 50);
        pipeGroup.add(pipe);
        console.log(pipe.velocityX);

        coin = createSprite(windowWidth, windowHeight - 160, 30, 30);
        coin.addImage(coinImg);
        coin.scale = 0.06;
        coin.velocityX = -8;
        coinGroup.add(coin);
    }

    if (frameCount % 111 === 0) {
        coin1 = createSprite(width, windowHeight - 100, 30, 30);
        coin1.addImage(coinImg);
        coin1.scale = 0.06;
        coin1.velocityX = -8;
        coinGroup1.add(coin1);
    }
}

function phase2() {
    if (frameCount % 150 === 0) {
        bird = createSprite(windowWidth + 20, windowHeight - 120);
        bird.addImage(birdImg);
        bird.scale = 0.08;
        bird.velocityX = -11;
        bird.y = Math.round(random(windowHeight - 120, windowHeight - 160));
        bird.setCollider("rectangle", 0, 50, bird.width - 350, bird.height - 80);
        birdGroup.add(bird);

        bin = createSprite(windowWidth + 450, windowHeight - 100);
        bin.addImage(bin_img);
        bin.scale = 0.4;
        bin.velocityX = -11;
        binGroup.add(bin);
        bin.setCollider("rectangle", 0, 50, bin.width - 100, bin.height - 80);
        // bin.debug = true;
    }

    player.collide(birdGroup);
    player.collide(binGroup);

    if (player.isTouching(birdGroup) || player.isTouching(binGroup)) {
        gameState = END;
        birdGroup.setVelocityXEach(0);
        coinGroup1.setVelocityXEach(0);
        binGroup.setVelocityXEach(0);
        cloudGroup.setVelocityXEach(0);
        restart();
    }

}

function restart() {
    swal({
        title: "Game Over",
        text: "Your Score Is :" + score,
        imageUrl: "https://toppng.com/uploads/preview/cartoon-game-characters-11549893427ws4wn4t2sc.png",
        imageSize: "100x100",
        confirmButtonText: "restart"
    },

        function (isConfirm) {
            if (isConfirm) {
                location.reload();
            }
        }
    );
}

function mute(){

    if(background_music.isPlaying()){
        background_music.stop();
    }
    else{
        background_music.play();
    }

}
