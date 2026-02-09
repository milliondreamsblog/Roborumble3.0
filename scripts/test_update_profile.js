const mongoose = require("mongoose");
const path = require("path");

async function updateProfile() {
    const MONGODB_URI = "mongodb+srv://admin:1234567890@cluster0.zfd80.mongodb.net/robo_rumble?retryWrites=true&w=majority";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Profile = mongoose.models.Profile || mongoose.model("Profile", new mongoose.Schema({
        clerkId: String,
        city: String,
        state: String,
        degree: String,
        branch: String,
        yearOfStudy: Number
    }, { strict: false }), "profiles");
    
    const update = {
        city: "Test City",
        state: "Test State",
        degree: "B.Tech",
        branch: "CSE",
        yearOfStudy: 3
    };

    const result = await Profile.findOneAndUpdate(
        { username: "chath" },
        { $set: update },
        { new: true }
    );
    
    if (result) {
        console.log("Update successful. Current profile state:");
        const pObj = result.toObject();
        Object.keys(pObj).forEach(key => {
            console.log(`${key}: ${JSON.stringify(pObj[key])}`);
        });
    } else {
        console.log("Profile not found");
    }

    await mongoose.connection.close();
}

updateProfile().catch(console.error);
