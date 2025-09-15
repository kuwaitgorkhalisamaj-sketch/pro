import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Upload } from "lucide-react";

const galleryItems = [
  { src: "https://picsum.photos/seed/a/600/400", hint: "community event", title: "Cultural Program 2023" },
  { src: "https://picsum.photos/seed/b/600/400", hint: "group photo", title: "Annual Picnic" },
  { src: "https://picsum.photos/seed/c/600/400", hint: "sports day", title: "Sports Day" },
  { src: "https://picsum.photos/seed/d/600/400", hint: "charity work", title: "Charity Drive" },
  { src: "https://picsum.photos/seed/e/600/400", hint: "festival celebration", title: "Dashain Celebration" },
  { src: "https://picsum.photos/seed/f/600/400", hint: "meeting people", title: "New Year Gathering" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Community Gallery"
        description="A collection of moments from our events and gatherings."
      >
        <Button>
          <Upload className="mr-2" />
          Upload Photo
        </Button>
      </PageHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={item.src}
                alt={item.title}
                width={600}
                height={400}
                data-ai-hint={item.hint}
                className="aspect-video object-cover w-full"
              />
            </CardContent>
            <CardFooter className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
