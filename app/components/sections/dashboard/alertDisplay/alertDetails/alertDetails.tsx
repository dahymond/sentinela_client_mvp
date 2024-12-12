import { useEffect, useState } from "react";
// import { AlertType } from "../../../../interfaces/interfaces";
import { AlertDetailsProps } from "../../../../interfaces/interfaces";
import { Button } from "../../../../ui/button";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Edit2,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { AdditionalAlertsQueue } from "./additonalAlertQueue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs";
import { Textarea } from "../../../../ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../ui/collapsible";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Separator } from "../../../../ui/separator";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { updatealertsSlice } from "@/store/slices/alertsSlice";
import { isValidDateString, readableSanctionString } from "@/lib/utils";
import { MainAlertQueue } from "./mainAlertQueue";

export function AlertDetails({
  alert,
  onBack,
  onUpdateDisposition,
}: AlertDetailsProps) {
  const { additional_alerts } = useAppSelector((store) => store.alertSlice);
  const dispatch = useAppDispatch();

  const [isJsonExpanded, setIsJsonExpanded] = useState(false);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [isEditingNarrative, setIsEditingNarrative] = useState(false);
  const [editedOverview, setEditedOverview] = useState(
    alert?.details?.dispositionOverview
  );
  const [editedNarrative, setEditedNarrative] = useState(
    alert?.details?.alertNarrative
  );
  const [isCustomerDetailsExpanded, setIsCustomerDetailsExpanded] =
    useState(true);
  const [isWatchlistDetailsExpanded, setIsWatchlistDetailsExpanded] =
    useState(true);

  const [activeAlertIndex, setActiveAlertIndex] = useState<number | null>(null);

  useEffect(() => {
    setEditedOverview(alert?.details?.dispositionOverview);
    setEditedNarrative(alert?.details?.alertNarrative);
  }, [alert?.details]);

  const handleEditOverview = () => {
    setIsEditingOverview(true);
  };

  // IN ACTUALITY, THIS FUNCTION WILL EDIT OVERVIEW ON THE BACKEND
  // AND SAVE TO THE LOG
  const handleSaveOverview = () => {
    const timestamp = new Date().toISOString();
    const newAuditLogEntry = {
      user: "Current User", // Replace with actual user name
      timestamp: timestamp,
      action: "Updated Alert Overview",
      field: "dispositionOverview",
      oldValue: alert.details.dispositionOverview,
      newValue: editedOverview,
    };

    // MOCK AUDIT LOG ENTRY ON DISPOSITION OVERVIEW EDIT
    dispatch(
      updatealertsSlice({
        name: "main_alert",
        value: {
          ...alert,
          details: {
            ...alert.details,
            dispositionOverview: editedOverview,
            auditLog: [newAuditLogEntry, ...alert.details.auditLog],
          },
        },
      })
    );

    setIsEditingOverview(false);
    console.log("Saving updated overview:", editedOverview);
  };

  const handleCancelOverview = () => {
    setEditedOverview(alert?.details?.dispositionOverview);
    setIsEditingOverview(false);
  };

  const handleEditNarrative = () => {
    setIsEditingNarrative(true);
  };

  const handleSaveNarrative = () => {
    const timestamp = new Date().toISOString();
    const newAuditLogEntry = {
      user: "Current User", // Replace with actual user name
      timestamp: timestamp,
      action: "Updated Alert Narrative",
      field: "alertNarrative",
      oldValue: alert?.details?.alertNarrative,
      newValue: editedNarrative,
    };

    // MOCK AUDIT LOG ENTRY ON DISPOSITION OVERVIEW EDIT
    dispatch(
      updatealertsSlice({
        name: "main_alert",
        value: {
          ...alert,
          details: {
            ...alert.details,
            alertNarrative: editedNarrative,
            auditLog: [newAuditLogEntry, ...alert.details.auditLog],
          },
        },
      })
    );

    setIsEditingNarrative(false);
    console.log("Saving updated narrative:", editedNarrative);
  };

  const handleCancelNarrative = () => {
    setEditedNarrative(alert?.details?.alertNarrative);
    setIsEditingNarrative(false);
  };

  const handleExportAlert = () => {
    const selectedAreas = Array.from(
      document.querySelectorAll("select[multiple] option:checked")
    ).map((option: any) => option?.value);
    console.log(`Exporting alert areas: ${selectedAreas.join(", ")}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Back button, Alert Title, Refresh Btn, Areas To Export, Export */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Alerts
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Alert Details
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select areas to export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="customerDetails">
                  Customer Details
                </SelectItem>
                <SelectItem value="watchlistMatch">Watchlist Match</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="auditLog">Audit Log</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportAlert}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* First Section: Basic Sanctions Details */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Alert ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{alert.id}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Customer Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {alert?.details?.customerDetails?.name}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-red-500 h-full rounded-full"
                  style={{ width: `${alert.score}%` }}
                ></div>
              </div>
              <span className="text-lg font-semibold">
                {Number(alert?.score).toFixed(0)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Alert Date and Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-semibold">
              {isValidDateString(alert?.alertDateTime)
                ? new Date(alert?.alertDateTime).toUTCString()
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Section: Few Main Alert details*/}
      <MainAlertQueue
        activeAlertIndex={activeAlertIndex}
        setActiveAlertIndex={setActiveAlertIndex}
      />

      {/* Third Section: Few Additional Alert details*/}
      <AdditionalAlertsQueue
        alerts={additional_alerts}
        activeAlertIndex={activeAlertIndex}
        setActiveAlertIndex={setActiveAlertIndex}
      />

      {/* Forth Section: Alerts Overview Section */}
      <div className="flex justify-end items-center space-x-2 mb-4 mt-10">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center gap-3">
            <TabsList className="">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customerDetails">
                Customer Details
              </TabsTrigger>
              <TabsTrigger value="watchlistMatch">Watchlist Match</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="auditLog">Audit Log</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => onUpdateDisposition("True Positive")}
              >
                True Positive
              </Button>
              <Button
                variant="outline"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => onUpdateDisposition("False Positive")}
              >
                False Positive
              </Button>
              <Button
                variant="outline"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => onUpdateDisposition("Escalated")}
              >
                Escalate
              </Button>
              <Button
                variant="outline"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => onUpdateDisposition("Pending Review")}
              >
                Pending
              </Button>
            </div>
          </div>

          {/* New Tab: Overview */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">
                          Alert Overview
                        </h3>
                        {/* Alert overview edit/non-edit buttons */}
                        {isEditingOverview ? (
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSaveOverview}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelOverview}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEditOverview}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>

                      {isEditingOverview ? (
                        <Textarea
                          value={editedOverview}
                          onChange={(e) => setEditedOverview(e.target.value)}
                          className="w-full h-32"
                        />
                      ) : (
                        <p className="text-gray-600 mb-4">{editedOverview}</p>
                        // <p className="text-gray-600 mb-4">{alert?.details?.dispositionOverview}</p>
                      )}
                      <h4 className="text-md font-semibold mb-2">
                        Watchlist Match
                      </h4>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Source:</span>{" "}
                        {readableSanctionString(alert.sanctions_source) ||
                          alert.sanctions_source}
                      </p>
                      {alert?.details?.watchlistDetails?.notes && (
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Reason:</span>{" "}
                          {alert?.details?.watchlistDetails?.notes}
                        </p>
                      )}
                      <h4 className="text-md font-semibold mt-4 mb-2">
                        Problematic Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {alert?.details?.watchlistDetails?.problematicTags?.map(
                          (tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold  mb-2">
                        Disposition
                      </h3>
                      <p className="text-gray-600 mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            alert.disposition === "Pending Review"
                              ? "bg-yellow-100 text-yellow-800"
                              : alert.disposition === "False Positive"
                              ? "bg-green-100 text-green-800"
                              : alert.disposition === "Escalated"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {alert?.disposition}
                        </span>
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold">
                          Alert Narrative
                        </h4>
                        {isEditingNarrative ? (
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSaveNarrative}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelNarrative}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEditNarrative}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                      {isEditingNarrative ? (
                        <Textarea
                          value={editedNarrative}
                          onChange={(e) => setEditedNarrative(e.target.value)}
                          className="w-full h-32"
                        />
                      ) : (
                        <p className="text-gray-600">{editedNarrative}</p>
                      )}
                    </div>
                  </div>
                  {/* Overview Customer Details and WatchlIst*/}
                  <Card className="mt-6">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Overview customer details */}
                        <Collapsible
                          open={isCustomerDetailsExpanded}
                          onOpenChange={setIsCustomerDetailsExpanded}
                        >
                          <div className="flex jußstify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                              Customer Details
                            </h3>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isCustomerDetailsExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          {/* Overview Customer Details */}
                          <CollapsibleContent>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">Name:</span>{" "}
                              {alert?.details?.customerDetails?.name}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">Address:</span>{" "}
                              {alert?.details?.customerDetails?.address ||
                                "n/a"}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">Citizenship:</span>{" "}
                              {alert?.details?.customerDetails?.citizenship ||
                                "n/a"}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">
                                Country of Residence:
                              </span>{" "}
                              {alert?.details?.customerDetails
                                ?.country_of_residence || "n/a"}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">
                                Date of Birth:
                              </span>{" "}
                              {alert?.details?.customerDetails?.dob || "n/a"}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">ID Number:</span>{" "}
                              {alert?.details?.customerDetails.national_id ||
                                "n/a"}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">
                                Passport Number:
                              </span>{" "}
                              {alert?.details?.customerDetails
                                ?.passport_number || "n/a"}
                            </p>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Overview Watchlist details */}
                        <Collapsible
                          open={isWatchlistDetailsExpanded}
                          onOpenChange={setIsWatchlistDetailsExpanded}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                              Watchlist Details
                            </h3>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isWatchlistDetailsExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>

                          <CollapsibleContent>
                            <p className="text-gray-600 text-sm mb-2">
                              <span className="font-medium">Name:</span>{" "}
                              {alert?.details?.watchlistDetails?.name}
                            </p>
                            {alert?.details?.watchlistDetails?.alias && (
                              <p className="text-gray-600 text-sm mb-2">
                                <span className="font-medium">Alias:</span>{" "}
                                {alert?.details?.watchlistDetails?.alias}
                              </p>
                            )}
                            {alert?.details?.watchlistDetails?.dob && (
                              <p className="text-gray-600 text-sm mb-2">
                                <span className="font-medium">
                                  Date of Birth:
                                </span>{" "}
                                {alert?.details?.watchlistDetails?.dob}
                              </p>
                            )}
                            {alert?.details?.watchlistDetails?.citizenship && (
                              <p className="text-gray-600 text-sm mb-2">
                                <span className="font-medium">
                                  Citizenship:
                                </span>{" "}
                                {alert?.details?.watchlistDetails?.citizenship}
                              </p>
                            )}
                            {alert?.details?.watchlistDetails
                              ?.countryOfResidence && (
                              <p className="text-gray-600 text-sm mb-2">
                                <span className="font-medium">
                                  Country of Residence:
                                </span>{" "}
                                {
                                  alert?.details?.watchlistDetails
                                    ?.countryOfResidence
                                }
                              </p>
                            )}
                            {alert?.details?.watchlistDetails?.source && (
                              <p className="text-gray-600 text-sm mb-2">
                                <span className="font-medium">Source:</span>{" "}
                                {alert?.sanctions_source}
                              </p>
                            )}
                            {alert?.details?.watchlistDetails?.source_url && (
                              <p className="text-gray-600 text-sm mb-2">
                                <span className="font-medium">SourceURL:</span>{" "}
                                {alert?.details?.watchlistDetails?.source_url}
                              </p>
                            )}

                            {alert?.details?.watchlistDetails?.notes && (
                              <p className="text-gray-600 text-sm mb-2">
                                <span className="font-medium">Note:</span>{" "}
                                {alert?.details?.watchlistDetails?.notes}
                              </p>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Tab: Customer Details */}
          <TabsContent value="customerDetails">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Customer Information
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Name:</span>{" "}
                      {alert?.details?.customerDetails?.name}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Address:</span>{" "}
                      {alert?.details?.customerDetails?.address || "n/a"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Citizenship:</span>{" "}
                      {alert?.details?.customerDetails?.citizenship || "n/a"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Country of Residence:</span>{" "}
                      {alert?.details?.customerDetails?.country_of_residence ||
                        "n/a"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {alert?.details?.customerDetails?.dob || "n/a"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">ID Number:</span>{" "}
                      {alert?.details?.customerDetails.national_id || "n/a"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Passport Number:</span>{" "}
                      {alert?.details?.customerDetails?.passport_number ||
                        "n/a"}
                    </p>
                  </div>

                  {/* Customer Details: Entity Enrichment */}
                  <ScrollArea className="flex flex-col text-sm h-[300px]">
                    <h3 className="text-lg font-semibold mb-4">
                      Entity Enrichment
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Name:</span>{" "}
                      {alert?.details?.entityEnrichment?.name}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Email:</span>{" "}
                      {alert?.details?.entityEnrichment?.email}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Previous Address:</span>{" "}
                      {alert?.details?.entityEnrichment?.previous_address}
                    </p>

                    {/* EMPLOYMENT */}
                    <div className="flex flex-col text-gray-600 mb-2 gap-2">
                      <span className="font-medium my-2">Employment(s):</span>{" "}
                      {alert?.details?.entityEnrichment?.employment.map(
                        (eachEmployment, i) => {
                          return (
                            <div
                              key={i}
                              className="flex flex-col gap-3 ml-2 bg-gray-200 p-3 rounded"
                            >
                              <div className="flex flex-col gap-2">
                                {/* title details */}
                                <div className="flex">
                                  Title: {eachEmployment?.title?.name}
                                </div>
                                <div className="flex">
                                  role: {eachEmployment?.title?.role}
                                </div>
                                <div className="flex">
                                  class: {eachEmployment?.title?.class_v2}
                                </div>
                                <div className="flex">
                                  sub-role: {eachEmployment?.title?.sub_role}
                                </div>
                              </div>
                              {/* company details */}
                              <div className="flex flex-col gap-2">
                                <div className="flex">
                                  company name: {eachEmployment?.company?.name}
                                </div>
                                <div className="flex">
                                  company size: {eachEmployment?.company?.name}
                                </div>
                                <div className="flex">
                                  company type: {eachEmployment?.company?.type}
                                </div>
                                <div className="flex">
                                  company founded:{" "}
                                  {eachEmployment?.company?.founded}
                                </div>
                                <div className="flex">
                                  company website:{" "}
                                  {eachEmployment?.company?.website}
                                </div>
                                <div className="flex">
                                  company industry type:{" "}
                                  {eachEmployment?.company?.industry}
                                </div>
                                <div className="flex">
                                  company location:{" "}
                                  {eachEmployment?.company?.location?.name}
                                </div>
                                <div className="flex flex-col gap-2">
                                  company social media:
                                  <div className="flex ml-2">
                                    {eachEmployment?.company?.twitter_url}
                                  </div>
                                  <div className="flex ml-2">
                                    {eachEmployment?.company?.facebook_url}
                                  </div>
                                  <div className="flex ml-2">
                                    {eachEmployment?.company?.linkedin_url}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* EDUCATION */}
                    <div className="text-gray-600 mb-2">
                      <span className="font-medium font-semibold">
                        Education:
                      </span>{" "}
                      {alert?.details?.entityEnrichment?.education.map(
                        (eachEducation, i) => {
                          return (
                            <div
                              key={i}
                              className="flex flex-col gap-3 ml-2 bg-gray-100 p-3 rounded"
                            >
                              <div className="flex flex-col gap-2">
                                {/* school details */}
                                <div className="flex">
                                  Start date: {eachEducation?.start_date}
                                </div>
                                <div className="flex">
                                  End date: {eachEducation?.end_date}
                                </div>
                                <div className="flex">
                                  school name: {eachEducation?.school?.name}
                                </div>
                                <div className="flex">
                                  location:{" "}
                                  {eachEducation?.school?.location.country}
                                </div>
                                <div className="flex">
                                  school linkedin:{" "}
                                  {eachEducation?.school?.linkedin_url}
                                </div>
                                <div className="flex">
                                  school facebook:{" "}
                                  {eachEducation?.school?.facebook_url}
                                </div>
                                <div className="flex">
                                  school twitter:{" "}
                                  {eachEducation?.school?.twitter_url}
                                </div>
                              </div>
                              {/* degree details */}
                              <div className="flex flex-col gap-2">
                                <div className="flex">
                                  degrees: {eachEducation?.degrees?.join(", ")}
                                </div>
                                <div className="flex">
                                  majors: {eachEducation?.majors?.join(", ")}
                                </div>
                                <div className="flex">
                                  summary: {eachEducation?.summary}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    <h4 className="text-md font-semibold mt-4 mb-2">
                      Social Media
                    </h4>
                    <div className="list-disc pl-5">
                      {alert?.details?.entityEnrichment?.social_media?.map(
                        (eachSM) => (
                          <div key={eachSM?.id} className="text-gray-600">
                            <h3>
                              Url: <span>{eachSM?.url}</span>
                            </h3>
                            <h3>
                              Username: <span>{eachSM?.username}</span>
                            </h3>
                            <h3>
                              Url: <span>{eachSM?.network}</span>
                            </h3>
                            {/* {eachSM} */}
                          </div>
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NEW TAB WATCHLIST */}
          <TabsContent value="watchlistMatch">
            <Card>
              <CardContent className="p-6">
                {/* watchlist entity */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Watchlist Entity
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Name:</span>{" "}
                      {alert?.details?.watchlistDetails?.name}
                    </p>
                    {alert?.details?.watchlistDetails?.alias && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Alias:</span>{" "}
                        {alert?.details?.watchlistDetails?.alias}
                      </p>
                    )}
                    {alert?.details?.watchlistDetails?.dob && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Date of Birth:</span>{" "}
                        {alert?.details?.watchlistDetails?.dob}
                      </p>
                    )}
                    {alert?.details?.watchlistDetails?.citizenship && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Citizenship:</span>{" "}
                        {alert?.details?.watchlistDetails?.citizenship}
                      </p>
                    )}
                    {alert?.details?.watchlistDetails?.countryOfResidence && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">
                          Country of Residence:
                        </span>{" "}
                        {alert?.details?.watchlistDetails?.countryOfResidence}
                      </p>
                    )}
                    {alert?.details?.watchlistDetails?.source && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Source:</span>{" "}
                        {alert?.sanctions_source}
                      </p>
                    )}
                    {alert?.details?.watchlistDetails?.source_url && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">SourceURL:</span>{" "}
                        {alert?.details?.watchlistDetails?.source_url}
                      </p>
                    )}

                    {alert?.details?.watchlistDetails?.notes && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Note:</span>{" "}
                        {alert?.details?.watchlistDetails?.notes}
                      </p>
                    )}
                  </div>
                  {/* Watchlist Additional Informatiion */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Additional Information
                    </h3>
                    {/* <h4 className="text-md font-semibold mb-2">Emails</h4>
                    <ul className="list-disc pl-5 mb-4">
                      {alert?.details?.watchlistDetails?.emails?.map(
                        (email, index) => (
                          <li key={index} className="text-gray-600">
                            {email || "N/A"}
                          </li>
                        )
                      )}
                    </ul> */}
                    <h4 className="text-sm  mb-2">
                      <span className="font-semibold">Addresses</span>
                      <span className="list-disc pl-5 mb-4">
                        {`${alert?.details?.watchlistDetails?.location} | ${alert?.details?.watchlistDetails?.citizenship}`}
                      </span>
                    </h4>
                    <h4 className="text-sm  mb-2">
                      <span className="font-semibold">Phone Numbers</span>
                      <span className="list-disc pl-5 mb-4">
                        {`${alert?.details?.watchlistDetails?.phone || "N/A"}`}
                      </span>
                    </h4>
                  </div>
                </div>
                {/* watchlist json */}
                <div className="mt-6">
                  <Collapsible
                    open={isJsonExpanded}
                    onOpenChange={setIsJsonExpanded}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-semibold mb-2">
                        Watchlist JSON
                      </h4>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          {isJsonExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <span className="sr-only">Toggle Watchlist JSON</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="mt-2">
                      <ScrollArea className="h-[200px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          {JSON.stringify(
                            alert?.details?.watchlistDetails,
                            null,
                            2
                          )}
                        </pre>
                      </ScrollArea>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-semibold mb-2">
                      Applicable Regulations
                    </h4>
                    <p className="text-gray-600">
                      {alert?.details?.documentation?.applicableRegulations}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2">
                      Reference Documents
                    </h4>
                    {/* <ul className="list-disc pl-5">
                      {alert.details.documentation.referenceDocuments
                        .split(", ")
                        .map((doc, index) => (
                          <li
                            key={index}
                            className="text-blue-600 hover:underline"
                          >
                            <a href="#">{doc}</a>
                          </li>
                        ))}
                    </ul> */}
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2">
                      Evidence Links
                    </h4>
                    <ul className="list-disc pl-5">
                      <li className="text-blue-600 hover:underline">
                        <a href="#">Transaction History</a>
                      </li>
                      <li className="text-blue-600 hover:underline">
                        <a href="#">Customer Profile</a>
                      </li>
                      <li className="text-blue-600 hover:underline">
                        <a href="#">Watchlist Match Details</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2">
                      Additional Notes
                    </h4>
                    <p className="text-gray-600">
                      {alert?.details?.documentation?.additionalNotes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auditLog">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Audit Log</h3>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  {alert?.details?.auditLog?.map((entry, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <p className="text-sm text-gray-500">{entry.timestamp}</p>
                      <p className="font-medium">{entry.user}</p>
                      <p className="text-gray-600">{entry.action}</p>
                      {entry.field && (
                        <p className="text-sm text-gray-600">
                          Field: {entry.field}
                          {entry.oldValue && entry.newValue && (
                            <span>
                              {" "}
                              {`- Changed from "{entry.oldValue}" to "{entry.newValue}"`}
                            </span>
                          )}
                        </p>
                      )}
                      {index < Number(alert?.details?.auditLog?.length) - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
