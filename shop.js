// 定数
const STORAGE_KEY = 'bugsRaceWallet';
const INVENTORY_KEY = 'bugsRaceInventory';
const STOCK_KEY = 'bugsRaceStocks'; // 株価データ
const PORTFOLIO_KEY = 'bugsRacePortfolio'; // 保有株
const btnShortSell = document.getElementById('btn-short-sell-stock');

// 虫データ（名前、アイコン、初期株価計算用のステータス）
const BUG_INFO = {
    'silverfish': { name: '紙魚', icon: '🐟', stats: { speed: 20, hp: 4, attack: 1 } },
    'mantis': { name: 'オオカマキリ', icon: '🦗', stats: { speed: 10, hp: 10, attack: 3 } },
    'isopod': { name: 'ダイオウグソクムシ', icon: '🦐', stats: { speed: 7, hp: 12, attack: 3 } },
    'shrimp': { name: 'モンハナシャコ', icon: '🥊', stats: { speed: 15, hp: 10, attack: 3 } },
    'ladybug': { name: 'ナナホシテントウ', icon: '🐞', stats: { speed: 15, hp: 8, attack: 1 } },
    'antlion': { name: 'ウスバカゲロウ', icon: '🦋', stats: { speed: 15, hp: 5, attack: 1 } },
    'ant': { name: 'クロヤマアリ', icon: '🐜', stats: { speed: 15, hp: 7, attack: 1 } },
    'beetle': { name: 'カブトムシ', icon: '🪲', stats: { speed: 7, hp: 15, attack: 2 } },
    'worm': { name: 'ミミズ', icon: '🪱', stats: { speed: 12, hp: 8, attack: 4 } },
    'cicada': { name: 'アブラゼミ', icon: '📢', stats: { speed: 17, hp: 8, attack: 4 } },
    'samurai': { name: 'サムライアリ', icon: '⚔️', stats: { speed: 12, hp: 6, attack: 5 } },
    'dung': { name: 'フンコロガシ', icon: '💩', stats: { speed: 10, hp: 12, attack: 2 } },
    'butterfly': { name: 'オオムラサキ', icon: '🦋', stats: { speed: 5, hp: 6, attack: 2 } },
    'centipede': { name: 'オオムカデ', icon: '🐛', stats: { speed: 15, hp: 8, attack: 4 } },
    'index_mushix': {
        name: 'MUSHIX',
        icon: '📈',
        stats: { speed: 0, hp: 0, attack: 0 },
        desc: '全上場銘柄の平均株価に連動するインデックスファンド。市場全体の成長に投資したい方に。'
    },
    'index_prime': {
        name: 'PRIME 5',
        icon: '👑',
        stats: { speed: 0, hp: 0, attack: 0 },
        desc: '株価上位5銘柄で構成されるエリートファンド。構成銘柄はレースごとに自動で入れ替わります。'
    },
    'index_muscle': {
        name: 'MUSCLE',
        icon: '💪',
        stats: { speed: 0, hp: 0, attack: 0 },
        desc: '攻撃力3以上の「武闘派」虫7種で構成。荒れたレース展開に強い攻撃的ファンド。'
    }
};

