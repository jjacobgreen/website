class Star {
  constructor(p) {
    this.x = p.random(0, p.width);
    this.y = p.random(0, p.height);
    this.radius = 4;
    this.size = 1;
  }

  show(p) {
    var r = this.radius;
    var s = this.size;
    p.push();
    p.noStroke();
    p.fill(255, 255, 255);
    p.rect(this.x, this.y, 1, 1);
    for (var i = -r; i < r + 1; i += s) {
      var alpha = p.map(Math.abs(i), 0, r, 255, 50);
      p.fill(160, 200, 200, alpha);
      if (i != 0) {
        p.rect(this.x + i, this.y, s, s);
      }
    }
    for (var j = -r; j < r + 1; j += s) {
      var alpha = p.map(Math.abs(j), 0, r, 255, 50);
      p.fill(160, 200, 200, alpha);
      if (j != 0) {
        p.rect(this.x, this.y + j, s, s);
      }
    }
    p.pop();
  }
}
