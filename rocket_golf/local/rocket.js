class Rocket {

  constructor(x, y) {
    this.start_x = x;
    this.start_y = y;

    this.pos = createVector(this.start_x, this.start_y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.force = createVector(0, 0);
    this.launch_vector = createVector(0, 0);

    this.diameter = 20;
    this.mass = pow(this.diameter, mass_power);

    // Flags
    this.launched = false;
    this.boosted = false;
    this.complete = false;
    this.crashed = false;

  }

  launch_sequence() {
    // Reset if crashed
    this.crashed = false;

    // Launch arrow and sequence
    var launch_vector = createVector(mouseX - this.pos.x, mouseY - this.pos.y).mult(launch_velocity_factor);

    if (launch_vector.mag() > max_launch_velocity) {
      launch_vector.setMag(max_launch_velocity);
    }

    push();
    stroke(255, 50, 50);
    strokeWeight(2);
    var angle = launch_vector.copy().heading();

    var max_mouse_x = this.pos.x + max_aim * cos(angle);
    var max_mouse_y = this.pos.y + max_aim * sin(angle);
    if (dist(this.pos.x, this.pos.y, mouseX, mouseY) < max_aim) {
      line(this.pos.x, this.pos.y, mouseX, mouseY);
      push();
      fill(255, 50, 50);
      translate(mouseX, mouseY);
      rotate(angle - PI / 2) //rotates the arrow point
      triangle(0, 6, -4, -8, 4, -8);
      pop();
    } else {
      line(this.pos.x, this.pos.y, max_mouse_x, max_mouse_y);
      push();
      fill(255, 50, 50);
      translate(max_mouse_x, max_mouse_y);
      rotate(angle - PI / 2) //rotates the arrow point
      triangle(0, 6, -4, -8, 4, -8);
      pop();
    }
    pop();

    if (mouseIsPressed) {
      this.vel = launch_vector;
      this.launched = true;
      // console.log('launch velocity', rocket.vel.mag());
    }
    this.launch_vector = launch_vector.copy();
  }

  boost() {
    if (this.boosted == false && keyIsPressed) {
      this.vel.add(this.vel.normalize().mult(boost_power))
      this.boosted = true;
      console.log('boosting');
    }
  }

  update(planets, hole) {
    if (this.launched && !this.complete && !this.crashed) {
      this.apply_gravity(planets, hole);
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      // Constrain max velocity
      if (this.vel.mag() > terminal_vel) {
        this.vel = this.vel.normalize().mult(terminal_vel);
      }
    }
  }

  show() {
    // fill(255);
    // ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
    push()
    translate(this.pos.x, this.pos.y)
    if (this.launched) {
      rotate(this.vel.heading() + PI / 2)
    } else {
      rotate(this.launch_vector.heading() + PI / 2)
    }
    image(rocket_img, 0, 0);
    pop()
  }

  reached_hole(hole) {
    var current_distance = this.pos.dist(hole.pos);
    var collision_distance = (this.diameter + hole.diameter) / 2;
    if (current_distance < collision_distance) {
      this.complete = true;
      return true;
    }
  }

  apply_gravity(planets, hole) {
    // Reset current acc
    this.acc.set(0, 0);

    // Apply hole gravity
    var d = this.pos.dist(hole.pos);
    var acc = G * hole.mass / pow(d, hole_power);
    var angle = hole.pos.copy().sub(this.pos).heading();
    this.acc.x = acc * cos(angle);
    this.acc.y = acc * sin(angle);

    // Apply planet gravity
    for (var i = 0; i < planets.length; i++) {
      var planet = planets[i];
      var planet_pos = planet.pos.copy();
      d = this.pos.dist(planet_pos);

      acc = G * planet.mass / pow(d, inverse_power);

      angle = planet_pos.sub(this.pos).heading();
      this.acc.x += acc * cos(angle);
      this.acc.y += acc * sin(angle);
    }

  }

  // Doesn't always stop on edge of planet when crashed due to moving multiple pixels per frame
  check_collisions(planets) {
    for (var i = 0; i < planets.length; i++) {
      var planet = planets[i];
      var current_distance = this.pos.dist(planet.pos);
      var collision_distance = (this.diameter + planet.diameter) / 2;
      if (current_distance < collision_distance) {
        this.crashed = true;
        return true;
      }
    }
  }

  offscreen() {
    if (this.pos.x + this.diameter / 2 > width ||
      this.pos.x - this.diameter / 2 < 0 ||
      this.pos.y + this.diameter / 2 > height ||
      this.pos.y - this.diameter / 2 < 0) {
      this.crashed = true;
      return true;
    }
  }

  relaunch() {
    // console.log('crash velocity', this.vel.mag());
    for (var i = 0; i < 10000; i++) {
      // console.log('counting')
    }
    rocket.pos.set(this.start_x, this.start_y);
    rocket.vel.set(0, 0);
    this.boosted = false;
    this.launched = false;
    this.complete = false;
    // console.log('relaunching')
  }

}
