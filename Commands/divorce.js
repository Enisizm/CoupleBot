const { Discord, MessageEmbed } = require("discord.js");
const qdb = require("quick.db")
const cdb = new qdb.table("COUPLE");
const Ayarlar = global.Ayarlar;
const code = require("@codedipper/random-code")
const kod = code(6, ["0","1","2","3","4","5","6"])

exports.run = async (client, message, args, ayar) => {
    let marry = await cdb.get(`marry.${message.author.id}.evlilik`);
    if (!marry) return message.channel.send(`${message.author} Evlenmeden Boşanamazsın Dostum!`);
    let user1 = marry.Person2 || "";
    let user2 = marry.Person1 || "";

    let mesaj = await message.channel.send(`Gerçekten boşanmak istiyor musun?\nİstiyorsan \`evet\`, İstemiyorsan \`hayır\` yazman yeterli. Düşünmek için 30 saniyen var!`);

        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000, errors: ["time"]})
        .then(divorce => {
        if (divorce.first().content == ("hayır" || "iptal")) {
            divorce.first().delete();
          mesaj.delete();
          return message.channel.send("İptal edildi.");
        };
        if (divorce.first().content == ("evet" || "onay")) {
            divorce.first().delete();
            mesaj.delete();
            cdb.delete(`marry.${user1}.evlilik`);
            cdb.delete(`marry.${user2}.evlilik`);
            return message.channel.send("İsteğin başarıyla onaylandı! Umarım ikiniz için de en iyisi olur.");
          };
          }).catch(err => console.log(err));
          return;
}

exports.conf = {
    name: "divorce",
    aliases: ["div"],
    enabled: true,
    guildOnly: true
};

exports.help = { 
    name: 'divorce', 
    description: 'Boşanmanızı Sağlar!',
    usage: 'divorce @member',
    kategori: 'kullanıcı'
};
