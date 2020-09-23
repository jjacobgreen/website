let sketch = function(p) {
  // Game structure
  var planets = [];
  var stars = [];
  const max_lives = 8;
  var lives = max_lives;
  var score = 0;
  var min_planet_d = 10;
  var max_planet_d = 100;
  var gameMode = 0;
  var mobile = false;
  // 0: Welcome screen
  // 1: Play
  // 2: Game over

  // Game dynamics
  var mass_power = 2;
  var inverse_power = 2;
  var hole_power = 1;

  var G = 1.2;
  var terminal_vel = 15;
  var hole_mass = 50;
  var launch_velocity_factor = 0.1;
  var max_launch_velocity = 10;
  var boost_power = 10;

  // Aesthetics
  var diameter = 32;
  var max_aim = max_launch_velocity / launch_velocity_factor;


  p.preload = function() {
    console.log('preload started');
    rocket_img = p.loadImage('https://s3.eu-west-2.amazonaws.com/www.jacobhgreen.com/rocket_golf/rocket2.gif');
    black_hole_img = p.loadImage('https://s3.eu-west-2.amazonaws.com/www.jacobhgreen.com/rocket_golf/black_hole2.gif');
  }

  // <------------- SETUP -------------> //
  p.setup = function() {
    console.log('setup started');
    // Adjustments for mobile
    if (p.windowWidth < 400) {
      mobile = true;
    }
    if (mobile) {
      canvas = p.createCanvas(p.windowWidth * 0.9, p.windowHeight * 0.85);
      // min_planet_d = 5;
      max_planet_d = 60;
    } else {
      canvas = p.createCanvas(600, 600);
    }
    // Places script within specific div in page!
    canvas.parent('game_div');

    p.textSize(16);
    p.textFont('Courier');
    p.noStroke();

    p.imageMode(p.CENTER);
    p.rectMode(p.CENTER);

    var n_stars = (p.width * p.height) / 10000;
    for (var i = 0; i < n_stars; i++) {
      stars.push(new Star(p));
    }

    // Create rocket, hole and planets
    var start_x = diameter;
    var start_y = p.height - diameter;
    var hole_x = p.width - diameter;
    var hole_y = diameter;
    // To check win screen
    // var hole_x = diameter;
    // var hole_y = height - 3 * diameter;
    rocket = new Rocket(p, start_x, start_y);
    hole = new Hole(p, hole_x, hole_y);
    hud = new HUD(p);

    home_planet = new Planet(p, 0, p.height, 70, true);
    planet1 = new Planet(p, 0.66 * p.width, 0.2 * p.height, max_planet_d, false);
    planet2 = new Planet(p, 0.4 * p.width, 0.66 * p.height, 60, false);

    planets.push(home_planet);
    planets.push(planet1);
    planets.push(planet2);

    console.log('setup complete');
    // frameRate(2);
  }
  // <------------- END SETUP -------------> //


  // <------------- GAME LOOP -------------> //
  p.draw = function() {

    if (gameMode == 0) {
      // gameMode = welcome_screen(width, height);
      welcome_screen(p.width, p.height);
      rounded_border();
    }
    if (gameMode == 1) {
      p.background(15);

      if (lives < 1) {
        gameMode = 2;
      } else {
        gameMode = 1;
      }

      // Stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].show(p);
      }
      // Planets (1. Show all planets)
      for (var i = 0; i < planets.length; i++) {
        current = planets[i];
        current.show(p);
      }

      // Initiate launch sequence if not launched yet or it's crashed
      if (!rocket.launched || rocket.crashed) {
        rocket.launch_sequence(p);
      }

      // Rocket (1. Check if reached hole, 2. Check if hit a planet, 3. Check if it's hit the side, 5. Check if boosted, 4. Update the rocket, 4. Show the rocket
      if (rocket.check_collisions(p, planets) || rocket.offscreen(p)) {
        lives--;
        rocket.relaunch(p);
      }
      if (rocket.reached_hole(p, hole)) {
        // NEW LEVEL
        new_level(p);
        gameMode = 4;
        rocket.relaunch(p);
      }

      rocket.boost(p);
      rocket.update(p, planets, hole);
      rocket.show(p);

      // Hole (1. Show the hole)
      hole.show(p);

      // HUD
      p.fill(0, 120, 255);
      hud.show_launch_velocity(p, rocket);
      hud.show_velocity(p, rocket);

      hud.show_lives(p, lives);
      hud.show_score(p, score);

      rounded_border();
    }

    if (gameMode == 2) {
      game_over_screen();
      rounded_border();
    }

    if (gameMode == 4) {
      level_complete(p.width, p.height);
    }
    // console.log(gameMode);
  }
  // <------------- END GAME LOOP -------------> //

  // <------------- GAME FUNCTIONS -------------> //
  function level_complete() {
    p.push();
    p.textSize(24);
    p.fill(220);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Well done!', p.width / 2, p.height / 2);
    p.textSize(20);
    p.text('Click to continue', p.width / 2, p.height / 2 + 45);
    p.pop();

    lives = max_lives;
    if (p.mouseIsPressed) {
      setTimeout(() => {
        gameMode = 1;
      }, 300);
    }
  }

  function welcome_screen() {
    p.push();
    var play_button_width = 120;
    var play_button_height = 60;
    var button_offset = 80;

    p.textSize(24);
    p.background(15);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(240);
    p.text('Rocket Golf', p.width / 2, p.height / 2);
    p.rect(p.width / 2, p.height / 2 + button_offset, play_button_width, play_button_height);
    p.fill(0);
    p.text('Play', p.width / 2, p.height / 2 + button_offset);
    p.fill(255);

    // Mouse interactivity (hover and click)
    if ((p.width / 2 - play_button_width / 2 < p.mouseX) && (p.mouseX < p.width / 2 + play_button_width / 2) && (p.height / 2 + 80 - play_button_height / 2 < p.mouseY) && (p.mouseY < p.height / 2 + 80 + play_button_height / 2)) {
      p.fill(100);
      p.strokeWeight(4);
      p.stroke(150);
      p.rect(p.width / 2, p.height / 2 + button_offset, play_button_width, play_button_height);
      p.noStroke();
      p.fill(240);
      p.text('Play', p.width / 2, p.height / 2 + button_offset);

      if (p.mouseIsPressed) {
        p.stroke(51);
        p.fill(120);
        p.rect(p.width / 2, p.height / 2 + button_offset, play_button_width, play_button_height);
        p.noStroke();
        p.fill(220);
        p.text('Play', p.width / 2, p.height / 2 + button_offset);
        // return 1;
        setTimeout(() => {
          gameMode = 1;
        }, 200);
      }
    }

    p.pop();
    return 0;
  }

  function game_over_screen() {
    p.push();
    p.clear();
    p.background(15);

    // Stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].show();
    }

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(40);
    p.fill(200, 50, 50);
    p.text('Game over!', p.width / 2, p.height / 2);
    p.textSize(20);
    p.text('Final score: '.concat(score.toString()), p.width / 2, p.height / 2 + 30);

    var play_button_width = 140;
    var play_button_height = 60;
    var button_offset = 80;

    p.fill(240);
    p.rect(p.width / 2, p.height / 2 + button_offset, play_button_width, play_button_height);
    p.fill(0);
    p.text('Play again', p.width / 2, p.height / 2 + button_offset);
    p.fill(255);

    // Mouse interactivity (hover and click)
    if ((p.width / 2 - play_button_width / 2 < p.mouseX) && (p.mouseX < p.width / 2 + play_button_width / 2) && (height / 2 + 80 - play_button_height / 2 < mouseY) && (mouseY < p.height / 2 + 80 + play_button_height / 2)) {
      p.fill(100);
      p.strokeWeight(4);
      p.stroke(150);
      p.rect(p.width / 2, p.height / 2 + button_offset, play_button_width, play_button_height);
      p.noStroke();
      p.fill(240);
      p.text('Play again', p.width / 2, p.height / 2 + button_offset);

      if (mouseIsPressed) {
        p.stroke(51);
        p.fill(120);
        p.rect(p.width / 2, p.height / 2 + button_offset, play_button_width, play_button_height);
        p.noStroke();
        p.fill(220);
        p.text('Play again', p.width / 2, p.height / 2 + button_offset);

        setTimeout(() => {
          gameMode = 1;
        }, 200);
        new_level();
        lives = max_lives;
        score = 0;
      }
    }

    p.pop();
  }

  function new_level() {
    score++;
    planets = [];
    var n_planets = p.random(1, 4);
    var planets_x = [];
    var planets_y = [];
    var planets_d = [];

    for (var i = 0; i < n_planets; i++) {
      planets_x.push(p.random(p.width / 8, 7 * p.width / 8));
      planets_y.push(p.random(height / 6, 5 * p.height / 6));
      planets_d.push(p.random(min_planet_d, max_planet_d));

      planets.push(new Planet(planets_x[i], planets_y[i], planets_d[i], false));
    }
  }

  function rounded_border() {
    p.push()
    p.strokeWeight(7);
    p.stroke('#fefce3');
    p.noFill();
    p.rect(p.width / 2, p.height / 2, p.width, p.height, 8, 8, 8, 8);
    p.pop()
  }

  // function keyPressed() {
  //   if (keyCode === 32) {
  //     loop();
  //   }
  // }

  // <------------- END GAME FUNCTIONS -------------> //
}

let myp5 = new p5(sketch);
