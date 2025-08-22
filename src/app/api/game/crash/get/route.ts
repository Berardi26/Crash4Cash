import axios from 'axios';
import { NextResponse } from 'next/server';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const res = await axios.get(`${API_URL}/game/crash/getgame`, {
      headers: {
        cookie, // forward cookies to backend
      },
      withCredentials: true
    })

    if (res.status !== 200) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Failed to fetch crash game:", error);
    return NextResponse.json(
      { error: "Failed to fetch crash game" },
      { status: 500 }
    );
  }
}


