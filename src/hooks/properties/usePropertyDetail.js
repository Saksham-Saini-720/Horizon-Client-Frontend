// src/hooks/queries/usePropertyDetail.js
import { useQuery } from "@tanstack/react-query";

// Mock API - replace with real endpoint
const fetchPropertyDetail = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock data matching your screenshots
  return {
    id,
    price: "$275,000",
    title: "Elegant Townhouse in Woodlands",
    location: "Woodlands, Lusaka",
    tag: "For Sale",
    type: "TOWNHOUSE",
    bedrooms: 3,
    bathrooms: 2,
    area: "200",
    areaUnit: "sqm",
    description: "Modern townhouse in a prestigious gated community. Open-plan living with high ceilings, private patio, and access to community amenities including pool and clubhouse.",
    amenities: [
      "Communal Pool",
      "Clubhouse",
      "24/7 Security",
      "Landscaped Gardens",
      "Parking",
      "Gym",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
    ],
    agent: {
      name: "Grace Tembo",
      title: "Property Agent",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      phone: "+260 97 123 4567",
      email: "grace.tembo@horizon.com",
    },
  };
};

export default function usePropertyDetail(id) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyDetail(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only fetch if id exists
  });
}
