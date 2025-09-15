
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Percent, Utensils, Landmark } from "lucide-react";

const partners = [
    {
        name: "Himalayan Restaurant",
        type: "Restaurant",
        icon: Utensils,
        discount: "15% Off",
        description: "Enjoy a 15% discount on your total bill. Authentic Nepali and Indian cuisine.",
        logo: "https://picsum.photos/seed/g/200/200",
        logoHint: "restaurant logo"
    },
    {
        name: "Kuwait Exchange Co.",
        type: "Money Exchange",
        icon: Landmark,
        discount: "Special Rates",
        description: "Get preferential exchange rates for remittances to Nepal. No service charge on first transaction.",
        logo: "https://picsum.photos/seed/h/200/200",
        logoHint: "finance logo"
    },
    {
        name: "Everest Dine",
        type: "Restaurant",
        icon: Utensils,
        discount: "20% Off",
        description: "A special 20% discount for all KGS members on dine-in and takeaway orders.",
        logo: "https://picsum.photos/seed/i/200/200",
        logoHint: "food logo"
    },
    {
        name: "Global Remit",
        type: "Money Exchange",
        icon: Landmark,
        discount: "Zero Fees",
        description: "Send money to Nepal with zero fees on all transactions above KWD 100.",
        logo: "https://picsum.photos/seed/j/200/200",
        logoHint: "money logo"
    }
]

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        title="Partner Benefits"
        description="Exclusive discounts for our community members."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partners.map((partner, index) => (
            <Card key={index} className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4 text-center sm:text-left">
               <div className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                    <Image 
                        src={partner.logo} 
                        alt={`${partner.name} logo`} 
                        width={100} 
                        height={100}
                        data-ai-hint={partner.logoHint}
                        className="rounded-lg object-cover w-full h-full"
                    />
               </div>
               <div className="flex-grow">
                    <CardHeader className="p-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <CardTitle className="text-lg">{partner.name}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <partner.icon className="h-4 w-4"/>
                                <span>{partner.type}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 mt-4">
                        <div className="flex items-center justify-center sm:justify-start text-primary font-bold text-lg mb-2">
                            <Percent className="h-5 w-5 mr-2" />
                            <span>{partner.discount}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{partner.description}</p>
                    </CardContent>
               </div>
            </Card>
        ))}
      </div>
    </>
  );
}
