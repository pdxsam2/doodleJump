//todo: 
// see comments
// fix setIntervals so that when you hit a wall you don't freeze
// add game over / try again screen 
// mess with some styling stuff
// make your own pixel art: https://www.raywenderlich.com/2888-introduction-to-pixel-art-for-games
// fix character image
// css tutorial: https://www.htmldog.com/guides/css/advanced/

document.addEventListener('DOMContentLoaded', () => {
    const grid= document.querySelector('.grid');
    const doodler= document.createElement('div');
    const gridHeight= 600;
    const gridWidth= 400;  
    let startPoint= 150;
    let doodlerLeftSpace; 
    let doodlerBottomSpace;
    let isGameOver= false;
    let platformCount= 5;
    let platforms= [];
    let upTimerId;
    let downTimerId;
    let isJumping= false;
    let isGoingLeft= false;
    let isGoingRight= false;
    let leftTimerId;
    let rightTimerId;
    let platformTimerId;
    let score= 0;

    document.querySelector(".start-button").onclick= start;

    function createDoodler(){
        doodler.classList.add('doodler');
        doodlerLeftSpace= platforms[0].left;
        doodlerBottomSpace= platforms[0].bottom;
        doodler.style.left= doodlerLeftSpace + 'px';
        doodler.style.bottom= doodlerBottomSpace +'px';
        grid.appendChild(doodler);
    }

    class Platform {
        constructor(bottomBuffer){
            this.bottom= bottomBuffer;
            this.left= Math.random() * 315;    
            this.visual= document.createElement('div');
            
            const visual= this.visual;
            visual.classList.add('platform');
            visual.style.left= this.left + 'px';
            visual.style.bottom= this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms(){
        for(let i= 0; i < platformCount; i++){
            let bottomBuffer= 100 + ((gridHeight/platformCount)*i);
            let newPlatform= new Platform(bottomBuffer);
            platforms.push(newPlatform);
        }
    }

    function movePlatforms(){
        //if(doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual= platform.visual;
                visual.style.bottom= platform.bottom + 'px';

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    console.log(platforms);
                    let newPlatform = new Platform(gridHeight);
                    platforms.push(newPlatform);

                }
            })
        //}
    }

    function jump() {
        clearInterval(downTimerId);
        upTimerId= setInterval(function () {
            isJumping= true;
            doodlerBottomSpace += 20;
            doodler.style.bottom= doodlerBottomSpace + 'px';
            if(doodlerBottomSpace > (startPoint+ 200)){
                fall();
            }
        }, 30);
    }

    function fall(){
        clearInterval(upTimerId);
        isJumping= false;
        downTimerId= setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom= doodlerBottomSpace + 'px';
            if(doodlerBottomSpace <= 10) {
                gameOver();
            }
            platforms.forEach(platform => {
                if( 
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= platform.left + 85) && 
                    !isJumping
                ){
                    console.log("landed...")
                    startPoint = doodlerBottomSpace;
                    ++score;
                    jump();
                }
            })
        }, 30)
    }

    function gameOver(){
        console.log("Game is over m8");
        isGameOver= true;
        while(grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        clearInterval(platformTimerId);
    }

    function control(e) {
        if(e.key === "ArrowLeft"){
            moveLeft();
        }
        else if(e.key === "ArrowRight"){
            moveRight();
        }
        else if(e.key === "ArrowUp"){
            setStraight();
        }
    }

    function setStraight(){
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
        isGoingRight= false;
        isGoingLeft= false;
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight= false;
        }
        isGoingLeft= true;
        leftTimerId = setInterval(function () {
            if(doodlerLeftSpace >= 5) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            }
            else moveRight();
        },30);
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft= false;
        }
        isGoingRight= true;
        rightTimerId= setInterval(function () {
            if(doodlerLeftSpace <= 335){
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } 
            else moveLeft();
        }, 30)
    }

    function start() {
        while(grid.firstChild){
            grid.removeChild(grid.firstChild);
        }
        
        if(!isGameOver) {
            createPlatforms();
            createDoodler();
            platformTimerId= setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keyup', control);
        }
    }
    
});