"use client"

import generateRandomRentalHistoryAction, { GenerateRandomRentalHistoryResult } from "@/actions/generateRandomRentalHistory";

export type GenerateRandomRentalHistoryParams = {
  userId: string;
};

export default async function generateRandomRentalHistory({
  userId
}: GenerateRandomRentalHistoryParams): Promise<GenerateRandomRentalHistoryResult> {
  return await generateRandomRentalHistoryAction(userId);
}