// 商品リスト
const SHOP_ITEMS = [
    // --- 激安・駄菓子・ゴミ (BAD枠) ---
    { id: 'stone', name: '道端の石', price: 0, icon: '🪨', desc: 'ただの石。投げても飛ばない。' },
    { id: 'acorn', name: 'どんぐり', price: 0, icon: '🌰', desc: '秋の落とし物。リスにあげよう。' },
    { id: 'plastic_bag', name: 'レジ袋 (Sサイズ)', price: 3, icon: '🛍️', desc: 'エコバッグを忘れた末路。' },
    { id: '5yen_choco', name: 'ごえんがあるよ', price: 5, icon: '🍫', desc: 'ご縁がありますように。' },
    { id: 'used_chopsticks', name: '使用済み割り箸', price: 10, icon: '🥢', desc: '誰かが使った形跡がある。' },
    { id: 'umaibo', name: 'うまい棒 (コンポタ味)', price: 12, icon: '🌽', desc: '国民的駄菓子。インフレに負けないで。' },
    { id: 'tirol', name: 'チロルチョコ', price: 20, icon: '🍫', desc: 'コンビニのレジ横の誘惑。' },
    { id: 'eraser_dust', name: 'ねりけし (自作)', price: 50, icon: '🤏', desc: '授業中に作った大作。いい匂いがする。' },
    { id: 'water', name: '「南アルプスの天然水」の空ペットボトル', price: 100, icon: '🫙', desc: '水道水を入れると美味しく感じる。' },
    { id: 'canned_coffee', name: '微糖缶コーヒー', price: 130, icon: '☕', desc: '働く大人の休憩時間。' },
    { id: 'jump', name: '週刊少年ジャンプ', price: 290, icon: '📖', desc: '友情・努力・勝利。' },
    { id: 'beef_bowl', name: '牛丼 (並)', price: 400, icon: '🍚', desc: '早い、安い、美味い。' },

    // --- 雑貨・日用品 (N枠) ---
    { id: 'plastic_sword', name: '伝説の聖剣 (プラスチック製)', price: 500, icon: '🗡️', desc: 'サービスエリアで売ってるやつ。' },
    { id: 'twitter_badge', name: 'X の認証バッジ', price: 1380, icon: '☑️', desc: '月額課金。強くなった気がする。' },
    { id: 'manga_abe', name: '漫画 安倍晋三物語', price: 2000, icon: '📚', desc: '感動のベストセラー' },
    { id: 'insect_jelly', name: '高級昆虫ゼリー 50個入り', price: 3980, icon: '🍮', desc: 'プロブリーダー御用達。高タンパク。' },

    // --- レトロ・ガジェット (N〜R枠) ---
    { id: 'tamagotchi', name: 'たまごっち (初代)', price: 2500, icon: '🥚', desc: '世話をサボるとすぐ死ぬ。' },
    { id: 'ds_lite', name: 'DS Lite', price: 3780, icon: '🎮', desc: '懐かしの名機' },
    { id: 'ps2', name: 'PS2', price: 5280, icon: '🎮', desc: 'DVDも見れるぞ' },
    { id: 'gba_sp', name: 'ゲームボーイアドバンスSP', price: 8800, icon: '👾', desc: 'バックライト液晶の衝撃。折りたたみ式。' },
    { id: 'one_seg', name: 'ワンセグ受信アダプタ', price: 7980, icon: '📺', desc: 'DSテレビ' },

    // --- 高級品？ (R枠) ---
    { id: 'frank_miura', name: '高級腕時計 (フランク三浦)', price: 6800, icon: '⌚', desc: '遠目で見ればバレない天才的デザイン。' },
    { id: 'yamato_cage', name: '大和型虫籠(小)', price: 28380, icon: '🦗', desc: '虫たちの高級マンション' },
    { id: 'tv_toshiba', name: '東芝55V型液晶テレビ', price: 74000, icon: '📺', desc: '大画面でレース観戦' },
    { id: 'fridge', name: 'アイリスオーヤマ冷蔵庫', price: 98000, icon: '🧊', desc: '両開きタイプ' },
    { id: 'washer', name: 'Panasonicドラム式洗濯機', price: 370000, icon: '🌀', desc: '最新鋭の洗浄力' },

    // --- 資産・ゴールド (SR枠) ---
    { id: 'gold_30', name: 'ゴールド (30g)', price: 700000, icon: '🥇', desc: '安全資産' },
    { id: 'gold_50', name: 'ゴールド (50g)', price: 1100000, icon: '🥇', desc: '輝きが増す' },
    { id: 'gold_100', name: 'ゴールド (100g)', price: 2350000, icon: '🥇', desc: '延べ棒' },

    // --- 車・高級時計 (SSR枠) ---
    { id: 'prius', name: 'トヨタ プリウス', price: 2770000, icon: '🚗', desc: '環境にやさしい' },
    { id: 'rolex_daytona', name: 'ロレックス デイトナ', price: 4500000, icon: '⌚', desc: '成功者の証。正規店では買えない。' },
    { id: 'tesla', name: 'テスラ モデル3', price: 5300000, icon: '⚡', desc: '電気の力で走る' },
    { id: 'lexus', name: 'レクサス RX500h', price: 9000000, icon: '🚙', desc: '成功者の証' },

    // --- 不動産・権利 (SSR枠) ---
    { id: 'moon_land', name: '月面 (1エーカー)', price: 3000, icon: '🌑', desc: '意外と安く買えるらしい。権利書付き。' },
    { id: 'home_nagoya', name: 'マイホーム (名古屋)', price: 35000000, icon: '🏯', desc: '住みやすい街' },
    { id: 'home_texas', name: 'マイホーム (テキサス)', price: 50000000, icon: '🤠', desc: '広大な庭付き' },

    // --- 超高額 (SSR枠) ---
    { id: 'honda_jet', name: 'プライベートジェット (HondaJet)', price: 750000000, icon: '🛩️', desc: '渋滞知らずの空の旅。維持費もヤバい。' },
    { id: 'baseball_team', name: '球団買収 (プロ野球)', price: 30000000000, icon: '⚾', desc: 'オーナー気分を味わえる。赤字覚悟。' },

    // --- 伝説・装備 ---
    { id: 'master_sword', name: '退魔の剣', price: 55000, icon: '🗡️', desc: '森の奥深くで眠っていた伝説の剣。抜くにはハートが必要。' },
    { id: 'dragon_ball', name: '四星球', price: 77777, icon: '🟠', desc: 'あと6つ集めると願いが叶うらしい。' },
    { id: 'infinity_gauntlet', name: '無限のガントレット', price: 500000000, icon: '🧤', desc: '指パッチン厳禁。' },

    // --- 宝石・鉱物 ---
    { id: 'amethyst', name: 'アメジストの原石', price: 15000, icon: '🟣', desc: '魔除けの効果があるとかないとか。玄関に置きたい。' },
    { id: 'diamond_ring', name: '婚約指輪 (給料3ヶ月分)', price: 900000, icon: '💍', desc: '箱パカ用。覚悟の証。' },
    { id: 'pink_diamond', name: 'ピンクダイヤモンド', price: 50000000, icon: '💎', desc: '奇跡の宝石。オークション級の輝き。' },
    { id: 'meteorite', name: 'ギベオン隕石', price: 850000, icon: '☄️', desc: '宇宙から飛来した鉄の塊。パワーを感じる。' },
    { id: 'kryptonite', name: '緑色の鉱石', price: 2000000, icon: '🟢', desc: '特定のスーパーヒーローが弱る石。' },

    // --- 過去・遺物 ---
    { id: 'haniwa', name: '踊る埴輪', price: 8000, icon: '🗿', desc: '古墳時代のアイドル。とぼけた顔が可愛い。' },
    { id: 'jomon_pottery', name: '火焔型土器', price: 120000, icon: '🏺', desc: '縄文人のパッションが爆発している。' },
    { id: 'ammonite', name: 'アンモナイトの化石', price: 4500, icon: '🐚', desc: '太古の海を支配した生物。' },
    { id: 'trex_skull', name: 'T-REXの頭骨', price: 15000000, icon: '🦖', desc: '博物館クラスの展示物。迫力がすごい。' },
    { id: 'ninja_scroll', name: '忍術の巻物', price: 55000, icon: '📜', desc: '秘伝の術が記されているが読めない。' },
    { id: 'katana_masamune', name: '名刀 正宗', price: 80000000, icon: '⚔️', desc: '国宝級の日本刀。切れ味抜群。' },

    // --- 未来・SF ---
    { id: 'hoverboard', name: 'ホバーボード', price: 8500000, icon: '🛹', desc: '宙に浮くスケボー。水の上では動かないので注意。' },
    { id: 'time_machine', name: 'タイムマシン (デロリアン)', price: 120000000, icon: '🏎️', desc: '過去や未来へ行ける車。燃料はゴミ。' },
    { id: 'cryo_pod', name: '冷凍睡眠カプセル', price: 30000000, icon: '⚰️', desc: '300年後の未来で目覚めたいあなたへ。' },
    { id: 'ai_robot', name: '猫型ロボット', price: 220000000, icon: '🤖', desc: '未来の国からやってきた。ポケットは四次元。' },
    { id: 'space_suit', name: '船外活動用宇宙服', price: 100000000, icon: '🧑‍🚀', desc: 'NASA仕様。これがあれば宇宙でも安心。' },

    // --- 高級食材 ---
    { id: 'matsutake', name: '国産マツタケ', price: 30000, icon: '🍄', desc: '秋の味覚の王様。香りが段違い。' },
    { id: 'caviar', name: 'キャビア (ベルーガ)', price: 50000, icon: '🐟', desc: '世界三大珍味。黒い宝石。' },
    { id: 'vintage_wine', name: 'ロマネ・コンティ', price: 3000000, icon: '🍷', desc: '飲む不動産。' },
    { id: 'sushi_set', name: '回らない寿司桶', price: 15000, icon: '🍣', desc: '特上。ウニとイクラも入ってる。' },
    { id: 'kobe_beef', name: '神戸牛ステーキ', price: 20000, icon: '🥩', desc: 'A5ランク。口の中でとろける。' },

    // --- オカルト・UMA ---
    { id: 'tsuchinoko', name: 'ツチノコのミイラ', price: 1000000, icon: '🐍', desc: '懸賞金1億円の夢の跡。' },
    { id: 'moai', name: 'モアイ像 (レプリカ)', price: 300000, icon: '🗿', desc: 'イースター島からのお土産。デカすぎて邪魔。' },
    { id: 'ufo_fragment', name: 'UFOの破片', price: 5000000, icon: '🛸', desc: '未知の金属でできている。NASAが探している。' },
    { id: 'cursed_doll', name: '呪いの日本人形', price: 500, icon: '🎎', desc: '捨てても戻ってくる。髪が伸びる。' },

    // --- 超高額・概念 ---
    { id: 'bitcoin_physical', name: 'ビットコイン (物理)', price: 9000000, icon: '₿', desc: 'なぜか硬貨として存在する謎の物体。' },
    { id: 'oil_field', name: '石油油田', price: 5000000000, icon: '🛢️', desc: '不労所得の極み。石油王になれる。' },
    { id: 'mona_lisa', name: 'モナ・リザ (本物)', price: 80000000000, icon: '🖼️', desc: 'ルーブル美術館から「借りて」きた。' },
    { id: 'statue_of_liberty', name: '自由の女神', price: 40000000000, icon: '🗽', desc: 'ニューヨークから輸送費別でお届け。' },
    { id: 'rocket', name: 'スペースX ロケット', price: 6000000000, icon: '🚀', desc: '火星移住計画用。' },

    // --- 芸術・インテリア ---
    { id: 'scream', name: '叫び (ムンク)', price: 12000000, icon: '😱', desc: 'あまりの価格に叫んでいる。' },
    { id: 'thinker', name: '考える人', price: 5000000, icon: '🤔', desc: '「晩ご飯何にしようかな…」' },
    { id: 'red_chair', name: '赤いパイプ椅子', price: 2000, icon: '🪑', desc: 'プロレス会場から持ってきた。殴打用。' },
    { id: 'toilet_gold', name: '純金のトイレ', price: 60000000, icon: '🚽', desc: '落ち着いて用を足せない。' },
    { id: 'bonsai', name: '樹齢500年の盆栽', price: 8000000, icon: '🪴', desc: 'おじいちゃんの宝物。水をやり忘れると怒られる。' },
    { id: 'moai_tissue', name: 'モアイのティッシュケース', price: 2500, icon: '🗿', desc: '鼻からティッシュが出る。' },

    // --- 和風・JAPAN ---
    { id: 'torii', name: '千本鳥居', price: 5000000, icon: '⛩️', desc: '部屋が京都になる。' },
    { id: 'mount_fuji', name: '富士山 (の書き割)', price: 3776, icon: '🗻', desc: '銭湯にあるアレ。' },
    { id: 'samurai_armor', name: '赤備えの甲冑', price: 1500000, icon: '👹', desc: '真田幸村モデル。夜中に動き出す。' },
    { id: 'daruma', name: '必勝ダルマ', price: 3000, icon: '👺', desc: '片目はまだ入れていない。選挙の時に。' },
    { id: 'onigiri', name: 'コンビニのおにぎり', price: 150, icon: '🍙', desc: 'ツナマヨ。日本が生んだ最高の発明。' },
    { id: 'mikoshi', name: 'お神輿', price: 4000000, icon: '🏮', desc: 'ワッショイ！部屋の中で担ぐと壁にぶつかる。' },

    // --- ネット・ネタ ---
    { id: 'potato_server', name: 'ジャガイモサーバー', price: 10, icon: '🥔', desc: '回線が弱い時に使われる比喩。' },
    { id: 'ie_icon', name: 'IEのアイコン', price: 5, icon: '🇪', desc: '動作が...遅い...です...。' },
    { id: 'blue_screen', name: 'ブルースクリーン', price: 500, icon: '💻', desc: '見てるだけで胃が痛くなる。' },
    { id: 'wi_fi', name: '最強のWi-Fiルーター', price: 30000, icon: '📶', desc: 'アンテナが8本くらい立ってる。' },

    // --- ランドマーク ---
    { id: 'tokyo_tower', name: '東京タワー', price: 1000000000, icon: '🗼', desc: '昭和のシンボル。やっぱり赤が好き。' },
    { id: 'pyramid', name: 'ギザのピラミッド', price: 5000000000, icon: '🔺', desc: 'パワーを感じる。カミソリの刃が研げるらしい。' },
    { id: 'sphinx', name: 'スフィンクス', price: 3000000000, icon: '🦁', desc: '鼻が欠けている。なぞなぞを出してくる。' },
    { id: 'eiffel_tower', name: 'エッフェル塔', price: 8000000000, icon: '🗼', desc: 'パリの象徴。鉄の貴婦人。' },
    { id: 'stonehenge', name: 'ストーンヘンジ', price: 50000000, icon: '🪨', desc: '誰が何のために作ったのか。ただの石置場かも。' },

    // --- 愛すべきゴミ・ガラクタ (5円〜500円) ---
    { id: 'bag_closure', name: 'パンの袋を留めるアレ', price: 5, icon: '🪝', desc: '正式名称は「バッグクロージャー」。なぜか捨てられない。' },
    { id: 'rubber_band', name: 'いつかの輪ゴム', price: 8, icon: '➰', desc: '手首につけておくと血が止まる。劣化してベタベタする。' },
    { id: 'bell_mark', name: 'ベルマーク (0.5点)', price: 10, icon: '🔔', desc: '集めると学校にピアノが届くらしい。あと100万枚必要。' },
    { id: 'soy_fish', name: '魚の醤油入れ', price: 15, icon: '🐟', desc: 'お弁当の隅にいるやつ。正式名称は「ランチャーム」。' },
    { id: 'baran', name: 'バラン', price: 20, icon: '🌿', desc: 'お弁当の仕切り。プラスチック製。食べられません。' },
    { id: 'mystery_screw', name: '謎のネジ', price: 25, icon: '🔩', desc: '家具を組み立てた後に必ず1本余るやつ。どこの？' },
    { id: 'ice_pack', name: '保冷剤', price: 30, icon: '🧊', desc: '冷凍庫を占拠する大量の保冷剤。いつか使うと信じている。' },
    { id: 'pull_tab', name: '空き缶のプルタブ', price: 35, icon: '🥫', desc: '車椅子と交換できるという都市伝説があった。' },
    { id: 'milk_cap', name: '牛乳瓶のフタ', price: 40, icon: '⚪', desc: 'メンコにして遊んだ歴戦の勇者。' },
    { id: 'receipt_long', name: '長すぎるレシート', price: 50, icon: '🧾', desc: 'クーポンのせいで本体より長い。財布がパンパンになる原因。' },
    { id: 'dead_battery', name: '使用済み乾電池', price: 60, icon: '🔋', desc: 'どれが新品でどれが使用済みかもう分からない。' },
    { id: 'glove_one', name: '片方だけの軍手', price: 80, icon: '🧤', desc: '道端によく落ちている。もう片方は旅に出た。' },
    { id: 'broken_chalk', name: '折れたチョーク', price: 100, icon: '🖍️', desc: '先生が黒板に強く書きすぎた末路。粉っぽい。' },
    { id: 'dust_bunny', name: '換気扇のホコリ', price: 120, icon: '☁️', desc: '年末の大掃除で見なかったことにされる存在。' },
    { id: 'dandelion', name: '道端のタンポポ', price: 150, icon: '🌼', desc: 'コンクリートの隙間から生えるド根性。' },
    { id: 'scab', name: '取れたてのかさぶた', price: 200, icon: '🩹', desc: '剥がす時の快感が忘れられない。コレクション用。' },
    { id: 'mud_ball', name: '光る泥団子', price: 300, icon: '🌑', desc: '3日間磨き続けた最高傑作。落とすと割れる。' },
    { id: 'random_button', name: '取れたボタン', price: 350, icon: '🔘', desc: 'どの服のか分からないが、捨てる勇気もない。' },
    { id: 'tangled_earphone', name: '絡まったイヤホン', price: 450, icon: '🎧', desc: 'ポケットに入れただけで知恵の輪になる。ほどくのに3年かかる。' },
    { id: 'vhs_tape', name: '爪の折れたビデオテープ', price: 500, icon: '📼', desc: '上書き禁止。「金曜ロードショー」と書いてある。' },
];

