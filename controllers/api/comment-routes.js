const router = require('express').Router();
const {Comment} = require('../../models');
const withAuth = require('../../utils/auth');;


router.get('/', async (req, res) => {
    try {
        const dbCommentData = await Comment.findAll({});

        if(!dbCommentData.length === 0) {
            res.status(404).json({message: 'There are no comments'});
            return;
        }

        res.status(200).json(dbCommentData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/', withAuth, async (req, res) => {
    try {
        const dbCommentData = await Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,
        });

        res.status(200).json(dbCommentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const dbCommentData = await Comment.destroy({
            where: {
                id: req.params.id
            }
        });

        if(!dbCommentData) {
            res.status(404).json({message: 'No comment found with this id.'});
            return;
        }

        res.status(200).json(dbCommentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;