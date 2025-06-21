// グローバル変数
let feedingRecords = [];
let walkRecords = [];
let familyMembers = [];
let petName = 'ポチ';

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadRecords();
    updateDisplay();
    
    // 設定が未完了の場合は初期設定モーダルを表示
    if (familyMembers.length === 0) {
        showSetupModal();
    }
});

// 初期設定モーダルを表示
function showSetupModal() {
    const setupModal = new bootstrap.Modal(document.getElementById('setupModal'));
    setupModal.show();
}

// 初期設定を保存
function saveInitialSettings() {
    const petNameInput = document.getElementById('setupPetName').value.trim();
    const family1 = document.getElementById('family1').value.trim();
    const family2 = document.getElementById('family2').value.trim();
    const family3 = document.getElementById('family3').value.trim();
    const family4 = document.getElementById('family4').value.trim();

    // バリデーション
    if (!petNameInput || !family1) {
        alert('ペットの名前と最低1人の家族名を入力してください。');
        return;
    }

    // データを保存
    petName = petNameInput;
    familyMembers = [family1];
    if (family2) familyMembers.push(family2);
    if (family3) familyMembers.push(family3);
    if (family4) familyMembers.push(family4);

    saveSettings();
    updateDisplay();
    updateFamilySelects();

    // モーダルを閉じる
    const setupModal = bootstrap.Modal.getInstance(document.getElementById('setupModal'));
    setupModal.hide();
}

// 設定を読み込み
function loadSettings() {
    const savedSettings = localStorage.getItem('petAppSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        petName = settings.petName || 'ポチ';
        familyMembers = settings.familyMembers || [];
    }
}

// 設定を保存
function saveSettings() {
    const settings = {
        petName: petName,
        familyMembers: familyMembers
    };
    localStorage.setItem('petAppSettings', JSON.stringify(settings));
}

// 記録を読み込み
function loadRecords() {
    const savedFeedingRecords = localStorage.getItem('feedingRecords');
    const savedWalkRecords = localStorage.getItem('walkRecords');
    
    if (savedFeedingRecords) {
        feedingRecords = JSON.parse(savedFeedingRecords);
    }
    
    if (savedWalkRecords) {
        walkRecords = JSON.parse(savedWalkRecords);
    }
}

// 記録を保存
function saveRecords() {
    localStorage.setItem('feedingRecords', JSON.stringify(feedingRecords));
    localStorage.setItem('walkRecords', JSON.stringify(walkRecords));
}

// 表示を更新
function updateDisplay() {
    updatePetName();
    updateTodayStats();
    updateFamilySelects();
    displayRecords();
}

// ペット名を更新
function updatePetName() {
    document.getElementById('petName').textContent = petName;
}

// 今日の統計を更新
function updateTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const todayFeeding = feedingRecords.filter(record => record.date === today).length;
    const todayWalk = walkRecords.filter(record => record.date === today).length;
    
    document.getElementById('todayFeeding').textContent = todayFeeding;
    document.getElementById('todayWalk').textContent = todayWalk;
}

// 家族選択肢を更新
function updateFamilySelects() {
    const feedingPersonSelect = document.getElementById('feedingPerson');
    const walkPersonSelect = document.getElementById('walkPerson');
    
    // 既存のオプションをクリア（最初のオプションは残す）
    feedingPersonSelect.innerHTML = '<option value="">選択してください</option>';
    walkPersonSelect.innerHTML = '<option value="">選択してください</option>';
    
    // 家族メンバーを追加
    familyMembers.forEach(member => {
        const feedingOption = new Option(member, member);
        const walkOption = new Option(member, member);
        feedingPersonSelect.add(feedingOption);
        walkPersonSelect.add(walkOption);
    });
}

// 餌やりモーダルを表示
function showFeedingModal() {
    // 現在時刻を設定
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    document.getElementById('feedingTime').value = timeString;
    
    const feedingModal = new bootstrap.Modal(document.getElementById('feedingModal'));
    feedingModal.show();
}

// 散歩モーダルを表示
function showWalkModal() {
    // 現在時刻を設定
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    document.getElementById('walkTime').value = timeString;
    
    const walkModal = new bootstrap.Modal(document.getElementById('walkModal'));
    walkModal.show();
}

