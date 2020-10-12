var fCanvas = false;
var w = 760;
var h = 478;
var isCamReady = false,
    isSockedReady = false,
    isGameReady = false,
    isColorReady = false,
    isColorReady2 = false,
    isWalking = false,
    isLocked = false,
    isHitLocked = false,
    isLocked2 = false,
    isHitLocked2 = false,
    isWalkLock = false,
    isWalking2 = false,
    isWalkLock2 = false;
const ply2Movemets = [{
    action: 'nothing',
    time: 2000
}, {
    action: 'move_right',
    time: 1000
}, {
    action: 'hit',
    time: 800
}, {
    action: 'move_right',
    time: 1000
}, {
    action: 'hit',
    time: 800
}, {
    action: 'nothing',
    time: 500
}, {
    action: 'hit',
    time: 800
}, {
    action: 'move_left',
    time: 1000
}, {
    action: 'hit',
    time: 800
}, {
    action: 'nothing',
    time: 500
}, ]
var actualMov = 0;
var msgOnLoad = ['Cargando escenario',
    'Debes seleccionar un color, cuando estes listo presiona el boton de ocultar',
    'Esperando que se conecte otro jugador',
    'Esperando que el otro jugador seleccione un color',
    'Listo para jugar'
]


//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Text = PIXI.Text,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Graphics = PIXI.Graphics,
    TilingSprite = PIXI.TilingSprite,
    AnimatedSprite = PIXI.AnimatedSprite,
    TextStyle = PIXI.TextStyle;

var app;
if (!PIXI.utils.isWebGLSupported()) {
    console.log('Not Support')
    fCanvas = true;
} else {
    console.log('Supported')
}
loader
    .add("src/atlas-scorpio-2.json")
    .add("src/atlas-liukang-2.json")
    .add("src/atlas-fatality.json")
    .add("src/bg/bg0.jpg")
    .add("src/bg/bg1.jpg")
    .add("src/bg/bg2.jpg")
    .add("src/bg/bg3.jpg")
    .add("src/bg/bg4.jpg")
    .add("src/bg/bg5.jpg")
    .add("src/bg/bg6.jpg")
    .add("src/bg/bg7.jpg")
    .add("bar", "src/bar.gif")
loader.onProgress.add(loadProgressHandler)

function init() {
    //Create a Pixi Application
    app = new Application({
        antialias: true,
        transparent: false,
        resolution: 1,
        forceCanvas: fCanvas,
        view: document.getElementById("game-canvas")
    });
    app.renderer.resize(w, h);
    loader.load(setup);
}

function loadProgressHandler(loader, resource) {

    //Display the file `name` currently being loaded
    //console.log("loading: " + resource.name);

    //Display the percentage of files currently loaded
    console.log("progress: " + loader.progress + "%");
}

function setup() {
    sheet_scorpio = resources["src/atlas-scorpio-2.json"].spritesheet;
    sheet_liu = resources["src/atlas-liukang-2.json"].spritesheet;
    sheet_fatality = resources["src/atlas-fatality.json"].spritesheet;

    //Create the `gameScene` group
    gameScene = new Container();
    app.stage.addChild(gameScene);

    gameOverScene = new Container();

    fatality = new AnimatedSprite(sheet_fatality.animations['fatallity']);
    fatality.x = w / 2;
    fatality.y = h / 2 - fatality.height;
    fatality.animationSpeed = 0.1;
    fatality.onLoop = function () {
        fatality.gotoAndPlay(5);
    }

    gameOverScene.addChild(fatality)

    let bgImages = ["src/bg/bg0.jpg", "src/bg/bg1.jpg", "src/bg/bg2.jpg", "src/bg/bg3.jpg", "src/bg/bg4.jpg",
        "src/bg/bg5.jpg", "src/bg/bg6.jpg", "src/bg/bg7.jpg"
    ];
    let textureArray = [];

    for (let i = 0; i < bgImages.length; i++) {
        let texture = resources[bgImages[i]].texture;
        textureArray.push(texture);
    };

    bg = new AnimatedSprite(textureArray);
    bg.animationSpeed = 0.13
    bg.play()
    gameScene.addChild(bg)
    createLifeBars();
    createScorpion();
    createLiuKang();

    gameScene.addChild(scorpio);
    gameScene.addChild(liukang);

    gameScene.sortChildren();
    keyboardListener();

    //set the game state to `play`
    state = pause; //movePlayer2();

    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
    updateState();
}

