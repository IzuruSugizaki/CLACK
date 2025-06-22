// 日記データを保存する配列（メモリ内保存）
let diaryEntries = [];
let currentPreviewData = null;

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 今日の日付を設定
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // 既存のエントリーを表示
    displayEntries();
});

// 入力内容をプレビューする関数
function previewEntry() {
    // フォームデータを取得
    const formData = getFormData();
    
    // バリデーション
    if (!validateForm(formData)) {
        return;
    }
    
    // プレビューデータを保存
    currentPreviewData = formData;
    
    // プレビュー内容を生成
    displayPreview(formData);
    
    // セクションの表示切り替え
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('preview-section').style.display = 'block';
}

// フォームデータを取得する関数
function getFormData() {
    return {
        date: document.getElementById('date').value,
        title: document.getElementById('title').value,
        mood: document.getElementById('mood').value,
        content: document.getElementById('content').value,
        tags: document.getElementById('tags').value
    };
}

// フォームバリデーション
function validateForm(data) {
    if (!data.date) {
        alert('日付を選択してください。');
        return false;
    }
    if (!data.title.trim()) {
        alert('タイトルを入力してください。');
        return false;
    }
    if (!data.mood) {
        alert('気分を選択してください。');
        return false;
    }
    if (!data.content.trim()) {
        alert('内容を入力してください。');
        return false;
    }
    return true;
}

// プレビューを表示する関数
function displayPreview(data) {
    const previewContent = document.getElementById('preview-content');
    
    // タグの処理
    const tags = data.tags.trim() ? 
        data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // 気分の表示名を取得
    const moodText = getMoodText(data.mood);
    
    previewContent.innerHTML = `
        <div class="preview-item">
            <strong>日付:</strong>
            <div>${formatDate(data.date)}</div>
        </div>
        <div class="preview-item">
            <strong>タイトル:</strong>
            <div>${escapeHtml(data.title)}</div>
        </div>
        <div class="preview-item">
            <strong>気分:</strong>
            <div>${data.mood} ${moodText}</div>
        </div>
        <div class="preview-item">
            <strong>内容:</strong>
            <div class="preview-content">${escapeHtml(data.content)}</div>
        </div>
        ${tags.length > 0 ? `
        <div class="preview-item">
            <strong>タグ:</strong>
            <div class="preview-tags">
                ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        </div>` : ''}
    `;
}

// 気分の表示名を取得
function getMoodText(moodEmoji) {
    const moodMap = {
        '😊': 'とても良い',
        '🙂': '良い',
        '😐': '普通',
        '😞': '悪い',
        '😢': 'とても悪い'
    };
    return moodMap[moodEmoji] || '';
}

// 日付をフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 確認後に保存する関数
function confirmSave() {
    if (!currentPreviewData) {
        alert('エラーが発生しました。最初からやり直してください。');
        cancelPreview();
        return;
    }
    
    // エントリーを作成
    const entry = {
        id: Date.now(), // 簡単なID生成
        date: currentPreviewData.date,
        title: currentPreviewData.title,
        mood: currentPreviewData.mood,
        content: currentPreviewData.content,
        tags: currentPreviewData.tags.trim() ? 
            currentPreviewData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        createdAt: new Date().toISOString()
    };
    
    // 同じ日付のエントリーがあるかチェック
    const existingIndex = diaryEntries.findIndex(e => e.date === entry.date);
    if (existingIndex !== -1) {
        if (confirm('同じ日付のエントリーが既に存在します。上書きしますか？')) {
            diaryEntries[existingIndex] = entry;
        } else {
            return;
        }
    } else {
        diaryEntries.push(entry);
    }
    
    // 日付順でソート（新しい順）
    diaryEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // フォームをリセット
    resetForm();
    
    // プレビューデータをクリア
    currentPreviewData = null;
    
    // セクションの表示切り替え
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
    
    // エントリー一覧を更新
    displayEntries();
    
    // 成功メッセージ
    alert('日記が保存されました！');
}

// プレビューをキャンセルして入力画面に戻る
function cancelPreview() {
    currentPreviewData = null;
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
}

// フォームをリセット
function resetForm() {
    document.getElementById('diary-form').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// エントリー一覧を表示
function displayEntries() {
    const entriesList = document.getElementById('entries-list');
    
    if (diaryEntries.length === 0) {
        entriesList.innerHTML = '<div class="empty-message">まだ日記が書かれていません。最初の日記を書いてみましょう！</div>';
        return;
    }
    
    const filteredEntries = getFilteredEntries();
    
    if (filteredEntries.length === 0) {
        entriesList.innerHTML = '<div class="empty-message">検索条件に一致する日記が見つかりません。</div>';
        return;
    }
    
    entriesList.innerHTML = filteredEntries.map(entry => `
        <div class="entry">
            <div class="entry-header">
                <div class="entry-title">${escapeHtml(entry.title)}</div>
                <div class="entry-meta">
                    <span class="entry-mood">${entry.mood}</span>
                    <span>${formatDate(entry.date)}</span>
                </div>
            </div>
            <div class="entry-content">${escapeHtml(entry.content)}</div>
            ${entry.tags.length > 0 ? `
            <div class="entry-tags">
                ${entry.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>` : ''}
            <div class="entry-actions">
                <button onclick="deleteEntry(${entry.id})" class="btn btn-delete">削除</button>
            </div>
        </div>
    `).join('');
}

// フィルタリングされたエントリーを取得
function getFilteredEntries() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const moodFilter = document.getElementById('mood-filter').value;
    
    return diaryEntries.filter(entry => {
        const matchesSearch = searchTerm === '' || 
            entry.title.toLowerCase().includes(searchTerm) ||
            entry.content.toLowerCase().includes(searchTerm) ||
            entry.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesMood = moodFilter === '' || entry.mood === moodFilter;
        
        return matchesSearch && matchesMood;
    });
}

// エントリーをフィルタリング
function filterEntries() {
    displayEntries();
}

// エントリーを削除
function deleteEntry(id) {
    if (confirm('本当にこの日記を削除しますか？')) {
        diaryEntries = diaryEntries.filter(entry => entry.id !== id);
        displayEntries();
    }
}