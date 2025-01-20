import { z } from "zod";

export const downloadVideoSchema = z.object({
  videoId: z.string().length(11),
  itag: z.number(),
  container: z.string(),
  contentLength: z.string(),
  filename: z.string(),
});
