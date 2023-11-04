var drawInterval = null;

const Input = {
    keymap: {},
    pointerMvmtX: 0,
    
    keyman: e => { Input.keymap[e.keyCode] = (e.type == 'keydown'); },

    isPressed: str => Input.keymap[str.toUpperCase().charCodeAt(0)] || false,

    mousemovement: e => { Input.pointerMvmtX += e.movementX * .01; },

    lockmouse: async (viewport) => {
        await viewport.requestPointerLock({ unassignedMovement: true });
        window.addEventListener('keydown', Input.keyman);
        window.addEventListener('keyup', Input.keyman);
        //window.addEventListener('mousemove', Input.mousemovement);
	// 25 fps
	drawInterval = setInterval(callRedraw, UPD_INT);
	//play music
	Sound.resume();
    },

    unlockmouse : async () => {
        if (!document.pointerLockElement) {
            window.removeEventListener('keydown', Input.keyman);
            window.removeEventListener('keyup', Input.keyman);
            window.removeEventListener('mousemove', Input.mousemovement);
	    clearInterval(drawInterval);
	    Sound.sfx('assets/pause.wav');
	    Sound.pause();
        }
    }
};

class Vector2 {
    x;
    y;
    constructor(x = 0, y = 0) {
	this.x = x;
	this.y = y;
    }
}

/*
class Door {
	#pos;
	texture;
	color;
	unitCode;
	show;

	constructor(gridpos = Vector2(), door_variety = 1, tex = null) {
	this.show = true;
	this.unitCode = units.door - 1 + door_variety;
	if (tex) {
		this.texture = new Image();
		this.texture.src = tex;
	}
	#pos = 
	};
    
	use() {
	
	};
	}
	*/

class Entity {
    movedir;
    #pos;
    facing; // radians
    #sprite;
    viewport; // canvas DOM Object
    color;
    unitCode; // main.js:units
    think; //interval
    
    constructor(x, y, path = '', func = null, clr = 'red', uC = null, vp = null, thinktime = 50) {
	this.movedir = new Vector2();
	this.#pos = new Vector2(x, y);
        this.facing = 0; //radians
        this.color = clr;
        if (path != '') {
            this.#sprite = new Image();
            this.#sprite.src = path;
        }
        this.think = func ? setInterval(func, thinktime, this) : null;
        World.entities.push(this);
        this.viewport = vp;
        if (this.viewport) {
            this.viewport.style.cursor = 'pointer';
            this.viewport.addEventListener(
                "click", () => { Input.lockmouse(this.viewport); }
            );
        }
        this.unitCode = uC;
    };

    //maintain compatibility
    get xpos() { return this.#pos.x; };

    set xpos(val) { this.#pos.x = val };

    get ypos() { return this.#pos.y; };

    set ypos(val) { this.#pos.y = val };

    get pos() { return this.#pos; };

    set pos(val) { this.#pos = val; };
}

window.onload = function() {
    document.onpointerlockchange = Input.unlockmouse;
    World.nextFloor();

    World.entities[0].viewport.getContext('2d').fillText("Cliccami per giocare.", 0, 40);

    // loop music
    Sound.trackplayer.addEventListener('ended', function () {
	this.currentTime = 0;
	this.play();
    }, false);
}

function distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}
