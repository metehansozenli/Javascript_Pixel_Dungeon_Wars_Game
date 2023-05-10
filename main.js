addEventListener('load',function(){
    
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 640;

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
                this.game.player.shoot(event);
            });
        }
    }

    class Projectiles{
        constructor(game,x,y,destX,destY,color,radius){
            this.game = game;
            this.x = x+25;
            this.y = y+25;
            this.destX = destX;
            this.destY = destY;
            this.radius = radius;
            this.color = color;
            this.velocity = 5;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.destX * this.velocity;
            this.y += this.destY * this.velocity;
            if(this.x > this.game.width-30 || this.y > this.game.height-30 || this.x < 30 || this.y < 30) this.markedForDeletion = true;
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
            this.health = 10;
            this.projectiles = [];
            
        }
        draw(context){
            const playerImg = new Image(); 
            playerImg.src = 'player1.png';
            context.drawImage(playerImg, this.x,this.y,128, 128);
            // context.fillStyle = 'blue';
            // context.fillRect(this.x,this.y,this.width,this.height);
            context.fillStyle = "Blue";
            context.font = "50px Arial";
            context.fillText(this.health,this.x+25,this.y);
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

            //X ekseninde sinirlama
            if(this.x < 55) this.x = 55;
            else if((this.x + 55) > this.game.width - this.width) this.x = this.game.width - this.width - 55;
            //Y ekseninde sinirlama
            if(this.y < this.game.topMargin) this.y = this.game.topMargin;
            else if((this.y + 50)> this.game.height - this.height) this.y = this.game.height - this.height - 50;

            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion); 
        }
        shoot(event){
            this.event = event;
            if (this.game.ammo>0){
                const rect = canvas.getBoundingClientRect();
                const angle = Math.atan2( (this.event.clientY - rect.top) - this.game.player.y, (this.event.clientX - rect.left) - this.game.player.x)
                this.projectiles.push(new Projectiles(this.game, this.game.player.x, this.game.player.y, Math.cos(angle), Math.sin(angle),'yellow',6));
                this.game.ammo--;
            }
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
            this.maxSpeed = 1;
            this.health = 20;
            this.projectiles2 = [];
        }
        draw(context){
            const enemyImg = new Image(); 
            enemyImg.src = 'wizard.gif';
            context.drawImage(enemyImg, this.x,this.y,96, 96);
            context.fillStyle = "Red";
            context.font = "50px Arial";
            context.fillText(this.health,this.x+25,this.y);
            this.projectiles2.forEach(projectile => {
                projectile.draw(context);
            });
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
            //X ekseninde sinirlama
            if(this.x < 55) this.x = 55;
            else if((this.x + 55) > this.game.width - this.width) this.x = this.game.width - this.width - 55;
            //Y ekseninde sinirlama
            if(this.y < this.game.topMargin) this.y = this.game.topMargin;
            else if((this.y + 50)> this.game.height - this.height) this.y = this.game.height - this.height - 50;
        } 
        shoot(){
            const angleEnemy = Math.atan2(this.game.player.y - this.y, this.game.player.x - this.x)
            this.projectiles2.push(new Projectiles(this.game, this.x, this.y, Math.cos(angleEnemy), Math.sin(angleEnemy),'blue',8));
        }
        update(){
            this.projectiles2.forEach(projectile => {
                projectile.update();
            });
            this.projectiles2 = this.projectiles2.filter(projectile => !projectile.markedForDeletion);
        }
        
    }

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.topMargin=105;
            this.lastKey = undefined;
            this.ammo = 20;
            this.maxAmmo = 20;
            this.ammoTimer = 0;// mermi reload etme sure sayaci
            this.enemyShootTimer = 0;// dusman ates etme sure sayaci
            this.enemyWTimer = 0;// dusman bekleme sayaci
            this.enemyRTimer = 0;// dusman hareket etme sayaci
            this.enemyWInterval = 2000;// dusman bekleme suresi
            this.enemyRInterval = 5000// dusman hareket suresi
            this.ammoInterval = 500;// mermi reload suresi

            this.inputs = new Inputs(this);
            this.player = new Player(this);
            this.enemy = new Enemy(this);
        }
        update(deltaTime){
            this.player.update();
            this.enemy.update();
            /*Dusmanin belirli araliklarla ates etmesi (her seferinde farkli araliklarla
             ateslemek icin random kullanilmistir.)*/
            if(this.enemyShootTimer > (this.enemyShootInterval = Math.random()*20000+100)){
                this.enemy.shoot();
                this.enemyShootTimer = 0;
            }
            else
                this.enemyShootTimer += deltaTime;

            // dusmanin belirli araliklar ile takip etmesi
            if(this.enemyWTimer < this.enemyWInterval){
                this.enemyWTimer += deltaTime;
                this.enemyRTimer = 0;
            }
            else{
                if(this.enemyRTimer > this.enemyRInterval)
                    this.enemyWTimer = 0;
                else{                 
                    this.enemy.moveEnemy();
                    this.enemyRTimer += deltaTime; 
                }   
            }

            // merminin belirli araliklar ile dolmasi
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo) 
                    this.ammo++;
                this.ammoTimer = 0;
            }
            else
                this.ammoTimer += deltaTime;

            this.player.projectiles.forEach(projectile => {
                if(this.checkHit(projectile,this.enemy)){
                    this.enemy.health--;
                    projectile.markedForDeletion = true;
                }
            });
            this.enemy.projectiles2.forEach(projectile => {
                if(this.checkHit(projectile,this.player)){
                    this.player.health--;
                    projectile.markedForDeletion = true;
                }
            });
        }
        show(ctx){
            this.player.draw(ctx);
            this.enemy.draw(ctx);
        }
        checkHit(projectile,aim){
            //Merminin merkez noktasinin dusman uzerindeki en kisa noktasini bulma 
            const y2 = (projectile.y < aim.y) ? aim.y : (projectile.y < aim.y + aim.height ) ? projectile.y : aim.y + aim.height;
            const x2 = (projectile.x < aim.x) ? aim.x : (projectile.x > aim.x + aim.width) ? aim.x + aim.width : projectile.x;
            //En yakin noktanin koordinatlari bulunduktan sonra mesefe hesaplama
            const distance = Math.sqrt( (x2-projectile.x)*(x2-projectile.x) + (y2-projectile.y)*(y2-projectile.y) );
            // Uzakilik merminin yaricapindan az veya esit ise vurulma gerceklesmis demektir
            if(distance <= projectile.radius) 
                return (true);
            else
               return (false); 
        }
    }
    const game= new Game(canvas.width,canvas.height);
    lastTime = 0;
    function animate(timeStamp){
        if(game.enemy.health > 0 && game.player.health > 0){// Oyun devam etme kosulu
            const deltaTime = timeStamp - lastTime;// bir onceki kare ile zaman farki
            lastTime = timeStamp;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            game.update(deltaTime);
            game.show(ctx);
            requestAnimationFrame(animate);
        }
    }
    animate(0);

});
