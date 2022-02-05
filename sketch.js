var canvas, player, mountain, gun, bullet;
var ground, lowerGround, cloud, coin, sun;
var bird, bin, restartBtn, amazing, unmute_Btn;
var mute_Btn, pipe, instructions, pause, play;
var pauseElement, energySymbol, energyDrink,elementOfEnergy;

var pipeImg, lavaImg, cloudImg, birdImg, bin_img;
var bk_img, player_img, groundImg, groundImg1, amazingImg;
var energySymbol_img, energyDrink_img;

var pipeGroup, coinGroup, cloudGroup, birdGroup;
var coinGroup1, binGroup, energyGroup;

var jump_sound, amazingSound, background_music;
var score = 0;
var sound1 = 50;

var PLAY = 0;
var END = 1;
var gameState = PLAY;
var END1 = 2;
var playerEnergy = 300;

function preload() {
    bk_img = loadImage("./images/gameBackground.jpg");
    player_img = loadImage("./images/player_image.png");
    cloudImg = loadImage("./images/cloud.png");
    pipeImg = loadImage("./images/pipe.png");
    coinImg = loadImage("./images/coin.png");
    groundImg = loadImage("./images/ground.jpg");
    groundImg1 = loadImage("./images/ground1.jpg");
    birdImg = loadImage("./images/bird.png");
    bin_img = loadImage("./images/bin.png");
    amazingImg = loadImage("./images/amazing_img.png");
    energySymbol_img = loadImage("./images/energy.png");
    energyDrink_img = loadImage("./images/energyDrink.png");

    jump_sound = loadSound("./sounds/jump.mp3");
    background_music = loadSound("./sounds/backgroundMusic.mp3");
}

function setup() {
    canvas = createCanvas(windowWidth - 20, windowHeight);

    background_music.play();
    background_music.setVolume(0.5);

    pipeGroup = createGroup();
    coinGroup = createGroup();
    coinGroup1 = createGroup();
    cloudGroup = createGroup();
    birdGroup = createGroup();
    binGroup = createGroup();
    energyGroup = createGroup();

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

    unmute_Btn = createImg("./images/unmute.png");
    unmute_Btn.position(windowWidth - 70, 10);
    unmute_Btn.size(40, 40);
    unmute_Btn.mouseClicked(mute);

    instructions = createElement("h1");
    instructions.html("Press the Space Key To Jump And Escape The Obstacles");
    instructions.position(400, 200);
    instructions.class("instructions");

    pause = createImg("./images/pause.png");
    pause.position(windowWidth / 2 + 350, 10);
    pause.size(230, 60);
    pause.mouseClicked(play1);

    reset = createImg("./images/reset.png");
    reset.position(windowWidth / 2 + 250, 10);
    reset.size(60, 60);
    reset.mouseClicked(reload1);

    energySymbol = createSprite(windowWidth / 3 - 150, 50);
    energySymbol.addImage(energySymbol_img);
    energySymbol.scale = 0.08;

    elementOfEnergy=createElement("h2");
    elementOfEnergy.html("Player`s Energy");
    elementOfEnergy.position(windowWidth/2-325,-15);
}

function draw() {
    background(bk_img);

    if (keyIsDown(RIGHT_ARROW)) {
        window.stop();
    }

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
        creatingEnergyDrinks();
        energy();

        //collision between player and obstacles
        if (pipeGroup.isTouching(player)) {
            pipeGroup.setVelocityXEach(0);
            cloudGroup.setVelocityXEach(0);
            coinGroup.setVelocityXEach(0);
            coinGroup1.setVelocityXEach(0);
            energyGroup.setVelocityXEach(0);
            gameState = END;
            restart();
        }

        if (coinGroup.isTouching(player)) {
            for (var i = 0; i < coinGroup.length; i++) {
                if (coinGroup[i].isTouching(player)) {
                    coinGroup[i].destroy();
                    score = score + 3;
                }
            }
        }

        if (coinGroup1.isTouching(player)) {
            for (var i = 0; i < coinGroup1.length; i++) {
                if (coinGroup1[i].isTouching(player)) {
                    coinGroup1[i].destroy();
                    score = score + 3;
                }
            }
        }

        if (energyGroup.isTouching(player)) {
            for (var i = 0; i < energyGroup.length; i++) {
                if (energyGroup[i].isTouching(player)) {
                    energyGroup[i].destroy();
                    playerEnergy = 300;
                }
            }
        }

        if (playerEnergy === 0) {
            gameState = END1;
            restart();
        }

        if (score >= 100) {
            pipeGroup.destroyEach();
            coinGroup.destroyEach();
        }

        if (score >= 100) {
            phase2();
        }

        if (score % 60 == 0 && score >= 50) {
            amazing.visible = true;
        }
        else {
            amazing.visible = false;
        }

        if (frameCount % 120 === 0) {
            instructions.hide();
        }
    }
    if (gameState === END) {
        ground.velocityX = 0;
        lowerGround.velocityX = 0;
        background_music.stop();

        pause.hide();
        // play.hide();
        reset.hide();
    }

    if (gameState === END1) {
        pipeGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        coinGroup1.setVelocityXEach(0);
        cloudGroup.setVelocityXEach(0);
        birdGroup.setVelocityXEach(0);
        binGroup.setVelocityXEach(0);
        energyGroup.setVelocityXEach(0);

        ground.velocityX = 0;
        lowerGround.velocityX = 0;

        background_music.stop();
        player.collide(ground);

        energy1();
    }


    //Text score
    textSize(30);
    fill("red");
    textFont("Times New Roman")
    text("Score:" + score, 30, 45);

    drawSprites();
}

