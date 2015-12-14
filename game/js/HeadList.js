/*
 * HeadList based on Dr. Steve Maddock's BallList
 * Adapted by Matt Burman for the whack-a-mole game
 */

HeadList.MAX_NUMHEADS = 500;

function HeadList() {
  this.heads = new Array(HeadList.MAX_NUMHEADS);
  this.numHeads = 0;
}

HeadList.prototype.getNumHeads = function(){
  return this.numHeads;
};

HeadList.prototype.add = function(h){
  if(this.numHeads>=HeadList.MAX_NUMHEADS) {
    console.log("too many heads");
    return;
  }
  this.heads[this.numHeads] = h;
  this.numHeads += 1;
};

HeadList.prototype.get = function(i){
  if(i >= this.numHeads) return 0;
  return this.heads[i];
};

HeadList.prototype.drawAsImages = function(context){
  for(var i=0; i < this.numHeads; i++){
    this.heads[i].drawAsImage(context);
  }
};