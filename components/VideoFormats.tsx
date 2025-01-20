import { VideoFormat } from "@/utils/youtube-helper";
import { div } from "framer-motion/client";
import VideoFormatButton from "./ui/videoFormat-button";
import { VolumeXIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { DownloadStatus } from "./DownloadProgress";

export const RenderVideoFormats = ({
  formats,
  hasAudio,
  title,
  videoId,
  setIsDownloading,
  setDownloadName,
  setDownloadStatus,
  setDownloadProgress,
}: {
  formats: VideoFormat[];
  hasAudio: boolean;
  title: string;
  videoId: string;
  setDownloadProgress: Dispatch<SetStateAction<number>>;
  setDownloadName: Dispatch<SetStateAction<string>>;
  setIsDownloading: Dispatch<SetStateAction<boolean>>;
  setDownloadStatus: Dispatch<SetStateAction<DownloadStatus>>;
}) => {
  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <span className="flex flex-col text-xl font-bold text-center sticky top-0 pt-2 items-center">
        <span>Video</span>

        {hasAudio ? (
          <></>
        ) : (
          <span className="flex text-sm text-center text-slate-400 mt-1">
            <VolumeXIcon className="mr-1" /> Video has no audio
          </span>
        )}
      </span>

      <div
        className="px-2 pb-2 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-0.5
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-slate-800
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        {formats.map((a) => (
          <VideoFormatButton
            setDownloadName={setDownloadName}
            setDownloadProgress={setDownloadProgress}
            setDownloadStatus={setDownloadStatus}
            setIsDownloading={setIsDownloading}
            title={title}
            videoId={videoId}
            key={a.iTag}
            item={a}
          />
        ))}
      </div>
    </div>
  );
};
