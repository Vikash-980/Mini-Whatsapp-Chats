const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let allchats = [
    {
        from: "kaju",
        to: "viku",
        msg: "ttttt",
        created_at: new Date(),
    },
    {
        from: "kaju1",
        to: "viku1",
        msg: "ttttt1",
        created_at: new Date(),
    },
    {
        from: "kaju2",
        to: "viku2",
        msg: "tttt2t",
        created_at: new Date(),
    },

];

Chat.insertMany(allchats);

