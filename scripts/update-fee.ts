import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const EventSchema = new mongoose.Schema({
    eventId: { type: String, unique: true, required: true },
    fees: { type: Number, required: true, default: 0 },
}, { strict: false });

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

async function updateFee() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error("❌ MONGODB_URI not found in environment variables");
        process.exit(1);
    }

    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB");

        console.log("📝 Updating event fee...");
        const result = await Event.updateOne(
            { eventId: "robo-obstacle-race" },
            { $set: { fees: 400 } }
        );

        if (result.matchedCount > 0) {
            console.log(`✅ Successfully updated Robo Obstacle Race fee to 400`);
            console.log(`  Modified count: ${result.modifiedCount}`);
        } else {
            console.log(`❌ Event "robo-obstacle-race" not found in the database.`)
        }

    } catch (error) {
        console.error("❌ Update failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

updateFee();