// 状態変数
let wallet = 0;
let inventory = {};
let stockData = { prices: {}, streaks: {}, history: {} };
let portfolio = [];
let selectedStockId = null;

// DOM要素
const walletEl = document.getElementById('wallet-amount');
const itemsGrid = document.getElementById('items-grid');
const inventoryGrid = document.getElementById('inventory-grid');
const sortSelect = document.getElementById('sort-select'); // ソート要素取得

// 株関連DOM
const stockBoard = document.getElementById('stock-board');
const orderTargetName = document.getElementById('order-target-name');
const stockAmountInput = document.getElementById('stock-amount');
const stockLeverageSelect = document.getElementById('stock-leverage');
const orderSummary = document.getElementById('order-summary');
const btnBuyStock = document.getElementById('btn-buy-stock');
const portfolioContainer = document.getElementById('stock-portfolio');
const portfolioList = document.getElementById('portfolio-list');

// ガチャモーダル
const gachaModal = document.getElementById('gacha-modal');
const btnOpenGacha = document.getElementById('btn-open-gacha-modal');
const btnCloseGacha = document.getElementById('btn-close-gacha');
const btnPlayGacha = document.getElementById('btn-play-gacha');
const gachaDisplayIcon = document.querySelector('.gacha-main-icon');
const gachaDisplayText = document.querySelector('.gacha-result-text');
const gachaHistory = document.getElementById('gacha-history');

