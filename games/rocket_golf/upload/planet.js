class Planet {

  constructor(x, y, d, home) {
    this.pos = createVector(x, y);
    this.colour = color(random(255), random(255), random(255));

    this.diameter = d;
    if (home) {
      this.mass = 0;
    } else {
      this.mass = pow(d, mass_power);
    }

  }

  show() {
    fill(this.colour);
    ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter)
  }

}
