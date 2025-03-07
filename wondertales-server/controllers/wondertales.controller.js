const WonderTales = require('../models/wondertales.model.js')
const path = require("path");
const fs = require("fs");
// Function for add story 
const addStory = async (req, res) => {
    console.log("Request Body:", req.body); 
    const { title, story, visitedLocation, imageUrl, visitedDate} = req.body;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        const formattedVisitedLocation = Array.isArray(visitedLocation) ? visitedLocation.join(", ") : visitedLocation;

        const parsedVisitedDate = new Date(parseInt(visitedDate));

        const wonderStory = new WonderTales({
            title,
            story,
            visitedLocation: formattedVisitedLocation, 
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
            createdOn: new Date(), 
            isFavourites: false, 
        });

        await wonderStory.save();
        res.status(201).json({ story: wonderStory, message: "Added Successfully" });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};
// get all story function 
const getAllStory = async (req, res) => {
    const { userId } = req.query;

    try {
        const travelStories = await WonderTales.find({ userId: userId }).sort({
            isFavourites: -1,
        });
        res.status(200).json({ stories: travelStories });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}
// function for image upload
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No Image uploaded" })
        }
        const uploadDir = path.resolve(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.status(201).json({ imageUrl });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
}
// Function for delete image
const deleteImage = async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "imageUrl parameter is required" });
    }

    try {
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, 'uploads', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: true, message: "Image not found" });
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};
// function for edit story 
const editStory = async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    try {
        const travelStory = await WonderTales.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }
        const placeHolderImageUrl = `http://localhost:5000/assets/placeholder-image.jpg`;
        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl && imageUrl.trim() !== "" ? imageUrl : placeHolderImageUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Update Successfully" })
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}
// function for delete story 
const deleteStory = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    try {
        const travelStory = await WonderTales.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel Story not found" });
        }
        await travelStory.deleteOne({ __id: id, userId});

        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);

        const filePath = path.join(__dirname, "../uploads", filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Failed to delete image files");
            }
        })
        res.status(200).json({ message: "Travel story deleted successfully " });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}
// function for favourite
const isFavourite = async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        const travelStory = await WonderTales.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        travelStory.isFavourite = isFavourite;
        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Update successful" })
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}
// function for search story
const searchStory = async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(404).json({ error: true, message: "Query is required" });
    }

    try {
        const searchResults = await WonderTales.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
            ]
        }).sort({ isFavourite: -1 });
        res.status(200).json({ stories: searchResults });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}
// function for filter story by data
const filterStory = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ error: true, message: "Both startDate and endDate are required" });
    }
    const { userId } = req.user;

    try {
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const filteredStories = await WonderTales.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end },
        }).sort({ isFavourite: - 1 });
        
        res.status(200).json({ stories: filteredStories });

    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}
 
module.exports = {
    addStory,
    getAllStory,
    uploadImage,
    filterStory,
    isFavourite,
    searchStory,
    deleteImage,
    deleteStory,
    editStory
}; 