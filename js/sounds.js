function loadSound() {
    createjs.Sound.registerSound("src/sounds/male/mk2-00603.mp3", 'haa');
    createjs.Sound.registerSound("src/sounds/male/mk2-00618.mp3", 'rhit');
    createjs.Sound.registerSound("src/sounds/male/mk2-00636.mp3", 'aahh');
    createjs.Sound.registerSound("src/sounds/liukang/mk2-00244.mp3", 'haa_liu');
    createjs.Sound.registerSound("src/sounds/liukang/mk2-00765.mp3", 'rhit_liu');
    createjs.Sound.registerSound("src/sounds/liukang/mk2-00235.mp3", 'final');
    createjs.Sound.registerSound("src/sounds/liukang/mk2-00783.mp3", 'die_liu');
    createjs.Sound.registerSound("src/sounds/hitsounds/mk2-00136.mp3", 'patada');
    createjs.Sound.registerSound("src/sounds/hitsounds/mk2-00103.mp3", 'hit1');
    createjs.Sound.registerSound("src/sounds/hitsounds/mk2-00109.mp3", 'hit2');
    createjs.Sound.registerSound("src/sounds/hitsounds/mk2-00121.mp3", 'hit3');
    createjs.Sound.registerSound("src/sounds/hitsounds/mk2-00139.mp3", 'puño_liu');
    createjs.Sound.registerSound("src/sounds/shaokahn/mk2-00948.mp3", 'fatality');
    createjs.Sound.registerSound("src/sounds/mk2-00277.mp3", 'explosion');
    createjs.Sound.registerSound("src/sounds/musiccues/mk2-end1a.mp3", 'end');
}

function playSound(soundID, vol) {
    var instance = createjs.Sound.play(soundID);
    instance.volume = vol;
}