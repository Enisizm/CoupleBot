const { Discord, MessageEmbed } = require("discord.js");
const qdb = require("quick.db")
const cdb = new qdb.table("COUPLE");
const Ayarlar = global.Ayarlar;
const code = require("@codedipper/random-code")
const kod = code(6, ["0","1","2","3","4","5","6"])

exports.run = async (client, message, args, ayar) => {
    let marry = await cdb.get(`marry.${message.author.id}.evlilik`);
    if (!marry) return message.channel.send(`Sana ait bir evlilik bulamadım! ${message.author}`);

    message.channel.send(`Merhaba, ${message.author} İşte Evlilik Belgen:\nÇift : <@!${marry.Person1}> & <@!${marry.Person2}>\nEvlilik Zamanı: ${new Date(marry.Dates).toTurkishFormatDate()}`)
}

exports.conf = {
    name: "coupleinfo",
    aliases: ["marryinfo"],
    enabled: true,
    guildOnly: true
};

exports.help = { 
    name: 'coupleinfo', 
    description: 'Evlilik Belgesini Gösterir!',
    usage: 'coupleinfo',
    kategori: 'kullanıcı'
};
