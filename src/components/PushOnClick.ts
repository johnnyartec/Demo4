
// You can write more code here

/* START OF COMPILED CODE */

import UserComponent from "./UserComponent";
import Phaser, { Tweens } from "phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PushOnClick extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__PushOnClick"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		this.prepareTween();
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): PushOnClick {
		return (gameObject as any)["__PushOnClick"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	private tweenObj?: Tweens.Tween;

	prepareTween() {
		this.tweenObj = this.scene.add.tween({
			targets: this.gameObject,
			scaleX: 0.6,
			scaleY: 0.6,
			duration: 80,
			yoyo: true,
			onStart: () => {
				this.gameObject.disableInteractive();
			},
			onComplete: () => {
				// 啟用物件的交互功能
				this.gameObject.setInteractive();
			},
			onCancel: () => {
				// 啟用物件的交互功能
				this.gameObject.setInteractive();
			}
		});
	}

	awake() {
		this.gameObject.setInteractive().on("pointerdown", () => {
			this.tweenObj!.play();
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
