import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Registration from "@/app/models/Registration";
import Profile from "@/app/models/Profile";
import Team from "@/app/models/Team";
import Event from "@/app/models/Event";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import AuthUser from "@/app/models/AuthUser";

// Force import to register models
void Team;
void Event;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        // clerkId no longer needed
        const eventId = searchParams.get("eventId");
        const status = searchParams.get("status");

        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
            if (decoded.role !== "ADMIN") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        } catch (err) {
            return NextResponse.json({ message: "Invalid session" }, { status: 401 });
        }

        // Build Query
        const query: Record<string, unknown> = {};
        if (eventId && eventId !== "all") query.eventId = eventId;
        if (status && status !== "all") query.paymentStatus = status;

        const registrations = await Registration.find(query)
            .populate({
                path: "teamId",
                populate: { path: "leaderId", select: "username email phone" },
            })
            .populate("eventId", "title fees")
            .sort({ createdAt: -1 });

        return NextResponse.json({ registrations });
    } catch (error) {
        console.error("Admin Registrations GET Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
