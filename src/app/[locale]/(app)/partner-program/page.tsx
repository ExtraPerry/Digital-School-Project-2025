"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";
import { usePartnerStationsInfinite } from "@/hooks/use-partner-stations-infinite";
import { useInsertPartnerStation } from "@/hooks/use-insert-partner-station";
import { useUpdatePartnerStation } from "@/hooks/use-update-partner-station";
import { useDeletePartnerStation } from "@/hooks/use-delete-partner-station";
import { Tables } from "@/types/supabase/database.types";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

type PartnerStation = Tables<"partner_station">;

// Helper functions for formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Station Form Dialog Component
interface StationFormDialogProps {
  isEdit?: boolean;
  formData: {
    name: string;
    address: string;
    maxSlots: number;
    filledSlots: number;
    isOpen: boolean;
  };
  onInputChange: (field: string, value: string | number | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  t: (key: string) => string;
}

const StationFormDialog: React.FC<StationFormDialogProps> = ({
  isEdit = false,
  formData,
  onInputChange,
  onSave,
  onCancel,
  isLoading,
  t
}) => (
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>{isEdit ? t("editStation.title") : t("addStation.title")}</DialogTitle>
      <DialogDescription>
        {isEdit ? "Update your partner station information" : "Add a new partner station to your network"}
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="stationName">{t("addStation.name")}</Label>
        <Input
          id="stationName"
          placeholder={t("addStation.namePlaceholder")}
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stationAddress">{t("addStation.address")}</Label>
        <Input
          id="stationAddress"
          placeholder={t("addStation.addressPlaceholder")}
          value={formData.address}
          onChange={(e) => onInputChange("address", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxSlots">{t("addStation.maxSlots")}</Label>
          <Input
            id="maxSlots"
            type="number"
            min="1"
            max="20"
            value={formData.maxSlots}
            onChange={(e) => onInputChange("maxSlots", parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filledSlots">{t("addStation.filledSlots")}</Label>
          <Input
            id="filledSlots"
            type="number"
            min="0"
            max={formData.maxSlots}
            value={formData.filledSlots}
            onChange={(e) => onInputChange("filledSlots", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="isOpen"
          type="checkbox"
          checked={formData.isOpen}
          onChange={(e) => onInputChange("isOpen", e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="isOpen">{t("addStation.isOpen")}</Label>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        {t("addStation.cancel")}
      </Button>
      <Button 
        onClick={onSave}
        disabled={!formData.name || !formData.address || isLoading}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        ) : null}
        {isEdit ? t("editStation.save") : t("addStation.save")}
      </Button>
    </DialogFooter>
  </DialogContent>
);

export default function PartnerProgram() {
  const t = useTranslations("PartnerProgram");
  const tMessages = useTranslations("Messages");

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<PartnerStation | null>(null);
  const [deletingStation, setDeletingStation] = useState<PartnerStation | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    maxSlots: 4,
    filledSlots: 0,
    isOpen: true,
  });

  // Get authenticated user
  const { data: user, isLoading: userLoading, error: userError } = useAuthenticatedUser();

  // Check if user has required information
  const userHasRequiredInfo = useMemo(() => {
    if (!user) return false;
    return !!(
      user.first_name && 
      user.last_name && 
      user.email && 
      user.phone && 
      user.address
    );
  }, [user]);

  const missingFields = useMemo(() => {
    if (!user) return [];
    const missing = [];
    if (!user.first_name) missing.push("First Name");
    if (!user.last_name) missing.push("Last Name");
    if (!user.email) missing.push("Email");
    if (!user.phone) missing.push("Phone");
    if (!user.address) missing.push("Address");
    return missing;
  }, [user]);

  // Get partner stations with infinite scroll
  const {
    data: partnerStations,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount
  } = usePartnerStationsInfinite({
    userId: user?.id || "",
    limit: 10,
    enabled: !!user?.id && userHasRequiredInfo
  });

  // Mutations
  const insertStationMutation = useInsertPartnerStation();
  const updateStationMutation = useUpdatePartnerStation();
  const deleteStationMutation = useDeletePartnerStation();

  // Ref for infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  // Filter stations based on search term
  const filteredStations = useMemo(() => {
    if (!partnerStations) return [];
    
    return partnerStations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partnerStations, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!partnerStations || partnerStations.length === 0) {
      return { totalStations: 0, activeStations: 0, totalSlots: 0, occupiedSlots: 0 };
    }

    const totalStations = totalCount || partnerStations.length;
    const activeStations = partnerStations.filter(station => station.is_open).length;
    const totalSlots = partnerStations.reduce((sum, station) => sum + station.max_slots, 0);
    const occupiedSlots = partnerStations.reduce((sum, station) => sum + station.filled_slots, 0);

    return { totalStations, activeStations, totalSlots, occupiedSlots };
  }, [partnerStations, totalCount]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      maxSlots: 4,
      filledSlots: 0,
      isOpen: true,
    });
  };

  // Handle add station
  const handleAddStation = () => {
    if (!user?.id) {
      toast.error("User not found. Please refresh the page and try again.");
      return;
    }

    insertStationMutation.mutate({
      name: formData.name,
      address: formData.address,
      max_slots: formData.maxSlots,
      filled_slots: formData.filledSlots,
      is_open: formData.isOpen,
      user_id: user.id,
    }, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success(tMessages("partnerStationCreated"));
          setIsAddDialogOpen(false);
          resetForm();
        } else {
          toast.error(result.error || tMessages("partnerStationError"));
        }
      },
      onError: (error) => {
        toast.error(tMessages("partnerStationError"));
        console.error("Error creating station:", error);
      }
    });
  };

  // Handle edit station
  const handleEditStation = (station: PartnerStation) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      address: station.address,
      maxSlots: station.max_slots,
      filledSlots: station.filled_slots,
      isOpen: station.is_open,
    });
  };

  // Handle update station
  const handleUpdateStation = () => {
    if (!editingStation || !user?.id) {
      toast.error("Station or user not found. Please try again.");
      return;
    }

    updateStationMutation.mutate({
      stationId: editingStation.id,
      name: formData.name,
      address: formData.address,
      max_slots: formData.maxSlots,
      filled_slots: formData.filledSlots,
      is_open: formData.isOpen,
      user_id: user.id,
    }, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success(tMessages("partnerStationUpdated"));
          setEditingStation(null);
          resetForm();
        } else {
          toast.error(result.error || tMessages("partnerStationError"));
        }
      },
      onError: (error) => {
        toast.error(tMessages("partnerStationError"));
        console.error("Error updating station:", error);
      }
    });
  };

  // Handle delete station
  const handleDeleteStation = () => {
    if (!deletingStation || !user?.id) {
      toast.error("Station or user not found. Please try again.");
      return;
    }

    deleteStationMutation.mutate({
      stationId: deletingStation.id,
      user_id: user.id,
    }, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success(tMessages("partnerStationDeleted"));
          setDeletingStation(null);
        } else {
          toast.error(result.error || tMessages("partnerStationError"));
        }
      },
      onError: (error) => {
        toast.error(tMessages("partnerStationError"));
        console.error("Error deleting station:", error);
      }
    });
  };

  // Show loading state
  if (userLoading || (isLoading && !partnerStations)) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
            {userError?.message || error?.message || "Something went wrong while loading your partner program data."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show required info warning if user does not have complete profile
  if (!userHasRequiredInfo) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl shadow-lg border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-600 dark:text-yellow-400">{t("requiresInfo.title")}</CardTitle>
            <CardDescription>
              {t("requiresInfo.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {t("requiresInfo.missingFields", { fields: missingFields.join(", ") })}
              </p>
            </div>
            <Link href="/settings">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                {t("requiresInfo.redirectButton")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle cancel for both add and edit dialogs
  const handleCancel = (isEdit: boolean) => {
    if (isEdit) {
      setEditingStation(null);
    } else {
      setIsAddDialogOpen(false);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="text-center rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t("stats.totalStations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalStations}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t("stats.activeStations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.activeStations}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t("stats.totalSlots")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalSlots}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t("stats.occupiedSlots")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.occupiedSlots}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stations Management */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{t("stations.title")}</CardTitle>
              <CardDescription>
                {t("stations.description")}
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t("stations.addNew")}
                </Button>
              </DialogTrigger>
              <StationFormDialog 
                isEdit={false}
                formData={formData}
                onInputChange={handleInputChange}
                onSave={handleAddStation}
                onCancel={() => handleCancel(false)}
                isLoading={insertStationMutation.isPending}
                t={t}
              />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder={t("stations.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stations List */}
      <div className="space-y-4">
        {filteredStations.length === 0 ? (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t("empty.title")}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? "No stations match your search criteria." : t("empty.description")}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t("empty.addFirst")}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredStations.map((station) => (
            <Card key={station.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left side - Main info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        station.is_open 
                          ? "bg-green-100 dark:bg-green-900" 
                          : "bg-red-100 dark:bg-red-900"
                      }`}>
                        <svg className={`w-5 h-5 ${
                          station.is_open 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {station.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("stationCard.createdAt")}: {formatDate(station.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("stationCard.address")}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{station.address}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("stationCard.capacityLabel")}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {station.filled_slots}/{station.max_slots} {t("stationCard.slots")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("stationCard.status")}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            station.is_open 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                            {station.is_open ? t("stations.status.open") : t("stations.status.closed")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="lg:text-right">
                    <div className="flex lg:flex-col gap-2">
                      <Dialog open={editingStation?.id === station.id} onOpenChange={(open) => {
                        if (!open) {
                          setEditingStation(null);
                          resetForm();
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleEditStation(station)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {t("stations.actions.edit")}
                          </Button>
                        </DialogTrigger>
                        <StationFormDialog 
                          isEdit={true}
                          formData={formData}
                          onInputChange={handleInputChange}
                          onSave={handleUpdateStation}
                          onCancel={() => handleCancel(true)}
                          isLoading={updateStationMutation.isPending}
                          t={t}
                        />
                      </Dialog>

                      <AlertDialog open={deletingStation?.id === station.id} onOpenChange={(open) => {
                        if (!open) setDeletingStation(null);
                      }}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => setDeletingStation(station)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t("stations.actions.delete")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("deleteStation.title")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("deleteStation.description")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("deleteStation.cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteStation}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleteStationMutation.isPending}
                            >
                              {deleteStationMutation.isPending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              ) : null}
                              {t("deleteStation.confirm")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="text-center py-8">
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading more stations...</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Load More Stations
            </Button>
          )}
        </div>
      )}
      
      {/* End of results indicator */}
      {partnerStations && partnerStations.length > 0 && !hasNextPage && (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You&apos;ve reached the end of your stations list
          </p>
        </div>
      )}
    </div>
  );
}
