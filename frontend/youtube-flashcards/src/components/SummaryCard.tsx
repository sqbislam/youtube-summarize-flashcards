import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface ISummaryCard {
  summary: string;
}
export function SummaryCard(props: ISummaryCard) {
  const { summary } = props;
  return (
    <Card className="p-2">
      <CardTitle>Summary</CardTitle>
      <CardContent className="mt-4">
        <p
          dangerouslySetInnerHTML={{ __html: summary }}
          className="text-start"
        ></p>
      </CardContent>
    </Card>
  );
}
