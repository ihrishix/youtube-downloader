import ytdl from "@distube/ytdl-core";
import { audio } from "framer-motion/client";

export interface VideoDetails {
  title: string;
  thumbnail: string;
  formats: VideoFormat[];
  audioFormats: AudioFormat[];
}

export interface AudioFormat {
  container: string;
  iTag: number;
  audioBitrate: number;
  contentLength: string;
}

export interface VideoFormat {
  width: number;
  height: number;
  fps: number;
  hasAudio: boolean;
  container: string;
  iTag: number;
  bitrate: number;
  contentLength: string;
}

export async function getVideoDetails(
  videoId: string
): Promise<VideoDetails | null> {
  try {
    const info = await ytdl.getInfo(
      `http://www.youtube.com/watch?v=${videoId}`
    );
    const formats: VideoFormat[] = [];
    const audioFormats: AudioFormat[] = [];
    const duplicates = new Set();
    const audioDuplicates = new Set();

    info.formats
      .sort((a, b) => {
        const bitrateA = a.bitrate || 0;
        const bitrateB = b.bitrate || 0;
        return bitrateB - bitrateA; // Sort in descending order
      })
      .filter((a) => {
        if (
          a.hasAudio &&
          !a.hasVideo &&
          a.audioBitrate &&
          !audioDuplicates.has(a.itag)
        ) {
          audioDuplicates.add(a.itag);
          audioFormats.push({
            container: a.container,
            iTag: a.itag,
            audioBitrate: a.audioBitrate,
            contentLength: a.contentLength,
          });
        }

        if (a.hasVideo && a.width && a.height && a.fps && a.bitrate) {
          const duplicatesString =
            a.width.toString() + a.height.toString() + a.fps.toString();

          if (!duplicates.has(duplicatesString)) {
            duplicates.add(duplicatesString);

            formats.push({
              width: a.width,
              height: a.height,
              fps: a.fps,
              hasAudio: a.hasAudio,
              container: a.container,
              iTag: a.itag,
              bitrate: a.bitrate,
              contentLength: a.contentLength,
            });
          }
        }
      });

    return {
      title: info.videoDetails.title,
      thumbnail:
        info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
          .url,
      formats,
      audioFormats,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function isVideoIdValid(videoId: string): Promise<boolean | null> {
  try {
    return ytdl.validateID(videoId);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getVideoStream(
  videoId: string,
  iTag: number
): Promise<ReadableStream<any> | null> {
  try {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const videoStream = ytdl(
            `https://www.youtube.com/watch?v=${videoId}`,
            {
              filter: (format) => format.itag === iTag,
            }
          );

          videoStream.on("data", (chunk) => {
            controller.enqueue(chunk);
          });

          videoStream.on("end", () => {
            controller.close();
          });

          videoStream.on("error", (error) => {
            controller.error(error);
            console.error("Stream error:", error);
          });
        } catch (error) {
          controller.error(error);
          console.error("Streaming error:", error);
        }
      },
      cancel() {
        console.log("Stream cancelled by client");
      },
    });

    return stream;
  } catch (e) {
    console.log(e);
    return null;
  }
}
