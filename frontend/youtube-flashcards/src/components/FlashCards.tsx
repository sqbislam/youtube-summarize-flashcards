import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface IConcept {
  [v: string]: string;
}
interface IFlashCards {
  keyConcepts: IConcept[];
}
export function FlashCards(props: IFlashCards) {
  const { keyConcepts } = props;
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
