import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Globe, Clock, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data - in a real app, this would come from an API or database
const establishments = [
  {
    title: "Creative 360 Pro | Web Design & SEO Agency",
    place_id: "ChIJZ1Tdr4FhwokRAduFCmuVWnc",
    data_id: "0x89c26181afdd5467:0x775a956b0a85db01",
    rating: 4.9,
    reviews: 291,
    type: "Marketing agency",
    types: ["Marketing agency", "Website designer"],
    address: "51 Frances St, Clifton, NJ 07014",
    open_state: "Open 24 hours",
    hours: "Open 24 hours",
    operating_hours: {
      thursday: "Open 24 hours",
      friday: "Open 24 hours",
      saturday: "Open 24 hours",
      sunday: "Open 24 hours",
      monday: "Open 24 hours (Labor Day)",
      tuesday: "Open 24 hours",
      wednesday: "Open 24 hours",
    },
    phone: "+19735631729",
    website: "https://creative360pro.com/",
    image: "https://lh3.googleusercontent.com/p/AF1QipNQBARQOrBcFheo7adlai-w27WH13CiyBtP6TOv=w1200-h628-k-no",
    gps_coordinates: {
      latitude: 40.8375555,
      longitude: -74.1355134,
    },
    google_maps_url:
      "https://www.google.com/maps/place/Creative+360+Pro+|+Web+Design+&+SEO+Agency/@40.8375555,-74.1355134,12/data=!3m1!1e3!4m6!3m5!1s0x89c26181afdd5467:0x775a956b0a85db01!8m2!3d40.8375555!4d-74.1355134!16s",
  },
  {
    title: "Tech Solutions Hub",
    place_id: "ChIJExample123",
    rating: 4.7,
    reviews: 156,
    type: "IT Services",
    types: ["IT Services", "Software Development"],
    address: "123 Main St, New York, NY 10001",
    open_state: "Open",
    hours: "9 AM - 6 PM",
    operating_hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    phone: "+12125551234",
    website: "https://techsolutions.com/",
    image: "/modern-tech-office.png",
    gps_coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  },
  {
    title: "Local Coffee Roasters",
    place_id: "ChIJExample456",
    rating: 4.5,
    reviews: 89,
    type: "Coffee shop",
    types: ["Coffee shop", "Cafe"],
    address: "456 Oak Ave, Brooklyn, NY 11201",
    open_state: "Closes at 8 PM",
    hours: "6 AM - 8 PM",
    operating_hours: {
      monday: "6:00 AM - 8:00 PM",
      tuesday: "6:00 AM - 8:00 PM",
      wednesday: "6:00 AM - 8:00 PM",
      thursday: "6:00 AM - 8:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 9:00 PM",
      sunday: "7:00 AM - 7:00 PM",
    },
    phone: "+17185559876",
    website: "https://localcoffee.com/",
    image: "/cozy-coffee-shop-interior-with-roasting-equipment.png",
  },
]

interface BusinessPageProps {
  params: {
    id: string
  }
}

export default function BusinessPage({ params }: BusinessPageProps) {
  const business = establishments.find((b) => b.place_id === params.id)

  if (!business) {
    notFound()
  }

  const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{business.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-lg">{business.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({business.reviews} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {business.types.map((type) => (
                        <Badge key={type} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {business.image && (
                  <img
                    src={business.image || "/placeholder.svg"}
                    alt={business.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
              </CardContent>
            </Card>

            {business.operating_hours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {daysOrder.map((day) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium">{dayNames[day as keyof typeof dayNames]}</span>
                        <span className="text-muted-foreground">
                          {business.operating_hours?.[day as keyof typeof business.operating_hours] || "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{business.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${business.phone}`} className="text-primary hover:underline">
                      {business.phone}
                    </a>
                  </div>
                </div>

                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {business.website.replace("https://", "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground">{business.open_state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {business.google_maps_url && (
              <Card>
                <CardContent className="pt-6">
                  <Button asChild className="w-full">
                    <a
                      href={business.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
