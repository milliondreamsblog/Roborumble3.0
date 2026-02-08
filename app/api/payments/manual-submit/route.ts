import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Registration from "@/app/models/Registration";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { eventId, transactionId, screenshotUrl } = body;

        if (!eventId || !transactionId || !screenshotUrl) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        // Find the specific registration for this user/event that is currently pending/initiated
        // We need to look up the profile first to get the _id
        const Profile = (await import("@/app/models/Profile")).default;
        const profile = await Profile.findOne({ clerkId: userId });

        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 });
        }

        // Find the registration. 
        // Logic: It could be an individual registration OR a team registration where this user is the leader/member.
        // However, for simplicity and security, we should probably pass the 'registrationId' from frontend if possible, 
        // OR find the most recent 'initiated' or 'pending' registration for this event and user.

        // Let's rely on eventId and user profile.
        // We find a registration where:
        // 1. eventId matches
        // 2. paymentStatus is NOT 'paid'
        // 3. EITHER (teamId is in user's teams) OR (selectedMembers includes user)
        // 4. Ideally, we just check if this user is allowed to modify it.

        // Simplified approach: Find registration by eventId where user is involved
        // Note: For team events, typically the leader registers.

        // Let's search using the Team logic from before if needed, but the frontend context usually knows.
        // But here we only have userId. 
        
        // Let's search for a registration for this event that involves this user.
        const Team = (await import("@/app/models/Team")).default;
        const teams = await Team.find({ members: profile._id });
        const teamIds = teams.map((t: any) => t._id);

        // Look up the Event to get its ObjectId
        const Event = (await import("@/app/models/Event")).default;
        const event = await Event.findOne({ eventId: eventId });

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        const LinkId = event._id;

        const registration = await Registration.findOne({
            eventId: LinkId,
            $or: [
                { teamId: { $in: teamIds } },
                { selectedMembers: profile._id }
            ],
            paymentStatus: { $ne: 'paid' }
        }).sort({ createdAt: -1 });

        if (!registration) {
            return NextResponse.json({ message: "No pending registration found for this event" }, { status: 404 });
        }

        // Update the registration
        registration.paymentStatus = "manual_verified"; // OR "verification_pending" if we want an admin step. 
        // Plan said: "manual_verification_pending" or use "manual_verified" as the status in schema enum. 
        // Schema enum has "manual_verified". Let's use that but maybe we should interpret it as "pending verification".
        // Actually schema has: "initiated", "pending", "paid", "failed", "refunded", "manual_verified".
        // Let's set it to "manual_verified" (implying user claims they verified it / submitted it manually). 
        // Ideally we'd have a specific "verification_pending" status, but "manual_verified" acts as that flag for now based on previous discussions/schema. 
        // Wait, review schema: 
        // enum: ["initiated", "pending", "paid", "failed", "refunded", "manual_verified"]
        // Let's treat "manual_verified" as "User submitted manual payment, needs Admin check".
        
        registration.userTransactionId = transactionId;
        registration.screenshotUrl = screenshotUrl;
        
        // Also add to payment log
        registration.paymentAttempts.push({
            attemptedAt: new Date(),
            razorpayOrderId: "MANUAL_" + transactionId,
            status: "manual_submission",
            errorMessage: ""
        });

        await registration.save();

        return NextResponse.json({ 
            success: true, 
            message: "Payment details submitted for verification" 
        });

    } catch (error) {
        console.error("Manual payment submission error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