function energy() {
    fill("white");
    rect(windowWidth / 2 - 400, 30, 300, 30);

    fill("yellow");
    rect(windowWidth / 2 - 400, 30, playerEnergy, 30);

    if (frameCount % 10 == 0) {
        playerEnergy -= 3;
    }

    if(playerEnergy<=80){
        fill("red");
        rect(windowWidth / 2 - 400, 30, playerEnergy, 30);
    }

    if(playerEnergy<=150 && playerEnergy>=80){
        fill("darkorange");
        rect(windowWidth / 2 - 400, 30, playerEnergy, 30);
    }
}

function energy1(){
    fill("white");
    rect(windowWidth / 2 - 400, 30, 300, 30);

    fill("yellow");
    rect(windowWidth / 2 - 400, 30, playerEnergy, 30);

    if(playerEnergy<=80){
        fill("red");
        rect(windowWidth / 2 - 400, 30, playerEnergy, 30);
    }
    
    if(playerEnergy<=150 && playerEnergy>=80){
        fill("darkorange");
        rect(windowWidth / 2 - 400, 30, playerEnergy, 30);
    }
}

function spawnClouds() {
    if (frameCount % 130 === 0) {
        cloud = createSprite(windowWidth + 30, 100, 100, 50);
        cloud.addImage(cloudImg);
        cloud.velocityX = -5;
        cloud.scale = 0.2;
        cloud.y = Math.round(random(150, 250));
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
        bird = createSprite(windowWidth + 20, Math.round(random(windowHeight - 120, windowHeight - 160)));
        bird.addImage(birdImg);
        bird.scale = 0.08;
        bird.velocityX = -12;
        bird.setCollider("rectangle", 0, 50, bird.width - 350, bird.height - 80);
        birdGroup.add(bird);

        bin = createSprite(windowWidth + 450, windowHeight - 100);
        bin.addImage(bin_img);
        bin.scale = 0.4;
        bin.velocityX = -12;
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
        energyGroup.setVelocityXEach(0);
        restart();
    }
}

function creatingEnergyDrinks() {
    if (frameCount % 350 === 0) {
        energyDrink = createSprite(windowWidth + 20, windowHeight - 100);
        energyDrink.addImage(energyDrink_img);
        energyDrink.velocityX = -8;
        energyDrink.scale = 0.15
        energyDrink.setCollider("rectangle", 0, 50, energyDrink.width - 100, energyDrink.height);
        energyGroup.add(energyDrink);
        // energyDrink.debug=true;
    }
}

function restart() {
    swal({
        title: "Game Over",
        text: "Your Score Is :" + score,
        imageUrl: "https://toppng.com/uploads/preview/cartoon-game-characters-11549893427ws4wn4t2sc.png",
        imageSize: "100x100",
        confirmButtonText: "Restart"
    },

        function (isConfirm) {
            if (isConfirm) {
                location.reload();
            }
        }
    );
}

function mute() {
    mute_Btn = createImg("./images/mute.png");
    mute_Btn.position(windowWidth - 100, 0);
    mute_Btn.size(100, 80);
    mute_Btn.mouseClicked(unmute);

    unmute_Btn.hide();

    if (background_music.isPlaying()) {
        background_music.stop();
    }
    else {
        background_music.play();
    }

}

function unmute() {
    unmute_Btn = createImg("./images/unmute.png");
    unmute_Btn.position(windowWidth - 70, 10);
    unmute_Btn.size(40, 40);
    unmute_Btn.mouseClicked(mute);

    mute_Btn.hide();
}

function play1() {
    play = createImg("./images/play.png");
    play.position(windowWidth / 2 + 298, 10);
    play.size(200, 60);
    play.mouseClicked(pause1);

    pauseElement = createElement("h1");
    pauseElement.position(windowWidth / 2 - 200, 250);
    pauseElement.html("Game Is Paused");
    pauseElement.class("pause");

    gameState = END1

    // energy();
}

function pause1() {
    pause = createImg("./images/pause.png");
    pause.position(windowWidth / 2 + 350, 10);
    pause.size(230, 60);
    pause.mouseClicked(play1);
    pauseElement.hide();

    birdGroup.setVelocityXEach(-8);
    cloudGroup.setVelocityXEach(-8);
    coinGroup.setVelocityXEach(-8);
    coinGroup1.setVelocityXEach(-8);
    binGroup.setVelocityXEach(-8);
    pipeGroup.setVelocityXEach(-8);
    energyGroup.setVelocityXEach(-8);
    birdGroup.setVelocityXEach(-12);
    binGroup.setVelocityXEach(-12);

    gameState = PLAY

    background_music.play();
    // player.collide(ground);
}

function reload1() {
    location.reload();
}