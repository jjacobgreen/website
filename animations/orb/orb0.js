let orb_sketch = function(p) {

  var mobile = false;
  var fr;
  var frame;
  var omega = 0.05;

  // Box sizes
  var w = 18;
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

  p.setup = function() {
    // Adjustments for mobile
    if (p.windowWidth < 400) {
      mobile = true;
    }
    if (mobile) {
      canvas = p.createCanvas(p.windowWidth * 0.9, p.windowHeight * 0.85, p.WEBGL);
    } else {
      canvas = p.createCanvas(400, 400, p.WEBGL);
    }
    // Places script within specific div in page!
    canvas.parent('orb_div');
    // Sliders
    // x_slider = p.createSlider(0, 10, 0, 0.05);
    // x_slider.position(10, 10);
    // z_slider = p.createSlider(0, 10, 0, 0.05);
    // z_slider.position(10, 30);
    // r_slider = p.createSlider(0, 10, 0.05, 0.05);
    // r_slider.position(10, 50);

    // Display framrate
    // fr = createP('');
    frame = 0;
    p.colorMode(p.HSB);

    // Camera settings
    p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, 0, 500);

    // Aesthetics
    // noStroke();
    p.strokeWeight(1);
  }

  p.draw = function() {
    frame++;
    p.background(56, 11, 100);

    // Sliders
    // x_step = x_slider.value();
    // z_step = z_slider.value();
    // r_off_k = r_slider.value();
    x_step = 0;
    z_step = 0;
    r_off_k = -0.05;


    // Rotate view
    p.push();
    p.translate(0, 0, 0);
    p.rotateX(-p.QUARTER_PI);
    p.rotateY(p.QUARTER_PI);
    // p.rotateY(p.millis() / 2000);

    // Plotting in x-z plane
    x_off = 0;
    z_off = 0;
    for (var i = -n / 2; i < n / 2; i++) {
      var x = (w + spacing) * i;
      x_off += x_step;

      for (var k = -m / 2; k < m / 2; k++) {
        var z = (w + spacing) * k;
        z_off += z_step;

        d = p.dist(-w / 2, 0, -w / 2, x, 0, z);
        r_off = r_off_k * d;

        // Draw boxes
        p.push();
        p.translate(x, 0, z); // Translates from previous position, not (0, 0), hence push/pop!

        var angle = (omega * frame) % p.TWO_PI + x_off + z_off + r_off;
        var h = amp_min + (amp * (p.sin(angle) + 1));

        hu = h % 255;
        // fill(hu);
        p.fill(hu, 50, 2550);
        p.box(w, h, w);
        p.pop();
      }
    }
    p.pop();

    // fr.html(floor(frameRate()));
  }
}

let orb_p5 = new p5(orb_sketch);
