let age = Math.floor(Math.random() * 100);
let isMember = true;
let result = null;
if (age <= 15) {
  result = 800;
} else if (isMember) {
  result = 1000;
} else {
  result = 1800;
}
document.body.append(result);