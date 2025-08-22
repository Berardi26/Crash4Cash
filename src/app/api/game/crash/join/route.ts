import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { username, betAmount, ... }
    const token = req.headers.get("Authorization");
    const address = req.headers.get("address");
    const cookie = req.headers.get("cookie");
    const res = await axios.post(`${API_URL}/game/crash/join`, body, {
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
    console.error("Error joining game:", error);
    return NextResponse.json({ error: "Failed to join game" }, { status: 500 });
  }
}
