import { getVideoStream } from "@/utils/youtube-helper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const downloadVideoSchema = z.object({
  videoId: z.string().length(11),
  itag: z.number(),
  container: z.string(),
  contentLength: z.string(),
  filename: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = downloadVideoSchema.safeParse(body);

  if (!data.success) {
    return NextResponse.json(
      {
        message: "Invalid Parameters",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const videoStream = await getVideoStream(data.data.videoId, data.data.itag);

    if (videoStream) {
      return new NextResponse(videoStream, {
        headers: {
          "Content-Type": `video/${data.data.container}`,
          "Content-Disposition": `attachment; filename="${data.data.filename}"`,
          "Content-Length": data.data.contentLength || "",
          "Accept-Ranges": "bytes",
        },
      });
    }
  } catch (error) {
    console.error("Error in video processing:", error);
  }

  return NextResponse.json(
    { error: "Failed to process video" },
    { status: 500 }
  );
}
