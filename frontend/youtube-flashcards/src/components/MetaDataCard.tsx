import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";

interface IMetadataCard {
  data: string;
}
export function MetadataCard(props: IMetadataCard) {
  const { data } = props;

  return (
    <Card className="p-4 ">
      <CardTitle>Metadata</CardTitle>
      <CardContent className="mt-4">
        <table className="text-start">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(data).map((key, idx) => {
              if (key === "length") {
                return (
                  <tr key={idx}>
                    <td className="pl-6">{key}</td>
                    <td className="pl-6">{formatTime(data[key])}</td>
                  </tr>
                );
              } else {
                return (
                  <tr key={idx}>
                    <td className="pl-6">{key}</td>
                    <td className="pl-6">{data[key as any]}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