// 初期化
function init() {
    loadData();
    initializeStockDataIfNeeded();
    updateDisplay();
    renderShopItems();
    renderInventory();
    renderStockBoard();
    renderPortfolio();

    if (stockAmountInput) stockAmountInput.addEventListener('input', updateOrderSummary);
    if (stockLeverageSelect) stockLeverageSelect.addEventListener('change', updateOrderSummary);

    // ★追加: ソート変更時の処理
    if (sortSelect) {
        sortSelect.addEventListener('change', renderShopItems);
    }
}

// データ読み込み
function loadData() {
    const savedWallet = localStorage.getItem(STORAGE_KEY);
    wallet = savedWallet ? parseInt(savedWallet) : 10000;

    const savedInventory = localStorage.getItem(INVENTORY_KEY);
    inventory = savedInventory ? JSON.parse(savedInventory) : {};

    const savedStock = localStorage.getItem(STOCK_KEY);
    stockData = savedStock ? JSON.parse(savedStock) : { prices: {}, streaks: {}, history: {} };

    const savedPortfolio = localStorage.getItem(PORTFOLIO_KEY);
    portfolio = savedPortfolio ? JSON.parse(savedPortfolio) : [];
}

// 株価データ初期化
function initializeStockDataIfNeeded() {
    let updated = false;
    Object.keys(BUG_INFO).forEach(bugId => {
        if (!stockData.prices[bugId]) {
            const t = BUG_INFO[bugId].stats;
            const basePrice = Math.floor((t.speed * 2 + t.hp * 2 + t.attack * 5) * (1.8 + Math.random() * 0.4));
            stockData.prices[bugId] = basePrice;
            stockData.streaks[bugId] = 0;
            stockData.history[bugId] = [basePrice];
            updated = true;
        }
    });
    if (updated) saveData();
}

