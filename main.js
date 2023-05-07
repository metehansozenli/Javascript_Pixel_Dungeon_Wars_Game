addEventListener('load',function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 720;

    class Controls{
        constructor(game){
            this.game = game;
            window.addEventListener("keydown",e => {
                this.game.lastKey = 'P' + e.key.toUpperCase();
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
            window.addEventListener('keyup',e => {
                this.game.lastKey= 'R'+e.key.toUpperCase();
            });
        }
    }

    class Projectiles{
        constructor(destX,destY){
            this.destX = destX;
            this.destY = destY;
            this.radius = 10;
            this.color = 'red';
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.destX, this.destY, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    class Player{
        constructor(game){
            this.game = game;
            this.width = 50;
            this.height = 50;
            this.x = 200;
            this.y = 200;
            this.velocityXL = 0;
            this.velocityXR = 0;
            this.velocityY = 0;
            this.maxSpeed = 3;
            
        }
        draw(context){
            context.fillRect(this.x,this.y,this.width,this.height);
        }
        update(){
            if (this.game.lastKey == 'PA')
                this.speedX = -3; 
            else if (this.game.lastKey == 'PD')
                this.speedX = 3;
            else if (this.game.lastKey == 'PW')
                this.speedY = -3;
            else if (this.game.lastKey == 'PS')
                this.speedY = 3;
            else {
                this.speedX = 0;
                this.speedY = 0;
            }
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    class Enemy{
        constructor(game){
            this.game = game;
            this.player = game.player;
            this.width = 50;
            this.height = 100;
            this.x = 600;
            this.y = 200;
            this.velocityXL = 0;
            this.velocityXR = 0;
            this.velocityY = 0;
            this.maxSpeed = 1;
        }
        
        draw(context){
            context.fillRect(this.x,this.y,this.width,this.height);
        }
        
        moveEnemy() {
            if (this.x < this.player.x) {
              this.x += this.maxSpeed;
            } else if (this.x > this.game.player.x) {
              this.x -= this.maxSpeed;
            }
            if (this.y < this.game.player.y) {
              this.y += this.maxSpeed;
            } else if (this.y > this.game.player.y) {
              this.y -= this.maxSpeed;
            }
            else{}

          } 
    }
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.lastKey = undefined;
            this.control = new Controls(this);
            this.player = new Player(this);
            this.enemy = new Enemy(this);
        }
        show(ctx){
            this.player.draw(ctx);
            this.enemy.draw(ctx);
            this.player.update();
            this.enemy.moveEnemy();
            
            // setInterval(() =>{
            //     const Interval = setInterval(() => this.enemy.moveEnemy(), 1);
            //     setTimeout(() =>{},5000);
            //     clearInterval(Interval);
            // },2000);
        }
    }

    const game= new Game(canvas.width,canvas.height);
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.show(ctx);
        window.addEventListener('click',(event) => {
            const projectile = new Projectiles(event.clientX,event.clientY);
            projectile.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

});
/*


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
    ctx.fillRect(this.x,this.y,enemyWidth,enemyHeigth);
    requestAnimationFrame(update);
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
