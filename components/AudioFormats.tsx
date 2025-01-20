import { AudioFormat } from "@/utils/youtube-helper";
import AudioFormatButton from "./ui/audioFormat-button";
import { Dispatch, SetStateAction } from "react";
import { DownloadStatus } from "./DownloadProgress";

export const RenderAudioFormats = ({
  formats,
  title,
  videoId,
  setDownloadProgress,
  setDownloadName,
  setIsDownloading,
  setDownloadStatus,
}: {
  formats: AudioFormat[];
  title: string;
  videoId: string;
  setDownloadProgress: Dispatch<SetStateAction<number>>;
  setDownloadName: Dispatch<SetStateAction<string>>;
  setIsDownloading: Dispatch<SetStateAction<boolean>>;
  setDownloadStatus: Dispatch<SetStateAction<DownloadStatus>>;
}) => {
  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <span className="text-xl font-semibold text-center sticky top-0 pt-2">
        Audio
      </span>
      <div
        className="px-2 pb-2 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-0.5
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-slate-800
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        {formats.map((a) => (
          <AudioFormatButton
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
