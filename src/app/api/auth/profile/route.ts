import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';


export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization");
    const address = req.headers.get("address");
    console.log("address-", address)
    const res = await fetch(`${API_URL}/auth/connect-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token || "", // forward token to backend
      },
      body: JSON.stringify({
        walletAddress: address || "",
      }),
    });

    if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error joining game:", error);
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
  }
}
