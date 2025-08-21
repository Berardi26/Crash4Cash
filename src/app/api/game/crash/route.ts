import { NextResponse } from 'next/server';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function GET() {
  try {
    console.log("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL)

    const res = await fetch(`${API_URL}/game/crash`, {
      cache: 'no-store', // disable caching for fresh data
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json(); // { username, betAmount, ... }
    const token = req.headers.get("Authorization");
    console.log("token-", token )
    const res = await fetch(`${API_URL}/game/crash/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` || "", // forward token to backend
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error joining game:", error);
    return NextResponse.json({ error: "Failed to join game" }, { status: 500 });
  }
}
