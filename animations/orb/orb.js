var mobile = false;
var fr;
var frame;
var omega = 0.05;

// Box sizes
var w = 20;
var amp = 80;
var amp_min = 20;

// Grid dimensions
var n = 11;
var m = 11;
// var spacing = w / 2;
var spacing = 0;

// Oscillation offsets
var x_off = 0;
var z_off = 0;
var x_step = 1;
var z_step = 0.2;

function setup() {
  // Adjustments for mobile
  if (windowWidth < 400) {
    mobile = true;
  }
  if (mobile) {
    canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.85, WEBGL);
  } else {
    canvas = createCanvas(600, 600, WEBGL);
  }
  // Places script within specific div in page!
  canvas.parent('orb_div');
  // Sliders
  x_slider = createSlider(0, 10, 0, 0.05);
  x_slider.position(10, 10);
  z_slider = createSlider(0, 10, 0, 0.05);
  z_slider.position(10, 30);
  r_slider = createSlider(-5, 5, 0.05, 0.05);
  r_slider.position(10, 50);

  // Display framrate
  fr = createP('');
  frame = 0;
  colorMode(HSB);

  // Camera settings
  ortho();

  // Aesthetics
  // noStroke();
  strokeWeight(1);
}

function draw() {
  frame++;
  background(56, 11, 100);

  // Sliders
  x_step = x_slider.value();
  z_step = z_slider.value();
  r_off_k = r_slider.value();

  // Rotate view
  push();
  translate(0, 0, 0);
  rotateX(-QUARTER_PI);
  rotateY(QUARTER_PI);
  // Plotting in x-z plane
  x_off = 0;
  z_off = 0;
  for (var i = -n / 2; i < n / 2; i++) {
    var x = (w + spacing) * i;
    x_off += x_step;

    for (var k = -m / 2; k < m / 2; k++) {
      var z = (w + spacing) * k;
      z_off += z_step;

      d = dist(-w / 2, 0, -w / 2, x, 0, z);
      r_off = -r_off_k * d;

      // Draw boxes
      push();
      translate(x, 0, z); // Translates from previous position, not (0, 0), hence push/pop!

      var angle = (omega * frame) % TWO_PI + x_off + z_off + r_off;
      var h = amp_min + (amp * (sin(angle) + 1));

      hu = h % 255;
      // fill(hu);
      fill(hu, 50, 2550);
      box(w, h, w);
      pop();
    }
  }
  pop();

  fr.html(floor(frameRate()));
}
