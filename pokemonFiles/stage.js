function Stage(player1, player2) {
    this.Pokemon = require('./pokemon');
    this.events = require('events');
    this.Discord = require('discord.js');
    
   

    //p1
    this.p1 = player1;
    this.team1 = [];
    this.p1Pokemon = 0;//index of current pokemon in team1
    this.p1Move;
    this.p1Turn;
    this.p1Msg;
    //p2
    this.p2 = player2;
    this.team2 = [];
    this.p2Pokemon = 0;//index of current pokemon in team2
    this.p2Move;
    this.p2Turn;
    this.p2Msg;

    this.t1Emitter = new this.events.EventEmitter();
    this.t2Emitter = new this.events.EventEmitter();
    
    this.createTeam1();
    this.createTeam2();
}
Stage.prototype.createTeam1 = function () {
    //this.p2 = player2;
    for(var i = 0; i < 6; i ++) {
        this.team1[i] = new this.Pokemon(Math.floor(Math.random() * 500) + 1, i, this.t1Emitter);
        //this.p2Pokemon[i] = this.Pokemon(floor(Math.random() * 500), i, this.emitter);  
    }
    var self = this;
    this.t1Emitter.on('teamDone', function() {
        self.test(1);
    });
    const createdListener = function(x) {
        console.log("Created a pokemon");
        var done = true;
        for(var i = 0; i < 6; i ++) {
            if(self.team1[i].created == false) {
                done = false;
                console.log("stopped");
                return;
            }
        }
        if(done) {
            console.log("teamcreated");
            
            self.t1Emitter.emit("teamDone");
            self.t1Emitter.removeListener("pokemonCreated", createdListener);
        }
    }
    this.t1Emitter.on("pokemonCreated", createdListener);
}
Stage.prototype.createTeam2 = function () {
    //this.p2 = player2;
    for(var i = 0; i < 6; i ++) {
        this.team2[i] = new this.Pokemon(Math.floor(Math.random() * 500) + 1, i, this.t2Emitter);
        //this.p2Pokemon[i] = this.Pokemon(floor(Math.random() * 500), i, this.emitter);  
    }
    var self = this;
    this.t2Emitter.on('teamDone', function() {
        self.test(2);
    });
    const createdListener = function(x) {
        console.log("Created a pokemon");
        var done = true;
        for(var i = 0; i < 6; i ++) {
            if(self.team2[i].name == undefined) {
                done = false;
                console.log("stopped");
                return;
            }
        }
        if(done) {
            console.log("teamcreated");
            self.t2Emitter.emit("teamDone");
            self.t2Emitter.removeListener("pokemonCreated", createdListener);
        }
    }
    this.t2Emitter.on("pokemonCreated", createdListener);
}
Stage.prototype.test = function (team) {
    if(team == 1) {
        var moves = [];
        for(var i = 0; i < this.team1.length; i ++) {
            moves[i] = "";
            for(var t = 0; t < this.team1[i].moves.length; t++) {
                moves[i] += (t+1) + ". " + this.team1[i].moves[t].name + '\n'; 
            }
        }
        const embed = new this.Discord.RichEmbed()
        .setTitle("Your Team")
        .setDescription("Treat them well")
        .setColor(0x00AE86)
        .addField(this.team1[0].name, moves[0], true)
        .addField(this.team1[1].name, moves[1], true)
        .addField(this.team1[2].name, moves[2], true)
        .addField(this.team1[3].name, moves[3], true)
        .addField(this.team1[4].name, moves[4], true)
        .addField(this.team1[5].name, moves[5], true);
      this.p1.send({embed});
    }
    else {
        var moves = [];
        for(var i = 0; i < this.team2.length; i ++) {
            moves[i] = "";
            for(var t = 0; t < this.team2[i].moves.length; t++) {
                moves[i] += this.team2[i].moves[t].name + '\n'; 
            }
        }
        const embed = new this.Discord.RichEmbed()
        .setTitle("Your Team")
        .setDescription("Treat them well")
        .setColor(0x00AE86)
        .addField(this.team2[0].name, moves[0], true)
        .addField(this.team2[1].name, moves[1], true)
        .addField(this.team2[2].name, moves[2], true)
        .addField(this.team2[3].name, moves[3], true)
        .addField(this.team2[4].name, moves[4], true)
        .addField(this.team2[5].name, moves[5], true);
      this.p2.send({embed});
    }
    this.printBattleStage(team);
}
Stage.prototype.receiveTurn = function(player, move) {
    if(player == this.p1) {
        this.p1Turn = true;
        this.p1Move = move;
        if(move.length > 1) {
            //this is for switching out pokemon
            //move[1] is the index of the new pokemon
            this.p1Pokemon == move[1];
        }
        else {
            if(this.p2Turn) {
                this.useMoves();
            }
        }
    }
    if(player == this.p2) {
        this.p2Turn = true;
        this.p2Move = move;
        if(move.length > 1) {
            this.p2Pokemon == move[1];
        }
        else {
            if(this.p1Turn) {
                this.useMoves();
            }
        }
    }
}
Stage.prototype.printBattleStage = function(toPlayer) {
    if(toPlayer == 1) {
        var outMon = this.team1[this.p1Pokemon];
        const embed = new this.Discord.RichEmbed()
        .setTitle(outMon.name)
        .setDescription("HP: " + outMon.getHP() + "/" + outMon.getMaxHP() + "\n" +
                        "Attack: " + outMon.getAttack() + "\n" +
                        "Defense: " + outMon.getDefense() + "\n" +
                        "S.Attack: " + outMon.getSAttack() + "\n" +
                        "S.Defense: " + outMon.getSDefense() + "\n" + 
                        "Speed: " + outMon.getSpeed()
                        );
        for(var i = 0; i < outMon.moves.length; i ++) {
            embed.addField(outMon.moves[i].name, outMon.moves[i].fText + "\n" + 
                            "Damage: " + outMon.moves[i].damage + "\n" +
                            "Accuracy: " + outMon.moves[i].accuracy 
                            );
        }
        this.p1.send({embed}).then(function(result) {
            this.p1Msg = result;
            result.react("1⃣");
            setTimeout(function() {
                result.react("2⃣");
                setTimeout(function() {
                    result.react("3⃣");
                    setTimeout(function() {
                        result.react("4⃣");
                    }, 500);
                }, 500);
            }, 500);  
        });
        
         
    }
    else {
        var outMon = this.team2[this.p1Pokemon];
        const embed = new this.Discord.RichEmbed()
        .setTitle(outMon.name)
        .setDescription("HP: " + outMon.getHP() + "/" + outMon.getMaxHP() + "\n" +
                        "Attack: " + outMon.getAttack() + "\n" +
                        "Defense: " + outMon.getDefense() + "\n" +
                        "S.Attack: " + outMon.getSAttack() + "\n" +
                        "S.Defense: " + outMon.getSDefense() + "\n" + 
                        "Speed: " + outMon.getSpeed()
                        );
        for(var i = 0; i < outMon.moves.length; i ++) {
            embed.addField(outMon.moves[i].name, outMon.moves[i].fText + "\n" + 
                            "Damage: " + outMon.moves[i].damage + "\n" +
                            "Accuracy: " + outMon.moves[i].accuracy 
                            );
        }
        this.p2.send({embed}).then(function(result) {
            this.p2Msg = result;
            result.react("1⃣");
            setTimeout(function() {
                result.react("2⃣");
                setTimeout(function() {
                    result.react("3⃣");
                    setTimeout(function() {
                        result.react("4⃣");
                    }, 500);
                }, 500);
            }, 500);
        });
    }
}
Stage.prototype.useMoves = function() {
    if(this.p1Move.priority - this.p2Move.priority == 0) {
        //speed determines first use
        if(this.team1[this.p1Pokemon].getSpeed() - this.team2[this.p2Pokemon].getSpeed() > 0) {
            //p1 is faster
            var moveEffects = this.p1Move.impact.split('+');
            if(this.p1Move.category != "status") {
                this.damageMove(this.p1Move, this.team1[this.p1Pokemon], this.team2[this.p2Pokemon]);
            }
        }
        else {
            //p2 is faster
        }
    }
    else if(this.p1Move.priority - this.p2Move.priority > 0) {
        //p1 auto goes first
    }
    else if(this.p1Move.priority - this.p2Move.priority < 0) {
        //p2 auto goes first
    }
}

Stage.prototype.damageMove = function(move, attacker, defender) {
    //I declare damage shall be (attack/defense) * moveDamage
    var damage;
    if(move.category == "physical") {
        //physical damage calculations
        damage = move.damage * (attacker.attack / defender.defense);
    }
    else {
        //special damage calculations
        damage = move.damage * (attacker.sAttack / defender.sDefense);
    }
    if(move.impact == "damage+ailment") {
        //extra effect calculations
        chance = Math.random() * 100;
        if(chance <= move.effectChance) {
            //effect occurs
        }
    }

}

Stage.prototype.dealDamage = function(victim, damage) {
    victim.setHP(victim.getHP() - damage);
    if(victim.getHP <= 0) {
        victim.alive = false;
    }
}
Stage.prototype.printTeam = function(player) {

}
module.exports = Stage;

