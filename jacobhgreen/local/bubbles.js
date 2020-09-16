var r_small = 100;
var r_big = 150;
var frame = 0;
// var

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', -1)

  // Turn transparency on
  // Get html reference for p5 canvas
  var ctx = canvas.elt.getContext("2d");
  ctx.globalAlpha = 0.5;

  // frameRate(45);

  bubbles = []
  n = Math.floor(width / 40)
  for (i = 0; i < n; i++) {
    bubbles.push(new Bubble());
  }

  pop_sound = loadSound('audio/pop_sound.wav');
}

function draw() {
  clear()
  background(144, 202, 249, 0);

  for (i = 0; i < bubbles.length; i++) {
    bubbles[i].update();
    bubbles[i].show();
    bubbles[i].popped();

    if (bubbles[i].offscreen()) {
      bubbles[i].reset();
    }
  }
  // console.log('hi');
}

class Bubble {

  constructor() {
    this.r = random(r_small, r_big);
    this.x = random(0, width);
    // this.y = random(height + this.r, height + this.r + 200);
    this.y = random(0, height);


    this.vx = 0;
    // this.vy = random(-1, -2);
    this.vy = -0.5;

    this.img = loadImage('images/bubble_green.svg');
    this.img_popping = loadImage('images/popping.svg');

    this.pop_time = -1;
    this.pop_x = 0;
    this.pop_y = 0;
    this.pop_w = 0;
    this.pop_h = 0;

    this.xoff = random(-5.0, 5.0);
    this.xoff_sin = random(0, TWO_PI);
  }

  update() {
    // Generate noise
    this.xoff += random(-0.1, 0.1);
    this.xoff_sin += 0.1;
    // console.log(xoff)

    // Change position
    this.x += this.vx;
    this.y += this.vy;

    // Change size
    var grow = 0.2;
    // this.r += grow;
    this.r = 40 * (height - this.y) / height + 40

    // Accelerate
    var acc_coeff = 0.00001;
    this.vy -= (acc_coeff * this.r);

    // Wobble
    // this.vx = 0.1 * sin(this.xoff_sin)
    this.vx += (noise(this.xoff) - 0.5) * 0.01

    // Update frame
    frame++;
  }

  show() {
    // ellipse(this.x, this.y, this.r, this.r);
    var x = this.x - this.r / 2;
    var y = this.y - this.r / 2;
    image(this.img, x, y, this.r, this.r)
  }

  offscreen() {
    if (this.y < 0 - this.r || this.x + this.r < 0 || this.x - this.r > width) {
      return true
    } else {
      return false
    }
  }

  reset() {
    // Reset below screen
    this.r = random(r_small, r_big)
    this.x = random(0, width);
    // this.y = random(height + this.r, height + this.r);
    this.y = height + this.r;

    this.vx = 0;
    this.vy = -random(0, 1);
    // this.vy = -0.1;
  }

  popped() {
    // if (mousePressed() && distance(this.x, this.y, mouseX, mouseY) < this.r) {
    if (distance(this.x, this.y, mouseX, mouseY) < this.r) {

      // Record where the bubble popped and its size at the time
      this.pop_w = 1.4 * this.r;
      this.pop_h = 0.6 * this.r;
      this.pop_x = this.x - this.pop_w / 2;
      this.pop_y = this.y - this.pop_h / 2;

      // Record the pop time, play the sound and reset the bubble
      image(this.img_popping, this.pop_x, this.pop_y, this.pop_w, this.pop_h);
      this.pop_time = second()
      pop_sound.play()
      this.reset();
    }

    // Keep drawing the droplets for 0.1s after popping
    // if (second() - this.pop_time < 0.05) {
    //   image(this.img_popping, this.pop_x, this.pop_y, this.pop_w, this.pop_h);
    // }
  }

}

function distance(x1, y1, x2, y2) {
  var x = x1 - x2;
  var y = y1 - y2;

  return Math.sqrt(pow(x, 2) + pow(y, 2));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// function mousePressed() {
//   print('click');
//   return true;
// }
