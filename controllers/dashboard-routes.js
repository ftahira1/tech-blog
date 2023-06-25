const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');
const auth = require('../utils/auth');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const dbPostData = await Post.findAll({
            where: { user_id: req.session.user_id },
            attributes: ['id', 'title', 'post_content', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes:['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
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

        const postData = dbPostData.map((post => post.get({plain: true})));

        res.render('dashboard', { postData, loggedIn: true});
    
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const dbPostData = await Post.findOne({
            where: { id: req.params.id },
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
            res.status(404).json({message: 'No post found with this id.'});
            return;
        }

        const postData = dbPostData.get({plain: true});
        
        res.render('edit-post', {
            postData,
            loggedIn: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/create/', withAuth, async (req,res) => {
    try {
        const dbPostData = await Post.findAll({
            where: { user_id: req.session.user_id},
            attributes: ['id', 'title', 'post_content', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
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

        const postdata = dbPostData.map(post => post.get({plain: true}));

        res.render('create-post', {
            postdata,
            loggedIn: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;



