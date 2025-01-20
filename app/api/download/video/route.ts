import { getVideoStream } from "@/utils/youtube-helper";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";
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

// export async function GET(req: NextRequest) {
//   let parseitag = req.nextUrl.searchParams.get("itag");
//   let itag = null;
//   if (parseitag) {
//     itag = parseInt(parseitag);
//   }
//   const data = {
//     data: {
//       videoId: req.nextUrl.searchParams.get("videoId") as string,
//       container: req.nextUrl.searchParams.get("container") as string,
//       contentLength: req.nextUrl.searchParams.get("contentLength") as string,
//       filename: req.nextUrl.searchParams.get("filename") as string,
//       itag,
//     },
//   };

//   if (!downloadVideoSchema.safeParse(data.data).success) {
//     return NextResponse.json(
//       {
//         message: "Invalid Parameters",
//       },
//       {
//         status: 400,
//       }
//     );
//   }

//   try {
//     const videoStream = await getVideoStream(
//       data.data.videoId,
//       data.data.itag!
//     );

//     if (videoStream) {
//       return new NextResponse(videoStream, {
//         headers: {
//           "Content-Type": `video/${data.data.container}`,
//           "Content-Disposition": `attachment; filename="${data.data.filename}"`,
//           "Content-Length": data.data.contentLength || "",
//           "Accept-Ranges": "bytes",
//         },
//       });
//     }
//   } catch (error) {
//     console.error("Error in video processing:", error);
//   }

//   return NextResponse.json(
//     { error: "Failed to process video" },
//     { status: 500 }
//   );
// }
