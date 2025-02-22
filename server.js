const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 6000;



// ✅ FIX: Ensure static files are properly served
app.use(express.static(path.join(__dirname, "public"))); 

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Read posts from JSON file
const getPosts = () => {
    const data = fs.readFileSync("posts.json", "utf8");
    return JSON.parse(data);
};

// Routes (no changes needed here)
app.get("/", (req, res) => {
    const posts = getPosts();
    res.render("posts", { posts });
});

app.get("/post", (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (post) {
        res.render("post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

app.get("/add-post", (req, res) => {
    res.render("add-post");
});

app.post("/add-post", (req, res) => {
    const posts = getPosts();
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));
    res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
