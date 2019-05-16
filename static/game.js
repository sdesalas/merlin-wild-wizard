var config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  },
  audio: {
    disableWebAudio: true
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('dungeon', 'assets/dungeon.png');
  this.load.image('merlin', 'assets/merlin.png');
  this.load.image('treasure', 'assets/treasure.png');
  this.load.image('fireball', 'assets/fireball.png');
  this.load.image('beholder', 'assets/beholder.png');
  this.load.spritesheet('heroes2', 'assets/sprites.png', { frameWidth: 16, frameHeight: 16, startFrame: 246, endFrame: 251 });
  this.load.audioSprite('sfx', 'assets/fx_mixdown.json', [
      'assets/fx_mixdown.ogg',
      'assets/fx_mixdown.mp3'
  ]);
}

function create ()
{
  
  //have the game centered horizontally
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.dungeon = this.add.sprite(0, 0, 'dungeon');
  this.treasure = this.add.sprite(600, 200, 'treasure');
  this.beholder = this.add.sprite(500, 240, 'beholder');
  this.dungeon.setOrigin(0,0);

  this.fireballs = this.physics.add.group({
    defaultKey: 'fireball',
    maxSize: 100
  });

  this.merlin = this.add.sprite(300, 200, 'merlin');
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
  if (this.paused) return;

  if (this.cursors.up.isDown)
  {
      this.merlin.y -= 4;
  }

  if (this.cursors.down.isDown)
  {
      this.merlin.y += 4;
  }

  if (this.cursors.left.isDown)
  {
      this.merlin.x -= 4;
  }

  if (this.cursors.right.isDown)
  {
      this.merlin.x += 4;
  }

  if (this.cursors.space.isDown && !(this.lastFireball > new Date().getTime() - 200))
  {
    this.lastFireball = new Date().getTime();
    fireball.call(this);
  }

  if (Phaser.Geom.Intersects.RectangleToRectangle(this.merlin.getBounds(), this.treasure.getBounds())) {
    win.call(this);
  }

  if (Phaser.Geom.Intersects.RectangleToRectangle(this.merlin.getBounds(), this.beholder.getBounds())) {
    gameOver.call(this);
  }

  this.merlin.x = Phaser.Math.Clamp(this.merlin.x, 0, config.width);
  this.merlin.y = Phaser.Math.Clamp(this.merlin.y, 0, config.height);
}

function win() {
  this.sound.playAudioSprite('sfx', 'ping');
  this.paused = true;
  setTimeout(() => {
    this.paused = false;
    this.scene.restart()
  }, 200);
}

function gameOver() {
  this.sound.playAudioSprite('sfx', 'death');
  this.paused = true;
  setTimeout(() => {
    this.paused = false;
    this.scene.restart()
  }, 2000);
}

function fireball () {

  var bullet = this.fireballs.get(this.merlin.x, this.merlin.y);
  if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.velocity.x = +200;
      this.sound.playAudioSprite('sfx', 'shot');
  }
}