function gameLoop(delta) {

    //Update the current game state:
    state(delta);
}

function play(delta) {
    scorpio.x += scorpio.vx
    if (contain(scorpio, {
            x: 0,
            y: 0,
            width: liukang.x,
            height: h
        })) {
        scorpio.vx = 0;
    }

    liukang.x += liukang.vx

    if (contain(liukang, {
            x: scorpio.x - liukang.width,
            y: 0,
            width: w + liukang.width,
            height: h
        })) {
        liukang.vx = 0;
    }
    if (rectangle2.width >= 160) {
        gameOverScene.visible = true;
        fatality.play();
        playSound('fatality', 1);
        playSound('end', 1);
        app.stage.addChild(gameOverScene);
        hideScorpio()
        state = end;
        scorpio_do_finisher()
    } else if (rectangle.width >= 160) {
        gameOverScene.visible = true;
        fatality.play();
        playSound('fatality', 1);
        playSound('end', 1);
        app.stage.addChild(gameOverScene);
        state = end;
        hideLiukang();
        liukang_do_finisher();
    }
}

function pause(delta) {
    if (isColorReady2 && isSockedReady && isColorReady) {
        state = play;
    }
}

function updateState() {
    if (!isColorReady) {
        document.getElementById('msg').innerHTML = msgOnLoad[1]
    } else if (!isSockedReady) {
        document.getElementById('msg').innerHTML = msgOnLoad[2]
    } else if (!isColorReady2) {
        document.getElementById('msg').innerHTML = msgOnLoad[3]
    } else {
        let element = document.getElementById('msg')
        element.innerHTML = msgOnLoad[4];
        element.classList.remove("alert-danger");
        element.classList.add("alert-success");
    }
}

function end(delta) {
    if ((fire_ball.y) > (scorpio.y + scorpio_finisher.height)) {
        fire_ball.vx = 0;
        fire_ball.vy = 0;
    }
    fire_ball.x += fire_ball.vx
    fire_ball.y += fire_ball.vy
}

function createLifeBars() {
    bar = new Sprite(resources.bar.texture)
    containerBarPly1 = new Container();
    rectangle = new Graphics();
    rectangle.beginFill(0x9b0000);
    rectangle.drawRect(3, bar.height * 0.20, 1, bar.height * 0.6);
    rectangle.endFill();
    containerBarPly1.addChild(bar);
    containerBarPly1.addChild(rectangle);
    containerBarPly1.x = 30 + containerBarPly1.width
    containerBarPly1.y = 30
    containerBarPly1.scale.x *= -1
    gameScene.addChild(containerBarPly1)

    bar2 = new Sprite(resources.bar.texture)
    containerBarPly2 = new Container();
    containerBarPly2.y = 30
    rectangle2 = new Graphics();
    rectangle2.beginFill(0x9b0000);
    rectangle2.drawRect(3, bar2.height * 0.20, 1,
        bar2.height * 0.6);
    rectangle2.endFill();
    containerBarPly2.addChild(bar2);
    containerBarPly2.addChild(rectangle2);
    containerBarPly2.x = w - 30 - containerBarPly2.width
    gameScene.addChild(containerBarPly2)
}

