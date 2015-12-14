/*
 * Written by: Matt Burman
 * Inspired by Dr. Steve Maddock's ball1.js
 */

/** @param headImageUrls urls of images for the "whack-a-mole"
 *  @param difficulty integer Number (0-2)
 *  @canvas object canvas dom element
 * */
var Game = function(userHeadImages, difficulty, canvas){
  'use strict';

  // deal with parameters being invalid
  if(!userHeadImages){
    userHeadImages = [];
  }
  if([0,1,2,3,4].indexOf(difficulty) === -1){
    difficulty = 4;
  }

  // Declare and initialise key variables
  var canvasOffsets,
      context,
      requestID,
      WIDTH,
      HEIGHT,                  //ez, med, hard,extr,maddock
      NUM_HEADS =               [5   , 8   , 13  , 21  , 34  ][difficulty],
      POPUP_LENGTH =            [10  , 8   , 7   , 6.5 , 6   ][difficulty]*1000,
      POPUP_LENGTH_VARIANCE =   [0   , 1   , 2   , 3   , 4   ][difficulty]*1000,
      HIDDEN_LENGTH =           [6   , 6   , 6   , 6   , 6   ][difficulty]*1000,
      HIDDEN_LENGTH_VARIANCE =  [1   , 2   , 3   , 4.5 , 5   ][difficulty]*1000,
      SHRINK_MULTIPLIER =       [0.99, 0.98, 0.97, 0.96, 0.95][difficulty],
      GROW_MULTIPLIER =         [1.05, 1.10, 1.15, 1.20, 1.5 ][difficulty],
      SPEED           =         [1   , 1.25, 1.5 , 1.75, 2   ][difficulty],
      heads,
      imageBaseStr = "../img/min/",//image handling variables
      imageCount = 0,
      imgFilenames = [
        imageBaseStr + "matt.png"
      ],
      NUM_IMAGES = imgFilenames.length,
      imgArray = new Array(imgFilenames.length),
      HEAD_WIDTH = 87,
      HEAD_HEIGHT = 100,
      score = 0,
      gameOver = false,
      hitmarker = new Audio("sounds/hitmarker.ogg"),
      wombocombo = new Audio("sounds/wombocombo.ogg"),
      triple = new Audio("sounds/triple.ogg"),
      sadViolin = new Audio("sounds/sad-violin.ogg");


  // main program body
  init();

  // functions

  function clear() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
  }

  // initialise all the heads
  function initHeads() {
    imgArray = imgArray.concat(userHeadImages);
    heads = new HeadList();
    for (var i=0; i < NUM_HEADS; i++) {
      var sx = HEAD_WIDTH + Math.random()*(WIDTH-2*HEAD_WIDTH),
          sy = HEAD_HEIGHT + Math.random()*(HEIGHT-2*HEAD_HEIGHT),
          dx = (Math.random() - 0.5)*SPEED,
          dy = (0.5 + Math.random())*SPEED,
          imgNumber = randInt(0, imgArray.length);
      imgArray[imgNumber].width = HEAD_WIDTH;
      imgArray[imgNumber].height = HEAD_HEIGHT;
      var head = new Head(
          imgArray[imgNumber].width,
          imgArray[imgNumber].height,
          sx,
          sy,
          dx,
          dy,
          imgArray[imgNumber],
          POPUP_LENGTH,
          POPUP_LENGTH_VARIANCE,
          HIDDEN_LENGTH,
          HIDDEN_LENGTH_VARIANCE
      );  // create a new Head object
      heads.add(head);
    }
  }

  function randInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
  }

  // update the positions of all the heads
  function updateHeads() {
    if(gameOver) return;

    for (var i = 0; i < heads.getNumHeads(); i++) {
      var h = heads.get(i);
      var headState = h.getState();
      if (h.getState() !== 0) {

        //handle position
        var hxNext = h.getX() + h.getDX();
        if (hxNext > WIDTH - HEAD_WIDTH || hxNext < 0) {
          h.setDX(-h.getDX());
        }
        var hyNext = h.getY() + h.getDY();
        if (hyNext > HEIGHT - HEAD_HEIGHT || hyNext < 0) {
          h.setDY(-h.getDY());
        }
        h.setX( h.getX() + h.getDX() );
        h.setY( h.getY() + h.getDY() );

        //handle height/width/visibility
        switch(headState){
          case 1://growing
            h.setH(h.getH() * GROW_MULTIPLIER);
            h.setW(h.getW() * GROW_MULTIPLIER);
            if(h.getW() === h.getMaxW() && h.getH() === h.getMaxH()){
              h.bePoppedUp();
            }
            break;
          case 2://fully popped up - nothing to do.
            break;
          case 3://shrinking
            h.setH(h.getH() * SHRINK_MULTIPLIER);
            h.setW(h.getW() * SHRINK_MULTIPLIER);
            if(h.getW() <= h.getMinW() && h.getH() <= h.getMinH()) {
              //shrunk - if not whacked, game over? or lose points
              h.getWhacked() ? h.hide() : endGame();
            }
            break;
          case 0:
            console.log("ERR: Visible in state: " + headState);
            h.setVisible(false);
            break;
        }
      } else if(headState){
        console.log("ERR: Non-visible in state: " + h.getState());
      }
    }
  }

  // draw the heads
  function drawHeads(){
    heads.drawAsImages(context);
  }

  // draw score
  function drawScore(){
    context.fillText("Score: " + score, 50, 50);
  }

  // render the screen display
  function render(){
    clear();
    drawHeads();
    updateHeads();
    drawScore();
  }

  // animation frames
  function nextFrame() {
    requestID = requestAnimationFrame(nextFrame);
    render();
  }

  function startInteractionIfImagesLoaded() {
    imageCount++;
    if (imageCount === NUM_IMAGES) {//i.e. don't start until
      initHeads();
      // start animation
      nextFrame();
    }
  }

  function loadResourcesThenStart() {
    for (var i = 0; i < imgFilenames.length; i++) {
      imgArray[i] = new Image();
      imgArray[i].onload = startInteractionIfImagesLoaded;
      imgArray[i].src = imgFilenames[i];
    }
  }

  function click(ev){
    var numClicked = 0;
    for(var i = 0; i < heads.getNumHeads(); i++){
      var h = heads.get(i);
      if(h.wasClicked(ev.x - canvasOffsets.left, ev.y - canvasOffsets.top)){
        switch(h.getState()){
          case 1://growing
            if(!h.getWhacked()) incrementScore(2);
            h.clickOnGrowing();
            numClicked++;
            break;
          case 2:
            if(!h.getWhacked()) incrementScore(1);
            h.clickOnPoppedUp();
            numClicked++;
            break;
          case 3:
            h.clickOnShrinking();
              numClicked++;
            break;
          default:
            alert("ERR: Click on hidden element???");
            break;
        }
      }
    }
    playClickSounds(numClicked);
  }

  function incrementScore(by){
    if(!gameOver) score += by;
  }

  function playClickSounds(numClicked){
    switch(numClicked){
      case 0:
        break;
      case 1:
        hitmarker.play();
        break;
      case 2:
        hitmarker.play();
        wombocombo.play();
        break;
      case 3:
        hitmarker.play();
        triple.play();
      default:
        hitmarker.play();
        triple.play();
    }
  }

  function endGame(){
    gameOver = true;
    sadViolin.play();
  }


  // initialise the simulation
  function init() {
    <!-- get the rendering area for the canvas -->
    canvas.addEventListener("click", click);
    context = canvas.getContext("2d");
    context.font = "48px serif";
    score = 0;
    canvasOffsets = canvas.getBoundingClientRect();
    HEIGHT = canvasOffsets.bottom - canvasOffsets.top;
    WIDTH = canvasOffsets.right - canvasOffsets.left;
    loadResourcesThenStart();
  }

  this.kill = function(){
    hitmarker.pause();
    wombocombo.pause();
    triple.pause();
    sadViolin.pause();
    canvas.removeEventListener("click", click);
    gameOver = true;
  };
};
