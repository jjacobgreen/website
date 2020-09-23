let supershape_sketch = function(p) {

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

  p.setup = function() {
    // Adjustments for mobile
    if (p.windowWidth < 400) {
      mobile = true;
    }
    if (mobile) {
      canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.85, p.WEBGL);
    } else {
    canvas = p.createCanvas(400, 400, p.WEBGL);
    }
    // Places script within specific div in page!
    canvas.parent('supershape_div');
    // fr = createP('');

    p.colorMode(this.HSB);
  }

  function radius(angle, m, n1, n2, n3) {
    t1 = p.abs((1 / a) * p.cos(m * angle / 4));
    // console.log(t1);
    t1 = p.pow(t1, n2);
    t2 = p.abs((1 / b) * p.sin(m * angle / 4));
    t2 = p.pow(t2, n3);
    t3 = t1 + t2;
    var rad = p.pow(t3, -1 / n1);
    return rad;
  }

  p.draw = function() {
    p.background(0);
    // p.background(56, 11, 100);

    m = p.map(p.sin(mchange), -1, 1, 0, 7);
    mchange += 0.02;

    // Light
    // ambientLight(100, 100, 100);
    // rotateX(millis() / 1000);
    p.pointLight(0, 0, 255, 0, 1, -1);
    // pointLight(hu, 255, 255, width, height, 20);
    p.directionalLight(0, 0, 255, 1, 1, 0);
    p.directionalLight(0, 0, 255, -1, -1, 0);


    p.specularMaterial(hu, 50, 255);
    p.shininess(100);

    // Rotation
    p.rotateX(p.millis() / 1000);
    p.rotateY(p.millis() / 1000);
    p.rotateZ(p.millis() / 1000);
    // orbitControl(10, 10, 10);

    // Aesthetics
    p.strokeWeight(1);
    p.noStroke();
    // stroke(hu / 2);
    // fill(hu, 255, 255);


    // Get points
    // i (theta), j (phi)
    for (let i = 0; i < res + 1; i++) {
      var theta = p.map(i, 0, res, -p.HALF_PI, p.HALF_PI);
      var r2 = radius(theta, m, 0.2, 1.7, 1.7);
      // var r2 = radius(theta, m, 3000, 1000, 1000);

      for (let j = 0; j < res + 1; j++) {
        var phi = p.map(j, 0, res, -p.PI, p.PI);
        var r1 = radius(phi, m, 0.2, 1.7, 1.7);
        // var r1 = radius(phi, m, 250, 100, 100);
        var x = r * r1 * p.cos(phi) * r2 * p.cos(theta);
        var y = r * r1 * p.sin(phi) * r2 * p.cos(theta);
        var z = r * r2 * p.sin(theta);

        shape[i][j] = p.createVector(x, y, z);
      }
    }

    // Plot points
    p.beginShape(p.TRIANGLE_STRIP);
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res + 1; j++) {
        p.vertex(shape[i][j].x, shape[i][j].y, shape[i][j].z);
        p.vertex(shape[i + 1][j].x, shape[i + 1][j].y, shape[i + 1][j].z);
      }
    }
    p.endShape();

    // fr.html(floor(frameRate()));

    hu = hu + 1;
    hu = p.floor(hu % 255);
  }
}

let supershape_p5 = new p5(supershape_sketch);