function createScorpion() {

    scorpio = new Container();
    scorpio_s = new AnimatedSprite(sheet_scorpio.animations['stance']);
    scorpio_s.animationSpeed = 0.2;
    scorpio_s.play();
    scorpio.addChild(scorpio_s);

    scorpio_w = new AnimatedSprite(sheet_scorpio.animations['walking']);
    scorpio_w.animationSpeed = 0.2;
    scorpio_w.play();
    scorpio_w.visible = false;
    scorpio.addChild(scorpio_w);

    scorpio_f = new AnimatedSprite(sheet_scorpio.animations['fist']);
    scorpio_f.animationSpeed = 0.2;
    scorpio_f.visible = false;
    scorpio_f.onLoop = function () {
        scorpio_f.stop();
        scorpio_f.visible = false;
        isWalkLock = false;
        isHitLocked = false;
        if (collision(scorpio.x, scorpio_f.width, liukang.x, -liukang.width)) {
            liukang_s.visible = false;
            liukang_w.visible = false;
            liukang_k.visible = false;
            liukang_h.visible = true;
            isWalkLock2 = true;
            isHitLocked2 = true;
            liukang_h.play();
            liukang.vx = 1;
            playSound('hit3', 1)
            playSound('rhit_liu', 1)
            isWalkLock2 = true;
            isHitLocked2 = true;
            if (rectangle2.width < 160) {
                rectangle2.width += 20;
                rectangle2.x = -(rectangle2.width * 3) + 3;
            }
        }
        if (isWalking) {
            scorpio_w.visible = true;
        } else {
            scorpio_s.visible = true;
        }
    };
    scorpio.addChild(scorpio_f);

    scorpio_h = new AnimatedSprite(sheet_scorpio.animations['b_hit']);
    scorpio_h.animationSpeed = 0.2;
    scorpio_h.visible = false;
    scorpio_h.onLoop = function () {
        isWalkLock = false;
        isHitLocked = false;
        scorpio_h.stop();
        scorpio_h.visible = false;
        scorpio_s.visible = true;
        scorpio.vx = 0;
    };
    scorpio.addChild(scorpio_h);

    scorpio_k = new AnimatedSprite(sheet_scorpio.animations['kick']);
    scorpio_k.animationSpeed = 0.2;
    scorpio_k.visible = false;
    scorpio_k.onLoop = function () {
        scorpio_k.stop();
        scorpio_k.visible = false;
        isWalkLock = false;
        isHitLocked = false;
        if (collision(scorpio.x, scorpio_k.width, liukang.x, -liukang.width)) {
            liukang_s.visible = false;
            liukang_w.visible = false;
            liukang_k.visible = false;
            liukang_h.visible = true;
            liukang_h.play();
            liukang.vx = 1;
            playSound('hit1', 1)
            playSound('rhit_liu', 1)
            isWalkLock2 = true;
            isHitLocked2 = true;

            if (rectangle2.width < 160) {
                rectangle2.width += 20;
                rectangle2.x = -(rectangle2.width * 3) + 3
            }
        }
        if (isWalking) {
            scorpio_w.visible = true;
        } else {
            scorpio_s.visible = true;
        }
    };
    scorpio.addChild(scorpio_k);

    fire_ball = new AnimatedSprite(sheet_scorpio.animations['fire']);
    fire_ball.animationSpeed = 0.15;
    fire_ball.visible = false;
    fire_ball.vx = 0;
    fire_ball.vy = 0;
    fire_ball.anchor.y = 1;
    fire_ball.anchor.x = 0.5;
    fire_ball.onLoop = function () {
        fire_ball.stop();
        fire_ball.visible = false;
        scorpio_finisher.animationSpeed = -0.15;
        scorpio_finisher.play();
    }
    fire_ball.zIndex = 2;
    fire_ball.onFrameChange = function () {
        if (fire_ball.currentFrame == 5) {
            liukang_die();
        }

    }

    gameScene.addChild(fire_ball);

    scorpio_finisher = new AnimatedSprite(sheet_scorpio.animations['finisher']);
    scorpio_finisher.animationSpeed = 0.15;
    scorpio_finisher.visible = false;
    scorpio_finisher.onLoop = function () {
        scorpio_finisher.stop();
    }
    scorpio_finisher.onFrameChange = function () {
        scorpio.y = h - scorpio.height - 25;
        hideScorpio();
        if (scorpio_finisher.animationSpeed < 0 && scorpio_finisher.currentFrame == 5) {
            scorpio_finisher.stop();
        } else if (scorpio_finisher.currentFrame == 7) {
            scorpio_finisher.stop();
            fire_ball.x = scorpio.x + scorpio_finisher.width
            fire_ball.y = scorpio.y + 12;
            fire_ball.visible = true;
            fire_ball.vx = 4;
            fire_ball.vy = 4;
            fire_ball.play();
            playSound('explosion', 1);
        }
    };
    scorpio.addChild(scorpio_finisher);

    scorpio_v = new AnimatedSprite(sheet_scorpio.animations['victory']);
    scorpio_v.animationSpeed = 0.12;
    scorpio_v.loop = false;
    scorpio_v.visible = false;
    scorpio_v.onFrameChange = function () {
        scorpio.y = h - scorpio.height - 25;
    };
    scorpio.addChild(scorpio_v);

    scorpio_d = new AnimatedSprite(sheet_scorpio.animations['die']);
    scorpio_d.animationSpeed = 0.15;
    scorpio_d.visible = false;
    scorpio_d.onLoop = function () {
        scorpio_d.gotoAndStop(-1);
    };
    scorpio_d.onFrameChange = function () {
        scorpio.y = h - scorpio.height - 25;
    }
    scorpio.addChild(scorpio_d);

    scorpio.y = h - scorpio.height - 25;
    scorpio.x = w / 3 + scorpio.width / 2 - 32;
    scorpio.vx = 0;

}

