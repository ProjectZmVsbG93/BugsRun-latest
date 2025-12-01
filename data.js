// data.js
export const RACE_DISTANCE = 100;

export const CONDITIONS = {
    '絶好調': { val: 1.5, class: 'cond-excellent' },
    '好調': { val: 1.2, class: 'cond-good' },
    '普通': { val: 1.0, class: 'cond-normal' },
    '不調': { val: 0.8, class: 'cond-bad' },
    '絶不調': { val: 0.5, class: 'cond-terrible' }
};

export const WEATHER_INFO = {
    '晴れ': { icon: '<img src="weather_sunny.png" class="weather-img" alt="晴れ">', desc: '良い天気。レース日和！' },
    '曇り': { icon: '<img src="weather_cloudy.png" class="weather-img" alt="曇り">', desc: '雲が多い。何か起こるかも？' },
    '雨': { icon: '<img src="weather_rain.png" class="weather-img" alt="雨">', desc: '雨が降っている。足元が悪い(移動半減)' },
    '小雨': { icon: '<img src="weather_light_rain.png" class="weather-img" alt="小雨">', desc: '毎ターン全員HP+2' },
    '雪': { icon: '<img src="weather_snow.png" class="weather-img" alt="雪">', desc: '雪が積もっている。進みにくい(-5cm)' },
    '日照り': { icon: '<img src="weather_drought.png" class="weather-img" alt="日照り">', desc: '毎ターン全員1ダメージ' },
    '砂嵐': { icon: '<img src="weather_sandstorm.png" class="weather-img" alt="砂嵐">', desc: '毎ターン誰かが行動不能' },
    '霧': { icon: '<img src="weather_fog.png" class="weather-img" alt="霧">', desc: '全員の与ダメージ-1' },
    '濃霧': { icon: '<img src="weather_dense_fog.png" class="weather-img" alt="濃霧">', desc: '攻撃が当たらなくなる' },
    '強風': { icon: '<img src="weather_strong_wind.png" class="weather-img" alt="強風">', desc: '移動距離倍化' },
    '追い風': { icon: '<img src="weather_tailwind.png" class="weather-img" alt="追い風">', desc: '前進+5cm' },
    '向かい風': { icon: '<img src="weather_headwind.png" class="weather-img" alt="向かい風">', desc: '前進-5cm' },
    '突風': { icon: '<img src="weather_gust.png" class="weather-img" alt="突風">', desc: '誰かの位置-10cm' },
    '竜巻': { icon: '<img src="weather_tornado.png" class="weather-img" alt="竜巻">', desc: 'ランダムイベント発生' },
    '嵐': { icon: '<img src="weather_storm.png" class="weather-img" alt="嵐">', desc: 'ランダムイベント発生' },
    '雷': { icon: '<img src="weather_thunder.png" class="weather-img" alt="雷">', desc: '虫一匹に3ダメージ' },
    '轟雷': { icon: '<img src="weather_roaring_thunder.png" class="weather-img" alt="轟雷">', desc: '虫一匹に3ダメージor即死' },
    '日食': { icon: '<img src="weather_solar_eclipse.png" class="weather-img" alt="日食">', desc: '不吉なイベント発生' },
    '満月': { icon: '<img src="weather_full_moon.png" class="weather-img" alt="満月">', desc: '確率で誰かが復活' },
    '桜吹雪': { icon: '<img src="weather_cherry_blossom.png" class="weather-img" alt="桜吹雪">', desc: '全員1ダメ＆確率で回復+行動不能' },
    '三日月': { icon: '<img src="weather_crescent_moon.png" class="weather-img" alt="三日月">', desc: '虫一匹のHP+3' },
    '月食': { icon: '<img src="weather_lunar_eclipse.png" class="weather-img" alt="月食">', desc: '全員が一時的に絶好調' },
    '新月': { icon: '<img src="weather_new_moon.png" class="weather-img" alt="新月">', desc: '全員が一時的に絶不調' },
    '溶岩流': { icon: '🌋', desc: '背後から溶岩が迫る！' },
    '噴火': { icon: '🌋', desc: '地裂噴火で大ダメージ' }
};

