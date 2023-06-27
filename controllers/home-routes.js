const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');

router.get('/', async (req, res) => {
    try {
        const dbPostData = await Post.findAll({
            attributes: ['id', 'title', 'post_content', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: [
                        {
                            model: User,
                            attributes: ['username']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });
        
        const postData = dbPostData.map((post) => post.get({plain: true}));

        res.render('homepage', 
        {
            postData,
            loggedIn: req.session.loggedIn,
            username: req.session.username,
        }
        );
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
    }

    res.render('signup');
});

router.get('/post/:id', async (req, res) => {
    try {
        const dbPostData = await Post.findOne({
            where: { id: req.params.id},
            attributes: ['id', 'title', 'post_content', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: [
                        {
                            model: User,
                            attributes: ['username']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if(!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }

        const postData = dbPostData.get({plain: true});

        res.render('one-post', {
            postData,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;