// データ保存
function saveData() {
    localStorage.setItem(STORAGE_KEY, wallet);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
    localStorage.setItem(STOCK_KEY, JSON.stringify(stockData));
    updateDisplay();
}

function updateDisplay() {
    if (walletEl) walletEl.textContent = wallet.toLocaleString();
}

// --- 株取引ロジック ---

// --- 修正: インデックス銘柄を先頭に表示する ---
function renderStockBoard() {
    if (!stockBoard) return;
    stockBoard.innerHTML = '';

    if (Object.keys(stockData.prices).length === 0) {
        stockBoard.innerHTML = '<div class="loading">データを読み込んでいます...</div>';
        return;
    }

    // ★追加: 表示順をソート (インデックス銘柄を優先的に先頭へ)
    const sortedIds = Object.keys(stockData.prices).sort((a, b) => {
        const isIndexA = a.startsWith('index_');
        const isIndexB = b.startsWith('index_');

        // Aがインデックスで、Bが違うなら、Aを前に (-1)
        if (isIndexA && !isIndexB) return -1;
        // Bがインデックスで、Aが違うなら、Bを前に (1)
        if (!isIndexA && isIndexB) return 1;

        // どちらも同じタイプなら定義順（変更なし）
        return 0;
    });

    sortedIds.forEach(id => {
        const info = BUG_INFO[id] || { name: '謎の虫', icon: '❓' };
        const price = stockData.prices[id];
        const history = stockData.history[id] || [];

        let diff = 0;
        if (history.length >= 2) {
            diff = price - history[history.length - 2];
        }

        const diffClass = diff > 0 ? 'price-up' : (diff < 0 ? 'price-down' : '');
        const diffSign = diff > 0 ? '+' : '';
        const cardClass = diff > 0 ? 'card-up' : (diff < 0 ? 'card-down' : '');

        const div = document.createElement('div');
        div.className = `stock-card ${cardClass} ${selectedStockId === id ? 'selected' : ''}`;
        div.onclick = () => selectStock(id);
        div.innerHTML = `
            <div class="stock-name">${info.icon} ${info.name}</div>
            <div class="stock-price">¥${price.toLocaleString()}</div>
            <div class="stock-diff ${diffClass}">${diffSign}${diff}</div>
        `;
        stockBoard.appendChild(div);
    });
}

function selectStock(id) {
    selectedStockId = id;
    const info = BUG_INFO[id] || { name: '謎の虫', icon: '❓' };
    const price = stockData.prices[id];

    if (orderTargetName) orderTargetName.innerHTML = `${info.icon} ${info.name} <span style="font-size:0.8em">(@${price}円)</span>`;
    if (btnBuyStock) btnBuyStock.disabled = false;

    document.querySelectorAll('.stock-card').forEach(card => card.classList.remove('selected'));
    renderStockBoard();
    updateOrderSummary();

    // ★追加: チャートを描画
    const history = stockData.history[id] || [price]; // 履歴がなければ現在値のみ
    drawStockChart(history, info.name);
}

// --- updateOrderSummary 関数を上書き ---
function updateOrderSummary() {
    if (!orderSummary) return;

    // 選択されていない場合
    if (!selectedStockId) {
        orderSummary.textContent = "銘柄を選択してください";
        if (btnBuyStock) btnBuyStock.disabled = true;
        if (btnShortSell) btnShortSell.disabled = true;
        return;
    }

    const amount = parseInt(stockAmountInput.value) || 0;
    const leverage = parseFloat(stockLeverageSelect.value);
    const price = stockData.prices[selectedStockId];

    const totalCost = price * amount;
    const requiredMargin = Math.ceil(totalCost / leverage);

    orderSummary.innerHTML = `
        総額: ${totalCost.toLocaleString()}円<br>
        必要証拠金: <span style="font-size:1.2em; color:#e91e63">${requiredMargin.toLocaleString()}円</span>
    `;

    // ボタンの有効化制御
    // 買い: 常に可能
    if (btnBuyStock) btnBuyStock.disabled = false;

    // 空売り: レバレッジが1倍(現物)の場合は不可
    if (btnShortSell) {
        if (leverage === 1) {
            btnShortSell.disabled = true;
            btnShortSell.title = "現物取引では空売りできません";
            btnShortSell.style.opacity = 0.5;
        } else {
            btnShortSell.disabled = false;
            btnShortSell.title = "";
            btnShortSell.style.opacity = 1;
        }
    }
}

// 株購入
// --- 修正: 10円以下の株購入禁止を追加 ---
if (btnBuyStock) {
    btnBuyStock.addEventListener('click', () => {
        if (!selectedStockId) return;

        const amount = parseInt(stockAmountInput.value);
        const leverage = parseFloat(stockLeverageSelect.value);
        const price = stockData.prices[selectedStockId];
        const info = BUG_INFO[selectedStockId];

        // ★追加: 10円以下の株は購入不可にする処理
        if (price <= 10) {
            alert(`「${info.name}」は現在取引停止中のため、新規購入できません。(株価10円以下)`);
            return;
        }

        if (amount <= 0) { alert('株数は1以上で入力してください'); return; }

        const totalCost = price * amount;
        const requiredMargin = Math.ceil(totalCost / leverage);

        if (wallet < requiredMargin) {
            alert('所持金が足りません');
            return;
        }

        if (!confirm(`${info.name}を${amount}株、レバレッジ${leverage}倍で購入しますか？\n必要証拠金: ${requiredMargin.toLocaleString()}円`)) return;

        wallet -= requiredMargin;

        portfolio.push({
            id: selectedStockId,
            name: info.name,
            amount: amount,
            buyPrice: price,
            leverage: leverage,
            margin: requiredMargin,
            date: new Date().toISOString()
        });

        saveData();
        renderPortfolio();
        alert('注文が約定しました！');
    });
}

