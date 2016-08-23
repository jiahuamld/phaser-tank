/**
 * 定义远程玩家
 * @return class RemotePlayer
 *
 */

export default class RemotePlayer {
  constructor(index, game, player, startX, startY, name, camp) {
    const x = startX;
    const y = startY;
    this.game = game;
    this.name = name;
    this.health = 3;
    this.camp = camp;  // 阵营
    this.weapon = game.add.weapon(30, 'knife1');
    this.player = player;
    this.alive = true;
    this.player = game.add.sprite(x, y, 'enemy');
    this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
    this.player.animations.add('stop', [3], 20, true);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.name = index.toString();
    game.physics.enable(this.player, Phaser.Physics.ARCADE); /* eslint no-undef:0 */
    this.player.body.immovable = true;
    this.player.body.collideWorldBounds = true;
    this.player.angle = game.rnd.angle();
    this.player.manager = this;
    this.lastPosition = {
      x,
      y,
      angle: this.player.angle,
    };
    game.physics.enable(this.weapon.bullets, Phaser.Physics.ARCADE);
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.bulletSpeed = 400;
    this.weapon.fireRate = 500;
    this.weapon.trackSprite(this.player, 0, 0, true);
    this.bullets = this.weapon.bullets;
    this.name_text = game.add.text(x - 25, y - this.player.height, this.name, { font: '6mm' });
  }

  update() {
    // 更新精灵状态
    if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y) {
      // 移动
      this.player.play('move');
      this.player.rotation = Math.PI + this.game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y);
      this.name_text.x = Math.floor(this.player.x - 25);
      this.name_text.y = Math.floor(this.player.y - this.player.height);
    } else if (this.player.angle !== this.lastPosition.angle) {
      // 旋转
      this.player.play('move');
    } else {
      this.player.play('stop');
    }
    this.lastPosition.x = this.player.x;
    this.lastPosition.y = this.player.y;
    this.lastPosition.angle = this.player.angle;
  }

  is_teammates(player) {
    // 判断是否是队友
    return this.camp === player.camp;
  }
}