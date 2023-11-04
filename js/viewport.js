// from: https://masteringjs.io/tutorials/fundamentals/enum
// ----
// Although enum is a reserved word in JavaScript, JavaScript has no support for traditional enums.
class views {
    static TOP = 0;
    static FP = 1;
}

class Ray {
    pos;
    #dir;
    end;
    maxDepth;
    constructor(v = new Vector2(), th = Math.PI / 2, max = 8) {
	this.pos = structuredClone(v);
	this.#dir = new Vector2(Math.cos(th), Math.sin(th));
	this.maxDepth = max;
	this.cast();
    };

    cast() {
	this.end = structuredClone(this.pos);
	let targ = undefined;
	for (var i = 0; i < this.maxDepth; i++) {
	    
	    this.end.x += this.pos.x + this.#dir.x * tile_size;
	    this.end.y += this.pos.y + this.#dir.y * tile_size;
	    targ = World.atPoint(this.end.x, this.end.y)
	    if (targ != units.air) break;
	}
	return targ;
    }
}

const DESIRED_FPS = 25;
const UPD_INT = Math.trunc(1000/DESIRED_FPS);

const Sound = {
    trackplayer: new Audio(),
    track : function(filepath) {
	Sound.trackplayer.src = filepath;
	Sound.trackplayer.load();
    },
    
    sfx: function (filepath, x = null, y = null, ears = World.entities[0]) {
	// god bless stack overflow
	// https://stackoverflow.com/questions/4099393/algorithm-to-set-proper-audio-volume-based-on-distance-x-y
	// TODO: panning
	// look into https://stackoverflow.com/questions/20287890/audiocontext-panning-audio-of-playing-media
	let vol = 1;
	if (x != null && y != null) vol = Math.min( vol, vol / distance(ears.xpos, ears.ypos, x, y) );
	var audio = new Audio(filepath);
	audio.volume = vol;
	audio.play();
	audio = null;
    },

    pause : function() {
	Sound.trackplayer.pause();
    },

    resume : function() {
	Sound.trackplayer.play();
    }
};

function drawEntityTD(ctx, entity) {
    let cos = Math.cos(entity.facing);
    let sin = Math.sin(entity.facing);
    ctx.beginPath();
    ctx.arc(entity.xpos, entity.ypos, tile_size / 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = entity.color;
    ctx.fill();
    /*
    drawLine(entity.pos,
	     new Vector2(entity.xpos + 30 * cos, entity.ypos + 30 * sin),
	     ctx,
	     entity.color,
	     5
	    );
    */
}

function drawSnatchingHand(ctx) {
    return;
}

function drawLine(start, end, ctx, color = 'blue', px = 1) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = px;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function drawRays(ctx, ent) {
    //let rayOffset = new Vector2();
    //let rayTh = ent.facing;
    //let rayDir = 0;
    const FOV = Math.PI / 3;
    //const HALF_FOV = FOV / 2;
    const STEP_ANGLE = FOV / ctx.canvas.width;

    //console.log(FOV/STEP_ANGLE);
    for (var i = 0; i < Math.floor(FOV/STEP_ANGLE); i++) {
	let ray = new Ray(ent.pos, ent.facing);
	drawLine(ray.pos, new Vector2(ray.end.x, ray.end.y), ctx);
	
	/*
	rayPos = ent.pos;
	var curSin = Math.sin(rayTh); curSin = curSin ? curSin : 0.000001;
	var curCos = Math.cos(rayTh); curCos = curCos ? curCos : 0.000001;
	rayOffset.x = (curSin > 0) ? rayPos.x + tile_size : rayPos.x;
	rayDir = (curSin > 0) ? 1 : -1;
	for (var depth = 0; depth < 8; depth++) {
	    rayOffset.y = ent.ypos + depth * curSin * tile_size;
	    if (World.atPoint(rayOffset.x, rayOffset.y) != units.air) break;
	    rayOffset.x += rayDir * tile_size;
	    }
	*/
	

	
	//drawLine(ent.pos, rayOffset, ctx);
    }
	
}

function drawViewport(ent, canvas, view = views.TOP) {
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    switch (view) {
        case views.TOP:
            //top down; mostly used for debugging
            for (var j = 0; j < World.mapHeight; j++) {
                for (var i = 0; i < World.mapWidth; i++) {

                    switch (World.map[(j * World.mapHeight) + i]) {
		    case units.player_s:
			ctx.fillStyle = 'green';
			break;
		    case units.wall:
			ctx.fillStyle = 'black';
			break;
		    case units.wallA:
			ctx.fillStyle = 'babyblue';
			break;
		    case units.wallB:
			ctx.fillStyle = 'crimson';
			break;
		    case units.wallC:
			ctx.fillStyle = 'lime';
			break;
		    case units.wallD:
			ctx.fillStyle = 'red';
			break;
                    case units.door:
			ctx.fillStyle = 'yellow';
			break;
		    default:
			ctx.fillStyle = 'white';
                    }

                    ctx.fillRect(
                        tile_size * i,
                        tile_size * j,
                        tile_size * (i + 1),
                        tile_size * (j + 1)
                    );

                }
            }

            for (let i = 0; i < World.entities.length; i++)
                if (World.entities[i] != undefined) drawEntityTD(ctx, World.entities[i]);

            //drawRays(ctx, ent);

            break;
        case views.FP:
            //first person


            break;
    }

}

function callRedraw() {
    for (let i = 0; i < World.entities.length; i++) {
	if (World.entities[i].viewport == null) continue;
        World.entities[i].viewport.getContext('2d').clearRect(0, 0,
            World.entities[i].viewport.width,
            World.entities[i].viewport.height
        );
        drawViewport(World.entities[i], World.entities[i].viewport, views.TOP);
    }
}