// --- 修正版: ポートフォリオ描画 & 決済処理 (評価額表示対応) ---

// ポートフォリオ描画関数
// --- 修正版: ポートフォリオ描画 & 決済処理 (評価額表示対応) ---

// ポートフォリオ描画関数
// --- 修正版: ポートフォリオ描画 (空売りの損益計算に対応) ---
function renderPortfolio() {
    if (!portfolioList || !portfolioContainer) return;
    portfolioList.innerHTML = '';

    if (portfolio.length > 0) {
        portfolioContainer.classList.remove('hidden');
        portfolio.forEach((pos, index) => {
            const currentPrice = stockData.prices[pos.id];
            const type = pos.type || 'buy'; // デフォルトは買い
            const typeText = type === 'sell' ? '<span style="color:blue">[売]</span>' : '<span style="color:red">[買]</span>';

            // ★修正: 損益計算の分岐を追加
            let profit = 0;
            if (type === 'sell') {
                // 空売り: (売った価格 - 現在価格) * 株数
                // 価格が上がるとマイナス(損)、下がるとプラス(益)
                profit = (pos.buyPrice - currentPrice) * pos.amount;
            } else {
                // 買い: (現在価格 - 買った価格) * 株数
                profit = (currentPrice - pos.buyPrice) * pos.amount;
            }

            // 現在の価値 (時価総額)
            const currentValue = currentPrice * pos.amount;

            const profitClass = profit >= 0 ? 'price-up' : 'price-down';
            const profitSign = profit >= 0 ? '+' : '';

            const div = document.createElement('div');
            div.className = 'portfolio-card';

            div.innerHTML = `
                <div class="pf-info">
                    <div style="margin-bottom: 4px;">
                        ${typeText} <strong>${pos.name}</strong> 
                        <span style="font-size:0.9em; color:#555;">x${pos.amount} (Lv.${pos.leverage})</span>
                    </div>
                    <div style="font-weight:bold; color:#333; background:#fff3e0; padding:2px 5px; border-radius:4px; display:inline-block; margin-bottom:2px;">
                        時価: ${currentValue.toLocaleString()}円
                    </div>
                    <div style="font-size:0.85em; color:#666;">
                        (取得単価: ${pos.buyPrice.toLocaleString()}円 → 現在: ${currentPrice.toLocaleString()}円)
                    </div>
                </div>
                <div class="pf-right">
                    <div class="pf-pl ${profitClass}">${profitSign}${profit.toLocaleString()}円</div>
                    <button class="btn-sell-stock" onclick="sellStock(${index})">決済</button>
                </div>
            `;
            portfolioList.appendChild(div);
        });
    } else {
        portfolioContainer.classList.add('hidden');
    }
}

// 決済処理関数 (ボタンから呼ばれる機能)
window.sellStock = function (index) {
    const pos = portfolio[index];
    // 万が一データがおかしい場合のエラーハンドリング
    if (!pos || !stockData.prices[pos.id]) {
        console.error("決済エラー: データが見つかりません");
        return;
    }

    const currentPrice = stockData.prices[pos.id];
    const type = pos.type || 'buy'; // デフォルトは買い

    // 損益計算: (現在価格 - 購入価格) * 株数
    // ※レバレッジ取引の場合、変動幅 * 株数がそのまま損益になります
    let profit = 0;
    if (type === 'sell') {
        profit = (pos.buyPrice - currentPrice) * pos.amount;
    } else {
        profit = (currentPrice - pos.buyPrice) * pos.amount;
    }

    // 返還額 = 証拠金 + 損益
    const returnAmount = Math.floor(pos.margin + profit);

    let msg = `【${type === 'sell' ? '買い戻し' : '売却'}】決済しますか？\n損益: ${profit.toLocaleString()}円\n`;
    if (returnAmount >= 0) {
        msg += `口座への返還: ${returnAmount.toLocaleString()}円`;
    } else {
        msg += `⚠️ 追証発生: ${Math.abs(returnAmount).toLocaleString()}円 の支払いが必要です`;
    }

    if (!confirm(msg)) return;

    // 資金反映
    wallet += returnAmount;

    // ポートフォリオから削除
    portfolio.splice(index, 1);

    // 保存と再描画
    saveData();
    renderPortfolio();
    updateDisplay(); // 所持金表示の更新も忘れずに

    alert('決済しました。');
}


// --- 買い物 & ガチャ (修正版: ソート対応) ---

function renderShopItems() {
    if (!itemsGrid) return;
    itemsGrid.innerHTML = '';

    // ★追加: ソートロジック
    let itemsToRender = [...SHOP_ITEMS]; // 元配列をコピー
    const sortType = sortSelect ? sortSelect.value : 'default';

    if (sortType === 'price_asc') {
        itemsToRender.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price_desc') {
        itemsToRender.sort((a, b) => b.price - a.price);
    }

    // ガチャや在庫と関係なく、ショップアイテムを一覧表示
    itemsToRender.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-image">${item.icon}</div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">¥${item.price.toLocaleString()}</div>
                <div class="item-desc">${item.desc}</div>
                <button class="btn-buy" onclick="buyItem('${item.id}')">購入する</button>
            </div>
        `;
        itemsGrid.appendChild(div);
    });
}

function renderInventory() {
    if (!inventoryGrid) return;
    inventoryGrid.innerHTML = '';
    const itemIds = Object.keys(inventory);

    if (itemIds.length === 0) {
        inventoryGrid.innerHTML = '<p class="empty-msg">持ち物はまだありません</p>';
        return;
    }

    itemIds.forEach(id => {
        const count = inventory[id];
        if (count <= 0) return;

        const itemData = SHOP_ITEMS.find(i => i.id === id);
        if (!itemData) return; // 商品リストにない古いアイテムなどがもしあればスキップ

        const sellPrice = Math.floor(itemData.price / 2);

        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-image">${itemData.icon}</div>
            <div class="item-details">
                <div class="item-name">${itemData.name} <span class="count-badge">x${count}</span></div>
                <div class="item-price" style="color: #ff9800;">売値: ¥${sellPrice.toLocaleString()}</div>
                <button class="btn-sell" onclick="sellItem('${id}')">売却する</button>
            </div>
        `;
        inventoryGrid.appendChild(div);
    });
}

