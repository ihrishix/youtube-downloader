"use client";

import { RenderAudioFormats } from "@/components/AudioFormats";
import {
  DownloadProgress,
  DownloadStatus,
} from "@/components/DownloadProgress";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Input } from "@/components/ui/input";
import MorphingText from "@/components/ui/morphing-text";
import Spinner from "@/components/ui/spinner";
import { TextAnimate } from "@/components/ui/text-animate";
import { RenderVideoFormats } from "@/components/VideoFormats";
import { RenderVideoThumbnail } from "@/components/VideoThumbnail";
import { AudioFormat, VideoDetails, VideoFormat } from "@/utils/youtube-helper";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Home() {
  const [videoId, setVideoId] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, seterror] = useState("");
  const [videoFormats, setVideoFormats] = useState<VideoFormat[]>([]);
  const [audioFormats, setAudioFormats] = useState<AudioFormat[]>([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0.0);
  const [downloadName, setDownloadName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(
    DownloadStatus.NO_DOWNLOAD
  );
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const resetPage = () => {
    setVideoId("");
    setThumbnail("");
    setVideoFormats([]);
    setAudioFormats([]);
    setVideoTitle("");
  };

  useEffect(() => {
    if (videoId != "") {
      fetchVideoData(
        videoId,
        setVideoFormats,
        setAudioFormats,
        setVideoTitle,
        setShowErrorDetails
      );
    }
  }, [videoId]);

  return (
    <div className="relative overflow-hidden">
      <AuroraBackground className="bg-black">
        <div className="w-full h-screen text-white flex justify-center">
          <div className="z-10 w-full h-full">
            <div className="w-full mt-8">
              <MorphingText
                className="text-indigo-300 my-4"
                texts={["just another", "youtube downloader"]}
              />
              <div className="w-[40%] mx-auto">
                <div className="relative">
                  <Input
                    className="h-12 "
                    placeholder="Enter video url or id"
                    onChange={(e) => {
                      setShowErrorDetails(false);
                      if (
                        validateYoutubeIdOrUrl(
                          e.target.value,
                          setVideoId,
                          setThumbnail
                        )
                      ) {
                        seterror("");
                      } else {
                        if (videoId.length != 0) {
                          //user changed the url, from valid to invalid
                          resetPage();
                        }

                        if (e.target.value.length == 0) {
                          seterror("");
                        } else {
                          seterror("Invalid url or id");
                        }
                      }
                    }}
                  />
                </div>
                <span className="text-red-500 italic mx-auto">{error}</span>

                {downloadStatus == DownloadStatus.NO_DOWNLOAD ? (
                  <></>
                ) : (
                  <DownloadProgress
                    status={downloadStatus}
                    downloadName={downloadName}
                    downloadProgress={downloadProgress}
                  />
                )}
              </div>
            </div>

            {videoId.length == 0 ? (
              <></>
            ) : (
              <div className="grid grid-cols-2 gap-8 p-8">
                <div className="">
                  <TextAnimate className="text-3xl mt-4 text-center font-semibold ">
                    {videoTitle}
                  </TextAnimate>

                  <RenderVideoThumbnail thumbnail={thumbnail} />
                </div>
                <div className="relative flex w-full h-[90%] justify-between mt-2 gap-4">
                  {videoFormats == undefined || videoFormats.length == 0 ? (
                    <div className="w-full h-full flex justify-center items-center ">
                      {showErrorDetails ? (
                        <div className="font-semibold text-red-500 text-xl">
                          Error fetching video details
                        </div>
                      ) : (
                        <Spinner />
                      )}
                    </div>
                  ) : (
                    <div className="flex">
                      <RenderVideoFormats
                        setDownloadName={setDownloadName}
                        setDownloadProgress={setDownloadProgress}
                        setDownloadStatus={setDownloadStatus}
                        setIsDownloading={setIsDownloading}
                        title={videoTitle}
                        videoId={videoId}
                        formats={videoFormats}
                        hasAudio={audioFormats.length != 0}
                      />
                      <RenderAudioFormats
                        formats={audioFormats}
                        setDownloadName={setDownloadName}
                        setDownloadProgress={setDownloadProgress}
                        setDownloadStatus={setDownloadStatus}
                        setIsDownloading={setIsDownloading}
                        title={videoTitle}
                        videoId={videoId}
                      />
                    </div>
                  )}

                  {isDownloading ? (
                    <div className="absolute inset-0 bg-slate-900 bg-opacity-70 rounded-lg text-center">
                      <div className="flex flex-col justify-center h-full">
                        <span className="font-bold text-2xl">
                          <div className="flex justify-center gap-2">
                            Downloading
                            <Spinner />
                          </div>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </AuroraBackground>
    </div>
  );
}

async function fetchVideoData(
  videoId: string,
  setVideoFormats: Dispatch<SetStateAction<VideoFormat[]>>,
  setAudioFormats: Dispatch<SetStateAction<AudioFormat[]>>,
  setVideoTitle: Dispatch<SetStateAction<string>>,
  setShowErrorDetails: Dispatch<SetStateAction<boolean>>
) {
  try {
    const data = await axios.post<VideoDetails>("/api/details", {
      videoId,
    });

    setVideoFormats(data.data.formats);
    setAudioFormats(data.data.audioFormats);
    setVideoTitle(data.data.title);
    setShowErrorDetails(false);
  } catch (e) {
    console.log("Error Fetching Video Details: " + e);
    setShowErrorDetails(true);
  }
}

function validateYoutubeIdOrUrl(
  urlOrId: string,
  setVideoId: Dispatch<SetStateAction<string>>,
  setThumbnail: Dispatch<SetStateAction<string>>
) {
  const urlRegex =
    /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

  let videoId = null;
  const matchUrl = urlRegex.exec(urlOrId);
  const matchId = urlRegex.exec(`https://www.youtube.com/watch?v=${urlOrId}`);

  if (matchUrl) {
    videoId = matchUrl[1];
  } else if (matchId) {
    videoId = matchId[1];
  }

  if (videoId) {
    setVideoId(videoId);
    setThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    return true;
  }

  return false;
}
