
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import PushOnClick from "../components/PushOnClick";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.

		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// fufuSuperDino
		const fufuSuperDino = this.add.image(400, 235, "FufuSuperDino");

		// text
		const text = this.add.text(400, 436, "", {});
		text.setOrigin(0.5, 0.5);
		text.text = "Phaser 3 + Phaser Editor 2D\nWebpack + TypeScript";
		text.setStyle({ "align": "center", "fontFamily": "Arial", "fontSize": "3em" });

		// fufuSuperDino (components)
		new PushOnClick(fufuSuperDino);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here
	private platforms?: Phaser.Physics.Arcade.StaticGroup;
	private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
	private stars?: Phaser.Physics.Arcade.Group;
	private bombs?: Phaser.Physics.Arcade.Group;
	private score: integer = 0;
	private gameOver: boolean = false;
	private scoreText?: Phaser.GameObjects.Text

	createPhysicObject() {
		this.add.image(400, 300, 'sky');

		this.platforms = this.physics.add.staticGroup();
		//refreshBody-->因為我們縮放的是一個 靜態 物體，所以必須把所作變動告訴物理世界（physics world）
		this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();

		this.platforms.create(600, 400, 'platform');
		this.platforms.create(50, 250, 'platform');
		this.platforms.create(750, 220, 'platform');


		this.player = this.physics.add.sprite(100, 450, 'dude');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		this.cursors = this.input.keyboard.createCursorKeys();


		//  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});

		this.stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
			// Cast child to Arcade Sprite type
			const spriteChild = child as Phaser.Physics.Arcade.Sprite;

			// Give each star a slightly different bounce
			spriteChild.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
		//this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);


		//  The score

		this.scoreText = this.add.text(16, 16, 'score: 0', {
			fontFamily: 'Arial',
			fontSize: '32px',
			color: '#ffffff',
			stroke: '#000000',
			strokeThickness: 4,
		});

		this.bombs = this.physics.add.group();

		//碰撞器（Collider）是施魔法的地方。它接收兩個物件，檢測二者之間的碰撞，並使二者分開。
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.stars, this.platforms);
		this.physics.add.collider(this.bombs, this.platforms);

		//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
		this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

		this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
	}

	hitBomb(obj1?: Phaser.GameObjects.GameObject, obj2?: Phaser.GameObjects.GameObject) {
		this.physics.pause();

		this.player!.setTint(0xff0000);

		this.player!.anims.play('turn');

		this.gameOver = true;
	}


	collectStar(obj1?: Phaser.GameObjects.GameObject, star?: Phaser.GameObjects.GameObject) {
		const spriteChild = star as Phaser.Physics.Arcade.Sprite;
		spriteChild.disableBody(true, true);

		//  Add and update the score
		this.score += 10;
		this.scoreText!.setText('Score: ' + this.score);

		if (this.stars!.countActive(true) === 0) {
			//  A new batch of stars to collect
			this.stars!.children.iterate(function (child: Phaser.GameObjects.GameObject) {
				// Cast child to Arcade Sprite type
				const spriteChild = child as Phaser.Physics.Arcade.Sprite;
				spriteChild.enableBody(true, spriteChild.x, 0, true, true);

			});

			var x = (this.player!.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

			let bomb = this.bombs!.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;

		}

	}


	create() {

		this.editorCreate();
		this.createPhysicObject();
	}


	update(time: number, delta: number): void {
		if (this.gameOver) {
			return;
		}

		if (this.cursors!.left.isDown) {
			this.player!.setVelocityX(-160);

			this.player!.anims.play('left', true);
		}
		else if (this.cursors!.right.isDown) {
			this.player!.setVelocityX(160);

			this.player!.anims.play('right', true);
		}
		else {
			this.player!.setVelocityX(0);

			this.player!.anims.play('turn');
		}

		if (this.cursors!.up.isDown && this.player!.body.touching.down) {
			this.player!.setVelocityY(-330);
		}

		/* END-USER-CODE */
	}
}
/* END OF COMPILED CODE */

// You can write more code here