// 餌やり記録を追加
function addFeedingRecord() {
    const time = document.getElementById('feedingTime').value;
    const type = document.getElementById('feedingType').value;
    const amount = document.getElementById('feedingAmount').value.trim();
    const person = document.getElementById('feedingPerson').value;
    
    // バリデーション
    if (!time || !type || !amount || !person) {
        alert('すべての項目を入力してください。');
        return;
    }
    
    // 記録オブジェクトを作成
    const record = {
        id: Date.now(), // 簡易的なID生成
        date: new Date().toISOString().split('T')[0],
        time: time,
        type: type,
        amount: amount,
        person: person,
        timestamp: new Date().toISOString()
    };
    
    // 記録を配列に追加
    feedingRecords.unshift(record); // 最新を先頭に
    
    // 最新10件のみ保持
    if (feedingRecords.length > 10) {
        feedingRecords = feedingRecords.slice(0, 10);
    }
    
    // 保存と表示更新
    saveRecords();
    updateDisplay();
    
    // フォームをリセット
    document.getElementById('feedingForm').reset();
    
    // モーダルを閉じる
    const feedingModal = bootstrap.Modal.getInstance(document.getElementById('feedingModal'));
    feedingModal.hide();
    
    console.log('餌やり記録を追加しました:', record);
}

// 散歩記録を追加
function addWalkRecord() {
    const time = document.getElementById('walkTime').value;
    const duration = document.getElementById('walkDuration').value;
    const location = document.getElementById('walkLocation').value.trim();
    const person = document.getElementById('walkPerson').value;

    //確認画面を作成
    
    
    // バリデーション
    if (!time || !duration || !location || !person) {
        alert('すべての項目を入力してください。');
        return;
    }
    
    // 記録オブジェクトを作成
    const record = {
        id: Date.now(), // 簡易的なID生成
        date: new Date().toISOString().split('T')[0],
        time: time,
        duration: duration,
        location: location,
        person: person,
        timestamp: new Date().toISOString()
    };
    
    // 記録を配列に追加
    walkRecords.unshift(record); // 最新を先頭に
    
    // 最新10件のみ保持
    if (walkRecords.length > 10) {
        walkRecords = walkRecords.slice(0, 10);
    }
    
    // 保存と表示更新
    saveRecords();
    updateDisplay();
    
    // フォームをリセット
    document.getElementById('walkForm').reset();
    
    // モーダルを閉じる
    const walkModal = bootstrap.Modal.getInstance(document.getElementById('walkModal'));
    walkModal.hide();
    
    console.log('散歩記録を追加しました:', record);
}

// 記録を表示
function displayRecords() {
    const recordsList = document.getElementById('recordsList');
    
    // 全記録を結合してタイムスタンプ順にソート
    const allRecords = [
        ...feedingRecords.map(record => ({...record, recordType: 'feeding'})),
        ...walkRecords.map(record => ({...record, recordType: 'walk'}))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 記録がない場合
    if (allRecords.length === 0) {
        recordsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">まだ記録がありません</div>
                <div class="empty-state-subtext">上のボタンから記録を追加してみましょう</div>
            </div>
        `;
        return;
    }
    
    // 記録を表示
    let html = '';
    allRecords.slice(0, 10).forEach(record => {
        if (record.recordType === 'feeding') {
            html += createFeedingRecordHTML(record);
        } else {
            html += createWalkRecordHTML(record);
        }
    });
    
    recordsList.innerHTML = html;
}

// 餌やり記録のHTMLを作成
function createFeedingRecordHTML(record) {
    const dateObj = new Date(record.date);
    const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    
    return `
        <div class="record-card feeding">
            <div class="record-header">
                <div class="record-type">🍽️ ${record.type}</div>
                <div class="record-time">${formattedDate} ${record.time}</div>
            </div>
            <div class="record-details">
                <div><strong>量:</strong> ${record.amount}</div>
                <div class="record-person">${record.person}</div>
            </div>
        </div>
    `;
}

// 散歩記録の