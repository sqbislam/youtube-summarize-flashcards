import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon, Rows3, SquareStack, Trash2 } from "lucide-react";
import { IConcept } from "@/lib/interfaces/utilities";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "./ui/collapsible";

interface IFlashCards {
  keyConcepts: IConcept[];
  discardConcept: (index: number) => void;
}

const ViewType = {
  Cards: "cards",
  List: "list",
};

export function ToggleViews({
  onViewChange,
  viewType,
}: {
  onViewChange: (view: string) => void;
  viewType: string;
}) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      onValueChange={onViewChange}
      defaultValue={ViewType.List}
      value={viewType}
    >
      <ToggleGroupItem value={ViewType.List} aria-label="Toggle List">
        <Rows3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={ViewType.Cards} aria-label="Toggle Cards">
        <SquareStack className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function CollapsibleItem({ data }: { data: IConcept }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setOpen}
      className="w-[380px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">{Object.keys(data)[0]}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDownIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          {Object.values(data)[0]}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function FlashCards(props: IFlashCards) {
  const { keyConcepts = [], discardConcept } = props;
  const [viewType, setViewType] = useState<string>(ViewType.List);
  return (
    <>
      <div className="flex flex-row justify-between  mb-2 items-center">
        <p>
          {`Found Key Concepts `}
          <span className="font-bold">{keyConcepts.length}</span>
        </p>
        <ToggleViews
          viewType={viewType}
          onViewChange={(view) => setViewType(view)}
        />
      </div>

      {viewType === ViewType.Cards ? (
        <Carousel className="w-full max-w-sm">
          <CarouselContent>
            {keyConcepts.map((data, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="p-4 bg-secondary ">
                    <CardTitle className="text-2xl font-semibold">
                      {Object.keys(data)[0]}
                    </CardTitle>
                    <CardContent className="flex aspect-square text-start p-2 overflow-y-auto max-h-[250px] w-full max-w-sm">
                      <span className="text-lg">{Object.values(data)[0]}</span>
                    </CardContent>
                    <CardFooter>
                      <Button
                        size="icon"
                        variant="outline"
                        className="mx-auto"
                        onClick={() => discardConcept(index)}
                      >
                        <Trash2 color="red" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <Card className="max-h-[400px] overflow-y-auto w-full overflow-x-hidden">
          {keyConcepts.map((data, index) => (
            <CollapsibleItem key={index} data={data} />
          ))}
        </Card>
      )}
    </>
  );
}
