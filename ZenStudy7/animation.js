let heading = document.getElementById("heading");
let degree = 0;

function rotateHeading() {
  degree = degree + 6;
  heading.style.transform = 'rotateX(' + degree + 'deg)';
}
setInterval(rotateHeading, 10);