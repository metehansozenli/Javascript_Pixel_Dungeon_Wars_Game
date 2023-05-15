const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 640;

class Inputs{
    constructor(game){
        this.game = game;
        this.player = this.game.player;
        //kullanicinin klavye hereketleri alınır ve tuşa göre yön belirlitilerek hareket saglanir
        window.addEventListener("keydown", (e) => {
            if(e.code == 'KeyD'){
                this.player.velocityXR = this.player.maxSpeed;
                this.player.frameY = 0; 
            }    
            if(e.code == 'KeyA'){
                this.player.velocityXL = -this.player.maxSpeed;
                this.player.frameY = 1; 
            }    
            if(e.code == 'KeyW'){
                this.player.velocityY = -this.player.maxSpeed;
                this.player.frameY = 3; 
            }    
            if(e.code == 'KeyS'){
                this.player.velocityY = this.player.maxSpeed;
                this.player.frameY = 2; 
            }    
            });
        //tusa basilmama durumu    
        window.addEventListener("keyup", (e) => {
            if(e.code == 'KeyD')
                this.player.velocityXR=0;
            if(e.code == 'KeyA')
                this.player.velocityXL=0;
            if(e.code == 'KeyW')
                this.player.velocityY=0;
            if(e.code == 'KeyS')
                this.player.velocityY=0;
        });

        canvas.addEventListener('click',(event) => {
            this.game.player.shoot(event);
        });
    }
}

class SpriteSheet{//karakterlerin animasyonu icin bilgilerin tutuldugu class
    constructor(Id,spriteWidth,spriteHeight,maxFrame){
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = maxFrame;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.image = document.getElementById(Id);
    }
}

