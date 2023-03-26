import Phaser from "phaser";
import Level from "./scenes/Level";
import preloadAssetPackUrl from "../static/assets/preload-asset-pack.json";
import Preload from "./scenes/Preload";

class Boot extends Phaser.Scene {

	constructor() {
		super("Boot");
	}

	preload() {

		this.load.pack("pack", preloadAssetPackUrl);
	}

	create() {

		this.scene.start("Preload");
	}
}

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: "#2f2f2f",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
		autoCenter: Phaser.Scale.Center.CENTER_BOTH
	},
	scene: [Boot, Preload, Level]
};


window.addEventListener('load', function () {

	const game = new Phaser.Game(config);

	game.scene.start("Boot");

});