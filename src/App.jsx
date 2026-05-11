import React, { useEffect, useMemo, useState } from 'react';

const machines = [
  {
    name: '沖ドキゴールド / ブラック',
    items: ['1500G〜', 'スルー当該に応じてボーダー下げる'],
  },
  {
    name: '沖ドキゴージャス',
    items: ['跨ぎなし2500G〜', '跨ぎあり2800G〜'],
  },
  {
    name: '東京喰種',
    items: ['AT間800G〜', '穢れ9〜11pt：650G〜'],
  },
  {
    name: 'からくりサーカス',
    items: ['鳴海ステージ0〜200G', '4スルー0G〜', '運命劇後0G〜天国まで'],
  },
  {
    name: 'かぐや様は告らせたい',
    items: [
      '体操服チカ0G〜',
      'ハート20〜',
      'REG後500G〜',
      'BIG後800G〜',
      '裏REG狙い REG5スルー〜',
    ],
  },
  {
    name: 'ヴヴヴ2',
    items: [
      '優遇狙い',
      '超革命5〜9後 要確認',
      'リセ500G〜',
      'AT間900G〜',
      '前回10連以上時750G〜',
    ],
  },
  {
    name: '北斗の拳',
    items: ['リセ100G〜', '優遇650G〜', '冷遇700G〜'],
  },
  {
    name: '防振り',
    items: ['リセ200G〜', '天井650G〜', 'ゾーン140G', 'ゾーン250G'],
  },
];

export default function SlotHyenaSearchApp() {
  const [search, setSearch] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [investment, setInvestment] = useState('');
  const [recovery, setRecovery] = useState('');
  const [showIncome, setShowIncome] = useState(false);
  const [selectedPlayerView, setSelectedPlayerView] = useState('全員');

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('slot-income-records');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const searchableText = `${machine.name} ${machine.items.join(' ')}`.toLowerCase();
      return searchableText.includes(search.toLowerCase());
    });
  }, [search]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];

    return machines
      .filter((machine) =>
        machine.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);
  }, [search]);

  useEffect(() => {
    localStorage.setItem('slot-income-records', JSON.stringify(records));
  }, [records]);

  const addRecord = () => {
    if (!playerName || !selectedDate) return;

    const invest = Number(investment || 0);
    const collect = Number(recovery || 0);

    const newRecord = {
      id: Date.now(),
      playerName,
      selectedDate,
      investment: invest,
      recovery: collect,
      balance: collect - invest,
    };

    setRecords((prev) => [newRecord, ...prev]);

    setInvestment('');
    setRecovery('');
  };

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const filteredRecords =
    selectedPlayerView === '全員'
      ? records
      : records.filter(
          (record) => record.playerName === selectedPlayerView
        );

  const totalBalance = filteredRecords.reduce(
    (sum, record) => sum + record.balance,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-center">
          松本軍団 機密情報
        </h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="機種名・G数・スルー回数で検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-2xl border text-base sm:text-lg shadow"
          />

          {suggestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow border mt-2 overflow-hidden max-h-72 overflow-y-auto">
              {suggestions.map((machine) => (
                <button
                  key={machine.name}
                  onClick={() => setSearch(machine.name)}
                  className="w-full text-left px-3 py-3 text-sm sm:text-base hover:bg-gray-100 border-b last:border-b-0"
                >
                  {machine.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 sm:p-5 border mb-6">
          <button
            onClick={() => setShowIncome(!showIncome)}
            className="w-full bg-black text-white rounded-xl p-3 font-bold text-base sm:text-lg"
          >
            {showIncome ? '収支カレンダーを閉じる' : '収支カレンダーを開く'}
          </button>

          {showIncome && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold my-4 text-center">
                収支カレンダー
              </h2>

              <div className="grid gap-3 mb-4">
                <select
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-white"
                >
                  <option value="">名前を選択</option>
                  <option value="松本拓海">松本拓海</option>
                  <option value="酒井優成">酒井優成</option>
                  <option value="黒川竜弥">黒川竜弥</option>
                </select>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                />

                <input
                  type="number"
                  placeholder="投資"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                />

                <input
                  type="number"
                  placeholder="回収"
                  value={recovery}
                  onChange={(e) => setRecovery(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                />

                <button
                  onClick={addRecord}
                  className="bg-black text-white rounded-xl p-3 font-bold"
                >
                  収支を追加
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto mb-4">
                {['全員', '松本拓海', '酒井優成', '黒川竜弥'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedPlayerView(name)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${
                      selectedPlayerView === name
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div
                className={`text-center font-bold text-lg mb-4 ${
                  totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                合計収支：
                {totalBalance > 0 ? '+' : ''}
                {totalBalance.toLocaleString()}円
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-2xl p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-bold text-lg">
                          {record.playerName}
                        </div>

                        <div className="text-sm text-gray-500">
                          {record.selectedDate}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg"
                      >
                        消去
                      </button>
                    </div>

                    <div className="mt-3 space-y-1 text-sm sm:text-base">
                      <div>投資：{record.investment.toLocaleString()}円</div>
                      <div>回収：{record.recovery.toLocaleString()}円</div>

                      <div
                        className={`font-bold text-lg ${
                          record.balance >= 0
                            ? 'text-blue-600'
                            : 'text-red-600'
                        }`}
                      >
                        収支：
                        {record.balance > 0 ? '+' : ''}
                        {record.balance.toLocaleString()}円
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {search.trim() !== '' ? (
          <div className="grid gap-4">
            {filteredMachines.map((machine) => (
              <div
                key={machine.name}
                className="bg-white rounded-2xl shadow p-4 sm:p-5 border"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-3">
                  {machine.name}
                </h2>

                <ul className="space-y-2">
                  {machine.items.map((item) => (
                    <li
                      key={`${machine.name}-${item}`}
                      className="text-gray-700 text-base sm:text-lg"
                    >
                      ・{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {filteredMachines.length === 0 && (
              <div className="text-center text-gray-500 mt-10 text-base sm:text-xl px-4">
                条件に一致する機種がありません
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-base sm:text-xl mt-16 px-4">
            機種名・G数・スルー回数を検索してください
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow p-4 sm:p-5 border">
          <h3 className="text-lg sm:text-xl font-bold mb-3">
            検索テスト例
          </h3>

          <ul className="space-y-2 text-sm sm:text-base text-gray-700">
            <li>・「カバネリ」→ カバネリのみ表示</li>
            <li>・「650」→ 650G条件の台を表示</li>
            <li>・「4スルー」→ 4スルー条件の台を表示</li>
            <li>・「リセ」→ リセット狙いの台を表示</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
