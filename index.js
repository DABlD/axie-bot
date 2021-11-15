var wy = "YWfDag";
const Discord = require("discord.js")
const { MessageEmbed } = require('discord.js')
const client = new Discord.Client()
var moment = require('moment-timezone');
moment().tz("Asia/Manila").format();
var ai = "ODk4MDgzNDc3NjA4NTk5NjMy";

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

client.on("ready", () => {
  console.log(`Bot Ready...`)
});

client.on("message", msg => {
    let isScholar = false;
    let roles = [];
    
    try{
        msg.member.roles._roles.forEach(a => {
            roles.push(a.name);
            if(a.name == "Scholar"){
                isScholar = true;
            }
        });
    }
    catch(err){
        console.log(msg);
        console.log(msg.member);
        try{
            console.log(msg.member.roles);
        }
        catch(err){
            log("Cant fetch msg.member.roles");
        }
        
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
            .addFields(
                { 
                    name: 'Failed to retrieve your channel roles', 
                    value: "Try again" }
                )
                .setTimestamp();

        client.channels.cache.get(msg.channel.id).send(exampleEmbed);
        log(err);
    }
    
    // SAVE
    if(msg.content.startsWith("!save ")){
        let temp = msg.content.split(" ");
        let id = msg.author.id;
        let username = msg.author.username;
        let ronin = temp[1].startsWith("0x") ? temp[1].substring(2) : temp[1].replace("ronin:", "");

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',
            data: {
                func: "save",
                did: id,
                username: username,
                ronin: ronin,
                role: isScholar ? "Scholar" : "Non-Scholar"
            },
            success: result => {
                console.log("success");
            },
            error: result => {
                console.log(result.responseText);
                console.log(result);

                const exampleEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                    .addFields(
                        {
                            name: "**Success**",
                            value: `<@!${id}>, your address has been saved`
                        }
                    )
                    .setTimestamp()

                client.channels.cache.get(msg.channel.id).send(exampleEmbed);
            }
        });
    }

    // LIST
    if (msg.content === "!list") {
        if(!(roles.includes("Moderator") || roles.includes("Technician"))){
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                .addFields(
                    {
                        name: "**Caution**",
                        value: `<@!${msg.author.id}>, you are not authorized to use this function`
                    }
                )
                .setTimestamp();

            client.channels.cache.get(msg.channel.id).send(exampleEmbed);
            return;
        }

        let message = "";
        let list = [];
        msg.reply("Getting Data...");

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',     
            data: {
                func: "lists",
            },
            success: users => {
                users.forEach((user, index) => {
                    list[index] = `**${user.username}**: 0x${user.ronin} \n`;
                });

                setTimeout(() => {
                    for(let i = 0; i < list.length; i++){
                        message += (i + 1) + ".) " + list[i];
                    }
                    message = message == "" ? "No Record" : message;

                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                        .addFields(
                            {
                                name: '**List**', 
                                value: message 
                            }
                        )
                    .setTimestamp();

                    client.channels.cache.get(msg.channel.id).send(exampleEmbed);
                }, 2000);
            },
            error: result => {
                log(result);
                ping();
            }
        });
    }

      // DELETE
    if(msg.content.startsWith("!del ")){
        if(!(roles.includes("Moderator") || roles.includes("Technician"))){
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                .addFields(
                    {
                        name: "**Caution**",
                        value: `<@!${msg.author.id}>, you are not authorized to use this function`
                    }
                )
                .setTimestamp();

            client.channels.cache.get(msg.channel.id).send(exampleEmbed);
            return;
        }

        let temp = msg.content.split(" ");
        temp.shift();
        let username = temp.join(" ");

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',
            data: {
                func: "del",
                username: username,
            },
            success: result => {
                console.log(result.responseText);
                console.log(result);

                if(result){
                    console.log(username + " has been deleted");

                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                        .addFields(
                            {
                                name: "**Success**",
                                value: `**${username}** has been deleted`
                            }
                        )
                        .setTimestamp()

                    client.channels.cache.get(msg.channel.id).send(exampleEmbed);
                }
                else{
                    ping();
                }
            },
            error: result => {
                log(result);
                ping();
            }
        });
    }

    // REPORT
    if(msg.content.startsWith("!report")){
        let did = msg.author.id;
        msg.reply(`Calculating Battles...`);

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',
            data: {
                func: "get",
                did: did,
            },
            success: result => {
                if(result){
                    let ronin = result.ronin;

                    $.ajax({
                        async: true,
                        crossDomain: true,
                        url: `https://axie-infinity.p.rapidapi.com/get-update/0x${ronin}?id=0x${ronin}`,
                        method: "GET",
                        headers: {
                            "x-rapidapi-host": "axie-infinity.p.rapidapi.com",
                            "x-rapidapi-key": "05842c1cdamshaf40fed9693d799p1d8e31jsnd2bc896db111"
                        },
                        error: result => {
                            log(result);
                            ping();
                        }
                    }).done(function (response) {
                        log(response);

                        let data = response.leaderboard;
                        let slp = response.slp;

                        let win = 0;
                        let lose = 0;
                        let draw = 0;
                        let winRate = 0;

                        // GET BATTLE LOGS
                        $.ajax({
                            "async": true,
                            "crossDomain": true,
                            "url": "https://axie-infinity.p.rapidapi.com/get-battle-log/0xc6aaba4d4ede6c5cbc1bb9fd863701726ed63d2e",
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-host": "axie-infinity.p.rapidapi.com",
                                "x-rapidapi-key": "05842c1cdamshaf40fed9693d799p1d8e31jsnd2bc896db111"
                            },
                            error: result => {
                                log(result);
                                ping();
                            }
                        }).done(function (response) {
                            console.log(response);
                            temp = [];

                            response[0].items.forEach(a => {
                                let from = "";
                                let to = "";

                                if(moment().tz("Asia/Manila").format("HH:mm:ss") <= "08:00:00"){
                                    from = moment().tz("Asia/Manila").subtract(1, 'day').format("YYYY-MM-DD 08:00:00");
                                    to = moment().tz("Asia/Manila").format("YYYY-MM-DD 08:00:00");
                                }
                                else{
                                    from = moment().tz("Asia/Manila").format("YYYY-MM-DD 08:00:00");
                                    to = moment().tz("Asia/Manila").add(1, 'day').format("YYYY-MM-DD 08:00:00")
                                }

                                let date = moment(a.created_at).tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss");

                                if(date < from){
                                    return true;
                                }

                                console.log(a);

                                temp[0] = a.first_client_id;
                                temp[1] = a.second_client_id;

                                temp[a.winner] == id ? win++ : a.winner == 2 ? draw++ : lose++;
                            });

                            winRate = ((win / (win + draw + lose)) * 100).toFixed(2);

                            const exampleEmbed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('Report')
                                .setAuthor(msg.author.username, msg.author.avatarURL())
                                .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                                .addFields(
                                    { name: ':crossed_swords: MMR', value: data.elo, inline: true },
                                    { name: ':trophy: Rank', value: data.rank, inline: true },
                                    { name: ':dna: Win Rate', value: winRate + "%", inline: true },
                                )
                                .addFields(
                                    { name: ':dagger: Win', value: win, inline: true },
                                    { name: ':shield: Draw', value: draw, inline: true },
                                    { name: ':broken_heart: Lose', value: lose, inline: true },
                                )
                                .addFields(
                                    { name: 'Today SLP', value: slp.todaySoFar + ' <:slp:902414759780057098>', inline: true },
                                    { name: 'Average', value: slp.average + ' <:slp:902414759780057098>', inline: true },
                                    { name: 'Total SLP', value: slp.total + ' <:slp:902414759780057098>', inline: true },
                                )
                                .setTimestamp();

                            client.channels.cache.get(msg.channel.id).send(exampleEmbed);
                        });
                    });
                }
                else{
                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                        .addFields(
                            {
                                name: "**Warning**",
                                value: `<@!${msg.author.id}>, You are not registered yet.
                                **Note:** Use the "!save *wallet_address*"" command`
                            }
                        )
                        .setTimestamp();

                    client.channels.cache.get(msg.channel.id).send(exampleEmbed);
                    return;
                }
            },
            error: result => {
                log(result);
                ping();
            }
        });
    }

    // MMR COMMAND
    if(msg.content.startsWith("!mmr ")){
        console.log(roles);
        if(!(roles.includes("Moderator") || roles.includes("Technician"))){
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                .addFields(
                    {
                        name: "**Caution**",
                        value: `<@!${msg.author.id}>, you are not authorized to use this function`
                    }
                )
                .setTimestamp();

            client.channels.cache.get(msg.channel.id).send(exampleEmbed);
            return;
        }

        let content = msg.content.split(' ')[1];
        let role = content == "jjv" ? "Scholar" : null;

        msg.reply(`Loading ${role ? role : 'all'} Rankings...`);
        let scholars = [];

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',     
            data: {
                func: "lists",
            },
            success: users => {
                users.forEach((user, index) => {
                    let ronin = user.ronin;

                    if(role == "Scholar" && user.role != "Scholar"){
                        return;
                    }
                    else{
                        $.ajax({
                            async: true,
                            crossDomain: true,
                            url: `https://axie-infinity.p.rapidapi.com/get-update/0x${ronin}?id=0x${ronin}`,
                            method: "GET",
                            headers: {
                                "x-rapidapi-host": "axie-infinity.p.rapidapi.com",
                                "x-rapidapi-key": "05842c1cdamshaf40fed9693d799p1d8e31jsnd2bc896db111"
                            },
                            error: result => {
                                log(result);
                                ping();
                            }
                        }).done(function (response) {
                            console.log(response);
                            let mmr = response.leaderboard.elo;
                            let name = response.leaderboard.name;

                            scholars.push({name: `<@!${user.did}>`, mmr: mmr});
                        });
                    }
                });

                setTimeout(() => {
                    scholars.sort((a, b) => a.mmr < b.mmr && 1 || -1);

                    let message = "\n";
                    scholars.forEach((scholar, index) =>{
                    message += `${index + 1}.) ${scholar.name} - ${scholar.mmr}`

                    if(index == 0){
                    message += "🥇";
                    }
                    else if(index == 1){
                    message += "🥈";
                    }
                    else if(index == 2){
                    message += "🥉";
                    }

                    message += "\n";
                    });

                    message = message == "\n" ? "No Wallet Address Saved" : message;
                    // msg.reply(message);

                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                        .addFields({ 
                            name: 'Rankings', 
                            value: message 
                        })
                    .setTimestamp();

                    client.channels.cache.get(msg.channel.id).send(exampleEmbed);
                }, 5000);
            },
            error: result => {
                log(result);
                ping();
            }
        });
    }

    // CHANGE ROLE
    if(msg.content.startsWith("!cr ")){
        if(!(roles.includes("Moderator") || roles.includes("Technician"))){
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                .addFields(
                    {
                        name: "**Caution**",
                        value: `<@!${msg.author.id}>, you are not authorized to use this function`
                    }
                )
                .setTimestamp();

            client.channels.cache.get(msg.channel.id).send(exampleEmbed);
            return;
        }

        let username = msg.content.split(" ")[1];
        let role = msg.content.split(" ")[2]

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',
            data: {
                func: "cr",
                username: username,
                role: role
            },
            success: result => {
                msg.reply(`Changed role of ${username} to ${role}`);
                console.log(`Changed role of ${username} to ${role}`);
            },
            error: result => {
                log(result);
                ping();
            }
        });
    }

    // CHANGE USERNAME
    if(msg.content.startsWith("!cu ")){
        if(!(roles.includes("Moderator") || roles.includes("Technician"))){
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                .addFields(
                    {
                        name: "**Caution**",
                        value: `<@!${msg.author.id}>, you are not authorized to use this function`
                    }
                )
                .setTimestamp();

            client.channels.cache.get(msg.channel.id).send(exampleEmbed);
            return;
        }

        let username = msg.content.split(" ")[1];

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',
            data: {
                func: "cu",
                did: msg.author.id,
                username: username
            },
            success: result => {
                msg.reply(`You've changed your username to "${username}"`);
                console.log(`You've changed your username to "${username}"`);
            },
            error: result => {
                log(result);
                ping();
            }
        });
    }

    // HELP
    if(msg.content.startsWith("!help")){
        if(roles.includes("Moderator") || roles.includes("Technician")){
            message = `
                **!save *wallet_address***   - Tracks a specified wallet address.
                **!cu *new_username***      - Changes display username
                **!del *username***              - Deletes a specified wallet address
                **!report**                            - Shows a detailed report
                **!mmr all**                         - Show scholar rankings
                **!debug**                            - For debugging
                **!myaxies**                        - List all your axies
                **!cr *username* *role***        - Changes role of specied username
                **!list**                                 - List all user and their wallet address
                **!help**                               - List available bot commands.
            `;
        }
        else{
            message = `
                !save *wallet_address*   - Tracks a specified wallet address.
                !report                            - Shows a detailed report.
                !myaxies                        - List all your axies.
                !help                               - List available bot commands.
            `;
        }

        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
            .addFields(
                { 
                    name: 'Bot Commands:', 
                    value: message },
                )
                .setTimestamp();

        client.channels.cache.get(msg.channel.id).send(exampleEmbed);
    }

    // MY AXIES
    if(msg.content.startsWith("!myaxies")){
        let did = msg.author.id;

        $.ajax({
            url: "https://jjvaxie.com",
            type: 'get',
            data: {
                func: "get",
                did: did,
            },
            success: result => {
                if(result){
                    $.ajax({
                        "async": true,
                        "crossDomain": true,
                        "url": `https://axie-infinity.p.rapidapi.com/get-axies/0x${result.ronin}`,
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-host": "axie-infinity.p.rapidapi.com",
                            "x-rapidapi-key": "05842c1cdamshaf40fed9693d799p1d8e31jsnd2bc896db111"
                        },
                        success: result => {
                            console.log(result);
                            let axies = result.data.axies.results;

                            axies.forEach(axie => {
                                let exampleEmbed = new Discord.MessageEmbed()
                                .setTitle(axie.name)
                                .setThumbnail(axie.image);
                                msg.channel.send(exampleEmbed);
                            });
                        },
                        error: result => {
                            log(result);
                            ping();
                        }
                    });
                }
                else{
                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setThumbnail('https://i.ibb.co/cC23GYX/JJV-FINAL-FINAl.gif')
                        .addFields(
                            {
                                name: "**Warning**",
                                value: `<@!${msg.author.id}>, You are not registered yet.
                                **Note:** Use the "!save *wallet_address*"" command`
                            }
                        )
                        .setTimestamp();

                    client.channels.cache.get(msg.channel.id).send(exampleEmbed);
                    return;
                }
            },
            error: result => {
                log(result);
                ping();
            }
        });
    }

    // LOG
    function log(data){
        
        console.log("----------------------------------");
        console.log(moment().format("YYYY-MM-DD hh:m:s"));
        console.log(data);
    }
    
    function ping(){
        msg.reply(`
            There was an error processing that request.
            Pinging <@!547051551777357835>!
        `);
    }
});

var la = "x2q8a53Gzr7Ft2p0rZt_nW6gc48";

client.login(`${ai}.${wy}.${la}`);