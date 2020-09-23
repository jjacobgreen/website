class Hole {

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.diameter = 20;
    this.mass = hole_mass;
  }

  show() {
    fill(200, 0, 0);
    // ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter)
    push();
    translate(this.pos.x, this.pos.y);
    image(black_hole_img, 0, 0);
    pop();
  }
}
