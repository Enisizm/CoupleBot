const { Discord, MessageEmbed } = require("discord.js");
const qdb = require("quick.db")
const cdb = new qdb.table("COUPLE");
const Ayarlar = global.Ayarlar;
const code = require("@codedipper/random-code")
const kod = code(6, ["0","1","2","3","4","5","6"])

exports.run = async (client, message, args, ayar) => {
    let prefix = Ayarlar.Prefix;

    if (args[0] == "teklif") {
        let sender = message.author;
        let receiver = message.mentions.members.first();
        let check = await cdb.get(`marry.${message.author.id}.evlilik`);
        let check2 = await cdb.get(`marry.${message.author.id}.kod`) || [];
        if (check) return message.channel.send(`Zaten bir evliliğin var! Aldatmaya mı çalışıyorsun dostum?\nEvliliği kontrol etmek için : \`!!marryinfo\``);
        if (check2.Sender == message.author.id) { 
            message.channel.send(`Zaten Cevabını Beklediğin Bir Teklifin Bulunmakta!`);
            return;
        };

        if (args[1] == "evet") {
            let ekod = await cdb.get(`marry.${message.author.id}.kod`);
            if (!ekod) return message.channel.send(`Böyle bir evlilik teklifi bulunamadı!`)
            if (args[2] !== ekod.Ekod) return message.channel.send(`Evlilik kodu yanlış bulunamadı!`);
            if (message.author.id == ekod.Sender) return message.channel.send(`Kendi Teklifine Cevap Veremezsin!`);
            if (message.author.id !== ekod.Receiver) return message.channel.send(`Başkasının Teklifine Karışamazsın!`);

            message.channel.send(`Evlilik işlemi başarıyla kabul edildi! ${message.author}\nArtık evlisiniz <@!${ekod.Sender}> & <@!${ekod.Receiver}> Mutlu bir evlilik hayatı dilerim!`);
            await cdb.set(`marry.${message.author.id}.evlilik`, {
                Person1: message.author.id,
                Person2: ekod.Sender,
                Dates: Date.now()
            });
            await cdb.set(`marry.${ekod.Sender}.evlilik`, {
                Person1: message.author.id,
                Person2: ekod.Sender,
                Dates: Date.now()
            });
            await cdb.delete(`marry.${message.author.id}.kod`)
            return;
        };

        if (args[1] == "hayır") {
            let ekod = await cdb.get(`marry.${message.author.id}.kod`);
            if (!ekod) return message.channel.send(`Böyle bir evlilik teklifi bulunamadı!`)
            if (args[2] !== ekod.Ekod) return message.channel.send(`Evlilik kodu yanlış bulunamadı!`);
            if (message.author.id == ekod.Sender) return message.channel.send(`Kendi Teklifine Cevap Veremezsin!`);
            if (message.author.id !== ekod.Receiver) return message.channel.send(`Başkasının Teklifine Karışamazsın!`);

            message.channel.send(`Evlilik teklifi başarıyla reddedildi! ${message.author}\nGördüğün gibi evlilik hayallerin suya düştü <@!${ekod.Sender}>`)
            await cdb.delete(`marry.${ekod.Receiver}.kod`);
            await cdb.delete(`marry.${ekod.Sender}.kod`);
            return;
        };

        if (!receiver) return message.channel.send(`${sender} evlilik teklifi için birisini etiketlemelisiniz!`);

        message.channel.send(`${sender} Size **Evlilik Teklifi** Yaptı ${receiver} ! Cevabın ne olacak?\n \`!!marry teklif evet ${kod}\` ya da \`!!marry teklif hayır ${kod}\``)
        await cdb.set(`marry.${receiver.id}.kod`, {
            Sender : sender.id,
            Receiver: receiver.id,
            Ekod: kod
        });
        await cdb.set(`marry.${message.author.id}.kod`, {
            Sender: sender.id,
            Receiver: receiver.id,
            Ekod: kod
        });
        return;
    };

    let marry = await cdb.get(`marry.${message.author.id}.evlilik`);
    if (!marry) { 
        message.channel.send(`Birisine Evlilik Teklifi Yapmak İstiyorsan Tek Yapman Gereken :\n${prefix}marry teklif @evleneceğin kişi`);
        return;
    } else {
        message.channel.send(`Zaten Bir Evliliğin Var! \nDaha Fazla Bilgi İçin ${prefix}marryinfo \nBoşanmak için ${prefix}divorce`)
    }
}

exports.conf = {
    name: "couple",
    aliases: ["marry"],
    enabled: true,
    guildOnly: true
};

exports.help = { 
    name: 'couple', 
    description: 'Evlendirme Dairesine Hoş Geldiniz!',
    usage: 'couple',
    kategori: 'kullanıcı'
};
