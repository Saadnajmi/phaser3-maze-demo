class Boot extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'boot' });
        this.blurredScene = undefined;
    }

    create ()
    {
        // more setup stuff here
        // ...

        // This will make your game responsive.
        // It is not ideal, i go back and forth on this
        // because i started implementing this
        // when there was no scale manager in Phaser
        window.onresize = () => {
            // Resize game configs.
            let longestSide = Math.max(window.innerWidth, window.innerHeight);
            let zoom = 2 * Math.max(1, Math.floor(longestSide / window.maxSize));
            this.sys.game.config.zoom = zoom;
            let w = window.innerWidth / zoom;
            let h = window.innerHeight / zoom;
            this.sys.game.renderer.resize(w, h, 1.0);
            this.sys.game.config.width = w;
            this.sys.game.config.height = h;
            this.sys.canvas.style.width = window.innerWidth + 'px';
            this.sys.canvas.style.height = window.innerHeight + 'px';
            // Check which scene is active.
            for (let scene of this.scene.manager.scenes) {
                if (scene.cameras && scene.cameras.main) {
                    // Scale the camera
                    scene.cameras.main.setViewport(0, 0, w, h);
                }
                if (scene.scene.settings.active) {
                    if (scene.resizeField) {
                        // Scale/position stuff in the scene itself with this method, that the scene must implement.
                        scene.resizeField(w, h);
                    }
                }
            }
            if (this.blurredScene) {
                let scene = this.scene.manager.getScene(this.blurredScene);
                scene.cameras.main.setViewport(0, 0, w, h);
                if (scene.resizeField) {
                    scene.resizeField(w, h);
                }
            }
        }

        this.sys.game.events.on('pause', () => {
            for (let scene of this.scene.manager.scenes) {
                if (scene.scene.settings.active) {
                    this.blurredScene = scene.scene.key;
                    if (scene.onGamePause) {
                        scene.onGamePause();
                        scene.scene.pause();
                    }
                }
            }
        }, this);

        this.sys.game.events.on('blur', () => {
            for (let scene of this.scene.manager.scenes) {
                if (scene.scene.settings.active) {
                    this.blurredScene = scene.scene.key;
                    if (scene.onGamePause) {
                        scene.onGamePause();
                        scene.scene.pause();
                    }
                }
            }
        }, this);

        this.sys.game.events.on('focus', () => {
            if (this.blurredScene) {
                this.scene.resume(this.blurredScene);
                let scene = this.scene.manager.getScene(this.blurredScene);
                if (scene.onGameResume) {
                    scene.onGameResume();
                }
            }
            this.blurredScene = undefined;
        }, this);

        this.sys.game.events.on('resume', () => {
            if (this.blurredScene) {
                this.scene.resume(this.blurredScene);
                let scene = this.scene.manager.getScene(this.blurredScene);
                if (scene.onGameResume) {
                    scene.onGameResume();
                }
            }
            this.blurredScene = undefined;
        }, this);

        this.scene.start('preloader');
    }

}

export default Boot;
