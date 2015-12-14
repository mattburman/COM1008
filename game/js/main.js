/*
 * Written by: Matt Burman
 */

(function(){
  console.log("hi");

  var difficultyString = "Difficulty Level: ",
      difficulty = "Hard",
      difficultyVal = 2,
      difficultyEl = document.getElementById("difficulty"),
      updateDifficulty = function(difficulty){
        difficultyEl.innerText = difficultyString + difficulty;
        switch(difficulty){
          case "Easy":
            difficultyVal = 0;
            break;
          case "Medium":
            difficultyVal = 1;
            break;
          case "Hard":
            difficultyVal = 2;
            break;
          case "Extreme":
            difficultyVal = 3;
            break;
          case "Maddock":
            difficultyVal = 4;
            break;
          default:
            difficultyVal = 0;
            break;
        }
      },

      btnCallback = function(ev){
        updateDifficulty(ev.srcElement.firstChild.data);
      },
      current_game,
      canvas = document.getElementById("game"),
      inputFieldsContainer = document.getElementById("image-urls"),
      addUrlButton = document.getElementById("add-field");


  updateDifficulty(difficulty);

  var images = [];
  var imagesToTest = 0;
  var imagesTested = 0;
  var imgCallback = function(img, success){
    console.log("imgCallback: " + success + ", imagesTested: " + imagesTested);
    if(success) images.push(img);
    imagesTested++;
    if(imagesTested === imagesToTest) {
      current_game = new Game(images, difficultyVal, canvas);
    }
  };

  var testImage = function(url, imgCallback){
    var image = new Image();
    var timedOut = false, timer;
    url = url.toString();

    image.onerror = image.onabort = function(){
      if(!timedOut){
        console.log("onerror");
        clearTimeout(timer);
        imgCallback(image, false);
      }
    };

    image.onload = function(){
      if(!timedOut){
        clearTimeout(timer);
        imgCallback(image, true);
      }
    };

    image.src = url;

    timer = setTimeout(function(){
      console.log("timeout");
      timedOut = true;
      imgCallback(image, false);
    }, 5000);

  };

  var testImagesAndPlay = function(urls){
    imagesTested = 0;
    imagesToTest = urls.length;
    images = [];
    for(var i = 0; i < urls.length; i++){
      testImage(urls[i], imgCallback);
    }
  };

  var playGame = function(){
    if(current_game) current_game.kill();

    //get urls from dom
    var inputNodes = inputFieldsContainer.getElementsByTagName("INPUT");
    var urls = new Array(inputNodes.length);
    for(var i = 0; i < inputNodes.length; i++){
      urls[i] = inputNodes[i].value;//I wish nodelist had .map from Array.prototype...
    }

    testImagesAndPlay(urls);
  };

  var buttons = ["easy", "medium", "hard", "extreme", "maddock"];
  for(var i = 0; i < buttons.length; i++){
    document.getElementById(buttons[i]).addEventListener("click", btnCallback);
  }

  document.getElementById("play-game").addEventListener("click", function(){
    window.scrollTo(0,0);

    playGame();

    //current_game = new Game([], difficultyVal, canvas);
  });

  addUrlButton.addEventListener("click", function(){
    var emptyInputField = document.createElement("INPUT");
    emptyInputField.setAttribute("type", "url");
    inputFieldsContainer.appendChild(emptyInputField);
  });

})();