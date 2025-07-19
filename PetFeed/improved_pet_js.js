//入力ホームとボタンの要素を取得
const date = document.getElementById('date')
const time = document.getElementById('time')
const giver = document.getElementById('giver')
const topping = document.getElementById('topping')
const button = document.getElementById('button')
const petlist = document.getElementById('petlist')

// 定数
const STORAGE_KEY = 'petFeedingRecords';

//petのご飯を記録格納用
let petRecords = [];

// localStorageからデータを読み込み
const loadPetRecords = () => {
  try {
    const storedRecords = localStorage.getItem(STORAGE_KEY);
    if (storedRecords) {
      petRecords = JSON.parse(storedRecords);
    }
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    petRecords = [];
  }
};

// localStorageにデータを保存
const savePetRecords = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(petRecords));
  } catch (error) {
    console.error('データの保存に失敗しました:', error);
    alert('データの保存に失敗しました。');
  }
};

//データを追加する
const addPetRecord = () => {
  if(!date.value || !time.value || !giver.value || !topping.value) {
    alert('すべてのフィールドを入力してください。');
    return;
  }

  const record = {
    id: Date.now(), // ユニークなIDを生成
    date: date.value,
    time: time.value,
    giver: giver.value,
    topping: topping.value,
    timestamp: new Date().toISOString() // 作成日時を記録
  };
  
  petRecords.push(record);
  savePetRecords();
  
  // フォームをリセット
  date.value = '';
  time.value = '';
  giver.value = '';
  topping.value = '';

  displayPetRecords();
};

// データを削除する
const deletePetRecord = (id) => {
  if (confirm('この記録を削除しますか？')) {
    petRecords = petRecords.filter(record => record.id !== id);
    savePetRecords();
    displayPetRecords();
  }
};

// 日付フォーマット関数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

//データを表示する
const displayPetRecords = () => {
  petlist.innerHTML = ''; // 既存のリストをクリア
  
  if (petRecords.length === 0) {
    petlist.innerHTML = '<p>まだ記録がありません。</p>';
    return;
  }

  // 日付と時間でソート（新しい順）
  const sortedRecords = petRecords.sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateB - dateA;
  });

  sortedRecords.forEach(record => {
    const listItem = document.createElement('div');
    listItem.className = "card";
    listItem.innerHTML = `
      <div class="card-content">
        <div class="card-header">
          <span class="date">📅 ${formatDate(record.date)}</span>
          <button class="delete-btn" onclick="deletePetRecord(${record.id})">❌</button>
        </div>
        <div class="card-body">
          <p>⏰ ${record.time}</p>
          <p>👤 ${record.giver}</p>
          <p>🍽️ ${record.topping}</p>
        </div>
      </div>`;
    petlist.appendChild(listItem);
  });
};

// 今日の日付を初期値として設定
const setTodayAsDefault = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  date.value = formattedDate;
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  time.value = `${hours}:${minutes}`;
};

// 初期化
const init = () => {
  loadPetRecords();
  displayPetRecords();
  setTodayAsDefault();
};

//登録を押すとデータを追加する
button.addEventListener("click", addPetRecord);

// ページ読み込み時に初期化
window.addEventListener('load', init);