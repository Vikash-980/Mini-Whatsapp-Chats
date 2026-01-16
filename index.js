const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

// 1. Port setup (Render ke liye zaroori hai)
const port = process.env.PORT || 8080;

// 2. Database Connection URL
// Agar Atlas ka link hai toh yahan paste karein, nahi toh local chalega
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/whatsapp";

// Views setup (Spelling theek kar di hai)
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => console.log("DB Connection Error:", err));

async function main() {
    await mongoose.connect(dbUrl);
}

// Index Route
app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        res.render("index.ejs", { chats });
    } catch (err) {
        res.status(500).send("Database error occurred");
    }
});

// New Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

// Create Route
app.post("/chats", async (req, res) => {
    try {
        let { from, to, msg } = req.body;
        let newChat = new Chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date(),
        });
        await newChat.save();
        res.redirect("/chats");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving chat");
    }
});

// Edit Route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});

// Update Route
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    await Chat.findByIdAndUpdate(
        id,
        { msg: newMsg },
        { runValidators: true, new: true }
    );
    res.redirect("/chats");
});

// Delete Route
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
});

app.get("/", (req, res) => {
    res.send("Root is working");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

