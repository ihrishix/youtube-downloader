import { AudioFormat } from "@/utils/youtube-helper";
import LitupButton from "./litup-button";
import { DownloadIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { DownloadStatus } from "../DownloadProgress";
import { downloadFile } from "./videoFormat-button";

export default function AudioFormatButton({
  item,
  videoId,
  title,
  setIsDownloading,
  setDownloadName,
  setDownloadStatus,
  setDownloadProgress,
}: {
  item: AudioFormat;
  videoId: string;
  title: string;
  setDownloadProgress: Dispatch<SetStateAction<number>>;
  setDownloadName: Dispatch<SetStateAction<string>>;
  setIsDownloading: Dispatch<SetStateAction<boolean>>;
  setDownloadStatus: Dispatch<SetStateAction<DownloadStatus>>;
}) {
  return (
    <LitupButton
      color={false}
      onClick={() => {
        if (title.length > 31) {
          title = title.substring(0, 30);
        }
        const filename = `${title}_${item.audioBitrate}kbps.${item.container}`;

        downloadFile(
          filename,
          videoId,
          item,
          setDownloadProgress,
          setDownloadName,
          setIsDownloading,
          setDownloadStatus,
          true
        );
      }}
    >
      <div className="flex justify-center gap-4">
        <div>
          <span className="font-semibold">{item.audioBitrate}kbps | </span>
          <span>{item.container}</span>
        </div>
        <DownloadIcon className="hidden group-hover:block" />
      </div>
    </LitupButton>
  );
}
