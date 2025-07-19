//入力ホームとボタンの要素を取得
const date = document.getElementById('date')
const time = document.getElementById('time')
const giver = document.getElementById('giver')
const topping = document.getElementById('topping')
const button = document.getElementById('button')
const petlist = document.getElementById('petlist')


//petのご飯を記録格納用
//let petRecords = [];

//localstrageにデータを追加する
const addPetRecord = () => {
  if(!date.value || !time.value || !giver.value || !topping.value) {
    alert('すべてのフィールドを入力してください。');
    return;
  } else {
    const record = {
      date: date.value,
      time: time.value,
      giver: giver.value,
      topping: topping.value
    };
    
    let localStorageNum = localStorage.length;
    //petRecords.push(record);
    localStorage.setItem(localStorageNum, JSON.stringify(record));
    
    // フォームをリセット
    date.value = '';
    time.value = '';
    giver.value = '';
    topping.value = '';

    //画面に表示をする関数を呼び出す。
    displayPetRecords();
  }
};

//localstrageのデータを表示する
const displayPetRecords = () => {
  petlist.innerHTML = ''; // 既存のリストをクリア
  for (let i = 0; i < localStorage.length; i++) {
    const record = JSON.parse(localStorage.getItem(i));
    if (record) {
      const listItem = document.createElement('div');
      listItem.className = "card";
      listItem.innerHTML = `
      日付📅${record.date}<br>
      時間⏰${record.time} <br>
      ご飯をあげた人👤${record.giver} <br>
      トッピング🍽️${record.topping}`;
      petlist.appendChild(listItem);
    }
  }
};

//登録を押すとデータを追加する
button.addEventListener("click", addPetRecord);