window.buyItem = function (id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item) return;
    if (wallet >= item.price) {
        if (!confirm(`${item.name}を${item.price.toLocaleString()}円で購入しますか？`)) return;
        wallet -= item.price;
        inventory[id] = (inventory[id] || 0) + 1;
        saveData();
        renderInventory();
        alert('購入しました！');
    } else {
        alert('お金が足りません！');
    }
};

window.sellItem = function (id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item || !inventory[id]) return;
    const sellPrice = Math.floor(item.price / 2);
    if (!confirm(`${item.name}を${sellPrice.toLocaleString()}円で売却しますか？`)) return;
    wallet += sellPrice;
    inventory[id] -= 1;
    if (inventory[id] <= 0) delete inventory[id];
    saveData();
    renderInventory();
};

// --- ガチャロジック (全商品対応版) ---

// 確率計算関数: 商品リスト全体からランダムに選出
function getGachaResult() {
    // 確率テーブルを動的に生成

    let weightedList = SHOP_ITEMS.map(item => {
        let weight = 20; // default
        if (item.price <= 500) weight = 64;
        else if (item.price <= 10000) weight = 30;
        else if (item.price <= 100000) weight = 4;
        else if (item.price <= 1000000) weight = 1.5;
        else weight = 0.5;

        return { item, weight };
    });

    const totalWeight = weightedList.reduce((sum, entry) => sum + entry.weight, 0);
    let random = Math.random() * totalWeight;

    for (const entry of weightedList) {
        if (random < entry.weight) {
            return entry.item;
        }
        random -= entry.weight;
    }
    return weightedList[weightedList.length - 1].item;
}

// ランク判定用ヘルパー
function getRank(price) {
    if (price > 1000000) return 'SSR';
    if (price > 100000) return 'SR';
    if (price > 5000) return 'R';
    if (price > 500) return 'N';
    return 'BAD';
}

if (btnOpenGacha) btnOpenGacha.addEventListener('click', () => gachaModal.classList.remove('hidden'));
if (btnCloseGacha) btnCloseGacha.addEventListener('click', () => gachaModal.classList.add('hidden'));

// --- 追加: ガチャ実行関数 (単発・10連共通) ---
// (shop.htmlに10連ボタン <button id="btn-play-gacha-10">...</button> を追加している前提です)
const btnPlayGacha10 = document.getElementById('btn-play-gacha-10');

function executeGacha(times) {
    const COST_PER_ONE = 500;
    const totalCost = COST_PER_ONE * times;

    if (wallet < totalCost) {
        alert('お金が足りません！');
        return;
    }

    // 支払い
    wallet -= totalCost;
    saveData();
    updateDisplay();

    // ボタン無効化
    if (btnPlayGacha) btnPlayGacha.disabled = true;
    if (btnPlayGacha10) btnPlayGacha10.disabled = true;

    // 演出開始
    let count = 0;
    const interval = setInterval(() => {
        gachaDisplayIcon.textContent = ['❓', '🌀', '✨', '📦'][count % 4];
        gachaDisplayText.textContent = times > 1 ? '10連抽選中...' : '抽選中...';
        count++;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);

        let results = [];
        let bestItem = null; // 演出用に一番レアなやつを保存
        let bestRankValue = -1; // BAD=0, N=1, R=2...

        // 抽選ループ
        for (let i = 0; i < times; i++) {
            const item = getGachaResult();
            const rank = getRank(item.price);

            // ランクの数値化（演出用）
            let rankVal = 0;
            if (rank === 'N') rankVal = 1;
            if (rank === 'R') rankVal = 2;
            if (rank === 'SR') rankVal = 3;
            if (rank === 'SSR') rankVal = 4;

            if (rankVal > bestRankValue) {
                bestRankValue = rankVal;
                bestItem = item;
            }

            // インベントリ追加
            inventory[item.id] = (inventory[item.id] || 0) + 1;
            results.push({ item, rank });
        }

        saveData();
        renderInventory();

        // 画面表示（10連の場合は一番良いやつを表示）
        gachaDisplayIcon.textContent = bestItem.icon;

        if (times > 1) {
            gachaDisplayText.textContent = `${bestItem.name} など ${times}個を入手！`;
        } else {
            // 単発の場合のメッセージ
            const r = getRank(bestItem.price);
            if (r === 'SSR' || r === 'SR') {
                gachaDisplayText.textContent = `大当たり！ ${bestItem.name}！`;
                gachaDisplayText.style.color = '#ffd700';
            } else if (r === 'BAD') {
                gachaDisplayText.textContent = `ハズレ... ${bestItem.name}`;
                gachaDisplayText.style.color = '#ccc';
            } else {
                gachaDisplayText.textContent = `${bestItem.name} を入手`;
                gachaDisplayText.style.color = 'white';
            }
        }

        // 履歴に追加 (新しい順)
        results.forEach(res => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `<span class="rank-${res.rank.toLowerCase()}">[${res.rank}]</span><span>${res.item.name}</span>`;
            gachaHistory.prepend(historyItem);
        });

        // ボタン有効化
        if (btnPlayGacha) btnPlayGacha.disabled = false;
        if (btnPlayGacha10) btnPlayGacha10.disabled = false;

    }, 1500); // 演出時間
}

// イベントリスナー登録 (既存のものをこれに置き換え)
if (btnPlayGacha) {
    btnPlayGacha.onclick = () => executeGacha(1);
}

if (btnPlayGacha10) {
    btnPlayGacha10.onclick = () => executeGacha(10);
}

