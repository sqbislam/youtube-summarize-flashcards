import { Card } from "@/components/ui/card";
import { getYoutubeThumbnail } from "@/lib/utils";

interface IYoutubeCard {
  link: string;
}
export function YoutubeVideoCard(props: IYoutubeCard) {
  const { link } = props;
  return (
    <Card className="p-2 mt-5">
      {link && getYoutubeThumbnail(link) && (
        <div className="w-full w-max-sm ">
          <img
            height={100}
            width={100}
            src={getYoutubeThumbnail(link)}
            alt="youtube thumbnail"
            className="fit cover"
          />
        </div>
      )}
    </Card>
  );
}
