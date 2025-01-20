import { AudioFormat, VideoFormat } from "@/utils/youtube-helper";
import axios from "axios";
import { DownloadIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { DownloadStatus } from "../DownloadProgress";
import LitupButton from "./litup-button";

export default function VideoFormatButton({
  item,
  videoId,
  title,
  setIsDownloading,
  setDownloadName,
  setDownloadStatus,
  setDownloadProgress,
}: {
  item: VideoFormat;
  videoId: string;
  title: string;
  setDownloadProgress: Dispatch<SetStateAction<number>>;
  setDownloadName: Dispatch<SetStateAction<string>>;
  setIsDownloading: Dispatch<SetStateAction<boolean>>;
  setDownloadStatus: Dispatch<SetStateAction<DownloadStatus>>;
}) {
  return (
    <LitupButton
      color={true}
      onClick={() => {
        if (title.length > 31) {
          title = title.substring(0, 30);
        }
        const filename = `${title}_${item.height}p_${item.fps}.${item.container}`;

        downloadFile(
          filename,
          videoId,
          item,
          setDownloadProgress,
          setDownloadName,
          setIsDownloading,
          setDownloadStatus
        );
      }}
    >
      <div className="flex justify-center gap-4">
        <div>
          <span className="font-semibold">{item.height}p @ </span>
          <span className="text-slate-400">{item.fps}fps</span>
        </div>

        <DownloadIcon className="hidden group-hover:block" />
      </div>
    </LitupButton>
  );
}

export function downloadFile(
  filename: string,
  videoId: string,
  item: VideoFormat | AudioFormat,
  setDownloadProgress: Dispatch<SetStateAction<number>>,
  setDownloadName: Dispatch<SetStateAction<string>>,
  setIsDownloading: Dispatch<SetStateAction<boolean>>,
  setDownloadStatus: Dispatch<SetStateAction<DownloadStatus>>,
  isAudio = false
) {
  try {
    setDownloadName(filename);
    setDownloadStatus(DownloadStatus.IN_PROGRESS);
    setIsDownloading(true);

    let url = "/api/download/video";

    if (isAudio) {
      url = "api/download/audio";
    }

    axios({
      url,
      method: "POST",
      responseType: "blob",
      onDownloadProgress: (e) => {
        if (e.progress) {
          setDownloadProgress(e.progress * 100);
        }
      },
      data: {
        videoId,
        filename,
        contentLength: item.contentLength,
        itag: item.iTag,
        container: item.container,
      },
    })
      .then((response) => {
        const href = URL.createObjectURL(response.data);

        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);

        setDownloadStatus(DownloadStatus.COMPLETED);
        setIsDownloading(false);
      })
      .catch((error) => {
        console.error("Error downloading the video:", error);
        setDownloadStatus(DownloadStatus.ERROR);
        setIsDownloading(false);
      });
  } catch (error) {
    console.error("Error downloading the video:", error);
    setDownloadStatus(DownloadStatus.ERROR);
    setIsDownloading(false);
  }
}
