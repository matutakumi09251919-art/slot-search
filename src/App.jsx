import React, { useMemo, useState } from 'react';

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
    name: 'アズールレーン',
    items: [
      'リセ0スルー100G〜',
      'リセ1スルー250G〜',
      'リセ2スルー0G〜',
      '通常0スルー200G〜',
      '2・6スルー150G〜',
      'ゲーム数1300G〜',
    ],
  },
  {
    name: 'DMC',
    items: ['ゾーン80G', 'ゾーン180G', 'リセ駆け抜け500G〜', '天井700G〜'],
  },
  {
    name: '化物語',
    items: ['リセ200G〜', '天井700G〜'],
  },
  {
    name: '無職転生',
    items: ['リセ250G〜', 'AT間1350G〜'],
  },
  {
    name: 'ToLOVEる',
    items: ['リセ200G〜', '駆け抜け後250G〜'],
  },
  {
    name: 'SBJ',
    items: ['リセ300G〜', '駆け抜け後250G〜', '天井600G〜'],
  },
  {
    name: 'カバネリ',
    items: [
      'リセ駆け抜け上位後250ゾーン抜けから',
      'リセ駆け抜け180G〜',
      '天井550G〜',
      'ゾーン80G',
      'ゾーン200G',
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

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const searchableText = `${machine.name} ${machine.items.join(' ')}`.toLowerCase();
      return searchableText.includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          スロット期待値・ハイエナ検索
        </h1>

        <input
          type="text"
          placeholder="機種名・G数・スルー回数で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-2xl border text-lg shadow mb-6"
        />

        <div className="grid gap-4">
          {filteredMachines.map((machine) => (
            <div
              key={machine.name}
              className="bg-white rounded-2xl shadow p-5 border"
            >
              <h2 className="text-2xl font-bold mb-3">{machine.name}</h2>

              <ul className="space-y-2">
                {machine.items.map((item) => (
                  <li
                    key={`${machine.name}-${item}`}
                    className="text-gray-700 text-lg"
                  >
                    ・{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-xl">
            条件に一致する機種がありません
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl shadow p-5 border">
          <h3 className="text-xl font-bold mb-3">検索テスト例</h3>

          <ul className="space-y-2 text-gray-700">
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
