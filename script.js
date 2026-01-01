/* --- 設定データ --- */
const HORSE_TYPES = {

  // 1. Green (緑)
  green: {
    horseSrc: "assets/horses/green.png",
    soilSrc:  "assets/gr/greengr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    
    // ★サイズは0.7倍のまま
    horseWidth: (180 * 0.7) + "px", 
    // ★位置のズレはリセット！
    horseBottom: 23,   // 土より少しだけ深く(23px)埋める
    horseLeft:   0,    // ズレなし
    
    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 0,     // 基準位置
    soilLeft:   0,     // ズレなし
  },

  // 2. Yellow (黄)
  yellow: {
    horseSrc: "assets/horses/yellow.png",
    soilSrc:  "assets/gr/yellowgr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.6) + "px",
    horseBottom: 0,
    horseLeft:   0,

    soilWidth:  (200 * 0.65) + "px",
    soilBottom: 0,
    soilLeft:   -8,
  },

  // 3. Purple (紫)
  purple: {
    horseSrc: "assets/horses/purple.png",
    soilSrc:  "assets/gr/purplegr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,
    soilWidth:  (200 * 0.75) + "px",
    soilBottom: 10,
    soilLeft:   0,
  },

  // 4. Blue (青)
  blue: {
    horseSrc: "assets/horses/blue.png",
    soilSrc:  "assets/gr/bluegr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,

    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 20,
    soilLeft:   0,
  },

  // 5. Orange (橙)
  orange: {
    horseSrc: "assets/horses/orange.png",
    soilSrc:  "assets/gr/orangegr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,

    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 20,
    soilLeft:   0,
  },

  // 6. Pink (ピンク)
  pink: {
    horseSrc: "assets/horses/pink.png",
    soilSrc:  "assets/gr/pinkgr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,
    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 1,
    soilLeft:   0,
  },

  // 7. Lightgreen (黄緑)
  lightgreen: {
    horseSrc: "assets/horses/lightgreen.png",
    soilSrc:  "assets/gr/lightgreengr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.6) + "px",
    horseBottom: 23,
    horseLeft:   0,

    soilWidth:  (200 * 0.6) + "px",
    soilBottom: 22.5,
    soilLeft:   0,
  },

  // 8. Red (赤)
  red: {
    horseSrc: "assets/horses/red.png",
    soilSrc:  "assets/gr/redgr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,
    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 14,
    soilLeft:   0,
  },

  // 9. Cyan (水色)
  cyan: {
    horseSrc: "assets/horses/cyan.png",
    soilSrc:  "assets/gr/cyangr.png",
    pullTime: 5000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.6) + "px",
    horseBottom: 23,
    horseLeft:   5,

    soilWidth:  (200 * 0.65) + "px",
    soilBottom: 18,
    soilLeft:   0,
  },
};


const screen = document.getElementById("screen");

