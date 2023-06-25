const router = require('express').Router();

const { User, Post, Comment } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.findAll({
            attributes: { exlude: ['password']},
        });
        res.status(200).json(dbUserData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            attributes: {exlude: ['password']},
            where: { id: req.params.id},
            include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                },
            },
        ]        
        });
        if(!dbUserData) {
            res.status(404).json({ message: 'No user with this id found!'});
            return;
        }
        res.status(200).json(dbUserData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            password: req.body.password
        });
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            
            res.status.json(dbUserData);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findone({
            where: {
                username: req.body.username,
            }
        });
        if(!dbUserData) {
            res.status(400).json({message: 'Incorrect username or password.'});
            return;
        }

        const validPassword = await dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({message: 'Incorrect email or password.'});
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.logged = true;

            res.status(200).json({message: 'You are now logged in.'});

        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', async (req, res) => {
    try{
        if(req.session.loggedIn) {
            const dbUserData = await req.session.destroy(() => {
                res.status(204).end();
            });
        } else {
            res.status(404).end();
        }
    } catch {
        res.status(400).end();
    }
});

module.exports = router;
