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


function preload() {
  rocket_img = loadImage('rocket2.gif');
  black_hole_img = loadImage('black_hole2.gif');
}

// <------------- SETUP -------------> //
function setup() {
  // Adjustments for mobile
  if (windowWidth < 400) {
    mobile = true;
  }
  if (windowWidth < 400) {
    canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.85);
    // min_planet_d = 5;
    max_planet_d = 60;
  } else {
    canvas = createCanvas(600, 600);
  }
  textSize(16);
  textFont('Courier')
  noStroke();

  imageMode(CENTER);
  rectMode(CENTER);

  var n_stars = (width * height) / 10000;
  for (var i = 0; i < n_stars; i++) {
    stars.push(new Star());
  }

  // Create rocket, hole and planets
  var start_x = diameter;
  var start_y = height - diameter;
  var hole_x = width - diameter;
  var hole_y = diameter;
  // To check win screen
  // var hole_x = diameter;
  // var hole_y = height - 3 * diameter;
  rocket = new Rocket(start_x, start_y);
  hole = new Hole(hole_x, hole_y);
  hud = new HUD();

  home_planet = new Planet(0, height, 70, true);
  planet1 = new Planet(0.66 * width, 0.2 * height, max_planet_d, false);
  planet2 = new Planet(0.4 * width, 0.66 * height, 60, false);

  planets.push(home_planet);
  planets.push(planet1);
  planets.push(planet2);

  // frameRate(2);
}
// <------------- END SETUP -------------> //


// <------------- GAME LOOP -------------> //
function draw() {

  if (gameMode == 0) {
    // gameMode = welcome_screen(width, height);
    welcome_screen(width, height);
    rounded_border();
  }
  if (gameMode == 1) {
    background(15);

    if (lives < 1) {
      gameMode = 2;
    } else {
      gameMode = 1;
    }

    // Stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].show();
    }
    // Planets (1. Show all planets)
    for (var i = 0; i < planets.length; i++) {
      current = planets[i];
      current.show();
    }

    // Initiate launch sequence if not launched yet or it's crashed
    if (!rocket.launched || rocket.crashed) {
      rocket.launch_sequence();
    }

    // Rocket (1. Check if reached hole, 2. Check if hit a planet, 3. Check if it's hit the side, 5. Check if boosted, 4. Update the rocket, 4. Show the rocket
    if (rocket.check_collisions(planets) || rocket.offscreen()) {
      lives--;
      rocket.relaunch();
    }
    if (rocket.reached_hole(hole)) {
      // NEW LEVEL
      new_level();
      gameMode = 4;
      rocket.relaunch();
    }

    rocket.boost();
    rocket.update(planets, hole);
    rocket.show();

    // Hole (1. Show the hole)
    hole.show();

    // HUD
    fill(0, 120, 255);
    hud.show_launch_velocity(rocket);
    hud.show_velocity(rocket);

    hud.show_lives(lives);
    hud.show_score(score);

    rounded_border();
  }

  if (gameMode == 2) {
    game_over_screen();
    rounded_border();
  }

  if (gameMode == 4) {
    level_complete(width, height);
  }
  // console.log(gameMode);
}
// <------------- END GAME LOOP -------------> //

// <------------- GAME FUNCTIONS -------------> //
function level_complete(width, height) {
  push();
  textSize(24);
  fill(220);
  textAlign(CENTER, CENTER);
  text('Well done!', width / 2, height / 2);
  textSize(20);
  text('Click to continue', width / 2, height / 2 + 45);
  pop();

  lives = max_lives;
  if (mouseIsPressed) {
    setTimeout(() => {
      gameMode = 1;
    }, 300);
  }
}

function welcome_screen(width, height) {
  push();
  var play_button_width = 120;
  var play_button_height = 60;
  var button_offset = 80;

  textSize(24);
  background(15);
  textAlign(CENTER, CENTER);
  fill(240);
  text('Rocket Golf', width / 2, height / 2);
  rect(width / 2, height / 2 + button_offset, play_button_width, play_button_height);
  fill(0);
  text('Play', width / 2, height / 2 + button_offset);
  fill(255);

  // Mouse interactivity (hover and click)
  if ((width / 2 - play_button_width / 2 < mouseX) && (mouseX < width / 2 + play_button_width / 2) && (height / 2 + 80 - play_button_height / 2 < mouseY) && (mouseY < height / 2 + 80 + play_button_height / 2)) {
    fill(100);
    strokeWeight(4);
    stroke(150);
    rect(width / 2, height / 2 + button_offset, play_button_width, play_button_height);
    noStroke();
    fill(240);
    text('Play', width / 2, height / 2 + button_offset);

    if (mouseIsPressed) {
      stroke(51);
      fill(120);
      rect(width / 2, height / 2 + button_offset, play_button_width, play_button_height);
      noStroke();
      fill(220);
      text('Play', width / 2, height / 2 + button_offset);
      // return 1;
      setTimeout(() => {
        gameMode = 1;
      }, 200);
    }
  }

  pop();
  return 0;
}

function game_over_screen() {
  push();
  clear();
  background(15);

  // Stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
  }

  textAlign(CENTER, CENTER);
  textSize(40);
  fill(200, 50, 50);
  text('Game over!', width / 2, height / 2);
  textSize(20);
  text('Final score: '.concat(score.toString()), width / 2, height / 2 + 30);

  var play_button_width = 140;
  var play_button_height = 60;
  var button_offset = 80;

  fill(240);
  rect(width / 2, height / 2 + button_offset, play_button_width, play_button_height);
  fill(0);
  text('Play again', width / 2, height / 2 + button_offset);
  fill(255);

  // Mouse interactivity (hover and click)
  if ((width / 2 - play_button_width / 2 < mouseX) && (mouseX < width / 2 + play_button_width / 2) && (height / 2 + 80 - play_button_height / 2 < mouseY) && (mouseY < height / 2 + 80 + play_button_height / 2)) {
    fill(100);
    strokeWeight(4);
    stroke(150);
    rect(width / 2, height / 2 + button_offset, play_button_width, play_button_height);
    noStroke();
    fill(240);
    text('Play again', width / 2, height / 2 + button_offset);

    if (mouseIsPressed) {
      stroke(51);
      fill(120);
      rect(width / 2, height / 2 + button_offset, play_button_width, play_button_height);
      noStroke();
      fill(220);
      text('Play again', width / 2, height / 2 + button_offset);

      setTimeout(() => {
        gameMode = 1;
      }, 200);
      new_level();
      lives = max_lives;
      score = 0;
    }
  }

  pop();
}

function new_level() {
  score++;
  planets = [];
  var n_planets = random(1, 4);
  var planets_x = [];
  var planets_y = [];
  var planets_d = [];

  for (var i = 0; i < n_planets; i++) {
    planets_x.push(random(width / 8, 7 * width / 8));
    planets_y.push(random(height / 6, 5 * height / 6));
    planets_d.push(random(min_planet_d, max_planet_d));

    planets.push(new Planet(planets_x[i], planets_y[i], planets_d[i], false));
  }
}

function rounded_border() {
  push()
  strokeWeight(7);
  stroke('#fefce3');
  noFill();
  rect(width / 2, height / 2, width, height, 8, 8, 8, 8);
  pop()
}

// function keyPressed() {
//   if (keyCode === 32) {
//     loop();
//   }
// }

// <------------- END GAME FUNCTIONS -------------> //


// Maybe change mass to prop to r^2 not r^3 and F to r not r^2
