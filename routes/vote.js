const express = require('express');
const router = express.Router();
const checkVoted = require('../middleware/checkVoted');
const voteModel = require('../models/voteModel');
const { isLoggedIn } = require('../middleware/authMiddleware.js');
const usersModel = require('../models/usersModel.js');


router.get('/', isLoggedIn, checkVoted, async (req, res) => {
    res.render('vote');
});

router.get('/voted', isLoggedIn, checkVoted, async (req, res) => {
    const votedMemberId = await voteModel.findOne({ "user": req.user._id }).populate('votedMemberId')
    console.log(votedMemberId)
    res.render('voted', { votedMemberId });
});



router.post('/', isLoggedIn, checkVoted, async (req, res) => {
    try {
        const votedMember = req.body.votedMember;
        const userId = req.user._id;
        const votedMemberDocument = await usersModel.findOne({ "username": votedMember });

        if (!votedMemberDocument) {
            console.error("Voted member not found");
            return res.status(404).send("Voted member not found");
        }

        const vote = new voteModel({
            user: userId,
            votedMember: votedMember,
            votedMemberId: votedMemberDocument._id
        });
        await vote.save();

        console.log("Vote saved successfully");
        res.redirect('/vote/voted');
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
