import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface ISummaryCard {
  summary: string;
}
export function SummaryCard(props: ISummaryCard) {
  const { summary } = props;
  return (
    <Card className="py-2">
      <CardTitle>Summary</CardTitle>
      <CardContent className="mt-4 p-0 lg:px-2">
        <MarkdownPreview
          source={summary}
          style={{ padding: 16 }}
          className="text-start bg-secondary text-gray-800 dark:text-inherit"
        />
      </CardContent>
    </Card>
  );
}
