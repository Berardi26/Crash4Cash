import { pinata } from "@/utils/pinata";
import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';


export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    const { cid } = await pinata.upload.public.file(file)
    const url = await pinata.gateways.public.convert(cid);
    console.log("upload url:", url)
    if (url) {
      const cookie = req.headers.get("cookie");
      const res = await axios.post(`${API_URL}/user/avatar`, {
        avatar: url
      }, {
        headers: {
          cookie, // forward cookies to backend
        },
        withCredentials: true
      })
      if (res.status !== 200) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      return NextResponse.json(res.data);
    }
    else {
      throw new Error(`Failed to upload avatar`);
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}