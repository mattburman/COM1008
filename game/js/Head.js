/*
 * Written by: Matt Burman
 * Extended Dr. Steve Maddock's ball.js for the whack-a-mole game.
 */

function Head(w, h, x, y, dx, dy, img, popupLen, popupLenVariance, hiddenLen, hiddenLenVariance){
  this.minW = 8.8;
  this.maxW = w;
  this.w = this.minW;

  this.minH = 10;
  this.maxH = h;
  this.h = this.minH;

  this.popupLen = popupLen;
  this.popupLenVariance = popupLenVariance;
  this.hiddenLen = hiddenLen;
  this.hiddenLenVariance = hiddenLenVariance;

  this.whacked = false;

  // States: 0 hidden, 1 growing, 2 popped up, 3 shrinking
  // 2 points awarded onclick in state 1, 1 in state 2, 0 in 3
  this.state = 0;

  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.visible = false;
  this.image = img;

  this.hide();
}

Head.prototype.drawAsImage = function(context) {
  if(this.visible && this.image !== null){
    context.drawImage(
        this.image,
        Math.floor(this.x),
        Math.floor(this.y),
        Math.floor(this.w),
        Math.floor(this.h)
    );
  }
};

Head.prototype.wasClicked = function(x, y){
  return    x > this.x
         && x < this.x + this.w
         && y > this.y
         && y < this.y + this.h
         && this.visible;
};

/*
 * Event handlers
*/

/* Click events */
Head.prototype.clickOnGrowing = function(){
  if(!this.whacked){
    this.state = 3;
    this.whacked = true;
  }
};
Head.prototype.clickOnPoppedUp = function(){
  this.state = 3;
  this.whacked = true;
};
Head.prototype.clickOnShrinking = function(){
  this.whacked = true;
  //no state increase
};

/* State change events */

function rand(min, max){
  return Math.random() * (max - min) + min;
}

/* Change state setTimeout Functions */
Head.prototype.hide = function(){
  console.log(this.getState() +": Shrunk, start hiding, "+"WAS WHACKED: " + this.whacked);
  var obj = this;
  this.whacked = false;
  this.visible = false;
  this.state = 0;
  setTimeout(function(){
    //come out of hiding
    console.log("out of hiding");
    obj.visible = true;
    if(obj.state === 0) obj.state = 1;//grow
  }, this.hiddenLen + rand(-this.hiddenLenVariance, this.hiddenLenVariance));
};
Head.prototype.bePoppedUp = function(){
  this.state = 2;
  var obj = this;
  setTimeout(function(){
    if(obj.state === 2) obj.state = 3;//shrink

  }, this.popupLen + rand(-this.popupLenVariance, this.popupLenVariance));
};

/* Setters */
Head.prototype.setW = function(w){
  this.w = w >= this.maxW ? this.maxW : w;
};
Head.prototype.setH = function(h){
  this.h = h >= this.maxH ? this.maxH : h;
};
Head.prototype.setX = function(x) {
  this.x = x;
};
Head.prototype.setY = function(y) {
  this.y = y;
};
Head.prototype.setDX = function(dx) {
  this.dx = dx;
};
Head.prototype.setDY = function(dy) {
  this.dy = dy;
};
Head.prototype.setVisible = function(v) {
  this.visible = v;
};

/* Getters */
Head.prototype.getWhacked = function(){
  return this.whacked;
};
Head.prototype.getState = function(){
  return this.state%4;
};
Head.prototype.getW = function(){
  return this.w;
};
Head.prototype.getMaxW = function(){
  return this.maxW;
};
Head.prototype.getMinW = function(){
  return this.minW;
};
Head.prototype.getMinH = function(){
  return this.minH;
};
Head.prototype.getH = function(){
  return this.h;
};
Head.prototype.getMaxH = function(){
  return this.maxH;
};
Head.prototype.getX = function() {
  return this.x;
};
Head.prototype.getY = function() {
  return this.y;
};
Head.prototype.getDX = function() {
  return this.dx;
};
Head.prototype.getDY = function() {
  return this.dy;
};
Head.prototype.getVisible = function() {
  return this.visible;
};
