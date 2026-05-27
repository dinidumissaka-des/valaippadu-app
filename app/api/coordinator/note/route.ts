import { NextResponse } from 'next/server';
import { setCoordinatorNote, clearCoordinatorNote } from '../../../../lib/weatherAdapter';

export async function POST(req: Request) {
  try {
    const { text, override_zone } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: 'text required' }, { status: 400 });
    const note = setCoordinatorNote(text.trim(), override_zone);
    return NextResponse.json({ success: true, posted_at: note!.posted_at });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  clearCoordinatorNote();
  return NextResponse.json({ success: true });
}
