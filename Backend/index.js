const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv")

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const url = process.env.URL ;
mongoose.connect(url, {})
        .then(()=>console.log("Connected to MongoDB"))
        .catch((err)=>console.log("Failed to Connect ",err));

app.use(cors());
// Post Model
const Post = mongoose.model('Post', {
    title: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { type: Date }
});

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.post('/posts', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/posts/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id, {
            title: req.body.title,
            content: req.body.content,
            updatedAt: Date.now()
        }, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});