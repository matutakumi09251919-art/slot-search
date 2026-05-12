import React, { useEffect, useMemo, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

// 🔥 Firebase設定（自分のFirebase情報に差し替え）
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const machines = [
  { name: '沖ドキゴールド / ブラック', items: ['1500G〜', 'スルー当該に応じてボーダー下げる'] },
  { name: '沖ドキゴージャス', items: ['跨ぎなし2500G〜', '跨ぎあり2800G〜'] },
  { name: '東京喰種', items: ['AT間800G〜', '穢れ9〜11pt：650G〜'] },
  { name: 'からくりサーカス', items: ['鳴海ステージ0〜200G', '4スルー0G〜', '運命劇後0G〜天国まで'] },
  { name: 'かぐや様は告らせたい', items: ['体操服チカ0G〜', 'ハート20〜', 'REG後500G〜', 'BIG後800G〜', '裏REG狙い REG5スルー〜'] },
  { name: 'ヴヴヴ2', items: ['優遇狙い', '超革命5〜9後 要確認', 'リセ500G〜', 'AT間900G〜', '前回10連以上時750G〜'] },
  { name: '北斗の拳', items: ['リセ100G〜', '優遇650G〜', '冷遇700G〜'] },
  { name: '防振り', items: ['リセ200G〜', '天井650G〜', 'ゾーン140G', 'ゾーン250G'] },
];

export default function SlotApp() {
  const [page, setPage] = useState('home'); // home | results

  const [search, setSearch] = useState('');

  const [playerName, setPlayerName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [investment, setInvestment] = useState('');
  const [recovery, setRecovery] = useState('');
  const [showIncome, setShowIncome] = useState(false);
  const [selectedPlayerView, setSelectedPlayerView] = useState('全員');
  const [records, setRecords] = useState([]);

  // 🔥 Firestoreリアルタイム同期
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'records'), (snap) => {
      setRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 機種フィルタ
  const filteredMachines = useMemo(() => {
    return machines.filter((m) =>
      `${m.name} ${m.items.join(' ')}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredRecords =
    selectedPlayerView === '全員'
      ? records
      : records.filter((r) => r.playerName === selectedPlayerView);

  const totalBalance = filteredRecords.reduce((s, r) => s + r.balance, 0);

  const addRecord = async () => {
    if (!playerName || !selectedDate) return;

    await addDoc(collection(db, 'records'), {
      playerName,
      selectedDate,
      investment: Number(investment || 0),
      recovery: Number(recovery || 0),
      balance: Number(recovery || 0) - Number(investment || 0),
    });

    setInvestment('');
    setRecovery('');
  };

  const deleteRecord = async (id) => {
    await deleteDoc(doc(db, 'records', id));
  };

  const goSearch = () => {
    if (!search.trim()) return;
    setPage('results');
  };

  const goHome = () => {
    setPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-6">
      <h1 className="text-xl sm:text-3xl font-bold text-center mb-4">
        ハイエナ検索＋収支管理
      </h1>

      {/* ================= HOME PAGE ================= */}
      {page === 'home' && (
        <>
          {/* 検索 */}
          <input
            className="w-full p-3 rounded-xl border mb-2"
            placeholder="機種検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={goSearch}
            className="w-full bg-black text-white p-3 rounded-xl mb-3"
          >
            検索する
          </button>

          {/* 収支 */}
          <div className="bg-white p-3 rounded-xl">
            <button
              className="w-full bg-black text-white p-3 rounded-xl"
              onClick={() => setShowIncome(!showIncome)}
            >
              収支カレンダー
            </button>

            {showIncome && (
              <>
                <div className="flex gap-2 mt-3">
                  {['全員', '松本拓海', '酒井優成', '黒川竜弥'].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSelectedPlayerView(n)}
                      className={`px-3 py-2 rounded-lg ${selectedPlayerView === n ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <div className="text-center font-bold mt-2" style={{ color: totalBalance >= 0 ? '#2563eb' : '#dc2626' }}>
                  合計収支：{totalBalance}
                </div>

                <select
                  className="w-full p-2 border rounded mt-3"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                >
                  <option value="">名前</option>
                  <option>松本拓海</option>
                  <option>酒井優成</option>
                  <option>黒川竜弥</option>
                </select>

                <input
                  type="date"
                  className="w-full p-2 border rounded mt-2"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="投資"
                  className="w-full p-2 border rounded mt-2"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="回収"
                  className="w-full p-2 border rounded mt-2"
                  value={recovery}
                  onChange={(e) => setRecovery(e.target.value)}
                />

                <button className="w-full bg-blue-500 text-white p-2 mt-2 rounded" onClick={addRecord}>
                  追加
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ================= RESULTS PAGE ================= */}
      {page === 'results' && (
        <>
          <button
            onClick={goHome}
            className="w-full bg-gray-800 text-white p-3 rounded-xl mb-3"
          >
            ← 戻る
          </button>

          <div className="bg-white p-3 rounded-xl mb-3">
            <div className="font-bold">検索結果：{search}</div>
          </div>

          <div>
            {filteredMachines.map((m) => (
              <div key={m.name} className="bg-white p-3 rounded-xl mb-2">
                <div className="font-bold">{m.name}</div>
                {m.items.map((i) => (
                  <div key={i}>・{i}</div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
