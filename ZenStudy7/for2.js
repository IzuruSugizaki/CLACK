let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
let names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

for (let i = 0; i < alphabet.length; i++) {
  for (let j = 0; j < names.length; j++) {
    document.body.innerHTML += alphabet[i] + names[j];
  }
}