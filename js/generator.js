const World = {
    floor: 0,
    //map: [],
    map: [],
    mapWidth : 0, mapHeight : 0,

    entities: [],

    getIndex: function(x, y) {
	return x + y * World.mapWidth;
    },

    atPoint: function(pos) {
	let mapPos = new Vector2(
	    Math.floor(pos.x / tile_size),
	    Math.floor(pos.y / tile_size)
	);
	
	return World.map[World.getIndex(mapPos.x, mapPos.y)];
    },

    kill: function (ent) {
	if (ent.think) clearInterval(ent.think);
	World.entities.splice(World.entities.indexOf(ent), 1);
    },

    win: function() {
	Sound.track('assets/escape_from_metal_city.ogg')
	World.kill(World.entities[0]);
	alert('Hai vinto!');
	window.location.reload();
    },
    
    placeWalls: function(_pattern = false) {
        // generate enclosing box
        for (var r = 0; r < World.mapWidth; r++) {
            for (var c = 0; c < World.mapHeight; c++) {
                if (r == 0 || c == 0 || r == World.mapHeight - 1 || c == World.mapWidth - 1)
                    World.map[World.getIndex(c, r)] = units.wall;
                //else
                    //World.map[(r * World.mapHeight) + c] = units.air; //ensure no cells are undefined
            }
        }
    },

    placeExit: function () {
        // place exit door(s) at top
        var middlepoint = (World.mapWidth - 1) / 2;
        if (World.mapWidth % 2 == 0) { // length is even, 2 doors
            //console.log(middlepoint);
            World.map[middlepoint] = units.door;
	    World.map[middlepoint + 1][0] = units.door;
        } else // length is odd, exit door is lonely :(
            World.map[middlepoint] = units.door;

    },

    placeItem: function(row = 1, col = 1, item_num = 1, _clr = 'blue') {
	
	new Entity((row * tile_size) + tile_size/2,
		   (col * tile_size) + tile_size/2,
		   '',
		   itemThink, _clr, units.collectFirst + item_num - 1
	);
	return;
    },

    placeGuard: function(row = 1, col = 1) {
	new Entity((row * tile_size) + tile_size / 2,
		   (col * tile_size) + tile_size / 2, '',
		   sentryThink, 'orange', units.guardSimple_s, null, 1000
		  );
    },

    placePlayer: function (chosen_tile_row = 1, chosen_tile_col = 1) {
        // TODO: randomize;

        new Entity((chosen_tile_row * tile_size) + tile_size / 2,
		   (chosen_tile_col * tile_size) + tile_size / 2,
		   '',
		   playerThink,
		   'green',
		   units.player_s,
		   document.getElementById('game') // viewport for the player
		  );
	
    },

    placeSpawns: function() {  //
        // items should spawn at the end of hallways
        // player cannot spawn on items
        // guards can spawn where they don't see the player in the first frame of a game
	for (var y = 0; y < World.mapHeight; y++) {
	    for (var x = 0; x < World.mapWidth; x++) {
		var index = World.getIndex(x, y);
		
	
		if (World.map[index] == units.player_s || World.map[index] === units.guardSentry_s) {
		    continue;
		}
	    
		if (World.map[index] == units.air && Math.random() < 0.2) {
		    World.map[index] = Math.floor(Math.random() * 5) + 2;
		    continue;
		}
		
		if (World.map[index] == 0 &&
		    (Math.random() < 0.05 ||
		     World.isTraversable(x - 1, y) ||
		     World.isTraversable(x + 1, y) ||
		     World.isTraversable(x, y - 1) ||
		     World.isTraversable(x, y + 1))) {
		    World.map[index] = Math.floor(Math.random() * 3) + units.doorA;
		    continue;
		}
	    
		if (World.map[index] != units.air && Math.random() < 0.1) {
		    World.map[index] = Math.floor(Math.random() * 5) + units.collectFirst;
		    continue;
		}
		
		if (World.map[index] != units.air && Math.random() < 0.05) {
		    World.map[index] = Math.floor(Math.random() * 4) + units.guardSentry_s;
		    continue;
		}
	    }
	}
    },

    placeEntities: function() {
        // TODO: look for spawns
	var shuffledagain = lastminshuffleArray(colors)
        World.placePlayer(); // player will always be entity 0
	for (let i = 1; i < 6; i++)
	    World.placeItem(2+i, 2+i, i, shuffledagain[i-1]); //items will be 1 - 5
	//World.placeGuard();
    },

    nextFloor: function (_w, _h) {
        World.floor++;
        //clear map array
        World.mapWidth = World.floor * 11;
        World.mapHeight = World.floor * 11;
        World.map = new Array(World.mapWidth * World.mapHeight).fill(units.air);
	//World.map = generateMaze(World.mapWidth, World.mapHeight);
        
        World.placeWalls();
        //World.placeSpawns();
        World.placeExit();
        World.placeEntities();
	
	Sound.track(bgm_track_pool[Math.floor(Math.random()*bgm_track_pool.length)]);
	alert("prendi " + colors + " in ordine, poi vai verso il cubo giallo.\n\nMuoviti con WASD.");
    },
    
    isTraversable: function(x, y) {
	if (x < 0 || x >= World.mapWidth || y < 0 || y >= World.mapHeight) {
	    return false; // Coordinate fuori dai limiti della mappa
	}
	var index = World.getIndex(x, y);
	return World.map[index] == units.air; // Verifica che la cella sia vuota
    }
    
};
