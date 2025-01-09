import { getVideoDetails } from "@/utils/youtube-helper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = detailsSchema.safeParse(body);

  if (!data.success) {
    return NextResponse.json(
      {
        msg: "Invalid Parameters",
      },
      {
        status: 400,
      }
    );
  }

  const videoDetails = await getVideoDetails(data.data.videoId);

  if (videoDetails) {
    return NextResponse.json(videoDetails);
  }

  return NextResponse.json({
    message: "Error fetching video",
  });
}

const detailsSchema = z.object({
  videoId: z.string().length(11),
});
