class Rocket {

  constructor(p, x, y) {
    this.start_x = x;
    this.start_y = y;

    this.pos = p.createVector(this.start_x, this.start_y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.force = p.createVector(0, 0);
    this.launch_vector = p.createVector(0, 0);

    this.diameter = 20;
    this.mass = p.pow(this.diameter, p.mass_power);

    // Flags
    this.launched = false;
    this.boosted = false;
    this.complete = false;
    this.crashed = false;

  }

  launch_sequence(p) {
    // Reset if crashed
    this.crashed = false;
    var launch_velocity_factor = 0.1;

    // Launch arrow and sequence
    console.log(p.launch_velocity_factor)
    var launch_vector = p.createVector(p.mouseX - this.pos.x, p.mouseY - this.pos.y).mult(launch_velocity_factor);

    if (launch_vector.mag() > p.max_launch_velocity) {
      launch_vector.setMag(p.max_launch_velocity);
    }

    p.push();
    p.stroke(255, 50, 50);
    p.strokeWeight(2);
    var angle = launch_vector.copy().heading();

    var max_mouse_x = this.pos.x + p.max_aim * p.cos(angle);
    var max_mouse_y = this.pos.y + p.max_aim * p.sin(angle);
    if (p.dist(this.pos.x, this.pos.y, p.mouseX, p.mouseY) < p.max_aim) {
      p.line(this.pos.x, this.pos.y, p.mouseX, p.mouseY);
      p.push();
      p.fill(255, 50, 50);
      p.translate(p.mouseX, p.mouseY);
      p.rotate(angle - p.PI / 2) //rotates the arrow point
      p.triangle(0, 6, -4, -8, 4, -8);
      p.pop();
    } else {
      p.line(this.pos.x, this.pos.y, max_mouse_x, max_mouse_y);
      p.push();
      p.fill(255, 50, 50);
      p.translate(max_mouse_x, max_mouse_y);
      p.rotate(angle - p.PI / 2) //rotates the arrow point
      p.triangle(0, 6, -4, -8, 4, -8);
      p.pop();
    }
    p.pop();

    if (p.mouseIsPressed) {
      this.vel = launch_vector;
      this.launched = true;
      // console.log('launch velocity', rocket.vel.mag());
    }
    this.launch_vector = launch_vector.copy();
  }

  boost(p) {
    if (this.boosted == false && p.keyIsPressed) {
      this.vel.add(this.vel.normalize().mult(p.boost_power))
      this.boosted = true;
      console.log('boosting');
    }
  }

  update(p, planets, hole) {
    if (this.launched && !this.complete && !this.crashed) {
      this.apply_gravity(p, planets, hole);
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      // Constrain max velocity
      if (this.vel.mag() > p.terminal_vel) {
        this.vel = this.vel.normalize().mult(p.terminal_vel);
      }
    }
  }

  show(p) {
    // fill(255);
    // ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
    p.push()
    p.translate(this.pos.x, this.pos.y)
    if (this.launched) {
      p.rotate(this.vel.heading() + p.PI / 2)
    } else {
      p.rotate(this.launch_vector.heading() + p.PI / 2)
    }
    p.image(rocket_img, 0, 0);
    p.pop()
  }

  reached_hole(p, hole) {
    var current_distance = this.pos.dist(hole.pos);
    var collision_distance = (this.diameter + hole.diameter) / 2;
    if (current_distance < collision_distance) {
      this.complete = true;
      return true;
    }
  }

  apply_gravity(p, planets, hole) {
    // Reset current acc
    this.acc.set(0, 0);

    // Apply hole gravity
    var d = this.pos.dist(hole.pos);
    var acc = p.G * hole.mass / p.pow(d, p.hole_power);
    var angle = hole.pos.copy().sub(this.pos).heading();
    this.acc.x = acc * p.cos(angle);
    this.acc.y = acc * p.sin(angle);

    // Apply planet gravity
    for (var i = 0; i < planets.length; i++) {
      var planet = planets[i];
      var planet_pos = planet.pos.copy();
      d = this.pos.dist(planet_pos);

      acc = p.G * planet.mass / p.pow(d, p.inverse_power);

      angle = planet_pos.sub(this.pos).heading();
      this.acc.x += acc * p.cos(angle);
      this.acc.y += acc * p.sin(angle);
    }

  }

  // Doesn't always stop on edge of planet when crashed due to moving multiple pixels per frame
  check_collisions(p, planets) {
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

  offscreen(p) {
    if (this.pos.x + this.diameter / 2 > p.width ||
      this.pos.x - this.diameter / 2 < 0 ||
      this.pos.y + this.diameter / 2 > p.height ||
      this.pos.y - this.diameter / 2 < 0) {
      this.crashed = true;
      return true;
    }
  }

  relaunch(p) {
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
