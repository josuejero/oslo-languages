// src/app/api/admin/content/[section]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Add this function inside the route file
async function updateContent(section: string, content: any) {
  // Implement your logic to update content here
  console.log(`Updating section ${section} with content:`, content);
  // Example: Save to a database or file system
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  const session = await getServerSession();
  
  // Check if user is authenticated and is admin
  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {

    const content = await request.json();
    // Here you would update the content in your database or file system
    // For example:

    await updateContent(params.section, content);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}