export const COURSES = [
    { id: 'meadow', name: 'ポカポカそうげん', desc: 'あきれるほど平和な草原。基本的にはいつも晴れ。', weatherChangeRate: 0.1, weatherTable: [{ type: '晴れ', weight: 64 }, { type: '霧', weight: 8 }, { type: '小雨', weight: 8 }, { type: '追い風', weight: 8 }, { type: '強風', weight: 8 }, { type: '満月', weight: 4 }] },
    { id: 'desert', name: 'カラカラさばく', desc: '雨の降らない乾燥地帯。日照りで体力がピンチ！', weatherChangeRate: 0.1, weatherTable: [{ type: '晴れ', weight: 55 }, { type: '日照り', weight: 15 }, { type: '砂嵐', weight: 15 }, { type: '竜巻', weight: 10 }, { type: '日食', weight: 5 }] },
    { id: 'mountain', name: 'カエラズのやま', desc: '天気が変わりやすく危険な山。倍率が高い虫を狙え？', weatherChangeRate: 0.5, weatherTable: [{ type: '晴れ', weight: 12 }, { type: '曇り', weight: 4 }, { type: '霧', weight: 8 }, { type: '濃霧', weight: 4 }, { type: '小雨', weight: 8 }, { type: '雨', weight: 4 }, { type: '追い風', weight: 8 }, { type: '強風', weight: 4 }, { type: '突風', weight: 8 }, { type: '向かい風', weight: 8 }, { type: '雷', weight: 8 }, { type: '轟雷', weight: 4 }, { type: '日食', weight: 4 }, { type: '満月', weight: 4 }] },
    { id: 'beach', name: 'ピチピチかいがん', desc: 'ナウなヤングのプライベートビーチ。嵐が来ると大変！', weatherChangeRate: 0.1, weatherTable: [{ type: '晴れ', weight: 57.5 }, { type: '曇り', weight: 2.5 }, { type: '追い風', weight: 8 }, { type: '強風', weight: 4 }, { type: '嵐', weight: 8 }, { type: '突風', weight: 4 }, { type: '向かい風', weight: 8 }, { type: '雷', weight: 4 }, { type: '轟雷', weight: 8 }, { type: '日食', weight: 8 }] },
    { id: 'snowfield', name: 'ブルブルせつげん', desc: '雪がどっさり積もった銀世界。長期戦になりがち。', weatherChangeRate: 0.1, weatherTable: [{ type: '雪', weight: 50 }, { type: '曇り', weight: 5 }, { type: '追い風', weight: 10 }, { type: '強風', weight: 10 }, { type: '突風', weight: 10 }, { type: '向かい風', weight: 10 }, { type: '満月', weight: 5 }] },
    { id: 'forest', name: 'ザワザワのもり', desc: '怪しげな雰囲気の森。天気次第で有利不利がコロコロ変わる。', weatherChangeRate: 0.1, weatherTable: [{ type: '霧', weight: 25 }, { type: '雨', weight: 25 }, { type: '曇り', weight: 5 }, { type: '濃霧', weight: 10 }, { type: '小雨', weight: 10 }, { type: '雷', weight: 10 }, { type: '轟雷', weight: 5 }, { type: '満月', weight: 10 }] },
    { id: 'building', name: 'ぼうふうビルディング', desc: 'ビル風が吹き荒れるオフィス街。追い風の時は走れ！', weatherChangeRate: 0.1, weatherTable: [{ type: '晴れ', weight: 50 }, { type: '強風', weight: 10 }, { type: '向かい風', weight: 10 }, { type: '追い風', weight: 10 }, { type: '竜巻', weight: 5 }, { type: '突風', weight: 10 }, { type: '日食', weight: 5 }] },
    { id: 'dome', name: 'せいぶドーム', desc: '自然共生型施設。ドームなのに雨が降るらしい？', weatherChangeRate: 0.5, weatherTable: [{ type: '桜吹雪', weight: 20 }, { type: '曇り', weight: 10 }, { type: '日食', weight: 10 }, { type: '強風', weight: 5 }, { type: '向かい風', weight: 5 }, { type: '追い風', weight: 5 }, { type: '突風', weight: 5 }, { type: '満月', weight: 20 }, { type: '雨', weight: 5 }, { type: '小雨', weight: 5 }, { type: '雪', weight: 10 }] },
    { id: 'observatory', name: 'ミハラシてんもんだい', desc: '雲より高い天文台跡地。月が生きている...？', weatherChangeRate: 0.1, weatherTable: [{ type: '満月', weight: 20 }, { type: '三日月', weight: 20 }, { type: '月食', weight: 20 }, { type: '新月', weight: 20 }, { type: '日食', weight: 20 }] },
    { id: 'volcano', name: 'グラグラかざん', desc: '噴火を続ける活火山。溶岩流が迫ってくる！', weatherChangeRate: 1.0, weatherTable: [{ type: '溶岩流', weight: 80 }, { type: '噴火', weight: 20 }] }
];

