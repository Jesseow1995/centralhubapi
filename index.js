const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const port = process.env.PORT || 3001;
var blogData = JSON.parse(fs.readFileSync('blog-data.json'));

app.use(cors());
app.use(express.json());

app.get('/blog-data', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(blogData))
})

app.get('/blog-data/:username', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(blogData[req.params.username].blogs))
})

app.put('/blog-data', function (req, res) {
    if (req.body.username && req.body.password && !blogData[req.body.username]) {

        blogData[req.body.username] = { password: req.body.password, blogs: [] }
        fs.writeFileSync('blog-data.json', JSON.stringify(blogData))
        res.setHeader('Content-Type', 'application/json')
        res.send({})
    } else return res.status(400).send('mission either username or password for new user')

});

app.post('/blog-data/:username', function (req, res) {
    if (blogData[req.params.username] && req.body && blogData[req.params.username].password === req.body.password) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(blogData[req.params.username].blogs));
    } else return res.status(401).send('password does not match or username does not exist')
});

app.patch('/blog-data/:username', function (req, res) {
    if (!req.body) {
        res.send(JSON.stringify(blogData));
        return;
    }

    if (blogData[req.params.username].blogs.length < 1) {
        var blogId = 0
    } else {
        var blogId = (blogData[req.params.username].blogs[blogData[req.params.username].blogs.length - 1].id + 1)
    }
    blogData[req.params.username].blogs.push({ ...req.body, id: blogId });
    fs.writeFileSync('blog-data.json', JSON.stringify(blogData));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(blogData));
});

app.delete(`/blog-data/:username/:blogId`, function (req, res) {
    const blogId = req.params.blogId;
    blogData[req.params.username].blogs = blogData[req.params.username].blogs.filter(blog => blog.id != blogId)
    fs.writeFileSync('blog-data.json', JSON.stringify(blogData));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(blogData[req.params.username].blogs))
})

app.listen(port, () => console.log('server started on port', port));

//console.log("server started");