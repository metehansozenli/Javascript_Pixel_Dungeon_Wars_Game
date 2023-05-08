addEventListener('load',function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 720;

    class Inputs{
        constructor(game){
            this.game = game;
            window.addEventListener("keydown",e => {
                this.game.lastKey = 'P' + e.code;
            });
            window.addEventListener('keyup',e => {
                this.game.lastKey= 'R'+ e.code;
            });
            canvas.addEventListener('click',(event) => {
                const rect = canvas.getBoundingClientRect();
                if (this.game.ammo>0){
                    const angle = Math.atan2( (event.clientY - rect.top) - this.game.player.y, (event.clientX - rect.left) - this.game.player.x)
                    this.game.player.projectiles.push(new Projectiles(this.game, this.game.player.x, this.game.player.y, Math.cos(angle), Math.sin(angle)));
                    this.game.ammo--;
                }
            });
        }
    }

    class Projectiles{
        constructor(game,x,y,destX,destY){
            this.game = game;
            this.x = x;
            this.y = y;
            this.destX = destX;
            this.destY = destY;
            this.radius = 10;
            this.color = 'yellow';
            this.velocity = 5;
        }
        update(){
            this.x += this.destX * this.velocity;
            this.y += this.destY * this.velocity;
        }
        draw(context){
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.fillStyle = this.color;
            context.fill();
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
            this.projectiles = [];
            
        }
        draw(context){
            context.fillStyle = 'blue';
            context.fillRect(this.x,this.y,this.width,this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }
        update(){
            if(this.game.lastKey == 'PKeyD')
                this.velocityXR = this.maxSpeed;
            else if(this.game.lastKey == 'PKeyA')
                this.velocityXL = -this.maxSpeed;
            else if(this.game.lastKey == 'PKeyW')
                this.velocityY = -this.maxSpeed;
            else if(this.game.lastKey == 'PKeyS')
                this.velocityY = this.maxSpeed;
            else if(this.game.lastKey == 'RKeyD')
                this.velocityXR=0;
            else if(this.game.lastKey == 'RKeyA')
                this.velocityXL=0;
            else if(this.game.lastKey == 'RKeyW')
                this.velocityY=0;
            else if(this.game.lastKey == 'RKeyS')
                this.velocityY=0;
            
            this.x += this.velocityXR;
            this.x += this.velocityXL;
            this.y += this.velocityY;

            this.projectiles.forEach(projectile => {
                projectile.update();
            });
        }
        shoot(){

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
            context.fillStyle = 'red';
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
            this.ammo = 5;
            this.maxAmmo = 5;
            this.inputs = new Inputs(this);
            this.player = new Player(this);
            this.enemy = new Enemy(this);
        }
        update(){
            setTimeout(() => {
                if(this.ammo < this.maxAmmo){
                    this.ammo++;
                }
                this.update(); // Metodu kendisi ile tekrar çağırarak, 2 saniye sonra tekrar çalışmasını sağlar.
            }, 2000);
        }
        show(ctx){
            this.player.draw(ctx);
            this.enemy.draw(ctx);
            this.player.update();
            this.enemy.moveEnemy(); 
        }
    }

    const game= new Game(canvas.width,canvas.height);
    
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update();
        game.show(ctx);
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
            vxr=maxSpeed;  
            break;
        case 'KeyA':
            vxl=-maxSpeed;
            break; 
        case 'KeyW':
            vy=-maxSpeed;
            break;
        case 'KeyS':
            vy=maxSpeed;
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
