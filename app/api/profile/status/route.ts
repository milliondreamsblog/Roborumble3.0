import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Profile from "@/app/models/Profile";

export async function GET() {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const profile = await Profile.findOne({ clerkId }).select(
            "registeredEvents paidEvents onboardingCompleted username"
        );

        if (!profile) {
            return NextResponse.json({
                registeredEvents: [],
                paidEvents: [],
                onboardingCompleted: false
            });
        }

        const Team = (await import("@/app/models/Team")).default;
        const teams = await Team.find({ members: profile._id });
        const teamIds = teams.map((t: any) => t._id);

        const Registration = (await import("@/app/models/Registration")).default;
        const registrations = await Registration.find({
            $or: [
                { teamId: { $in: teamIds } },
                { selectedMembers: profile._id }
            ]
        }).select("eventId paymentStatus");

        const statusMap: Record<string, string> = {};
        const paidEvents: string[] = [];
        const registeredEvents: string[] = [];

        registrations.forEach((reg: any) => {
            const eId = reg.eventId.toString();
            statusMap[eId] = reg.paymentStatus;
            registeredEvents.push(eId);
            if (reg.paymentStatus === 'paid') {
                paidEvents.push(eId);
            }
        });

        return NextResponse.json({
            registeredEvents,
            paidEvents, // Kept for backward compatibility
            statusMap,
            onboardingCompleted: profile.onboardingCompleted,
            username: profile.username
        });

    } catch (error) {
        console.error("Profile Status Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
