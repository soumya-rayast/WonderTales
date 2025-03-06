const express = require("express");
const {
    addStory,
    getAllStory,
    uploadImage,
    deleteImage,
    editStory,
    deleteStory,
    isFavourite,
    searchStory,
    filterStory
} = require("../controllers/wondertales.controller");

const upload = require("../multer.js");
const authenticationToken = require("../middleware/authentication.js");

const router = express.Router();

// Add a new story
router.post("/add", authenticationToken, addStory);

// Get all stories of a user
router.get("/get-all-stories", authenticationToken, getAllStory);

// Edit an existing story
router.put("/edit-story/:id", authenticationToken, editStory);

// Delete a story
router.delete("/delete-story/:id", authenticationToken, deleteStory);

// Upload an image (added authentication protection)
router.post("/image-upload", authenticationToken, upload.single("image"), uploadImage);

// Delete an uploaded image
router.delete("/delete-image", authenticationToken, deleteImage);

// Update is Favourite
router.put("/update-is-favourite/:id", authenticationToken, isFavourite);

// search story 
router.get("/search", searchStory);

// filter by date 
router.get('/filter',authenticationToken, filterStory);

module.exports = router; 