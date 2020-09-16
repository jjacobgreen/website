class HUD {

  constructor() {
    this.life_size = 12;
  }

  show_velocity(rocket) {
    fill(0, 120, 255);
    var rounded_velocity = Math.round(rocket.vel.copy().mag() * 10) / 10;
    text('Velocity: '.concat(rounded_velocity.toString()), 10, 20);
  }

  show_launch_velocity(rocket) {
    var rounded_launch_velocity = min(Math.round(rocket.launch_vector.copy().mag() * 10) / 10, terminal_vel);
    text('Launch Velocity: '.concat(rounded_launch_velocity.toString()), 10, 40);
  }

  show_lives(lives) {
    var width_offset = 60;
    push();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Lives: ', width / 2 - 25 - width_offset, height - 1.4 * this.life_size);
    for (var i = 1; i <= lives; i++) {
      ellipse(width / 2 - width_offset + (this.life_size + 2) * i, height - 1.4 * this.life_size, this.life_size, this.life_size)
    }
    pop();
  }

  show_score(score) {
    push();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Score: '.concat(score.toString()), width - 50, height - 1.4 * this.life_size);
    pop();
  }

}
