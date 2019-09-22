
let people = [];
let locations = [];

let a = 1;
let xLoc = 0;
let maxY = 0;
let maxX = 0;
let minY = 999;
let minX = 999;
let v;

function setup() {
  createCanvas(600, 600);
  // person = new Person(createVector(Math.round(random(50, width - 50)), Math.round(random(50, height - 50))));

  for (let i = 0; i < 12; i++ ) {
    let rv = createVector(Math.round(random(50, width - 50)), Math.round(random(50, height - 50)));
    people.push(new Person(rv, [random(0, 255), random(0, 255), random(0, 255)], 'L '+(i+1)))
  }
  background(220);

  v = createVector(5, 1);

}

function draw() {
  background(220);


  // fill(0, 0, 0, 0)
  // stroke(0, 0, 0);
  // quad(minX, minY, maxX, minY, maxX, maxY, minX, maxY)

  people.map(person => {
    person.show();

    if (!person.bonded) {

      people.filter(hito => hito.rest == 0 && hito.name !== person.name && !(person.ex && person.ex.name == hito.name)).map((hito) => {
        if (!person.bonded && !hito.bonded && dist(person.vec.x, person.vec.y, hito.vec.x, hito.vec.y) < 40) {
          hito.active = false;
          person.bond(hito);
          person.active = true;
        }
      })
    }
    

    if (person.active && person.bonded) person.dance(person.bonded);
    if (!person.bonded || !person.active) person.wander();


    if (person.vec.x > maxX) maxX = person.vec.x;
    if (person.vec.y > maxY) maxY = person.vec.y;

    if (person.vec.x < minX) minX = person.vec.x;
    if (person.vec.y < minY) minY = person.vec.y;

    if (person.needsToFlee()) {
      person.flee()
    }
  });

  // xLoc += 1;
  // if (xLoc >= width) {
  //   xLoc = 0;
  //   background(220);

  // }
  a += 0.05;
}

function mouseClicked() {
  people.map(person => person.target = null)

  let clicked = people.filter(person => dist(mouseX, mouseY, person.vec.x, person.vec.y) < 20)[0]
  console.log(clicked);

  if (clicked) {
    clicked.setTarget(mouseX, mouseY)
  }
  // person.setTarget(mouseX, mouseY)
}
