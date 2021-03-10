const canvas = document.querySelector("canvas");

// set canvas size to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// resize the canvas if the window is resized
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// get the context of the canvas to draw something in it
const c = canvas.getContext("2d");

// circle class used to generate circles with different properties
// each circles have it's own color, starting position, direction and velocity
class Circle {
  constructor(x, y, dx, dy, radius) {
    this.red = Math.random() * 256;
    this.green = Math.random() * 256;
    this.blue = Math.random() * 256;

    this.radius = radius;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  // draw the circle in the canvas with a specific position
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = `rgba(${this.red}, ${this.green}, ${this.blue}, 0.3)`;
    c.fill();
  }

  // get the next position of the circle to be rendered
  // also check if the circle hits the boundary of the window
  // revert the direction of the circle if it hits the boundary of the window
  update(targeted) {
    this.x += this.dx;
    this.y += this.dy;

    if (
      this.x + this.radius >= window.innerWidth ||
      this.x - this.radius <= 0
    ) {
      this.dx = -this.dx;
    } else if (
      this.y + this.radius >= window.innerHeight ||
      this.y - this.radius <= 0
    ) {
      this.dy = -this.dy;
    }

    // enlarge the circle if it enters the radius of the cursor position
    // else revert the radius of the circle back to it's smaller size
    if (targeted) {
      this.radius = 50;
    } else {
      this.radius = 5;
    }

    // draw the circle again after determining it's next position
    this.draw();
  }
}

// function to generate circles in the canvas
const generateCircles = (number) => {
  const circles = [];
  let lastX = null;
  let lastY = null;

  // instantiate number of circles based on the given parameter
  // circle objects are then stored in the array
  for (i = 0; i < number; i++) {
    const radius = 20;
    const x = Math.random() * (window.innerWidth - radius * 2) + radius;
    const y = Math.random() * (window.innerHeight - radius * 2) + radius;
    const dx = (Math.random() - 0.5) * 10;
    const dy = (Math.random() - 0.5) * 10;

    const circle = new Circle(x, y, dx, dy, radius);
    circles.push(circle);
  }

  // function to print each frame of the canvas
  // it is an infinite loop that will keep render each frame non stop
  const animate = () => {
    // erase the contents in the previous frame
    // remove this line of code for SPECIAL EFFECTS
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    // function to render the next frame
    // calling animate (itself) function again, thus the infinite loop
    requestAnimationFrame(animate);
    // check if the circles are in the radius of the cursor
    // if so pass in a true value to the update function
    for (i = 0; i < number; i++) {
      if (lastX && lastY) {
        if (
          circles[i].x >= lastX - 100 &&
          circles[i].x <= lastX + 100 &&
          circles[i].y >= lastY - 100 &&
          circles[i].y <= lastY + 100
        ) {
          circles[i].update(true);
        } else {
          circles[i].update(false);
        }
      } else {
        circles[i].update(false);
      }
    }

    // store the last position of the cursor in a variable
    // if the cursor is near the boundary of the window,
    // consider the cursor has left the window and store null into the position variables
    window.addEventListener("mousemove", (e) => {
      if (
        e.clientX <= 20 ||
        e.clientX >= window.innerWidth - 20 ||
        e.clientY <= 20 ||
        e.clientY >= window.innerHeight - 20
      ) {
        lastX = null;
        lastY = null;
        return;
      }
      lastX = e.clientX;
      lastY = e.clientY;
    });

    // store null value into the cursor position variable if mouse left
    window.addEventListener("mouseleave", () => {
      lastX = null;
      lastY = null;
    });
  };

  // calling the animate function once to start the loop
  animate();
};

// generate circles in the canvas
generateCircles(400);
