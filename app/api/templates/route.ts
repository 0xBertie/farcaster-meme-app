import { NextResponse } from 'next/server';
import { getMemeTemplates } from '@/lib/db';

export async function GET() {
  try {
    const { templates, error } = await getMemeTemplates();

    if (error) throw error;

    return NextResponse.json({ success: true, templates: templates || [] });
  } catch (error: any) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed' },
      { status: 500 }
    );
  }
}
