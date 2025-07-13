
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Navigation,
  ShoppingBag,
  GraduationCap,
  Heart,
  DollarSign
} from 'lucide-react';
import { SectorType } from './SectorDashboard';

interface SectorContentProps {
  sector: SectorType;
}

export const SectorContent: React.FC<SectorContentProps> = ({ sector }) => {
  const renderRetailContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Nearby Stores & Malls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Westfield Mall", type: "Shopping Mall", distance: "0.8 miles", rating: 4.5, offers: "20% off on weekends" },
            { name: "Target Store", type: "Department Store", distance: "1.2 miles", rating: 4.3, offers: "Buy 2 Get 1 Free" },
            { name: "Whole Foods Market", type: "Grocery Store", distance: "0.5 miles", rating: 4.6, offers: "Organic deals" },
            { name: "Best Buy Electronics", type: "Electronics Store", distance: "1.8 miles", rating: 4.4, offers: "Tech sale ongoing" }
          ].map((store, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {store.distance}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{store.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline">{store.type}</Badge>
                <div className="bg-green-50 p-2 rounded-lg">
                  <p className="text-xs text-green-800 font-medium">🎯 {store.offers}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Browse
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEducationContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Educational Institutions</h2>
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h3 className="font-semibold text-yellow-800 mb-2">⭐ Top 5 Recommended</h3>
            <p className="text-sm text-yellow-700">Premium institutions with excellent ratings</p>
          </div>
          
          {[
            { name: "Seattle University", type: "Private University", rating: 4.8, tuition: "$45,000/year", programs: "120+ programs" },
            { name: "University of Washington", type: "Public University", rating: 4.7, tuition: "$38,000/year", programs: "180+ programs" },
            { name: "Seattle Pacific University", type: "Private University", rating: 4.6, tuition: "$42,000/year", programs: "65+ programs" },
            { name: "Cornish College of Arts", type: "Arts College", rating: 4.5, tuition: "$35,000/year", programs: "40+ programs" },
            { name: "Seattle Central College", type: "Community College", rating: 4.4, tuition: "$15,000/year", programs: "80+ programs" }
          ].map((school, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <CardDescription>{school.type}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{school.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{school.tuition}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{school.programs}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Other Institutions (10 more)</h3>
            <p className="text-sm text-gray-600">Additional educational options available with standard ratings</p>
            <Button variant="link" className="p-0 h-auto text-sm">View all institutions →</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthcareContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Healthcare Facilities</h2>
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h3 className="font-semibold text-red-800 mb-2">⭐ Top 5 Recommended</h3>
            <p className="text-sm text-red-700">Highly rated medical facilities</p>
          </div>
          
          {[
            { name: "Seattle Children's Hospital", type: "Pediatric Hospital", rating: 4.9, specialty: "Pediatric Care", distance: "2.1 miles" },
            { name: "UW Medical Center", type: "General Hospital", rating: 4.8, specialty: "Multi-specialty", distance: "1.8 miles" },
            { name: "Swedish Medical Center", type: "General Hospital", rating: 4.7, specialty: "Cardiology", distance: "2.5 miles" },
            { name: "Virginia Mason Medical", type: "Medical Center", rating: 4.6, specialty: "Surgery", distance: "1.2 miles" },
            { name: "Harborview Medical", type: "Trauma Center", rating: 4.5, specialty: "Emergency Care", distance: "3.0 miles" }
          ].map((hospital, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{hospital.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hospital.distance}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{hospital.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline">{hospital.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{hospital.specialty}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Book Appointment
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGeneralContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">General Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "City Hall", type: "Government", distance: "1.5 miles", hours: "8 AM - 5 PM" },
            { name: "Public Library", type: "Library", distance: "0.8 miles", hours: "9 AM - 8 PM" },
            { name: "Post Office", type: "Postal Service", distance: "0.6 miles", hours: "9 AM - 6 PM" },
            { name: "Community Center", type: "Recreation", distance: "1.0 miles", hours: "6 AM - 10 PM" }
          ].map((service, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {service.distance}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline">{service.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.hours}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  <Navigation className="w-4 h-4 mr-1" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  switch (sector) {
    case 'retail':
      return renderRetailContent();
    case 'education':
      return renderEducationContent();
    case 'healthcare':
      return renderHealthcareContent();
    case 'general':
      return renderGeneralContent();
    default:
      return <div>Select a sector to view content</div>;
  }
};
