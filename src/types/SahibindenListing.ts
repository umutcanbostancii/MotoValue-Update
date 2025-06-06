export interface SahibindenListing {
  id: string;
  title: string;
  price: string;
  date: string;
  location: string;
  image: string;
  link: string;
  classifiedDetails: {
    brand: string;
    model: string;
    year: string;
    mileage: string;
    condition: string;
    engineCapacity: string;
    enginePower: string;
    cylinderCount: string;
    transmission: string;
    timingType: string;
    type: string;
    from: string;
    accessories: string[];
    securityFeatures: string[];
  };
}
