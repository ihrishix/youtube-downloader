import Image from "next/image";

export const RenderVideoThumbnail = ({ thumbnail }: { thumbnail: string }) => {
  if (thumbnail.length == 0) {
    return <></>;
  }

  return (
    <div className="relative aspect-video mt-2">
      <Image
        fill
        sizes="100vw"
        objectFit="cover"
        src={thumbnail}
        alt="Video Thumbnail"
      />
    </div>
  );
};
