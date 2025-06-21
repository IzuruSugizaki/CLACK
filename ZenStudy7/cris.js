let nextChristmas = new Date('2025-12-25 00:00');
let now = new Date();
let seconds = (nextChristmas.getTime() - now.getTime()) / 1000;
document.getElementById('next-christmas').innerText =
  '次のクリスマスまで後' + seconds + '秒。';