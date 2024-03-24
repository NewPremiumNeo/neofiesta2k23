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
    const votedMemberId = await voteModel.findOne({ "user": req.user._id })
    // const votedMemberId = await voteModel.findOne({ "user": req.user._id }).populate('votedMemberId')
    res.render('voted', { votedMemberId });
});



router.post('/', isLoggedIn, checkVoted, async (req, res) => {
    try {
        names = ['Aadil Latif', 'Aditya Pratap', 'Ajain Raj', 'Akash', 'Alok Jaiswal', 'Alok Mehta', 'Ashish Kumar 1', 'Ashish Kumar 2', 'Ayush Pandey', 'Gyan Prakash', 'Kartik Sahu', 'Monu Kumawat', 'Nikhil Anand', 'Pabitra Mondal', 'Pankaj Kumar', 'Pratap Yadav', 'Prateek pandey', 'Priyanshu Kumar', 'Ranjeet Chaudhary', 'Ravi Raj', 'Rishabh Shukla', 'Riya Kumari', 'Sandeep Prajapati', 'Satyam Kumar', 'Shiva Hansda', 'Shruti Gupta', 'Shristi Gupta', 'Sudip Tikader', 'Swatantra Sahu', 'Vishal Kumar']

        const votedMember = req.body.votedMember;
        const userId = req.user._id;
        const votedMemberDocument = await usersModel.findOne({ "username": votedMember });

        const name = names[parseInt(votedMember.slice(-2)) - 1];
        let vote = ""
        if (votedMemberDocument) {
            vote = new voteModel({
                user: userId,
                votedMember: votedMember,
                name: name,
                votedMemberId: votedMemberDocument._id
            });
        }else{
            vote = new voteModel({
                user: userId,
                votedMember: votedMember,
                name: name,
            });
        }

        await vote.save();

        console.log("Vote saved successfully");
        res.redirect('/vote/voted');
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;