import { Progress } from "./ui/progress";

export const DownloadProgress = ({
  downloadName,
  downloadProgress,
  status,
}: {
  downloadName: string;
  downloadProgress: number;
  status: DownloadStatus;
}) => {
  return (
    <div className="p-4">
      {!(status == DownloadStatus.NO_DOWNLOAD) ? (
        <div>
          <span className="">
            {status == DownloadStatus.COMPLETED ? (
              <span className="text-green-500 font-semibold italic">
                Download Completed.
              </span>
            ) : status == DownloadStatus.IN_PROGRESS ? (
              <span className="text-indigo-300 font-semibold italic">
                Downloading
              </span>
            ) : status == DownloadStatus.ERROR ? (
              <span className="text-red-500 font-semibold italic">
                Error downloading file.
              </span>
            ) : (
              <></>
            )}{" "}
            {downloadName} ({downloadProgress.toFixed(2)}%)
          </span>
          <Progress
            value={downloadProgress}
            color="white"
            className="w-full h-8 mt-1"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export enum DownloadStatus {
  COMPLETED,
  NO_DOWNLOAD,
  IN_PROGRESS,
  ERROR,
}
