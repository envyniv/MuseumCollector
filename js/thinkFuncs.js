const moveHelper = (ent) => {
    ent;
}

const playerThink = async (ent) => {
    let cos_th = Math.cos(ent.facing);
    let sin_th = Math.sin(ent.facing);
    
    let plySpd = tile_size / 5;
    
    ent.facing = Input.pointerMvmtX;
    
    ent.movedir.y = Input.isPressed('s') - Input.isPressed('w');
    ent.movedir.x = Input.isPressed('d') - Input.isPressed('a');
    
    //ent.xpos += ent.movedir.x * cos_th * plySpd;
    //ent.ypos += ent.movedir.y * sin_th * plySpd;

    prev_pos = new Vector2(ent.xpos, ent.ypos);
    /*
    if (Input.isPressed('w')) {
	ent.xpos += cos_th * plySpd;
	ent.ypos += sin_th * plySpd;
    }
    else if (Input.isPressed('s')) {
	ent.xpos -= cos_th * plySpd;
	ent.ypos -= sin_th * plySpd;
    }
    // strafing
    if (Input.isPressed('a')) {
	ent.xpos += sin_th * plySpd;
	ent.ypos -= cos_th * plySpd;
    }
    else if (Input.isPressed('d')) {
	ent.xpos -= sin_th * plySpd;
	ent.ypos += cos_th * plySpd;
	}
    */
    ent.xpos += ent.movedir.x * plySpd;
    ent.ypos += ent.movedir.y * plySpd;

    let WAIO = World.atPoint(ent.pos); // what am i on?
    if ( WAIO <= units.wallD && WAIO >= units.wall || WAIO == units.sentryCage ) { ent.pos = prev_pos; }
    else if (WAIO == units.door && collected == 31) World.win(); // trigger win 
	
}

const itemThink = async (ent) => {
    const p = World.entities[0];
    const scan_radius = tile_size / 3;
    // if the player is in the radius of the item, destroy the item.
    if (distance(ent.xpos, ent.ypos, p.xpos, p.ypos) < scan_radius) {
	console.log(collected, Math.pow(2, colors.indexOf(ent.color)))
	if (collected >= Math.pow(2, colors.indexOf(ent.color))-1) {
	    Sound.sfx("assets/got.wav");
	    collected += Math.pow(2, ent.unitCode - 11);
	    //console.log(collected);
	    drawSnatchingHand(p.viewport);
	    World.kill(ent);
	}
    }
}

const simpletonThink = async (ent) => {
    /* TODO:
       raycast with 60° FOV,
       if player found - simple chase algo,
       until player goes out of sight.
       then, start idly moving again.
    */
    ent;
    const player = World.entities[0];
    const mvmtSpeed = tile_size / 6;
    return;
}

const sentryThink = async (ent) => {
    // turn around 90 degrees
    const player = World.entities[0];
    ent.facing += Math.PI / 2;
    /*
    switch (ent.facing) {
    case Math.PI / 2:
	if (ent.ypos < player.ypos && )
	break;
	}
	*/
    //console.log(tick);
}
