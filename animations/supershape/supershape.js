var res = 50;
var r = 100;
var shape = Array(res + 1).fill(null).map(() => Array(res + 1).fill(null));
var fr;
var hu = 0;

var m;
var mchange = 0;
var a = 1;
var b = 1;

var mobile = false;

function setup() {
  // Adjustments for mobile
  if (windowWidth < 400) {
    mobile = true;
  }
  if (mobile) {
    canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.85, WEBGL);
    // min_planet_d = 5;
    max_planet_d = 60;
  } else {
    canvas = createCanvas(600, 600, WEBGL);
  }
  // Places script within specific div in page!
  canvas.parent('supershapes_div');
  // fr = createP('');

  colorMode(HSB);
}

function radius(angle, m, n1, n2, n3) {
  t1 = abs((1 / a) * cos(m * angle / 4));
  // console.log(t1);
  t1 = pow(t1, n2);
  t2 = abs((1 / b) * sin(m * angle / 4));
  t2 = pow(t2, n3);
  t3 = t1 + t2;
  var rad = pow(t3, -1 / n1);
  return rad;
}

function draw() {
  background(0);

  m = map(sin(mchange), -1, 1, 0, 7);
  mchange += 0.02;

  // Light
  // ambientLight(100, 100, 100);
  // rotateX(millis() / 1000);
  pointLight(0, 0, 255, 0, 1, -1);
  // pointLight(hu, 255, 255, width, height, 20);
  directionalLight(0, 0, 255, 1, 1, 0);
  directionalLight(0, 0, 255, -1, -1, 0);


  specularMaterial(hu, 255, 255);
  shininess(100);

  // Rotation
  rotateX(millis() / 1000);
  rotateY(millis() / 1000);
  rotateZ(millis() / 1000);
  // orbitControl(10, 10, 10);

  // Aesthetics
  strokeWeight(1);
  noStroke();
  // stroke(hu / 2);
  // fill(hu, 255, 255);


  // Get points
  // i (theta), j (phi)
  for (let i = 0; i < res + 1; i++) {
    var theta = map(i, 0, res, -HALF_PI, HALF_PI);
    var r2 = radius(theta, m, 0.2, 1.7, 1.7);
    // var r2 = radius(theta, m, 3000, 1000, 1000);

    for (let j = 0; j < res + 1; j++) {
      var phi = map(j, 0, res, -PI, PI);
      var r1 = radius(phi, m, 0.2, 1.7, 1.7);
      // var r1 = radius(phi, m, 250, 100, 100);
      var x = r * r1 * cos(phi) * r2 * cos(theta);
      var y = r * r1 * sin(phi) * r2 * cos(theta);
      var z = r * r2 * sin(theta);

      shape[i][j] = createVector(x, y, z);
    }
  }

  // Plot points
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res + 1; j++) {
      vertex(shape[i][j].x, shape[i][j].y, shape[i][j].z);
      vertex(shape[i + 1][j].x, shape[i + 1][j].y, shape[i + 1][j].z);
    }
  }
  endShape();

  // fr.html(floor(frameRate()));

  hu = hu + 1;
  hu = floor(hu % 255);
}
