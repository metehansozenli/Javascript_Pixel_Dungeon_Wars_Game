addEventListener('load',function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 720;

    class Controls{
        constructor(game){
            this.game = game;
            addEventListener("keydown",e => {
                this.game.lastKey = 'P' + e.key;
                /*switch(e.code){
                    case 'KeyD':
                        vxr=playerVelocity;  
                        break;
                    case 'KeyA':
                        vxl=-playerVelocity;
                        break; 
                    case 'KeyW':
                        vy=-playerVelocity;
                        break;
                    case 'KeyS':
                        vy=playerVelocity;
                        break;
                } */
            });
            addEventListener('keyup',e => {
                this.game.lastKey= 'R'+e.key;
            });
        }
    }

    class Player{
        constructor(game){
            this.game = game;
            this.width = 50;
            this.height = 50;
            this.x = 200;
            this.y = 200;
            this.speedX = 0;
            this.speedY = 0;
            
        }
        draw(ctx){
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
        update(){
            if (this.game.lastKey == 'PA')
                this.speedX = -1;
            else if (this.game.lastKey == 'PD')
                this.speedX = 1;
            else if (this.game.lastKey == 'PW')
                this.speedY = -1;
            else if (this.game.lastKey == 'PS')
                this.speedY = 1;
            else {
                this.speedX = 0;
                this.speedY = 0;
            }
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    class Enemy{
        constructor(width,height,color){
            this.width=width;
            this.height=height;
            this.color=color;
        } 
    }
    class Game{
        constructor(width,height){
            this.width=width;
            this.height=height;
            this.lastKey=undefined;
            this.control=new Controls(this);
            this.player = new Player(this);
        }
        show(ctx){
            this.player.draw(ctx);
        }
    }

    const game= new Game(canvas.width,canvas.height);
    function animate(){
        game.show(ctx);
        game.update();
        requestAnimationFrame(animate);
    }
    

});
/*
let x=100;
let y=80;
let vxl=0;
let vxr=0;
let vy=0;
let playerWidth=25;
let playerHeigth=25;
let enemyWidth=25;
let enemyHeigth=50;
let enemyX=0;
let enemyY=0;
let playerVelocity=2;
let enemyVelocity=1;

class Player{
    constructor(width,height,color){
        this.width=width;
        this.height=height;
        this.color=color;
    } 
}
class Enemy{
    constructor(width,height,color){
        this.width=width;
        this.height=height;
        this.color=color;
    } 
}

function update(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    if(x>=0)
        x += vxl;
    if(x+playerWidth<=canvas.width)
        x += vxr;
    y += vy;
    moveEnemy();
    ctx.fillStyle="blue";
    ctx.fillRect(x,y,playerWidth,playerHeigth);
    ctx.fillStyle="red";
    ctx.fillRect(enemyX,enemyY,enemyWidth,enemyHeigth);
    requestAnimationFrame(update);
}

function moveEnemy() {
    if (enemyX < x) {
      enemyX+=enemyVelocity;
    } else if (enemyX > x) {
      enemyX-=enemyVelocity;
    }
    if (enemyY < y) {
      enemyY+=enemyVelocity;
    } else if (enemyY > y) {
      enemyY-=enemyVelocity;
    }
  }


addEventListener("keydown",function(e){
    switch(e.code){
        case 'KeyD':
            vxr=playerVelocity;  
            break;
        case 'KeyA':
            vxl=-playerVelocity;
            break; 
        case 'KeyW':
            vy=-playerVelocity;
            break;
        case 'KeyS':
            vy=playerVelocity;
            break;
    } 
});

addEventListener("keyup",function(e){
    
    if(e.code == 'KeyD') {
        vxr=0;
        hor=0;
    }
    else if( e.code == 'KeyA'){
        vxl=0;
        hor=0
    }
    else if(e.code == 'KeyW' || e.code == 'KeyS'){
        vy=0;
        ver=0;
    }
});

update();*/
