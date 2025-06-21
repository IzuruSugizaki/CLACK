let game = {
  startTime: null,
  stopTime: null,
  secondes: null,
  option: {
    once: true,
  },
  displayArea: document.getElementById('display-area'),
  start: function () {
    game.startArea.innerText = '計測中';
    game.startTime = Date.now();
  },
  stop: function () {
    document.body.addEventListener('keydown', game.retry, game.option);
    game.stopTime = Date.now();
    game.secondes = (game.stopTime - game.startTime) / 1000;

    if(9.5 )
}