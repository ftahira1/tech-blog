const router = require('express').Router();

const { User, Post, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.findAll({
            attributes: {exclude:['password']}, 
        })
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            attributes: {exclude:['password']},
            where: {id: req.params.id},
            include: [
                {
                    model: Post,
                    attributes: ['id', 'model', 'issue', 'created_on']
                },
                {
                    model: Image,
                    attributes: ['id', 'title', 'img'],
                    include: {
                        model: Post,
                        attributes: ['place']
                    }
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_on'],
                    include: {
                        model: Post,
                        attributes: ['place']
                    }
                }
            ]
        });
        if(!dbUserData) {
            res.status(404).json({message: 'No user found with this ID.'});
            return;
        }
    } catch(err) {
        res.status(500).json(err);
    }
}
);

router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.username = dbUserData.username;
            req.session.user_id = dbUserData.id;
            res.status(200).json(dbUserData);
        })
    } catch(err) {
        res.status(500).json(err);
    }
}
);

router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if(!dbUserData) {
            res.status(404).json({message: 'Username is not correct.'});
            return;
        }

        const validPassword = await dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(404).json({message: 'Password is not correct.'});
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.username = dbUserData.username;
            req.session.user_id = dbUserData.id;
            res.status(200).json({message: 'You are logged in.'});
        }) 
    } catch(err) {
        res.status(500).json(err);
        console.log(err);
    }
});

router.post('/logout', async(req, res) => {
    try {
        if(req.session.loggedIn) {
            const dbUserData = await req.session.destroy(() => {
                res.status(204).end();
            })
        } else{
            res.status(404).end();
        }
    } catch {
        res.status(400).end();
    }
});


module.exports = router;
