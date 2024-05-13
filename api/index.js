const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./models/User')
const Post = require('./models/Post')
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const pathModule = require('path');


var salt = bcrypt.genSaltSync(10);

var secret = 'asdadjas4e3w4e4usjfnsd544u3i53mdsfsdf';


app.use(express.json());
app.use(cors({credentials:true , origin:'http://localhost:3000'}));
app.use(cookieParser());
app.use('/uploads' , express.static(__dirname + '/uploads'));


mongoose.connect('mongodb+srv://soloveichikbar:64hRRwImWMfzMRb0@cluster0.oxrhlea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register' , async (req ,res) => {
    const {username , password} = req.body;
    try {
        const userDoc = await User.create({
            username, 
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e){
        res.status(400).json(e);
    }
    
});

app.post('/login' , async (req , res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(404).json({ message: "User not found" });
        }
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            return res.status(401).json({ message: "Wrong credentials" });
        }
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Error generating token" });
            }
            res.cookie('token', token, { httpOnly: true }).json({
                id: userDoc._id,
                username,
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });
  
  app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
  });


app.post('/logout' , (req,res) => {
    res.cookie('token' , '').json('ok');
})

app.post('/post' ,uploadMiddleware.single('file') , async (req,res) => {
    const {originalname , path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path , newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title,summary,content,option,time,distance} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            option,
            time,
            distance,
            author: info.id,
        });
            res.json('postDoc');
      });
});


app.get('/post' , async (req,res) => {
    res.json(
        await Post.find()
        .populate('author' , ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});


app.get('/post/:id' , async (req,res) => {
    const {id} =req.params;
    const postDoc = await Post.findById(id).populate('author' , ['username']);
    res.json(postDoc);
})


app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
        const {originalname , path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path , newPath);
    }
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id,title,summary,option,content,time,distance} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor){
            return res.status(400).json('you are not the author of this post');
        }

        await postDoc.updateOne({title,summary,content , option,time , distance,cover:newPath ? newPath : postDoc.cover});

            res.json('postDoc');
      });

});

app.delete('/post/:id', async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.params;

    try {
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            const postDoc = await Post.findById(id);
            if (!postDoc) {
                return res.status(404).json({ message: "Post not found" });
            }

            // Check if the logged-in user is the author of the post
            if (postDoc.author.toString() !== decoded.id) {
                return res.status(401).json({ message: "You are not authorized to delete this post" });
            }

            // Delete the post if the user is authorized
            await Post.findByIdAndDelete(id); // Using findByIdAndDelete instead of findByIdAndRemove
            res.json({ message: "Post deleted successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



app.listen(4000);
//mongodb+srv://soloveichikbar:64hRRwImWMfzMRb0@cluster0.oxrhlea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//64hRRwImWMfzMRb0