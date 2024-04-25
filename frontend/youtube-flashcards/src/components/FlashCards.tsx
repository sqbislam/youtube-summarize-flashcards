import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { IConcept } from "@/lib/interfaces/utilities";

interface IFlashCards {
  keyConcepts: IConcept[];
  discardConcept: (index: number) => void;
}
export function FlashCards(props: IFlashCards) {
  const { keyConcepts, discardConcept } = props;
  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {keyConcepts.map((data, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="p-4">
                <CardTitle className="text-2xl font-semibold">
                  {Object.keys(data)[0]}
                </CardTitle>
                <CardContent className="flex aspect-square text-start p-2">
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
  );
}