function createLiuKang() {

    liukang = new Container();
    liukang_s = new AnimatedSprite(sheet_liu.animations['liu_stance']);
    liukang_s.animationSpeed = 0.2;
    liukang_s.play();
    liukang.addChild(liukang_s)

    liukang_w = new AnimatedSprite(sheet_liu.animations['liu_walking']);
    liukang_w.animationSpeed = 0.2;
    liukang_w.play();
    liukang_w.visible = false;
    liukang.addChild(liukang_w)

    liukang_k = new AnimatedSprite(sheet_liu.animations['liu_fist']);
    liukang_k.animationSpeed = 0.2;
    liukang_k.visible = false;
    liukang_k.onLoop = function () {
        isWalkLock2 = false;
        isHitLocked2 = false;
        liukang_k.stop();
        liukang_k.visible = false;
        if (collision(scorpio.x, scorpio.width, liukang.x, liukang_k.width)) {
            hideScorpio()
            scorpio_h.visible = true;
            scorpio_h.play();
            isWalkLock = true;
            isHitLocked = true;
            scorpio.vx = -1;
            playSound('rhit', 1)
            playSound('hit1', 1)

            if (rectangle.width < 160) {
                rectangle.width += 20;
                rectangle.x = -(rectangle.width * 3) + 3
            }
        }
        if (isWalking2) {
            liukang_w.visible = true;
        } else {
            liukang_s.visible = true;
        }
    };
    liukang.addChild(liukang_k)

    liukang_f = new AnimatedSprite(sheet_liu.animations['liu_punching']);
    liukang_f.animationSpeed = 0.2;
    liukang_f.visible = false;
    liukang_f.onLoop = function () {
        isWalkLock2 = false;
        isHitLocked2 = false;

        liukang_f.stop();
        liukang_f.visible = false;
        if (collision(scorpio.x, scorpio.width, liukang.x, liukang_f.width)) {
            hideScorpio()
            isWalkLock = true;
            isHitLocked = true;
            scorpio_h.visible = true;
            scorpio_h.play();
            scorpio.vx = -1;
            playSound('rhit', 1)
            playSound('hit3', 1)

            if (rectangle.width < 160) {
                rectangle.width += 20;
                rectangle.x = -(rectangle.width * 3) + 3
            }
        }
        if (isWalking2) {
            liukang_w.visible = true;
        } else {
            liukang_s.visible = true;
        }
    };
    liukang.addChild(liukang_f);

    liukang_h = new AnimatedSprite(sheet_liu.animations['liu_beaing_hit']);
    liukang_h.animationSpeed = 0.2;
    liukang_h.visible = false;
    liukang_h.onLoop = function () {
        isWalkLock2 = false;
        isHitLocked2 = false;
        liukang_h.stop();
        liukang_h.visible = false;
        liukang_s.visible = true;
        liukang.vx = 0;
    };
    liukang.addChild(liukang_h)

    liukang_finisher = new AnimatedSprite(sheet_liu.animations['finisher']);
    liukang_finisher.animationSpeed = 0.2;
    liukang_finisher.visible = false;
    liukang_finisher.onLoop = function () {
        liukang_finisher.stop()
        state = end;
        liukang_victory();
    };
    liukang_finisher.onFrameChange = function () {
        liukang.y = h - liukang.height - 25;
        hideLiukang();
        if (liukang_finisher.currentFrame === 16) {
            scorpio_die();
        }
    };
    liukang.addChild(liukang_finisher)

    liukang_v = new AnimatedSprite(sheet_liu.animations['liu_victory']);
    liukang_v.animationSpeed = 0.18;
    liukang_v.loop = true;
    liukang_v.visible = false;
    liukang_v.anchor.x = 0.5
    liukang_v.onFrameChange = function () {
        liukang.y = h - liukang.height - 25;
    };
    liukang_v.onLoop = function () {
        liukang_v.gotoAndStop(-1);
    };
    liukang.addChild(liukang_v);

    liukang_d = new AnimatedSprite(sheet_scorpio.animations['liu_die']);
    liukang_d.animationSpeed = 0.15;
    liukang_d.visible = false;
    liukang_d.anchor.x = 0.5
    liukang_d.scale.x *= -1;
    liukang_d.onLoop = function () {
        liukang_d.gotoAndStop(-2);
    };
    liukang_d.onFrameChange = function () {
        liukang.y = h - liukang.height - 25;
    }
    liukang.addChild(liukang_d);

    liukang.y = h - liukang.height - 25
    liukang.x = 2 * w / 3 - liukang.width / 2 + 20
    liukang.vx = 0
    liukang.scale.x *= -1;
}

