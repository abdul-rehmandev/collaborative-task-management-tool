import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Fetch all projects created by the signed-in user
export async function GET() {
    const session = await getServerSession(authOptions);

    // Ensure the user is signed in
    if (!session || !session.user?.email) {
        return NextResponse.redirect('/homepage');
    }

    await connectToDatabase();

    // Find all projects where the current user is the owner by email
    const projects = await Project.find({ 'projectOwner.email': session.user.email });

    return NextResponse.json(projects);
}
