const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const port = process.env.PORT || 3001;

app.get('blog-data.json', (req, res) => {
    res.status(200).json({ api: 'version 1' })
})


var blogData = JSON.parse(fs.readFileSync('blog-data.json'));

app.use(cors());
app.use(express.json());

app.get('/blog-data', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(blogData));
});

app.post('/blog-data', function (req, res) {
    if (!req.body) {
        res.send(JSON.stringify(blogData));
        return;
    }
    blogData.blogs.push({ ...req.body, id: (blogData.blogs[blogData.blogs.length - 1].id + 1) });
    fs.writeFileSync('blog-data.json', JSON.stringify(blogData));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(blogData));
});

app.delete(`/blog-data/:blogId`, function (req, res) {
    const blogId = req.params.blogId;
    blogData.blogs = blogData.blogs.filter(blog => blog.id != blogId)
    fs.writeFileSync('blog-data.json', JSON.stringify(blogData));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(blogData))
})

app.listen(port, () => console.log('server started on port', port));

//console.log("server started");