function moveTo(sprite, x) {
    if (sprite.x > x) {
        sprite.x -= 1
        moveTo(sprite, x)
    }

    if (sprite.x < x) {
        sprite.x += 1
        moveTo(sprite, x)
    }


}

function alignBottom(sprite, container) {
    sprite.y = container.height - sprite.height;
}

function movePlayer2() {
    let move = ply2Movemets[actualMov];
    if (actualMov < ply2Movemets.length) {
        switch (move.action) {
            case 'move_right':
                liukang_right_press();
                setTimeout(() => {
                    liukang_left_release();
                    actualMov++
                    movePlayer2();
                }, move.time);
                break;

            case 'move_left':
                liukang_left_press();
                setTimeout(() => {
                    liukang_left_release();
                    actualMov++
                    movePlayer2();
                }, move.time);
                break;

            case 'kick':
                liukang_fist_press()
                setTimeout(() => {
                    actualMov++
                    movePlayer2();
                }, move.time);
                break;
            case 'fist':
                liukang_fist_press()
                setTimeout(() => {
                    actualMov++
                    movePlayer2();
                }, move.time);
                break;

            case 'nothing':
                setTimeout(() => {
                    actualMov++
                    movePlayer2();
                }, move.time);
                break;

            default:
                console.log('default');
                break;
        }
    }

}

function scorpio_right_press() {
    if (!isLocked) {
        isWalking = true;
        scorpio.vx = 2
        if (!isWalkLock) {
            scorpio_s.visible = false;
            scorpio_w.visible = true;
            scorpio_w.animationSpeed = 0.16;
        }
    }
}