/* --- 馬生成関数 (製造マシーン) --- */
const spawnHorse = (type, x, y, index) => {
  const data = HORSE_TYPES[type];
  if (!data) return;

// --- 1. 要素を作る ---
  const wrap = document.createElement("div");
  wrap.className = "horse-wrap";
  // 指定された場所に配置
  wrap.style.left = x;
  wrap.style.bottom = y;
  // 奥の馬が手前に来ないように、下の方にある馬ほど手前(z-index高)にする
  wrap.style.zIndex = index + 10; 

  // 土を作る
  const soil = document.createElement("img");
  soil.className = "soil";
  soil.src = data.soilSrc;
  soil.style.width = data.soilWidth;
  soil.style.bottom = `${data.soilBottom}px`;
  soil.style.marginLeft = `${data.soilLeft}px`;

  // 馬を作る
  const horse = document.createElement("img");
  horse.className = "horse";
  horse.src = data.horseSrc;
  horse.draggable = false;
  horse.style.width = data.horseWidth;
  // CSSのtranslate(-50%)と競合しないようセット
  horse.style.transform = 'translate(-50%, 0)'; 
  horse.style.bottom = `${data.horseBottom}px`;
  horse.style.marginLeft = `${data.horseLeft}px`;

  // 合体
  wrap.appendChild(soil);
  wrap.appendChild(horse);
  screen.appendChild(wrap);

// --- 2. この馬専用のメモリ(変数)を用意する ---
  let timer = null;
  let startTime = null;
  let isPulling = false;

// --- 3. 内部関数 (この馬専用の動き) ---
  
  const startPull = (e) => {
    if (horse.classList.contains("pulled")) return;
    if (e.type === "touchstart") e.preventDefault();
    if (isPulling) return;

    horse.style.transition = 'none';
    isPulling = true;
    startTime = Date.now();

    timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / data.pullTime, 1);
      const currentMove = data.maxDistance * progress;
      
      // 引っ張る動き
      horse.style.transform = `translate(-50%, -${currentMove}px)`;

      if (progress >= 1) {
        finishPull();
      }
    }, 20);
  };

  const cancelPull = () => {
    if (horse.classList.contains("pulled")) return;
    if (!isPulling) return;

    clearInterval(timer);
    isPulling = false;

    horse.style.transition = 'transform 0.1s ease-out';
    horse.style.transform = `translate(-50%, 0px)`;
  };

  const finishPull = () => {
    clearInterval(timer);
    isPulling = false;
    console.log("1匹抜けた！");

    const pulledY = data.maxDistance;

    // 回転の設定
    horse.style.transformOrigin = data.transformOrigin;
    horse.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    horse.style.transform = `translate(-50%, -${pulledY}px) rotate(180deg)`;

    // 発射
    setTimeout(() => {
      horse.classList.add("pulled");
      horse.style.transition = ''; 
    }, 1000);
  };

// --- 4. イベント登録 ---
  horse.addEventListener("touchstart", startPull, { passive: false });
  horse.addEventListener("touchend", cancelPull);
  horse.addEventListener("touchcancel", cancelPull);

  horse.addEventListener("mousedown", startPull);
  horse.addEventListener("mouseup", cancelPull);
  horse.addEventListener("mouseleave", cancelPull);
};

/* --- メイン処理：9匹生み出す！ --- */
/* --- 9匹の配置座標リスト (デザイン画に合わせた座標) --- */
const POSITIONS = [
  // 1段目 (上)
  { left: "20%", bottom: "73%" }, // 左上 (Cyan)
  { left: "80%", bottom: "72%" }, // 右上 (Red)
  { left: "45%", bottom: "60%" }, // 中央上 (Pink)

  // 2段目 (中)
  { left: "78%", bottom: "51.5%" }, // 右中 (Orange)
  { left: "18%", bottom: "50%" }, // 左中 (Lightgreen)
  { left: "50%", bottom: "35%" }, // 中央 (Blue)

  // 3段目 (下 - テキスト枠の上あたり)
  { left: "81%", bottom: "26%" }, // 右下 (Green)
  { left: "20%", bottom: "23%" }, // 左下 (Purple)
  { left: "46%", bottom: "17%" }, // 中央下 (Yellow)
];

/* --- 色の順番リスト (座標の並び順に対応) --- */
const COLOR_ORDER = [
  // 1段目 (奥)
  "cyan", "red", "pink",
  
  // 2段目 (中)
  "orange", "lightgreen", "blue",
  
  // 3段目 (手前)
  "green", "purple", "yellow"
];


/* --- メイン処理 --- */
POSITIONS.forEach((pos, index) => {
  const colorName = COLOR_ORDER[index];
  
  // Z-index調整: 
  // 手前(下の方)にある馬ほど、数字を大きくして手前に表示させる
  // Purple, Yellow, Green は手前に来てほしいので index を利用して調整
  // (indexが大きいほど配列の後ろ＝下の方なので、そのままでも概ねOKですが念のため)
  
  spawnHorse(colorName, pos.left, pos.bottom, index);
});


// 右クリック禁止
window.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); return false; };