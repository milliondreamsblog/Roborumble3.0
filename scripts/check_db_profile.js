const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function checkProfile() {
    const MONGODB_URI = "mongodb+srv://admin:1234567890@cluster0.zfd80.mongodb.net/robo_rumble?retryWrites=true&w=majority";

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const clerkId = "user_39QlVGiMPYTGjCUWBRn8pUIHcrT"; // From the user's terminal output 403 error log or assumed from context
    // Actually let's just list the last few updated profiles
    
    const Profile = mongoose.models.Profile || mongoose.model("Profile", new mongoose.Schema({}, { strict: false }), "profiles");
    
    const profiles = await Profile.find({ $or: [{ username: "chath" }, { email: "chathparewa2025@gmail.com" }] });
    
    console.log(`Found ${profiles.length} potential profiles`);
    
    profiles.forEach((p, i) => {
        console.log(`--- Profile ${i + 1} ---`);
        const pObj = p.toObject();
        Object.keys(pObj).forEach(key => {
            console.log(`${key}: ${JSON.stringify(pObj[key])}`);
        });
    });

    await mongoose.connection.close();
}

checkProfile().catch(console.error);