function scorpio_right_release() {
    if (!isLocked) {
        isWalking = false;
        scorpio.vx = 0
        if (!isWalkLock) {
            scorpio_s.visible = true;
            scorpio_w.visible = false;
        }
    }
}

function scorpio_left_press() {
    if (!isLocked) {
        isWalking = true;
        scorpio.vx = -2
        if (!isWalkLock) {
            scorpio_s.visible = false;
            scorpio_w.visible = true;
            scorpio_w.animationSpeed = -0.16;
        }
    }
}

function scorpio_left_release() {
    if (!isLocked) {
        isWalking = false;
        scorpio.vx = 0
        if (!isWalkLock) {
            scorpio_s.visible = true;
            scorpio_w.visible = false;
        }
    }
}

function scorpio_kick_press() {
    if (!isLocked) {
        if (!isHitLocked) {
            isWalkLock = true;
            isHitLocked = true;
            hideScorpio();
            scorpio_k.visible = true;
            scorpio_k.play();
            playSound('haa', 1)
            playSound('patada', 0.5)
        }
    }
}

function scorpio_fist_press() {
    if (!isLocked) {
        if (!isHitLocked) {
            isWalkLock = true;
            isHitLocked = true;
            hideScorpio();
            scorpio_f.visible = true;
            scorpio_f.play();
            playSound('haa', 1)
            playSound('patada', 0.5)
        }
    }
}

function scorpio_do_finisher() {
    if (!isLocked) {
        isLocked = true;
        isLocked2 = true;
        hideScorpio();
        scorpio_finisher.visible = true;
        scorpio_finisher.play();
    }
}

function scorpio_die() {
    hideScorpio();
    scorpio_d.visible = true;
    scorpio_d.play();
}

function scorpio_victory() {
    hideScorpio();
    scorpio_v.visible = true;
    scorpio_v.play();
}

function liukang_right_press() {
    if (!isLocked2) {
        isWalking2 = true;
        liukang.vx = 2
        if (!isWalkLock2) {
            liukang_s.visible = false;
            liukang_w.visible = true;
            liukang_w.animationSpeed = -0.16;
        }
    }
}

function liukang_right_release() {
    if (!isLocked2) {
        isWalking2 = false;
        liukang.vx = 0
        if (!isWalkLock2) {
            liukang_w.visible = false;
            liukang_s.visible = true;
        }
    }

}

function liukang_left_press() {
    if (!isLocked2) {
        isWalking2 = true;
        liukang.vx = -2
        if (!isWalkLock2) {
            liukang_s.visible = false;
            liukang_w.visible = true;
            liukang_w.animationSpeed = 0.16;
        }
    }
}

function liukang_left_release() {
    if (!isLocked2) {
        isWalking2 = false;
        liukang.vx = 0
        if (!isWalkLock2) {
            liukang_w.visible = false;
            liukang_s.visible = true;
        }
    }

}

function liukang_kick_press() {
    if (!isLocked2) {
        if (!isHitLocked2) {
            isWalkLock2 = true;
            isHitLocked2 = true;
            hideLiukang();
            liukang_k.visible = true;
            liukang_k.play();
            playSound('haa_liu', 1)
            playSound('puño_liu', 0.5)
        }
    }
}

function liukang_fist_press() {
    if (!isLocked2) {
        if (!isHitLocked2) {
            isWalkLock2 = true;
            isHitLocked2 = true;
            hideLiukang();
            liukang_f.visible = true;
            liukang_f.play();
            playSound('haa_liu', 1)
            playSound('puño_liu', 0.5)
        }
    }

}

function liukang_do_finisher() {
    if (!isLocked2) {
        isLocked = true;
        isLocked2 = true;
        hideLiukang();
        liukang_finisher.visible = true;
        liukang_finisher.play();
        hideLiukang();
        playSound('aahh', 1)
    }

}

function liukang_victory() {
    hideLiukang();
    liukang_finisher.visible = false;
    liukang_v.visible = true;
    liukang_v.play();
    playSound('final', 1)
}

