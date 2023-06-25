const router = require('express').Router();

const { User } = require('../../models');

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
                model: 'Post',
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                model: 'Comment',
                attributes: ['id']
            },
        ]        
        })
    }
})