"use server"

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";
import { Database } from "@/types/supabase/database.types";

type RentalHistoryInsert = Database["public"]["Tables"]["rental_history"]["Insert"];
type ScooterRow = Database["public"]["Tables"]["scooter"]["Row"];

export type GenerateRandomRentalHistoryResult = {
  success: true;
  error?: undefined;
  data: Database["public"]["Tables"]["rental_history"]["Row"];
} | {
  success: false;
  error: string;
  data?: undefined;
}

export default async function generateRandomRentalHistory(
  userId: string
): Promise<GenerateRandomRentalHistoryResult> {
  const supabase = await createSupabaseServerAdmin();

  if (!userId) {
    return {
      success: false,
      error: 'User ID is required',
    };
  }

  // First, get the total count of scooters
  const { count: scooterCount, error: countError } = await supabase
    .from("scooter")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return {
      success: false,
      error: `Failed to count scooters: ${countError.message}`,
    };
  }

  if (!scooterCount || scooterCount === 0) {
    return {
      success: false,
      error: 'No scooters found in the database',
    };
  }

  // Generate random offset to select a random scooter
  const randomOffset = Math.floor(Math.random() * scooterCount);
  
  // Fetch only one random scooter using offset
  const { data: randomScooters, error: scooterError } = await supabase
    .from("scooter")
    .select("*")
    .range(randomOffset, randomOffset)
    .limit(1);

  if (scooterError) {
    return {
      success: false,
      error: `Failed to fetch random scooter: ${scooterError.message}`,
    };
  }

  if (!randomScooters || randomScooters.length === 0) {
    return {
      success: false,
      error: 'Failed to select random scooter',
    };
  }

  const randomScooter: ScooterRow = randomScooters[0];

  // Generate random rental data
  const now = new Date();
  const startTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time within last 7 days
  const endTime = new Date(startTime.getTime() + Math.random() * 4 * 60 * 60 * 1000); // Random duration up to 4 hours
  
  // Generate random locations (you can customize these to be more realistic)
  const locations = [
    "Montpellier Centre",
    "Place de la Comédie",
    "Université de Montpellier",
    "Gare Saint-Roch",
    "Antigone",
    "Port Marianne",
    "Beaux-Arts",
    "Hôtel de Ville",
    "Château d'Eau",
    "Plan Cabanes"
  ];
  
  const startLocation = locations[Math.floor(Math.random() * locations.length)];
  let endLocation = locations[Math.floor(Math.random() * locations.length)];
  // Ensure end location is different from start location
  while (endLocation === startLocation) {
    endLocation = locations[Math.floor(Math.random() * locations.length)];
  }

  // Generate random distance (between 0.5 and 15 km)
  const distanceTravelled = Math.round((Math.random() * 14.5 + 0.5) * 100) / 100;

  const rentalHistoryInsert: RentalHistoryInsert = {
    user_id: userId,
    scooter_id: randomScooter.id,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    start_location: startLocation,
    end_location: endLocation,
    distance_travelled: distanceTravelled,
  };

  // Debug log to check the values being inserted
  console.log('Inserting rental history:', {
    user_id: userId,
    scooter_id: randomScooter.id,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    start_location: startLocation,
    end_location: endLocation,
    distance_travelled: distanceTravelled,
  });

  // Insert the rental history record
  const { data: rentalHistory, error: rentalHistoryError } = await supabase
    .from("rental_history")
    .insert(rentalHistoryInsert)
    .select()
    .single();

  if (rentalHistoryError) {
    return {
      success: false,
      error: `Failed to create rental history: ${rentalHistoryError.message}`,
    };
  }

  if (!rentalHistory) {
    return {
      success: false,
      error: 'Failed to create rental history: No data returned',
    };
  }

  return {
    success: true,
    data: rentalHistory,
  };
}
