const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const port = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded(
    {extended: true}
));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err)
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully stored")
            } else {
                res.send(err)
            }
        })
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send('deleted all shit!!')
            } else {
                res.send(err)
            }
        })
    });

app.route('/articles/:articleTitle')
    .get(function (req, res) {
        Article.findOne({title: req.params.articleTitle}, function (err, foundArticle) {
            if (!err) {
                res.send(foundArticle)
            } else {
                res.send('Not Found')
            }
        })
    })
    .put(function (req, res) {
        Article.updateOne({title: req.params.articleTitle}, {
            title: req.body.title,
            content: req.body.content
        }, {overwrite: true}, function (err) {
            if (!err) {
                res.send('Updated successfully')
            } else {
                res.send('Update unsuccessful');
            }
        })
    })
    .patch(function (req, res) {
        Article.updateOne(
            {title: req.params.articleTitle}, {$set: req.body}, function (err) {
                if (!err) {
                    res.send('Updated successfully');
                } else {
                    res.send('Update unsuccessful');
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne({title: req.params.articleTitle}, function (err) {
            if (!err) {
                res.send('Deleted successfully')
            } else {
                res.send('Delete Failed')
            }
        })
    });

app.listen(port, function () {
    console.log(`server listening on ${port}`);
})