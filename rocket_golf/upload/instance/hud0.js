class HUD {

  constructor(p) {
    this.life_size = 12;
  }

  show_velocity(p, rocket) {
    p.fill(0, 120, 255);
    var rounded_velocity = Math.round(rocket.vel.copy().mag() * 10) / 10;
    p.text('Velocity: '.concat(rounded_velocity.toString()), 10, 20);
  }

  show_launch_velocity(p, rocket) {
    var terminal_vel = 15
    var rounded_launch_velocity = p.min(Math.round(rocket.launch_vector.copy().mag() * 10) / 10, terminal_vel);
    p.text('Launch Velocity: '.concat(rounded_launch_velocity.toString()), 10, 40);
  }

  show_lives(p, lives) {
    var width_offset = 60;
    p.push();
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Lives: ', p.width / 2 - 25 - width_offset, p.height - 1.4 * this.life_size);
    for (var i = 1; i <= lives; i++) {
      p.ellipse(p.width / 2 - width_offset + (this.life_size + 2) * i, p.height - 1.4 * this.life_size, this.life_size, this.life_size)
    }
    p.pop();
  }

  show_score(p, score) {
    p.push();
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Score: '.concat(score.toString()), p.width - 50, p.height - 1.4 * this.life_size);
    p.pop();
  }

}
