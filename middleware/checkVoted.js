const Vote = require('../models/voteModel');

const checkVoted = async (req, res, next) => {
    try {
        const userId = req.user._id; 
        const existingVote = await Vote.findOne({ user: userId });
        if(req.originalUrl == "/vote"  || req.originalUrl == "/vote/"  || req.originalUrl == "/vote//"){
            if (existingVote) {
                return res.redirect('/vote/voted');
            }
            next();
        }else{
            if (!existingVote) {
                return res.redirect('/vote');
            }
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = checkVoted;
