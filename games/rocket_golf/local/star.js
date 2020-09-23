class Star {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.radius = 4;
    this.size = 1;
  }

  show() {
    var r = this.radius;
    var s = this.size;
    push();
    noStroke();
    fill(255, 255, 255);
    rect(this.x, this.y, 1, 1);
    for (var i = -r; i < r + 1; i += s) {
      var alpha = map(Math.abs(i), 0, r, 255, 50);
      fill(160, 200, 200, alpha);
      if (i != 0) {
        rect(this.x + i, this.y, s, s);
      }
    }
    for (var j = -r; j < r + 1; j += s) {
      var alpha = map(Math.abs(j), 0, r, 255, 50);
      fill(160, 200, 200, alpha);
      if (j != 0) {
        rect(this.x, this.y + j, s, s);
      }
    }
    pop();
  }
}
