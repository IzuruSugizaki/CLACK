function collatz(n) {
  while (n !== 1) {
    document.body.innerHTML += `nの値が${n}になりました。<br>`;
    if (n % 2 === 0) {
      n = n / 2;
    } else {
      n = n * 3 + 1;
    }
  }
  document.body.innerHTML += `nの値が${n}になりました。<br>`;
  document.body.innerHTML += '終了';
}

collatz(10); // Example call with a starting value of 10