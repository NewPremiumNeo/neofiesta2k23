const voteModel = require('../models/voteModel');
const { uploadOnCloudinary } = require('../middleware/cloudinary.js');
const photoModel = require('../models/photoModel.js');


exports.photoUploadPost = async (req, res) => {
    const { postTitle, postDescription, year } = req.body;
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    const uploadedPhotos = req.files.map(file => ({ imageUrl: file.path }));
    try {
        const savedPhotos = await Promise.all(
            uploadedPhotos.map(async photo => {
                const result = await uploadOnCloudinary(photo.imageUrl);
                if (result) {
                    const newPhoto = new photoModel({
                        postImageUrl: result.secure_url,
                        imageTitle: postTitle,
                        imageDescription: postDescription,
                        year: year,
                        ownerIds: req.user._id
                    });
                    // Save the new photo document to MongoDB
                    const savedPhoto = await newPhoto.save();
                    return savedPhoto.postImageUrl;

                } else {
                    return null;
                }
            })
        );
        const filteredPhotos = savedPhotos.filter(photo => photo !== null);

        res.json(filteredPhotos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


exports.calculateWinners = async () => {
    try {
        const voteCounts = await voteModel.aggregate([
            {
                $group: {
                    _id: "$votedMember",
                    name: { $first: "$name" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        if (voteCounts.length > 0) {
            const highestVoteCount = voteCounts[0].count;
            const winners = voteCounts.filter(vote => vote.count === highestVoteCount);
            return { voteCounts, winners };
        } else {
            return { message: "No votes recorded yet." };
        }
    } catch (error) {
        console.error(error);
        return { error: "Internal Server Error" };
    }
};
