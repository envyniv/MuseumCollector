const tile_size = 64; //tile height

class units {
    static air = 0; //obligatory 0
    
    static player_s = 1;
    
    static wall = 2;
    static wallA = 3;
    static wallB = 4;
    static wallC = 5;
    static wallD = 6;
    
    static door = 7; // usually exit door
    static doorA = 8;
    static doorB = 9;
    static doorC = 10;

    // items to collect (in order)
    static collectFirst = 11;
    static collectSecond = 12;
    static collectThird = 13;
    static collectFourth = 14;
    static collectFifth = 15;

    //enemies
    static guardSimple_s = 16;
    static guardChase_s = 17;
    static guardIntercept_s = 18;
    static guardSentry_s = 19;

    static sentryCage = 20;
}

/*

 * first = 1
 * second = 2
 * third = 4
 * fourth = 8
 * fifth = 16
  
  */

var collected = 0;

const bgm_track_pool = [
    "assets/boba_gor.ogg",
    "assets/briefing.ogg",
    "assets/covert_action.ogg",
]

function lastminshuffleArray(a) {
    var array = structuredClone(a);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


const last_minute_colors = [
    'orange',
    'blue',
    'yellow',
    'gray',
    'red'
]

const colors = lastminshuffleArray(last_minute_colors)

let time = new Date().getTime();
