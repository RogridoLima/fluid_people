

class Person {

  constructor(vector, colors = [220, 0, 0], name = 'p') {
    this.name = name;
    this.colors = colors;
    this.vec = vector;
    this.target = null;
    this.radius = 20;
    this.xOff = vector.x;
    this.yOff = vector.y;
    this.aOff = random( sq(vector.x + vector.y) );
    this.active = false;
    this.bonded = null;
    this.ex = '';

    this.dancingMoves = 0;
    this.restingTime = random(40, 120);
    this.rest = 0;
    this.speak = 0;
  }
  
  needsToFlee() {
    // return this.target
    return this.target && dist(this.vec.x, this.vec.y, this.target.x, this.target.y) < 200
    // return dist(this.vec.x, this.vec.y, mouseX, mouseY) < 200
  }

  forget() {
    this.ex = this.bonded;
    
    this.bonded = null;
    this.active = false;


    let oldEx = this.ex ? this.ex.name : '';
    setTimeout(() => {
      if (oldEx == this.ex ? this.ex.name : '') this.ex = '';
    }, 20000);
  }

  wander() {
    let x, y;

    let ratio = 0.03;
    if (this.rest > 0) ratio = 0.003;
    
    this.xOff += 0.005;
    this.yOff += 0.006;
    x = noise(this.xOff) * (width);
    y = noise(this.yOff) * (width);

    this.vec.set(lerp(this.vec.x, x, ratio), lerp(this.vec.y, y, ratio));
  }

  say(phrase) {
    fill(120)
    text(phrase, this.vec.x + 20, this.vec.y - 7.5);
  }

  dance() {
    if (!this.active) return;

    let x1,y1;
    
    x1 = this.bonded.vec.x + (sin(this.dancingMoves) * 30);
    y1 = this.bonded.vec.y + (cos(this.dancingMoves) * 30);
    
    stroke(...this.colors)
    strokeWeight(3)
    line(this.bonded.vec.x, this.bonded.vec.y, this.vec.x, this.vec.y)
    strokeWeight(1)

    this.vec.set(x1, y1)

    this.dancingMoves += 0.02;
  }

  bond(person) {
    if (this.bonded) return;
    this.bonded = person;
    person.bonded = this;

    setTimeout(() => {
      this.forget();
      person.forget();
    }, random(1000, 12000));
  }

  show() {

    let x, y;

    if (this.rest == 0) {
      if (this.speak > 0) {
        fill(120)
        this.say('back to action!')
      }

      y = this.vec.y + cos(noise(this.aOff) * 155);
      x = this.vec.x + sin(noise(this.aOff) * 155);
      this.speak--
    }

    if (this.rest > 0) {
      if (this.needsToFlee()) {
        fill(120)
        this.say('ahh!! run run!!')
      }
      y = this.vec.y;
      x = this.vec.x;

      if (!this.needsToFlee()) {
        fill(120)
        this.say('that was close..')
        this.rest--;
        if (this.rest == 0) this.speak = 60;
      }
    }

    fill(...this.colors);

    text(this.name, x - 5, y - 15);
    stroke(0);
    ellipse(x, y, this.radius, this.radius);

    stroke(200, 200, 200)
    // if (this.target)  ellipse(this.target.x, this.target.y, 10, 10);
    stroke(0)

    this.aOff += random(0.003, 0.001);
  }

  setTarget(x, y) {
    this.target = createVector(x, y);
  }

  flee() {
    if (!this.target) return;
    if (this.bonded) {
      this.bonded.forget();
      this.forget();
    }

    this.rest += 1;

    strokeWeight(1)
    stroke(0);
    
    // formula para espelhar localmente em um plano 2d:
    // x = Ex + (Ex - Xx)
    // y = Ey + (Ey - Xy)
    // E: ponto onde separa os lados
    // X: ponto a ser espelhado
    // x/y: coordenada espelhada

    let x1, y1, x2, y2;

    let oldVec = this.vec.copy();
    let ratio = 0.019;
    
    x2 = oldVec.x + ((oldVec.x - this.target.x)* 2)
    y2 = oldVec.y + ((oldVec.y - this.target.y)* 2)

    this.vec.set(lerp(this.vec.x, x2, ratio), lerp(this.vec.y, y2, ratio));

    // fill(0);
    // text('flee point', x2 - 15, y2 - 15)
    // ellipse(x2, y2, 23, 23)
    
    // fill(...this.colors);
    // text('mirror', x1 - 15, y1 - 15)
    // ellipse(x1, y1, 20, 20)

    // stroke(255, 0, 0);
    // line(x1, y1, oldVec.x, oldVec.y)


    // fill(0, 0, 0, 0.5);

    if (!this.needsToFlee()) this.target = null
  }

}