function liukang_die() {
    hideLiukang();
    liukang_d.visible = true;
    liukang_d.play();
    playSound('die_liu', 1)
}

function hideScorpio() {
    scorpio_s.visible = false;
    scorpio_w.visible = false;
    scorpio_k.visible = false;
    scorpio_f.visible = false;
    scorpio_h.visible = false;
}

function hideLiukang() {
    liukang_s.visible = false;
    liukang_w.visible = false;
    liukang_k.visible = false;
    liukang_f.visible = false;
    liukang_h.visible = false;
}

function liukang_position(x) {
    liukang.x = x;
    isWalking2 = true;
    liukang.vx = -2
    if (!isWalkLock2) {
        liukang_s.visible = false;
        liukang_w.visible = true;
        liukang_w.animationSpeed = 0.16;
    }
}

function keyboardListener() {
    let right = keyboard("ArrowRight"),
        left = keyboard("ArrowLeft"),
        space = keyboard(" "),
        x = keyboard("x"),
        a = keyboard("a"),
        d = keyboard("d"),
        w = keyboard("w"),
        s = keyboard("s"),
        z = keyboard("z"),
        f = keyboard("f"),
        g = keyboard("g");

    right.press = () => {
        if (state == play) {
            scorpio_right_press()
        }
    };
    right.release = () => {
        if (state == play) {
            scorpio_right_release()
        }
    };
    left.press = () => {
        if (state == play) {
            scorpio_left_press()
        }
    };
    left.release = () => {
        if (state == play) {
            scorpio_left_release()
        }
    };
    space.press = () => {
        if (state == play) {
            scorpio_kick_press()
        }
    };
    x.press = () => {
        if (state == play) {
            scorpio_fist_press();
        }
    }
    f.press = () => {
        scorpio_do_finisher();
    }

    d.press = () => {
        if (state == play) {
            liukang_right_press()
        }
    };
    d.release = () => {
        if (state == play) {
            liukang_right_release()
        }
    };
    a.press = () => {
        if (state == play) {
            liukang_left_press()
        }
    };
    a.release = () => {
        if (state == play) {
            liukang_left_release()
        }
    };
    s.press = () => {
        if (state == play) {
            liukang_kick_press();
        }
    }
    w.press = () => {
        if (state == play) {
            liukang_fist_press();
        }
    }
    g.press = () => {
        if (state == play) {
            liukang_do_finisher();
        }
    }
}

function contain(sprite, container) {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
}

function collision(x1, w1, x2, w2) {
    if ((x1 + w1) >= x2 - w2) {
        return true;
    } else {
        return false;
    }
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined; //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};

function onVisibilityChange(callback) {
    var visible = true;

    if (!callback) {
        throw new Error('no callback given');
    }

    function focused() {
        if (!visible) {
            callback(visible = true);
        }
    }

    function unfocused() {
        if (visible) {
            callback(visible = false);
        }
    }

    // Standards:
    if ('hidden' in document) {
        document.addEventListener('visibilitychange',
            function () {
                (document.hidden ? unfocused : focused)()
            });
    }
    if ('mozHidden' in document) {
        document.addEventListener('mozvisibilitychange',
            function () {
                (document.mozHidden ? unfocused : focused)()
            });
    }
    if ('webkitHidden' in document) {
        document.addEventListener('webkitvisibilitychange',
            function () {
                (document.webkitHidden ? unfocused : focused)()
            });
    }
    if ('msHidden' in document) {
        document.addEventListener('msvisibilitychange',
            function () {
                (document.msHidden ? unfocused : focused)()
            });
    }
    // IE 9 and lower:
    if ('onfocusin' in document) {
        document.onfocusin = focused;
        document.onfocusout = unfocused;
    }
    // All others:
    window.onpageshow = window.onfocus = focused;
    window.onpagehide = window.onblur = unfocused;
};

onVisibilityChange(function (visible) {
    if (!visible) {
        state = pause;
    } else {
        state = play;
    }
});