class Planet {

  constructor(p, x, y, d, home) {
    this.pos = p.createVector(x, y);
    this.colour = p.color(p.random(255), p.random(255), p.random(255));

    this.diameter = d;
    if (home) {
      this.mass = 0;
    } else {
      this.mass = p.pow(d, p.mass_power);
    }

  }

  show(p) {
    p.fill(this.colour);
    p.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter)
  }

}
