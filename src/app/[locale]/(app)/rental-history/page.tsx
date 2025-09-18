"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";
import { useRentalHistoryInfinite } from "@/hooks/use-rental-history-infinite";
import { useGenerateRandomRentalHistory } from "@/hooks/use-generate-random-rental-history";
import { Database } from "@/types/supabase/database.types";
import { toast } from "sonner";

type RentalHistoryWithScooter = Database["public"]["Tables"]["rental_history"]["Row"] & {
  scooter?: {
    id: string;
    reference_number: string | null;
    model: string | null;
  } | null;
};

// Helper functions for formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  
  if (diffMins < 60) {
    return `${diffMins} min`;
  } else {
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}min`;
  }
};

// Mock cost calculation - this should come from your business logic
const calculateCost = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  
  // Example: €0.15 per minute with €1.50 base fee
  const baseFee = 1.50;
  const perMinuteFee = 0.15;
  const total = baseFee + (diffMins * perMinuteFee);
  
  return `€${total.toFixed(2)}`;
};

export default function RentalHistory() {
  const t = useTranslations("RentalHistory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  
  // Get authenticated user
  const { data: user, isLoading: userLoading, error: userError } = useAuthenticatedUser();
  
  // Get mutation for generating random rental history
  const generateRandomRentalMutation = useGenerateRandomRentalHistory();
  
  // Get rental history with infinite scroll
  const {
    data: rentalHistory,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount
  } = useRentalHistoryInfinite({
    userId: user?.id || "",
    limit: 10,
    enabled: !!user?.id
  });

  // Ref for infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Handler for generating random rental history
  const handleGenerateRandomRental = () => {
    if (!user?.id) {
      toast.error("User not found. Please refresh the page and try again.");
      return;
    }

    generateRandomRentalMutation.mutate({ userId: user.id }, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Random rental history generated successfully!");
        } else {
          toast.error(result.error || "Failed to generate rental history");
        }
      },
      onError: (error) => {
        toast.error("Failed to generate rental history. Please try again.");
        console.error("Error generating rental history:", error);
      }
    });
  };

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Filter rentals based on search term
  const filteredRentals = useMemo(() => {
    if (!rentalHistory) return [];
    
    return rentalHistory.filter(rental => {
      const rentalWithScooter = rental as RentalHistoryWithScooter;
      return (
        rentalWithScooter.start_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rentalWithScooter.end_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rentalWithScooter.scooter?.reference_number && 
         rentalWithScooter.scooter.reference_number.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [rentalHistory, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!rentalHistory || rentalHistory.length === 0) {
      return { totalRides: 0, totalSpent: 0, totalDistance: 0 };
    }

    const totalRides = totalCount || rentalHistory.length;
    const totalSpent = rentalHistory.reduce((sum, rental) => {
      const cost = parseFloat(calculateCost(rental.start_time, rental.end_time).replace('€', ''));
      return sum + cost;
    }, 0);
    
    // Mock distance calculation - in a real app, this would be stored or calculated based on coordinates
    const totalDistance = rentalHistory.reduce((sum) => sum + Math.random() * 5 + 0.5, 0);

    return { totalRides, totalSpent, totalDistance };
  }, [rentalHistory, totalCount]);

  // Show loading state
  if (userLoading || (isLoading && !rentalHistory)) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="text-center rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (userError || error) {
    return (
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {userError?.message || error?.message || "Something went wrong while loading your rental history."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t("stats.totalRides")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalRides}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t("stats.totalDistance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.totalDistance.toFixed(1)} km
            </div>
          </CardContent>
        </Card>

        <Card className="text-center rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t("stats.totalSpent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              €{stats.totalSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder={t("filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedPeriod === "all" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("all")}
                size="sm"
              >
                {t("filters.allTime")}
              </Button>
              <Button 
                variant={selectedPeriod === "month" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("month")}
                size="sm"
              >
                {t("filters.thisMonth")}
              </Button>
              <Button 
                variant={selectedPeriod === "week" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("week")}
                size="sm"
              >
                {t("filters.thisWeek")}
              </Button>
            </div>
          </div>
          
          {/* Generate Random Rental Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateRandomRental}
              disabled={generateRandomRentalMutation.isPending || !user?.id}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              {generateRandomRentalMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  {t("generate.loading")}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t("generate.button")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rental History List */}
      <div className="space-y-4">
        {filteredRentals.length === 0 ? (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t("empty.title")}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? t("empty.description") : t("empty.noRides")}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRentals.map((rental) => {
            const rentalWithScooter = rental as RentalHistoryWithScooter;
            const startDate = formatDate(rentalWithScooter.start_time);
            const startTime = formatTime(rentalWithScooter.start_time);
            const endTime = formatTime(rentalWithScooter.end_time);
            const duration = calculateDuration(rentalWithScooter.start_time, rentalWithScooter.end_time);
            const cost = calculateCost(rentalWithScooter.start_time, rentalWithScooter.end_time);
            const scooterId = rentalWithScooter.scooter?.reference_number || `SC-${rentalWithScooter.scooter_id?.slice(0, 6)}`;
            // Mock distance - in real app, this would be stored in DB or calculated
            const distance = `${(Math.random() * 5 + 0.5).toFixed(1)} km`;

            return (
              <Card key={rental.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left side - Main info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 014 0m6 0a2 2 0 104 0m-4 0a2 2 0 014 0" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {t("ride.rideNumber", { id: rentalWithScooter.id.slice(0, 8) })}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {startDate} • {startTime} - {endTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("ride.route")}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{rentalWithScooter.start_location}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{rentalWithScooter.end_location}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("ride.duration")}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{duration}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("ride.distance")}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{distance}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Cost and actions */}
                    <div className="lg:text-right">
                      <div className="mb-3">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{cost}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("ride.scooter", { id: scooterId })}</p>
                      </div>
                      
                      <div className="flex lg:flex-col gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {t("ride.receipt")}
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          {t("ride.share")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="text-center py-8">
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">{t("loadingMore")}</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {t("loadMore")}
            </Button>
          )}
        </div>
      )}
      
      {/* End of results indicator */}
      {rentalHistory && rentalHistory.length > 0 && !hasNextPage && (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("endOfHistory")}
          </p>
        </div>
      )}

      {/* Export Options */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{t("export.title")}</CardTitle>
          <CardDescription>
            {t("export.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t("export.csv")}
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t("export.pdf")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
