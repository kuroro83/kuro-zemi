//----エンティティ関連の関数 ----------------------------------------------

//全エンティティ共通

function updatePosition(entity){
  entity.x+=entity.vx;
  entity.y+=entity.vy;
}

//プレイヤーエンティティ用

function createPlayer(){
  return{
    x:200,
    y:300,
    vx:0,
    vy:0,
  };
}

function applyGravity(entity){
  entity.vy+=0.15;
}

function applyJump(entity){
  entity.vy=-5;
}

function drawPlayer(entity){
  noStroke();//縁取り無し
  fill("#F7D060");//黄色
  square(entity.x,entity.y,40,8);//丸角の四角
  fill('#000000');//黒
  circle(entity.x+13,entity.y-10,10);//眼
  fill('#E21818')//赤
  rect(entity.x+10,entity.y+5,20,10);//口
}

function playerIsAlive(entity) {
  // プレイヤーの位置が生存圏内なら true を返す。
  // 600 は画面の下端
  return entity.y < 600;
}

//ブロックエンティティ用

function createBlock(y) {
  return {
    x: 900,
    y,
    vx: -2,
    vy: 0
  };
}

function drawBlock(entity) {
  stroke(10)
  fill("#5D9C59");//緑色
  rect(entity.x, entity.y, 80, 400);
}

function blockIsAlive(entity) {
  // ブロックの位置が生存圏内なら true を返す。
  // -100 は適当な値（ブロックが見えなくなる位置であればよい）
  return -100 < entity.x;
}

// 複数のエンティティを処理する関数

/**
 * 2つのエンティティが衝突しているかどうかをチェックする
 *
 * @param entityA 衝突しているかどうかを確認したいエンティティ
 * @param entityB 同上
 * @param collisionXDistance 衝突しないギリギリのx距離
 * @param collisionYDistance 衝突しないギリギリのy距離
 * @returns 衝突していたら `true` そうでなければ `false` を返す
 */
function entitiesAreColliding(
  entityA,
  entityB,
  collisionXDistance,
  collisionYDistance
) {
  // xとy、いずれかの距離が十分開いていたら、衝突していないので false を返す

  let currentXDistance = abs(entityA.x - entityB.x); // 現在のx距離
  if (collisionXDistance <= currentXDistance) return false;

  let currentYDistance = abs(entityA.y - entityB.y); // 現在のy距離
  if (collisionYDistance <= currentYDistance) return false;

  return true; // ここまで来たら、x方向でもy方向でも重なっているので true
}


//----ゲーム全体に関わる部分 ----------------------------------------------

/** プレイヤーエンティティ */
let player;

//ブロックエンティティの配列
let blocks;

/** ゲームの状態。"play" か "gameover" を入れるものとする */
let gameState;

/** ブロックを上下ペアで作成し、`blocks` に追加する */
function addBlockPair() {
  let y = random(-100, 100);
  blocks.push(createBlock(y)); // 上のブロック
  blocks.push(createBlock(y + 600)); // 下のブロック
}

/** ゲームオーバー画面を表示する */
function drawGameoverScreen() {
  background(0, 192); // 透明度 192 の黒
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER); // 横に中央揃え ＆ 縦にも中央揃え
  text("GAME OVER", width / 2, height / 2); // 画面中央にテキスト表示
}

/** ゲームの初期化・リセット */
function resetGame() {
  // 状態をリセット
  gameState = "play";


  //プレイヤーを作成
  player=createPlayer();

  //ブロックの配列準備
  blocks=[];

}

/** ゲームの更新 */
function updateGame() {
   // ゲームオーバーなら更新しない
   if (gameState === "gameover") return;

   // ブロックの追加と削除
   if (frameCount % 120 === 1) addBlockPair(blocks); // 一定間隔で追加
   blocks = blocks.filter(blockIsAlive); // 生きているブロックだけ残す
 
   //全エンティティの位置を更新
   updatePosition(player);
   for (let block of blocks) updatePosition(block);
 
   //プレイヤーに重力を適用
   applyGravity(player);

    // プレイヤーが死んでいたらゲームオーバー
  if (!playerIsAlive(player)) gameState = "gameover";

   // 衝突判定
  for (let block of blocks) {
    if (entitiesAreColliding(player, block, 20 + 40, 20 + 200)) {
      gameState = "gameover";
      break;
    }
  }
}

/** ゲームの描画 */
function drawGame() {
   //全エンティティを描画
   background('#D4FAFC');
   drawPlayer(player);
   for (let block of blocks) drawBlock(block);

   // ゲームオーバーならそれ用の画面を表示
  if (gameState === "gameover") drawGameoverScreen();
}

/** マウスボタンが押されたときのゲームへの影響 */
function onMousePress() {
  {
    switch (gameState) {
      case "play":
        // プレイ中の状態ならプレイヤーをジャンプさせる
        applyJump(player);
        break;
      case "gameover":
        // ゲームオーバー状態ならリセット
        resetGame();
        break;
    }
    
  }
  
}


//----setup/draw 他 ------------------------------------------------------

function setup() {
  createCanvas(800, 600); // 800 x 600 ピクセル。今回このサイズでやっていきます
  rectMode(CENTER); //四角形の基準点を中心に変更

  resetGame();

  //se=loadSound("se_jump_001.wav");//効果音読み込み
}

function draw() {
  updateGame();
  drawGame();
}

function mousePressed(){//（ここにマウスボタンを押したときの処理が入る）
  onMousePress()
  //se.play();
}