// --- 追加: 空売り注文処理 ---
if (btnShortSell) {
    btnShortSell.addEventListener('click', () => {
        if (!selectedStockId) return;

        const amount = parseInt(stockAmountInput.value);
        const leverage = parseFloat(stockLeverageSelect.value);
        const price = stockData.prices[selectedStockId];
        const info = BUG_INFO[selectedStockId];

        if (amount <= 0) { alert('株数は1以上で入力してください'); return; }

        // レバレッジ1倍チェック（念のため）
        if (leverage === 1) { alert('空売りは信用取引(2倍以上)でのみ可能です'); return; }

        const totalCost = price * amount;
        const requiredMargin = Math.ceil(totalCost / leverage);

        if (wallet < requiredMargin) {
            alert('所持金（証拠金）が足りません');
            return;
        }

        if (!confirm(`【空売り注文】\n${info.name}を${amount}株、レバレッジ${leverage}倍で空売りしますか？\n(下がれば利益、上がれば損失)\n\n必要証拠金: ${requiredMargin.toLocaleString()}円`)) return;

        wallet -= requiredMargin;

        portfolio.push({
            id: selectedStockId,
            name: info.name,
            amount: amount,
            buyPrice: price,
            leverage: leverage,
            margin: requiredMargin,
            type: 'sell', // ★重要: 売りポジションであることを記録
            date: new Date().toISOString()
        });

        saveData();
        renderPortfolio();
        alert('空売り注文が約定しました！');
    });
}

// --- 修正版: 株価チャート描画関数 (自動目盛り調整付き) ---
function drawStockChart(history, label) {
    const canvas = document.getElementById('stock-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // データが少なすぎる場合は描画しない
    if (history.length < 2) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "#888";
        ctx.textAlign = "center";
        ctx.fillText("データ収集中...", canvas.width / 2, canvas.height / 2);
        return;
    }

    // レイアウト設定
    const padding = 20; // 上下右の余白
    const paddingLeft = 50; // 左側の余白（数値用）
    const w = canvas.width - paddingLeft - padding;
    const h = canvas.height - padding * 2;

    // データ範囲の計算
    let maxVal = Math.max(...history);
    let minVal = Math.min(...history);

    // 上下に少し余裕を持たせる (グラフが天井/底に張り付かないように)
    const rangeRaw = maxVal - minVal;
    // 変動がなさすぎる場合の対策
    const margin = (rangeRaw === 0) ? (maxVal * 0.1) : (rangeRaw * 0.1);

    // 表示用の最大・最小
    const viewMax = maxVal + margin;
    const viewMin = Math.max(0, minVal - margin); // 0未満にはしない
    const viewRange = viewMax - viewMin;

    // --- Y軸の目盛り計算 (スマートな刻み幅) ---
    // グラフの高さ内に4〜6本程度の線を引きたい
    const targetTicks = 5;
    const rawStep = viewRange / targetTicks;

    // 刻み幅をキリの良い数字(1, 2, 5, 10...)に丸める
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const magStep = rawStep / magnitude;
    let step;

    if (magStep <= 1) step = 1 * magnitude;
    else if (magStep <= 2) step = 2 * magnitude;
    else if (magStep <= 5) step = 5 * magnitude;
    else step = 10 * magnitude;

    // 0除算等の安全策
    if (step <= 0) step = 10;

    // 座標計算関数
    const getX = (i) => paddingLeft + (i / (history.length - 1)) * w;
    const getY = (val) => canvas.height - padding - ((val - viewMin) / viewRange) * h;

    // --- グリッド線とY軸ラベルの描画 ---
    ctx.textAlign = "left"; // ★変更: 左揃え
    ctx.textBaseline = "middle";
    ctx.font = "10px sans-serif";
    ctx.lineWidth = 1;

    // viewMinより少し下から、viewMaxを超えるまでループ
    const startTick = Math.floor(viewMin / step) * step;

    for (let tick = startTick; tick <= viewMax; tick += step) {
        if (tick < viewMin) continue; // 範囲外はスキップ

        const y = getY(tick);

        // グリッド線
        ctx.beginPath();
        ctx.strokeStyle = "#f0f0f0"; // 薄いグレー
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();

        // 数値ラベル
        ctx.fillStyle = "#999";
        // ★変更: X座標を左端(5px)に固定
        ctx.fillText(tick.toLocaleString(), 5, y);
    }

    // --- 折れ線グラフの描画 ---
    ctx.beginPath();

    // 色決定: 始点より終点が高ければ赤(上昇)、低ければ緑(下落)
    const isUp = history[history.length - 1] >= history[0];
    const lineColor = isUp ? "#e53935" : "#43a047";

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;

    history.forEach((val, i) => {
        if (i === 0) ctx.moveTo(getX(i), getY(val));
        else ctx.lineTo(getX(i), getY(val));
    });
    ctx.stroke();

    // --- 領域の塗りつぶし (グラデーション) ---
    const grad = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    grad.addColorStop(0, isUp ? "rgba(229, 57, 53, 0.2)" : "rgba(67, 160, 71, 0.2)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad;
    // 閉じたパスを作るために下辺を追加
    ctx.lineTo(getX(history.length - 1), canvas.height - padding);
    ctx.lineTo(getX(0), canvas.height - padding);
    ctx.fill();

    // --- 点を描画 ---
    history.forEach((val, i) => {
        ctx.beginPath();
        // 最新の点だけ色付き
        const isLatest = i === history.length - 1;
        ctx.fillStyle = isLatest ? lineColor : "#fff";
        ctx.strokeStyle = lineColor;

        // 最新の点は少し大きく
        const radius = isLatest ? 4 : 2;

        ctx.arc(getX(i), getY(val), radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });

    // --- 最新価格の強調表示 ---
    const lastVal = history[history.length - 1];
    const lastY = getY(lastVal);
    const lastX = getX(history.length - 1);

    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = lineColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    // グラフの点の少し上に表示
    ctx.fillText(lastVal.toLocaleString(), lastX, lastY - 8);
}

// 起動
init();