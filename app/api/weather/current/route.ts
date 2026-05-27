import { NextResponse } from 'next/server';
import { getCurrentConditions } from '../../../../lib/weatherAdapter';

export async function GET() {
  try {
    const data = await getCurrentConditions();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