class Projectiles{//mermirler
    constructor(game,x,y,destX,destY,color,radius){
        this.game = game;
        this.x = x;
        this.y = y;
        this.destX = destX;
        this.destY = destY;
        this.radius = radius;
        this.color = color;
        this.velocity = 5;
        this.deletionStatus = false;
    }
    update(){
        this.x += this.destX * this.velocity;
        this.y += this.destY * this.velocity;
        //mermir oyun alaninin disina cikarsa silinmesi icin kosul
        if(this.x > this.game.width-30 || this.y > this.game.height-30 || this.x < 30 || this.y < 30) 
            this.deletionStatus = true;
    }
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Player extends SpriteSheet{
    constructor(game){
        super('player',33,64,4);
        this.game = game;
        this.width = 33;
        this.height = 64;
        this.x = 200;
        this.y = 200;
        this.velocityXL = 0;
        this.velocityXR = 0;
        this.velocityY = 0;
        this.maxSpeed = 3;
        this.health = 15;
        this.projectiles = [];   
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight,this.x,this.y,this.width, this.height);
        this.projectiles.forEach(projectile => {
            projectile.draw(context);
        });
    }
    update(){
        
        //oyuncu hareketi
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
        this.projectiles = this.projectiles.filter(projectile => !projectile.deletionStatus); // silinecek mermi varsa silinmesi saglaniyor
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

class Enemy extends SpriteSheet{
    constructor(game){
        super('enemy',78,78,8);          
        this.game = game; 
        this.player = game.player;
        this.x = 600;
        this.y = 200;
        this.spriteHeight = 78;
        this.spriteWidth = 78;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.maxSpeed = 1;
        this.health = 50;
        this.projectiles2 = [];
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight,this.x,this.y,this.width, this.height);
        this.projectiles2.forEach(projectile => {
            projectile.draw(context);
        });
        
    }
    moveEnemy() {
        //dusmanin takip etmesi
        if (this.x < this.player.x) {
            this.x += this.maxSpeed;
            this.frameY=0;
        } 
        else if (this.x > this.game.player.x) {
            this.x -= this.maxSpeed;
            this.frameY=1;
        }
        if (this.y < this.game.player.y) {
            this.y += this.maxSpeed;
            this.frameY=2;
        } 
        else if (this.y > this.game.player.y) {
            this.y -= this.maxSpeed;
            this.frameY=3;
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
        //düsmanin oyuncuya ates etmesi
        const angleEnemy = Math.atan2(this.game.player.y - this.y, this.game.player.x - this.x)
        this.projectiles2.push(new Projectiles(this.game, this.x, this.y, Math.cos(angleEnemy), Math.sin(angleEnemy),'#23b82d',8));
    }
    update(){
        this.projectiles2.forEach(projectile => {
            projectile.update();
        });
        this.projectiles2 = this.projectiles2.filter(projectile => !projectile.deletionStatus);
    }
    
}

class Rats extends SpriteSheet{
    constructor(game,x,y){
        super('rats',50,40,4);
        this.game = game;
        this.player = this.game.player;
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.spriteHeight = 40;
        this.spriteWidth = 50;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.maxSpeed = 2;
        this.deletionStatus = false;
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight,this.x,this.y,this.width, this.height);
    }
    update() {
        //sicanlarin takip etmesi
        if (this.x < this.player.x) {
            this.x += this.maxSpeed;
            this.frameY=0;
        } 
        else if (this.x > this.game.player.x) {
            this.x -= this.maxSpeed;
            this.frameY=1;
        }
        if (this.y < this.game.player.y) {
            this.y += this.maxSpeed;
            this.frameY=2;
        } 
        else if (this.y > this.game.player.y) {
            this.y -= this.maxSpeed;
            this.frameY=3;
        }
        if(this.y == this.game.player.y){
            this.y += 0;
        }
        
    } 
}

class Spikes {
    constructor(game){
        this.game = game;
        this.height = 50;
        this.width = 50 ;
        this.image = new Image();
        this.image = document.getElementById('spikes');
        this.x = Math.random() * this.game.width - this.width;
        this.y = Math.random() * this.game.height + this.height;
        //spawnlanilan noktanin yurunebilecek alanda olmasi
        this.x = (this.x < 55)? 58 : (this.x > this.game.width - this.width - 55)? this.game.width - this.width - 58 : this.x;
        this.y = (this.y < 185)? 185 : (this.y > this.game.height - this.height - 55)? this.game.height - this.height - 58 : this.y;
        this.damage = 0.1;
    }
    draw(context){
        context.drawImage(this.image,this.x,this.y,50,50);
    }

}

class Game{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.topMargin=105;
        this.ammo = 10;
        this.maxAmmo = 6;
        this.ammoTimer = 0;// mermi reload etme sure sayaci
        this.enemyShootTimer = 0;// dusman ates etme sure sayaci
        this.enemyWTimer = 0;// dusman bekleme sayaci
        this.enemyRTimer = 0;// dusman hareket etme sayaci
        this.enemyWInterval = 2000;// dusman bekleme suresi
        this.enemyRInterval = 5000// dusman hareket suresi
        this.ammoInterval = 500;// mermi reload suresi
        this.spriteTimer = 0;
        this.spriteInterval = 150;
        this.player = new Player(this);
        this.inputs = new Inputs(this);
        this.enemy = new Enemy(this);
        this.ammoIcon = document.getElementById("ammo");
        this.enemyHeart = document.getElementById("eHeart");
        this.playerHeart = document.getElementById("pHeart");
        this.rats = [];
        this.spikes = [];
        this.spikeCount = Math.random()*4 + 1;// dikenlerin sayisinin random belirlenmesi
    }
    update(deltaTime){
        
        this.player.update();
        this.enemy.update();
        this.rats.forEach(rat => {
            rat.update();
        });
        this.rats = this.rats.filter(rat => !rat.deletionStatus);
        //rastgele anda sican spawnlanmasi icin kosul
        var possibilty = Math.random();  
        if(possibilty < 0.001){
            this.spawnRats();
        }
        //Sprite sheet uzerinde belirli araliklarla gezinme
        if(this.spriteTimer > this.spriteInterval){
            if(this.enemy.frameX < this.enemy.maxFrame){
                this.enemy.frameX++;
                this.player.frameX++;
                this.rats.forEach(rat => {
                    rat.frameX++;
                });
            }
            //animasyonun basa donmesi icin gerekli kosullar
            if(this.enemy.frameX == this.enemy.maxFrame)
                this.enemy.frameX = 0;

            if(this.player.frameX == this.player.maxFrame)
                this.player.frameX = 0;

            this.rats.forEach(rat => {
                if(rat.frameX == rat.maxFrame)
                    rat.frameX = 0;
            });
            
            this.spriteTimer = 0;           
        }
        else
            this.spriteTimer += deltaTime;

        /*Dusmanin belirli araliklarla ates etmesi (her seferinde farkli araliklarla
                    ateslemek icin random kullanilmistir.)*/
        if(this.enemyShootTimer > (this.enemyShootInterval = Math.random()*20000+100)){
            this.enemy.shoot();
            this.enemyShootTimer = 0;
        }
        else
            this.enemyShootTimer += deltaTime;

        // Dusmanin belirli araliklar ile takip etmesi
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

        // Merminin belirli araliklar ile dolmasi
        if(this.ammoTimer > this.ammoInterval){
            if(this.ammo < this.maxAmmo) 
                this.ammo++;
            this.ammoTimer = 0;
        }
        else
            this.ammoTimer += deltaTime;
        // Cesitli kosullarda carpisma tesbit etme 
        this.player.projectiles.forEach(projectile => {
            if(this.checkHit(projectile,this.enemy)){
                this.enemy.health--;
                projectile.deletionStatus = true;
            }
        });
        this.enemy.projectiles2.forEach(projectile => {
            if(this.checkHit(projectile,this.player)){
                this.player.health--;
                projectile.deletionStatus = true;
            }
        });
        this.player.projectiles.forEach(projectile => {
            this.rats.forEach(rat => {
                if(this.checkHit(projectile,rat)){
                    rat.deletionStatus = true;
                    projectile.deletionStatus = true;
                }
            })
            
        });
        this.rats.forEach(rat => {
            if(this.checkHit(rat,this.player))
                this.player.health--;
        });
        this.rats.forEach(rat => {
            if(this.checkCollision(this.player,rat))
                this.player.health-=0.005;
        });
        this.spikes.forEach(spike => {
            if(this.checkCollision(this.player,spike))
                this.player.health-=0.01;
        });
        
        // Boss ve oyuncu canların oyun ekraninda gosterilmesi ve mermi sayisi
        ctx.drawImage(this.playerHeart,1050,55,30,30);
        ctx.fillStyle = "#ffe56d";
        ctx.font = "20px Arial";
        ctx.fillText(this.player.health.toFixed(1),1110,75);
        ctx.drawImage(this.ammoIcon,1050,100,30,30);
        ctx.fillStyle = "#ffe56d";
        ctx.font = "20px Arial";
        ctx.fillText(this.ammo,1110,120);
        
        ctx.drawImage(this.enemyHeart,80,55,30,30);
        ctx.fillStyle = "#ffe56d";
        ctx.font = "20px Arial";
        ctx.fillText(this.enemy.health,140,75);
    }
    show(ctx){
        this.player.draw(ctx);
        this.enemy.draw(ctx);
        this.rats.forEach(rat => {
            rat.draw(ctx);
        });
        this.spikes.forEach(spike => {
            spike.draw(ctx);
        });
    }
    checkCollision(player,enemy){
        //carpisma kosullari
        if (player.x < enemy.x + enemy.width &&
            player.x + enemy.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            return true;
        }
        // Carpisma yoksa
        return false;
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
    spawnRats(){
        //random yerde spawnlanma
        this.rats.push(new Rats(this,Math.random()*1100,Math.random()*600-this.topMargin));
    }
    spawnSpikes(){
        for(let i=0 ; i<=this.spikeCount ; i++)
            this.spikes.push(new Spikes(this));     
    }
}

var div;
function startGame(){
    div = document.getElementById("mainMenu");
    div.style.display= "none";
    const game = new Game(canvas.width,canvas.height);
    game.spawnSpikes();
    lastTime = 0;
    
    function animate(timeStamp){
        
        if(game.enemy.health <= 0){
           gameEnd("player");
        }
        else if(game.player.health <= 0){
            gameEnd("enemy");
        }
        else{// Oyun devam etme kosulu
            const deltaTime = timeStamp - lastTime;// bir onceki kare ile zaman farki
            lastTime = timeStamp;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            game.update(deltaTime);
            game.show(ctx);
            requestAnimationFrame(animate);
        }
    }
    animate(0);
}
function howToPlay(){
    div = document.getElementById("howToPlay");
    div.style.display = "flex";
}
function backToMenu(){
    div = document.getElementById("howToPlay");
    div.style.display = "none";
}
function gameEnd(winner){//bitisde gösterilecek ekran
    div = document.getElementById("gameEnd");
    div.style.display = "flex";
    if(winner == "player"){
        div.style.background = "url('assets/winScreen.gif')";
        div.style.backgroundSize = "cover";
    }
    else if (winner == "enemy"){
        div.style.background = "url('assets/deadScreen.gif')";
        div.style.backgroundSize = "cover";
    }
}
