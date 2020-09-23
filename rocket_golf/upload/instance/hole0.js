class Hole {

  constructor(p, x, y) {
    this.pos = p.createVector(x, y);
    this.diameter = 20;
    this.mass = p.hole_mass;
  }

  show(p) {
    p.fill(200, 0, 0);
    // ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter)
    p.push();
    p.translate(this.pos.x, this.pos.y);
    p.image(black_hole_img, 0, 0);
    p.pop();
  }
}