export const BUG_TEMPLATES = [
    { id: 'silverfish', name: '紙魚', icon: '<img src="silverfish.png" class="bug-img" alt="紙魚">', speed: 20, hp: 4, attack: 1, type: 'スピード', skills: ['前進', 'ぶつかる', 'ヒラヒラしている', 'オロオロしている', '逆走'], desc: '体力も攻撃力も最低クラスであるものの非常に足が速い超軽量級の虫。オロオロしたり焦って逆走したりほかの虫にぶつかったりするドジな奴だがハマったときは一瞬で100cmを駆け抜けレースを終わらせてしまう。いびつで暴力的な速さを求めるあなたにおすすめ。' },
    { id: 'mantis', name: 'オオカマキリ', icon: '<img src="mantis.png" class="bug-img" alt="オオカマキリ">', speed: 10, hp: 10, attack: 3, type: 'バランス', skills: ['前進', '鎌を突き刺す', '鎌を振り下ろす', '羽ばたく', '捕食'], desc: 'スピード、体力、攻撃力のいずれも高水準なバランス型の虫。１％の確率で発動する単体即死攻撃の「捕食」とほかの虫と同じ位置まで移動する「羽ばたく」はほかの虫では味わえない珍しい技。オオカマキリの貴重な捕食シーンを見てみたいあなたにおすすめ。' },
    { id: 'isopod', name: 'ダイオウグソクムシ', icon: '<img src="isopod.png" class="bug-img" alt="ダイオウグソクムシ">', speed: 7, hp: 12, attack: 3, type: 'タンク', skills: ['前進', 'オトモを呼ぶ', 'ワイはグソクムシ界の大王やぞ！！！'], desc: '生半可な攻撃では倒れない高い体力を持つ虫。自分はほとんど行動しないものの、サポート役の「オトモ」の虫を呼ぶことで実質二回行動が可能になる。「オトモ」は細かい攻撃と妨害が得意で、腰の重い大王を前に運ぶことも。王様気質のあなたにおすすめ。' },
    { id: 'shrimp', name: 'モンハナシャコ', icon: '<img src="shrimp.png" class="bug-img" alt="モンハナシャコ">', speed: 15, hp: 10, attack: 3, type: '攻撃型タンク', skills: ['前進', 'ハイパーシャコパンチ', '衝撃波', '閃光弾', '回復'], desc: '２ターンに１回しか行動できない代わりに行動がどれも非常に強力な虫。全員の攻撃を不発にする「閃光弾」や周りに最大９ダメージを割り振って与える「衝撃波」、単体に５ダメージを与えるシャコパンチなどを繰り出す。一発の重みを求めるあなたにおすすめ。' },
    { id: 'ladybug', name: 'ナナホシテントウ', icon: '<img src="ladybug.png" class="bug-img" alt="ナナホシテントウ">', speed: 15, hp: 8, attack: 1, type: 'チャージ', skills: ['前進', '北斗七星ゲージを貯める', '北斗千手殺', '北斗有情破顔拳', '残悔積歩拳'], desc: '通常は特に秀でた点を持たないが、「北斗七星ゲージ」を７まで貯めると本領を発揮する虫。「北斗七星ゲージ」を全て消費することで発動できる「北斗有情破顔拳」は全体に即死攻撃を放ち、試合を一発で決める力を持つ。ロマン砲が好きなあなたにおすすめ。' },
    { id: 'antlion', name: 'ウスバカゲロウ', icon: '<img src="antlion.png" class="bug-img" alt="ウスバカゲロウ">', speed: 15, hp: 5, attack: 1, type: 'スピード', skills: ['前進', '突進', '翅の手入れ'], desc: '体力も低く、攻撃も得意ではないが、前進する能力に特化している虫。無駄行動やマイナス行動を起こさないという点で、上振れ狙いの紙魚とは差別化している。次に進む距離が２倍になる「翅を手に入れる」を持つ。安定した速さが欲しいあなたにおすすめ。' },
    { id: 'ant', name: 'クロヤマアリ', icon: '<img src="ant.png" class="bug-img" alt="クロヤマアリ">', speed: 15, hp: 7, attack: 1, type: 'チャージ', skills: ['前進', '仲間を呼ぶ', '仲間と一緒に前進する', '仲間と一緒に攻撃する'], desc: '仲間を呼んで数を増やし、集団で有利にレースを進める虫。仲間が増えるほど攻撃力や移動力がアップする。数の暴力で圧倒したいあなたにおすすめ。' },
    { id: 'beetle', name: 'カブトムシ', icon: '<img src="beetle.png" class="bug-img" alt="カブトムシ">', speed: 7, hp: 15, attack: 2, type: '高級タンク', skills: ['前進', '突き刺す', '突き飛ばす', '吹き飛ばす'], desc: '圧倒的な体力を誇る森の王者。攻撃を受けてもビクともせず、逆に相手を突き飛ばして妨害する。安定感抜群のタンクとして活躍する。堅実なレース運びを好むあなたにおすすめ。' },
    { id: 'worm', name: 'ミミズ', icon: '<img src="worm.png" class="bug-img" alt="ミミズ">', speed: 12, hp: 8, attack: 4, type: 'バランス', skills: ['前進', '巻き付く', '土を食べる', '土に潜る', '落とし穴を掘る'], desc: '土に潜って攻撃を回避したり、落とし穴を掘って相手を妨害したりと、トリッキーな動きで翻弄する。地味ながらも侮れない実力者。搦め手が好きなあなたにおすすめ。' },
    { id: 'cicada', name: 'アブラゼミ', icon: '<img src="cicada.png" class="bug-img" alt="アブラゼミ">', speed: 17, hp: 8, attack: 4, type: 'バランス', skills: ['前進', '小便をかける', '超音波', '死んだフリ'], desc: '大音量の鳴き声で相手を妨害したり、死んだフリで攻撃をやり過ごしたりする。短命だがその分爆発力があるかもしれない。騒がしいレースが好きなあなたにおすすめ。' },
    { id: 'samurai', name: 'サムライアリ', icon: '<img src="samurai.png" class="bug-img" alt="サムライアリ">', speed: 12, hp: 6, attack: 5, type: 'アタック', skills: ['前進', '面打ち', '胴打ち', '小手打ち', '疾駆け'], desc: '高い攻撃力を持つ戦闘狂。レースよりも相手を倒すことに執着しがちだが、その攻撃性でライバルを蹴散らし、結果的にトップに立つことも。武闘派のあなたにおすすめ。' },
    { id: 'dung', name: 'フンコロガシ', icon: '<img src="dung.png" class="bug-img" alt="フンコロガシ">', speed: 10, hp: 12, attack: 2, type: 'タンク', skills: ['前進', '糞直球', '糞球大車輪', 'フンを食べる', 'フンをなすりつける', '糞命の選択'], desc: 'フンを転がして進む虫。進むたびにフンが大きくなり、防御力や攻撃力が上がる。フンを投げて攻撃したり、フンに隠れて攻撃を防いだりする。汚いけど強い。堅実なあなたにおすすめ。' },
    { id: 'butterfly', name: 'オオムラサキ', icon: '<img src="butterfly_larva.png" class="bug-img" alt="オオムラサキ">', speed: 5, hp: 6, attack: 2, type: '進化', skills: ['脱皮する', '葉っぱを食べる'], desc: '幼虫からサナギ、そして成虫へと進化する虫。成虫になると移動力と攻撃力が大幅にアップし、空を飛んで障害物を無視する。大器晩成型のあなたにおすすめ。' },
    { id: 'centipede', name: 'オオムカデ', icon: '<img src="centipede.png" class="bug-img" alt="オオムカデ">', speed: 15, hp: 8, attack: 4, type: 'アタック', skills: ['前進', '噛み付く', '天井に張り付く', 'ロケットダイブ'], desc: '多くの足で素早く動き、強力な毒で相手を攻撃する。天井に張り付いて攻撃を回避したり、上空から急降下して大ダメージを与えたりする。トリッキーな動きで相手を翻弄したいあなたにおすすめ。' }
];