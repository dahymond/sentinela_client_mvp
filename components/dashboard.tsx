'use client'

import { useState } from 'react'
import { AlertCircle, BarChart3, FileText, Settings, Shield, Users, Search, Upload, Menu, X, Download, Filter, ArrowUpDown, AlertTriangle, RefreshCw, ArrowLeft, ChevronDown, ChevronUp, Edit2, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"

interface AlertDetailsProps {
  alert: AlertType;
  onBack: () => void;
  onUpdateDisposition: (disposition: string) => void;
  setAlert: (updatedAlert: AlertType) => void;
  allAlerts: AlertType[];
}

interface AlertType {
  id: string;
  name: string;
  match: string;
  disposition: string;
  score: number;
  alertDateTime: string;
  details: {
    customerDetails: {
      address: string;
      country: string;
      dob: string;
      idNumber: string;
    };
    entityEnrichment: {
      email: string;
      previousAddress: string;
      employment: string;
      socialMedia: string[];
      education: string;
    };
    watchlistEntity: {
      location: string;
      reason: string;
      source: string;
      problematicTags: string[];
    };
    rawWatchlist: {
      name: string;
      dob: string;
      nationality: string;
      source: string;
      reason: string;
      nil: string;
      emails: string[];
      addresses: string[];
      phones: string[];
    };
    dispositionOverview: string;
    alertNarrative: string;
    documentation: {
      applicableRegulations: string;
      referenceDocuments: string;
      additionalNotes: string;
    };
    auditLog: Array<{
      user: string;
      timestamp: string;
      action: string;
      field?: string;
      oldValue?: string;
      newValue?: string;
    }>;
  };
  additionalAlertsCount: number;
}

function AdditionalAlertsQueue({ alerts, onSelectAlert }: { alerts: AlertType[], onSelectAlert: (alert: AlertType) => void }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Additional Alerts for This Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectAlert({...alert, additionalAlertsCount: alerts.length - 1})}
            >
              <span>Alert ID: {alert.id}</span>
              <span>Watchlist Match: {alert.match}</span>
              <span>Risk Score: {alert.score}</span>
              <span>Alert Date: {alert.alertDateTime}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AlertDetails({ alert, onBack, onUpdateDisposition, setAlert, allAlerts }: AlertDetailsProps) {
  const [isJsonExpanded, setIsJsonExpanded] = useState(false)
  const [isEditingOverview, setIsEditingOverview] = useState(false)
  const [isEditingNarrative, setIsEditingNarrative] = useState(false)
  const [editedOverview, setEditedOverview] = useState(alert.details.dispositionOverview)
  const [editedNarrative, setEditedNarrative] = useState(alert.details.alertNarrative)
  const [isCustomerDetailsExpanded, setIsCustomerDetailsExpanded] = useState(true);
  const [isWatchlistDetailsExpanded, setIsWatchlistDetailsExpanded] = useState(true);

  const additionalAlerts = allAlerts.filter(a => 
    a.id !== alert.id && 
    (a.name === alert.name || a.details.customerDetails.idNumber === alert.details.customerDetails.idNumber)
  ).concat([
    {
      ...alert,
      id: '987654321',
      match: 'EU Sanctions List',
      disposition: 'Pending Review',
      score: 65,
      alertDateTime: '2023-06-01 10:30 AM',
      additionalAlertsCount: 2,
      details: {
        ...alert.details,
        watchlistEntity: {
          location: 'Brussels, Belgium',
          reason: 'Financial Sanctions',
          source: 'EU Sanctions List',
          problematicTags: ['Financial Crime', 'Money Laundering']
        },
        rawWatchlist: {
          ...alert.details.rawWatchlist,
          name: `${alert.name} (EU)`,
          nationality: 'Belgian',
          source: 'EU',
          reason: 'Financial Sanctions'
        },
        dispositionOverview: `${alert.name} has been identified on the EU Sanctions List for potential involvement in financial crimes.`,
        alertNarrative: `This alert was generated due to a match with the EU Sanctions List. The individual shares the same name and similar identifying information with a person sanctioned for financial crimes. Further investigation is required to confirm the match and determine appropriate action.`
      }
    },
    {
      ...alert,
      id: '876543210',
      match: 'Interpol Red Notice',
      disposition: 'False Positive',
      score: 40,
      alertDateTime: '2023-05-28 02:15 PM',
      additionalAlertsCount: 2,
      details: {
        ...alert.details,
        watchlistEntity: {
          location: 'Global',
          reason: 'International Warrant',
          source: 'Interpol Red Notice',
          problematicTags: ['Fugitive', 'Fraud']
        },
        rawWatchlist: {
          ...alert.details.rawWatchlist,
          name: `${alert.name} (Interpol)`,
          nationality: 'Unknown',
          source: 'Interpol',
          reason: 'International Warrant'
        },
        dispositionOverview: `${alert.name} was initially flagged due to a name match with an individual on Interpol's Red Notice list.`,
        alertNarrative: `This alert was triggered by a name similarity with an individual on Interpol's Red Notice list. After thorough investigation, it was determined that this is a false positive. The date of birth, nationality, and other identifying information do not match the listed individual.`
      }
    }
  ]);

  const handleEditOverview = () => {
    setIsEditingOverview(true)
  }

  const handleSaveOverview = () => {
    const timestamp = new Date().toISOString();
    const newAuditLogEntry = {
      user: "Current User", // Replace with actual user name
      timestamp: timestamp,
      action: "Updated Alert Overview",
      field: "dispositionOverview",
      oldValue: alert.details.dispositionOverview,
      newValue: editedOverview
    };

    setAlert({
      ...alert,
      details: {
        ...alert.details,
        dispositionOverview: editedOverview,
        auditLog: [newAuditLogEntry, ...alert.details.auditLog]
      }
    });

    setIsEditingOverview(false)
    console.log('Saving updated overview:', editedOverview)
  }

  const handleCancelOverview = () => {
    setEditedOverview(alert.details.dispositionOverview)
    setIsEditingOverview(false)
  }

  const handleEditNarrative = () => {
    setIsEditingNarrative(true)
  }

  const handleSaveNarrative = () => {
    const timestamp = new Date().toISOString();
    const newAuditLogEntry = {
      user: "Current User", // Replace with actual user name
      timestamp: timestamp,
      action: "Updated Alert Narrative",
      field: "alertNarrative",
      oldValue: alert.details.alertNarrative,
      newValue: editedNarrative
    };

    setAlert({
      ...alert,
      details: {
        ...alert.details,
        alertNarrative: editedNarrative,
        auditLog: [newAuditLogEntry, ...alert.details.auditLog]
      }
    });

    setIsEditingNarrative(false)
    console.log('Saving updated narrative:', editedNarrative)
  }

  const handleCancelNarrative = () => {
    setEditedNarrative(alert.details.alertNarrative)
    setIsEditingNarrative(false)
  }

  const handleExportAlert = () => {
    const selectedAreas = Array.from(document.querySelectorAll('select[multiple] option:checked')).map(option => option.value);
    console.log(`Exporting alert areas: ${selectedAreas.join(', ')}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Alerts
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">Alert Details</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <div className="flex items-center space-x-2">
            <Select multiple>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select areas to export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="customerDetails">Customer Details</SelectItem>
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

      <div className="grid grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Alert ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{alert.id}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Customer Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{alert.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-red-500 h-full rounded-full"
                  style={{ width: `${alert.score}%` }}
                ></div>
              </div>
              <span className="text-lg font-semibold">{alert.score}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Alert Date and Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{alert.alertDateTime}</p>
          </CardContent>
        </Card>
      </div>

      <AdditionalAlertsQueue alerts={additionalAlerts} onSelectAlert={(selectedAlert) => {
        setAlert(selectedAlert);
        setIsEditingOverview(false);
        setIsEditingNarrative(false);
        setEditedOverview(selectedAlert.details.dispositionOverview);
        setEditedNarrative(selectedAlert.details.alertNarrative);
      }} />

      <div className="flex justify-end space-x-2 mb-4">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customerDetails">Customer Details</TabsTrigger>
              <TabsTrigger value="watchlistMatch">Watchlist Match</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="auditLog">Audit Log</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800" onClick={() => onUpdateDisposition('True Positive')}>True Positive</Button>
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800" onClick={() => onUpdateDisposition('False Positive')}>False Positive</Button>
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800" onClick={() => onUpdateDisposition('Escalated')}>Escalate</Button>
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800" onClick={() => onUpdateDisposition('Pending Review')}>Pending</Button>
            </div>
          </div>
          <TabsContent value="overview">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Alert Overview</h3>
                        {isEditingOverview ? (
                          <div>
                            <Button variant="ghost" size="sm" onClick={handleSaveOverview}>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleCancelOverview}>
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={handleEditOverview}>
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
                      )}
                      <h4 className="text-md font-semibold mb-2">Watchlist Match</h4>
                      <p className="text-gray-600 mb-2"><span className="font-medium">Source:</span> {alert.match}</p>
                      <p className="text-gray-600 mb-2"><span className="font-medium">Reason:</span> {alert.details.watchlistEntity.reason}</p>
                      <h4 className="text-md font-semibold mt-4 mb-2">Problematic Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {alert.details.watchlistEntity.problematicTags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold  mb-2">Disposition</h3>
                      <p className="text-gray-600 mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            alert.disposition === 'Pending Review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : alert.disposition === 'False Positive'
                              ? 'bg-green-100 text-green-800'
                              : alert.disposition ===   'Escalated'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alert.disposition}
                        </span>
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold">Alert Narrative</h4>
                        {isEditingNarrative ? (
                          <div>
                            <Button variant="ghost" size="sm" onClick={handleSaveNarrative}>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleCancelNarrative}>
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={handleEditNarrative}>
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
                  <Card className="mt-6">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <Collapsible
                          open={isCustomerDetailsExpanded}
                          onOpenChange={setIsCustomerDetailsExpanded}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">Customer Details</h3>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isCustomerDetailsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Name:</span> {alert.name}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Address:</span> {alert.details.customerDetails.address}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Country:</span> {alert.details.customerDetails.country}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Date of Birth:</span> {alert.details.customerDetails.dob}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">ID Number:</span> {alert.details.customerDetails.idNumber}</p>
                          </CollapsibleContent>
                        </Collapsible>
                        <Collapsible
                          open={isWatchlistDetailsExpanded}
                          onOpenChange={setIsWatchlistDetailsExpanded}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">Watchlist Details</h3>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isWatchlistDetailsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Name:</span> {alert.details.rawWatchlist.name}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Date of Birth:</span> {alert.details.rawWatchlist.dob}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Nationality:</span> {alert.details.rawWatchlist.nationality}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Source:</span> {alert.details.rawWatchlist.source}</p>
                            <p className="text-gray-600 mb-2"><span className="font-medium">Reason:</span> {alert.details.rawWatchlist.reason}</p>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customerDetails">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Name:</span> {alert.name}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Address:</span> {alert.details.customerDetails.address}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Country:</span> {alert.details.customerDetails.country}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Date of Birth:</span> {alert.details.customerDetails.dob}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">ID Number:</span> {alert.details.customerDetails.idNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Entity Enrichment</h3>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Email:</span> {alert.details.entityEnrichment.email}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Previous Address:</span> {alert.details.entityEnrichment.previousAddress}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Employment:</span> {alert.details.entityEnrichment.employment}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Education:</span> {alert.details.entityEnrichment.education}</p>
                    <h4 className="text-md font-semibold mt-4 mb-2">Social Media</h4>
                    <ul className="list-disc pl-5">
                      {alert.details.entityEnrichment.socialMedia.map((link, index) => (
                        <li key={index} className="text-gray-600">{link}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlistMatch">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Watchlist Entity</h3>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Name:</span> {alert.details.rawWatchlist.name}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Date of Birth:</span> {alert.details.rawWatchlist.dob}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Nationality:</span> {alert.details.rawWatchlist.nationality}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Source:</span> {alert.details.rawWatchlist.source}</p>
                    <p className="text-gray-600 mb-2"><span className="font-medium">Reason:</span> {alert.details.rawWatchlist.reason}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <h4 className="text-md font-semibold mb-2">Emails</h4>
                    <ul className="list-disc pl-5 mb-4">
                      {alert.details.rawWatchlist.emails.map((email, index) => (
                        <li key={index} className="text-gray-600">{email || 'N/A'}</li>
                      ))}
                    </ul>
                    <h4 className="text-md font-semibold mb-2">Addresses</h4>
                    <ul className="list-disc pl-5 mb-4">
                      {alert.details.rawWatchlist.addresses.map((address, index) => (
                        <li key={index} className="text-gray-600">{address}</li>
                      ))}
                    </ul>
                    <h4 className="text-md font-semibold mb-2">Phone Numbers</h4>
                    <ul className="list-disc pl-5">
                      {alert.details.rawWatchlist.phones.map((phone, index) => (
                        <li key={index} className="text-gray-600">{phone || 'N/A'}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Collapsible
                    open={isJsonExpanded}
                    onOpenChange={setIsJsonExpanded}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-semibold mb-2">Watchlist JSON</h4>
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
                          {JSON.stringify(alert.details.rawWatchlist, null, 2)}
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
                    <h4 className="text-md font-semibold mb-2">Applicable Regulations</h4>
                    <p className="text-gray-600">{alert.details.documentation.applicableRegulations}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2">Reference Documents</h4>
                    <ul className="list-disc pl-5">
                      {alert.details.documentation.referenceDocuments.split(', ').map((doc, index) => (
                        <li key={index} className="text-blue-600 hover:underline">
                          <a href="#">{doc}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2">Evidence Links</h4>
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
                    <h4 className="text-md font-semibold mb-2">Additional Notes</h4>
                    <p className="text-gray-600">{alert.details.documentation.additionalNotes}</p>
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
                  {alert.details.auditLog.map((entry, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <p className="text-sm text-gray-500">{entry.timestamp}</p>
                      <p className="font-medium">{entry.user}</p>
                      <p className="text-gray-600">{entry.action}</p>
                      {entry.field && (
                        <p className="text-sm text-gray-600">
                          Field: {entry.field}
                          {entry.oldValue && entry.newValue && (
                            <span> - Changed from "{entry.oldValue}" to "{entry.newValue}"</span>
                          )}
                        </p>
                      )}
                      {index < alert.details.auditLog.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export function DashboardComponent() {
  const TOTAL_ALLOWED_SCREENINGS = 1000; // Hypothetical total number of screenings allowed
  const initialQueueData = [
    {
      id: '123456789',
      name: 'John Doe',
      match: 'OFAC SDN List',
      disposition: 'True Positive',
      score: 95,
      alertDateTime: '2023-05-05 09:00 AM',
      additionalAlertsCount: 2,
      details: {
        customerDetails: {
          address: '123 Main St, Anytown USA',
          country: 'United States',
          dob: '01/01/1980',
          idNumber: '12345678'
        },
        entityEnrichment: {
          email: 'john.doe@example.com',
          previousAddress: '456 Oak St, Othertown USA',
          employment: 'Acme Corp',
          socialMedia: [
            'https://twitter.com/johndoe',
            'https://linkedin.com/in/johndoe'
          ],
          education: 'University of Anytown, 2002, Bachelor\'s in Business'
        },
        watchlistEntity: {
          location: 'Anytown, USA',
          reason: 'Sanctions Violation',
          source: 'OFAC SDN List',
          problematicTags: ['Terrorism', 'Financial Crime']
        },
        rawWatchlist: {
          name: "Usama bin Muhammad bin Awad BIN LADIN",
          dob: "1957-03-10",
          nationality: "Saudi Arabian",
          source: "OFAC",
          reason: "Terrorism",
          nil: "",
          emails: [""],
          addresses: ["123 Main St, Anytown USA"],
          phones: ["+1 555 123 4567"]
        },
        dispositionOverview: "The customer is a true match based on matched PII identifiers to SDN entity \"Usama bin Muhammad bin Awad BIN LADIN\". The customer's name \"John Doe\" closely matches the SDN entity's name \"Usama bin Ladin\" with an 85% fuzzy matching logic. Additionally, the customer's date of birth and nationality align with the SDN entity's information.",
        alertNarrative: "The customer, identified as John Doe, shares a significant resemblance in name to the SDN entity \"Usama bin Muhammad bin Awad BIN LADIN\". Both individuals have a common birthplace in Saudi Arabia, further solidifying the match. The customer's date of birth and nationality also correspond to the SDN entity's details, indicating a high likelihood of a true positive match. In conclusion, based on the close alignment of the customer's name, date of birth, and nationality with the SDN entity's information, the disposition of True Positive is recommended with a high risk score of 95.",
        documentation: {
          applicableRegulations: "OFAC Sanctions, Anti-Money Laundering (AML) regulations",
          referenceDocuments: "OFAC SDN List, Customer Due Diligence (CDD) Policy",
          additionalNotes: "The customer's transactions and activities should be closely monitored for any suspicious behavior or potential violations."
        },
        auditLog: [
          { user: "Jane Doe", timestamp: "2023-05-07 10:30 AM", action: "Marked as True Positive", field: "disposition", oldValue: "Pending Review", newValue: "True Positive" },
          { user: "John Smith", timestamp: "2023-05-06 3:45 PM", action: "Escalated to Compliance", field: "disposition", oldValue: "Pending Review", newValue: "Escalated" },
          { user: "Sarah Lee", timestamp: "2023-05-05 9:20 AM", action: "Initial Review Completed", field: "disposition", oldValue: null, newValue: "Pending Review" },
          { user: "System", timestamp: "2023-05-05 9:00 AM", action: "Alert Created" }
        ]
      }
    },
    {
      id: '234567890',
      name: 'Jane Smith',
      match: 'UN Consolidated List',
      disposition: 'False Positive',
      score: 25,
      alertDateTime: '2023-05-08 09:00 AM',
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '789 Elm St, Somewhere USA',
          country: 'United States',
          dob: '15/05/1985',
          idNumber: '87654321'
        },
        entityEnrichment: {
          email: 'jane.smith@example.com',
          previousAddress: '101 Pine St, Elsewhere USA',
          employment: 'Tech Innovations Inc.',
          socialMedia: [
            'https://twitter.com/janesmith',
            'https://linkedin.com/in/janesmith'
          ],
          education: 'State University, 2007, Master\'s in Computer Science'
        },
        watchlistEntity: {
          location: 'Somewhere, USA',
          reason: 'Name Similarity',
          source: 'UN Consolidated List',
          problematicTags: ['Financial Crime']
        },
        rawWatchlist: {
          name: "Jane Smithson",
          dob: "1975-08-22",
          nationality: "Canadian",
          source: "UN",
          reason: "Financial Sanctions",
          nil: "",
          emails: [""],
          addresses: ["456 Maple Ave, Toronto, Canada"],
          phones: ["+1 416 555 7890"]
        },
        dispositionOverview: "After thorough investigation, it has been determined that the customer Jane Smith is not the same individual as Jane Smithson on the UN Consolidated List. Despite the name similarity, there are significant differences in date of birth, nationality, and known addresses.",
        alertNarrative: "The initial match was triggered due to the similarity between the names Jane Smith and Jane Smithson. However, upon closer examination, several key differences were identified. The customer's date of birth (15/05/1985) does not match the listed individual's (22/08/1975). Furthermore, the customer is a U.S. citizen, while the listed individual is Canadian. The addresses and other identifying information also do not correspond. Given these discrepancies, this case is concluded to be a false positive.",
        documentation: {
          applicableRegulations: "UN Sanctions List, Know Your Customer (KYC) guidelines",
          referenceDocuments: "UN Consolidated List, Customer Identification Program (CIP) Policy",
          additionalNotes: "While this case is a false positive, it demonstrates the importance of thorough due diligence in name matching cases."
        },
        auditLog: [
          { user: "Mike Johnson", timestamp: "2023-05-10 2:15 PM", action: "Marked as False Positive", field: "disposition", oldValue: "Pending Review", newValue: "False Positive" },
          { user: "Emily Brown", timestamp: "2023-05-09 11:20 AM", action: "Additional Verification Completed" },
          { user: "David Wilson", timestamp: "2023-05-08 9:45 AM", action: "Initial Review Started"           },
          { user: "System", timestamp: "2023-05-08 9:00 AM", action: "Alert Created" }
        ]
      }
    },
    {
      id: '345678901',
      name: 'Michael Johnson',
      match: 'OFAC SDN List',
      disposition: 'Escalated',
      score: 75,
      alertDateTime: '2023-05-11 09:00 AM',
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '246 Oak Ave, Metropolis USA',
          country: 'United States',
          dob: '03/15/1978',
          idNumber: '23456789'
        },
        entityEnrichment: {
          email: 'michael.johnson@example.com',
          previousAddress: '135 Birch Ln, Smallville USA',
          employment: 'Global Traders Co.',
          socialMedia: [
            'https://twitter.com/mjohnson',
            'https://linkedin.com/in/michaeljohnson'
          ],
          education: 'City College, 2000, Bachelor\'s in International Business'
        },
        watchlistEntity: {
          location: 'Unknown',
          reason: 'Potential Sanctions Evasion',
          source: 'OFAC SDN List',
          problematicTags: ['Sanctions Evasion']
        },
        rawWatchlist: {
          name: "Michael Johnson",
          dob: "1978-03-15",
          nationality: "Unknown",
          source: "OFAC",
          reason: "Suspected sanctions evasion activities",
          nil: "",
          emails: ["mjohnson@globaltrade.com"],
          addresses: ["Unknown"],
          phones: [""]
        },
        dispositionOverview: "The customer Michael Johnson shares identical name and date of birth with an individual on the OFAC SDN List. However, due to limited information on the listed individual's location and other identifiers, further investigation is required to confirm or rule out the match.",
        alertNarrative: "The alert was triggered due to an exact match on both name and date of birth between the customer and an OFAC SDN List entry. The listed individual is suspected of involvement in sanctions evasion activities. While these key identifiers match, there is limited additional information available on the SDN entry to conclusively confirm or deny the match. Given the severity of the potential match and the need for additional investigation, this case has been escalated for further review and possible reporting to relevant authorities.",
        documentation: {
          applicableRegulations: "OFAC Sanctions, Bank Secrecy Act (BSA), Anti-Money Laundering (AML) regulations",
          referenceDocuments: "OFAC SDN List, Enhanced Due Diligence (EDD) Procedures, Suspicious Activity Reporting (SAR) Guidelines",
          additionalNotes: "Immediate account restrictions have been applied pending the outcome of the escalated review. Any attempted transactions should be carefully scrutinized and may require additional approvals."
        },
        auditLog: [
          { user: "Alex Turner", timestamp: "2023-05-12 4:30 PM", action: "Escalated to Senior Compliance Team", field: "disposition", oldValue: "Pending Review", newValue: "Escalated" },
          { user: "Sophia Lee", timestamp: "2023-05-12 2:10 PM", action: "Additional Research Conducted" },
          { user: "Chris Martinez", timestamp: "2023-05-11 10:05 AM", action: "Initial Match Identified" },
          { user: "System", timestamp: "2023-05-11 9:00 AM", action: "Alert Created" }
        ]
      }
    },
    {
      id: '456789012',
      name: 'Emily Davis',
      match: 'EU Sanctions List',
      disposition: 'Pending Review',
      score: 60,
      alertDateTime: '2023-05-13 09:00 AM',
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '369 Maple Dr, Lakeside USA',
          country: 'United States',
          dob: '11/22/1982',
          idNumber: '34567890'
        },
        entityEnrichment: {
          email: 'emily.davis@example.com',
          previousAddress: '753 Cedar St, Riverside USA',
          employment: 'International Consulting Group',
          socialMedia: [
            'https://twitter.com/emilydavis',
            'https://linkedin.com/in/emilydavis'
          ],
          education: 'Coastal University, 2004, Master\'s in International Relations'
        },
        watchlistEntity: {
          location: 'London, UK',
          reason: 'Financial Sanctions',
          source: 'EU Sanctions List',
          problematicTags: ['Financial Crime', 'Sanctions Evasion']
        },
        rawWatchlist: {
          name: "Emily Davis-Smith",
          dob: "1982-11-22",
          nationality: "British",
          source: "EU",
          reason: "Association with sanctioned entities",
          nil: "",
          emails: ["e.davis@intlconsult.co.uk"],
          addresses: ["10 Downing Street, London, UK"],
          phones: ["+44 20 1234 5678"]
        },
        dispositionOverview: "The customer Emily Davis has a name and date of birth match with Emily Davis-Smith on the EU Sanctions List. While there are similarities, there are also notable differences in nationality and known addresses. Further investigation is needed to determine if this is the same individual.",
        alertNarrative: "This alert was generated due to matching name and date of birth between the customer and an individual on the EU Sanctions List. The listed individual, Emily Davis-Smith, is associated with sanctioned entities. While the core identifiers match, there are discrepancies in the nationality (US vs. British) and known addresses. The customer's employment in international consulting raises the possibility of a connection, but it's not conclusive. Given the potential severity of the match and the need for additional verification, this case is pending a more thorough review to either confirm the match or rule it out as a false positive.",
        documentation: {
          applicableRegulations: "EU Financial Sanctions, OFAC Secondary Sanctions, Anti-Money Laundering (AML) regulations",
          referenceDocuments: "EU Sanctions List, Enhanced Due Diligence (EDD) Procedures, Cross-Border Transaction Monitoring Guidelines",
          additionalNotes: "Temporary transaction limits have been imposed on the account while the review is pending. Any international transactions or consulting fees should be scrutinized closely."
        },
        auditLog: [
          { user: "Rachel Green", timestamp: "2023-05-14 3:45 PM", action: "Initiated Enhanced Due Diligence" },
          { user: "Ross Geller", timestamp: "2023-05-14 11:30 AM", action: "Flagged for Additional Review" },
          { user: "Chandler Bing", timestamp: "2023-05-13 9:15 AM", action: "Initial Alert Generated" },
          { user: "System", timestamp: "2023-05-13 9:00 AM", action: "Alert Created" }
        ]
      }
    },
    {
      id: '567890123',
      name: 'David Wilson',
      match: 'OFAC SDN List',
      disposition: 'True Positive',
      score: 90,
      alertDateTime: '2023-05-15 09:00 AM',
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '159 Pine St, Hilltop USA',
          country: 'United States',
          dob: '07/04/1976',
          idNumber: '45678901'
        },
        entityEnrichment: {
          email: 'david.wilson@example.com',
          previousAddress: '753 Spruce Ave, Valley USA',
          employment: 'Worldwide Shipping LLC',
          socialMedia: [
            'https://twitter.com/davidwilson',
            'https://linkedin.com/in/davidwilson'
          ],
          education: 'National University, 1998, Bachelor\'s  in Maritime  Studies'
        },
        watchlistEntity: {
          location: 'Various',
          reason: 'Proliferation Financing',
          source: 'OFAC SDN List',
          problematicTags: ['Terrorism', 'Proliferation Financing']
        },
        rawWatchlist: {
          name:  "David A. Wilson",
          dob: "1976-07-04",
          nationality: "United States",
          source: "OFAC",
          reason: "Involvement in proliferation financing networks",
          nil: "",
          emails: ["d.wilson@worldwideship.com"],
          addresses: ["Various locations in  USA, Singapore, and Panama"],
          phones: ["+1 555 0123 4567", "+65 6789 0123"]
        },
        dispositionOverview: "The customer David Wilson is confirmed to be a true match with David A. Wilson on the OFAC SDN List. Multiple identifiers including name, date of birth, nationality, and business associations align closely with the listed individual.",
        alertNarrative: "This case has been confirmed as a True Positive match. The customer, David Wilson, matches the OFAC SDN List entry for David A. Wilson across multiple key identifiers. The date of birth (07/04/1976) is an exact match. The customer's employment in Worldwide Shipping LLC aligns with the listed individual's involvement in global shipping networks suspected of proliferation financing. Additional research has uncovered links between the customer's known addresses and those associated with the SDN entry. The high risk score of 90 reflects the strength of this match and the severity of the associated activities. Given the confirmation of this match, immediate action is required in accordance with OFAC regulations.",
        documentation: {
          applicableRegulations: "OFAC Sanctions, Counter Proliferation Financing (CPF) regulations, Specially Designated Nationals (SDN) compliance requirements",
          referenceDocuments: "OFAC SDN List, Maritime Sanctions Advisory, Proliferation Financing Typologies",
          additionalNotes: "Immediate account freeze and reporting to relevant authorities is required. All past transactions should be reviewed for potential sanctions violations."
        },
        auditLog: [
          {  user: "Monica Geller", timestamp: "2023-05-16 5:00 PM", action: "Confirmed True Positive Match", field: "disposition", oldValue: "Escalated", newValue: "True Positive" },
          { user: "Phoebe Buffay", timestamp: "2023-05-16 2:30 PM", action: "Completed In-Depth Investigation" },
          { user: "Joey Tribbiani", timestamp: "2023-05-15 10:45 AM", action: "Escalated for Urgent Review", field: "disposition", oldValue: "Pending Review", newValue: "Escalated" },
          { user: "System", timestamp: "2023-05-15 9:00 AM", action: "Alert Created" }
        ]
      }
    },
    {
      id: '678901234',
      name: 'Sarah Johnson',
      match: 'UN Sanctions List',
      disposition: 'Pending Review',
      score: 70,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '123 Main St, Anytown, USA',
          country: 'United States',
          dob: '01/15/1990',
          idNumber: '987654321'
        },
        entityEnrichment: {
          email: 'sarah.johnson@email.com',
          previousAddress: '456 Oak Ave, Anytown, USA',
          employment: 'XYZ Corp',
          socialMedia: [],
          education: 'University of Anytown, 2012'
        },
        watchlistEntity: {
          location: 'New York, USA',
          reason: 'Potential Financial Crime',
          source: 'UN Sanctions List',
          problematicTags: ['Money Laundering', 'Fraud']
        },
        rawWatchlist: {
          name: 'Sarah Jane Johnson',
          dob: '1990-01-15',
          nationality: 'American',
          source: 'UN',
          reason: 'Financial Sanctions',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer shares a similar name with an individual on the UN Sanctions List. Further investigation is needed to determine if this is a true positive.',
        alertNarrative: 'The alert was triggered due to a name similarity between the customer and an individual on the UN Sanctions List.  Additional information is needed to confirm or deny the match.',
        documentation: {
          applicableRegulations: 'UN Sanctions, AML Regulations',
          referenceDocuments: 'UN Sanctions List, KYC Policy',
          additionalNotes: 'Pending further review.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '789012345',
      name: 'Robert Chen',
      match: 'EU Sanctions List',
      disposition: 'False Positive',
      score: 30,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '789 Elm St, Shanghai, China',
          country: 'China',
          dob: '05/20/1985',
          idNumber: '111222333'
        },
        entityEnrichment: {
          email: 'robert.chen@email.com',
          previousAddress: '101 Pine St, Shanghai, China',
          employment: 'Tech Company',
          socialMedia: ['https://www.linkedin.com/in/robertchen'],
          education: 'University of Shanghai, 2007'
        },
        watchlistEntity: {
          location: 'Shanghai, China',
          reason: 'Name Similarity',
          source: 'EU Sanctions List',
          problematicTags: ['Name Match']
        },
        rawWatchlist: {
          name: 'Robert Cheng',
          dob: '1980-05-20',
          nationality: 'Chinese',
          source: 'EU',
          reason: 'Financial Sanctions',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'After investigation, it was determined that the customer is not the same individual as Robert Cheng on the EU Sanctions List.',
        alertNarrative: 'The alert was triggered due to name similarity. However, further investigation revealed significant differences in other identifying information.',
        documentation: {
          applicableRegulations: 'EU Sanctions, KYC Guidelines',
          referenceDocuments: 'EU Sanctions List, CIP Policy',
          additionalNotes: 'False positive confirmed.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '890123456',
      name: 'Maria Garcia',
      match: 'OFAC SDN List',
      disposition: 'True Positive',
      score: 85,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '123 Main St, Mexico City, Mexico',
          country: 'Mexico',
          dob: '10/01/1975',
          idNumber: '444555666'
        },
        entityEnrichment: {
          email: 'maria.garcia@email.com',
          previousAddress: '456 Oak Ave, Mexico City, Mexico',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
        },
        watchlistEntity: {
          location: 'Mexico City, Mexico',
          reason: 'Narcotics Trafficking',
          source: 'OFAC SDN List',
          problematicTags: ['Drug Trafficking', 'Organized Crime']
        },
        rawWatchlist: {
          name: 'Maria Elena Garcia',
          dob: '1975-10-01',
          nationality: 'Mexican',
          source: 'OFAC',
          reason: 'Narcotics Trafficking',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer is a confirmed match with Maria Elena Garcia on the OFAC SDN List.',
        alertNarrative: 'The alert was triggered due to a strong match on name and date of birth.  Further investigation confirmed the match.',
        documentation: {
          applicableRegulations: 'OFAC Sanctions, AML Regulations',
          referenceDocuments: 'OFAC SDN List, CDD Policy',
          additionalNotes: 'Confirmed true positive.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '901234567',
      name: 'Alexander Petrov',
      match: 'Interpol Red Notice',
      disposition: 'Escalated',
      score: 80,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '789 Elm St, Moscow, Russia',
          country: 'Russia',
          dob: '03/10/1970',
          idNumber: '777888999'
        },
        entityEnrichment: {
          email: 'alexander.petrov@email.com',
          previousAddress: '101 Pine St, Moscow, Russia',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
        },
        watchlistEntity: {
          location: 'Moscow, Russia',
          reason: 'International Warrant',
          source: 'Interpol Red Notice',
          problematicTags: ['Fugitive', 'Financial Crime']
        },
        rawWatchlist: {
          name: 'Alexander Petrov',
          dob: '1970-03-10',
          nationality: 'Russian',
          source: 'Interpol',
          reason: 'International Warrant',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer is a potential match with an individual on an Interpol Red Notice.',
        alertNarrative: 'The alert was triggered due to a match on name and date of birth.  This case has been escalated for further review.',
        documentation: {
          applicableRegulations: 'International Law Enforcement Cooperation',
          referenceDocuments: 'Interpol Red Notice',
          additionalNotes: 'Escalated for further investigation.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '101234567',
      name: 'Aisha Patel',
      match: 'UK Sanctions List',
      disposition: 'Pending Review',
      score: 55,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '123 Main St, Mumbai, India',
          country: 'India',
          dob: '08/12/1980',
          idNumber: '222333444'
        },
        entityEnrichment: {
          email: 'aisha.patel@email.com',
          previousAddress: '456 Oak Ave, Mumbai, India',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
        },
        watchlistEntity: {
          location: 'Mumbai, India',
          reason: 'Suspected Terrorist Financing',
          source: 'UK Sanctions List',
          problematicTags: ['Terrorism Financing']
        },
        rawWatchlist: {
          name: 'Aisha Fatima Patel',
          dob: '1980-08-12',
          nationality: 'Indian',
          source: 'UK',
          reason: 'Terrorist Financing',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer shares a similar name with an individual on the UK Sanctions List. Further investigation is needed.',
        alertNarrative: 'The alert was triggered due to a name similarity between the customer and an individual on the UK Sanctions List.  Additional information is needed to confirm or deny the match.',
        documentation: {
          applicableRegulations: 'UK Sanctions, Counter-Terrorism Financing Regulations',
          referenceDocuments: 'UK Sanctions List, CTF Policy',
          additionalNotes: 'Pending further review.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '201234567',
      name: 'Carlos Mendoza',
      match: 'OFAC SDN List',
      disposition: 'False Positive',
      score: 40,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '789 Elm St, Bogota, Colombia',
          country: 'Colombia',
          dob: '02/28/1995',
          idNumber: '555666777'
        },
        entityEnrichment: {
          email: 'carlos.mendoza@email.com',
          previousAddress: '101 Pine St, Bogota, Colombia',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
        },
        watchlistEntity: {
          location: 'Bogota, Colombia',
          reason: 'Name Similarity',
          source: 'OFAC SDN List',
          problematicTags: ['Name Match']
        },
        rawWatchlist: {
          name: 'Carlos Alberto Mendoza',
          dob: '1990-02-28',
          nationality: 'Colombian',
          source: 'OFAC',
          reason: 'Drug Trafficking',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'After investigation, it was determined that the customer is not the same individual as Carlos Alberto Mendoza on the OFAC SDN List.',
        alertNarrative: 'The alert was triggered due to name similarity. However, further investigation revealed significant differences in other identifying information.',
        documentation: {
          applicableRegulations: 'OFAC Sanctions, AML Regulations',
          referenceDocuments: 'OFAC SDN List, CDD Policy',
          additionalNotes: 'False positive confirmed.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '301234567',
      name: 'Yuki Tanaka',
      match: 'Japan Sanctions List',
      disposition: 'True Positive',
      score: 92,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '123 Main St, Tokyo, Japan',
          country: 'Japan',
          dob: '11/18/1972',
          idNumber: '888999000'
        },
        entityEnrichment: {
          email: 'yuki.tanaka@email.com',
          previousAddress: '456 Oak Ave, Tokyo, Japan',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
        },
        watchlistEntity: {
          location: 'Tokyo, Japan',
          reason: 'Proliferation Financing',
          source: 'Japan Sanctions List',
          problematicTags: ['Weapons Proliferation', 'Sanctions Evasion']
        },
        rawWatchlist: {
          name: 'Yukihiro Tanaka',
          dob: '1972-11-18',
          nationality: 'Japanese',
          source: 'Japan',
          reason: 'Proliferation Financing',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer is a confirmed match with Yukihiro Tanaka on the Japan Sanctions List.',
        alertNarrative: 'The alert was triggered due to a strong match on name and date of birth. Further investigation confirmed the match.',
        documentation: {
          applicableRegulations: 'Japan Sanctions, Export Control Regulations',
          referenceDocuments: 'Japan Sanctions List, Export Control Policy',
          additionalNotes: 'Confirmed true positive.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '401234567',
      name: 'Fatima Al-Saud',
      match: 'UN Sanctions List',
      disposition: 'Escalated',
      score: 78,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '789 Elm St, Riyadh, Saudi Arabia',
          country: 'Saudi Arabia',
          dob: '06/05/1968',
          idNumber: '333444555'
        },
        entityEnrichment: {
          email: 'fatima.alsaud@email.com',
          previousAddress: '101 Pine St, Riyadh, Saudi Arabia',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
        },
        watchlistEntity: {
          location: 'Riyadh, Saudi Arabia',
          reason: 'Suspected Terrorist Association',
          source: 'UN Sanctions List',
          problematicTags: ['Terrorism', 'Sanctions Evasion']
        },
        rawWatchlist: {
          name: 'Fatima bint Abdullah Al-Saud',
          dob: '1968-06-05',
          nationality: 'Saudi Arabian',
          source: 'UN',
          reason: 'Terrorist Association',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer is a potential match with an individual on the UN Sanctions List. This case has been escalated for further review.',
        alertNarrative: 'The alert was triggered due to a match on name and date of birth.  This case has been escalated due to the potential severity of the match.',
        documentation: {
          applicableRegulations: 'UN Sanctions, Counter-Terrorism Regulations',
          referenceDocuments: 'UN Sanctions List, CTF Policy',
          additionalNotes: 'Escalated for further investigation.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '501234567',
      name: 'Hans Mueller',
      match: 'EU Sanctions List',
      disposition: 'Pending Review',
      score: 65,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '123 Main St, Berlin, Germany',
          country: 'Germany',
          dob: '09/25/1988',
          idNumber: '666777888'
        },
        entityEnrichment: {
          email: 'hans.mueller@email.com',
          previousAddress: '456 Oak Ave, Berlin, Germany',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
        },
        watchlistEntity: {
          location: 'Berlin, Germany',
          reason: 'Potential Sanctions Violation',
          source: 'EU Sanctions List',
          problematicTags: ['Sanctions Evasion', 'Financial Crime']
        },
        rawWatchlist: {
          name: 'Hans Peter Mueller',
          dob: '1988-09-25',
          nationality: 'German',
          source: 'EU',
          reason: 'Financial Sanctions',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer shares a similar name with an individual on the EU Sanctions List. Further investigation is needed.',
        alertNarrative: 'The alert was triggered due to a name similarity. Additional information is needed to confirm or deny the match.',
        documentation: {
          applicableRegulations: 'EU Sanctions, AML Regulations',
          referenceDocuments: 'EU Sanctions List, KYC Policy',
          additionalNotes: 'Pending further review.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    },
    {
      id: '601234567',
      name: 'Olga Popova',
      match: 'OFAC SDN List',
      disposition: 'True Positive',
      score: 88,
      alertDateTime: new Date().toISOString(),
      additionalAlertsCount: 0,
      details: {
        customerDetails: {
          address: '789 Elm St, St. Petersburg, Russia',
          country: 'Russia',
          dob: '07/10/1978',
          idNumber: '999000111'
        },
        entityEnrichment: {
          email: 'olga.popova@email.com',
          previousAddress: '101 Pine St, St. Petersburg, Russia',
          employment: 'Unknown',
          socialMedia: [],
          education: 'Unknown'
                                },
        watchlistEntity: {
          location: 'St. Petersburg, Russia',
          reason: 'Cyber-related Sanctions',
          source: 'OFAC SDN List',
          problematicTags: ['Cyber Crime', 'Sanctions Evasion']
        },
        rawWatchlist: {
          name: 'Olga Sergeyevna Popova',
          dob: '1978-07-10',
          nationality: 'Russian',
          source: 'OFAC',
          reason: 'Cyber-related Sanctions',
          nil: '',
          emails: [],
          addresses: [],
          phones: []
        },
        dispositionOverview: 'The customer is a confirmed match with Olga Sergeyevna Popova on the OFAC SDN List.',
        alertNarrative: 'The alert was triggered due to a strong match on name and date of birth. Further investigation confirmed the match.',
        documentation: {
          applicableRegulations: 'OFAC Sanctions, Cyber Sanctions Regulations',
          referenceDocuments: 'OFAC SDN List, Cyber Sanctions Policy',
          additionalNotes: 'Confirmed true positive.'
        },
        auditLog: [{ user: 'System', timestamp: new Date().toISOString(), action: 'Alert Created' }]
      }
    }
  ]

  const [activeTab, setActiveTab] = useState('alerts')
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [isMenuExpanded, setIsMenuExpanded] = useState(true)
  const [fuzzyScore, setFuzzyScore] = useState(50)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDisposition, setFilterDisposition] = useState('all')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')
  const [queueData, setQueueData] = useState(initialQueueData)
  const [escalatedAlerts, setEscalatedAlerts] = useState([])
  const [columnOrder, setColumnOrder] = useState(['id', 'name', 'match', 'disposition', 'score', 'additionalAlertsCount']);

  const menuItems = [
    { icon: <Shield className="w-5 h-5" />, label: 'Alerts Dashboard', value: 'alerts' },
    { icon: <AlertTriangle className="w-5 h-5" />, label: 'Escalations', value: 'escalations' },
    { icon: <Settings className="w-5 h-5" />, label: 'Screening Setup', value: 'setup' },
  ]

  const filteredAndSortedQueueData = queueData
    .filter(alert => 
      (searchQuery === '' || 
              alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       alert.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterDisposition === 'all' || alert.disposition === filterDisposition)
    )
    .sort((a, b) => {
      if (sortBy === 'id') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      } else if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === 'score') {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score
      } else if (sortBy === 'alertDateTime') {
        return sortOrder === 'asc' ? new Date(a.alertDateTime).getTime() - new Date(b.alertDateTime).getTime() : new Date(b.alertDateTime).getTime() - new Date(a.alertDateTime).getTime();
      }
      return 0
    })

  const dispositionData = [
    { name: 'True Positive', value: queueData.filter(alert => alert.disposition === 'True Positive').length + escalatedAlerts.filter(alert => alert.disposition === 'True Positive').length },
    { name: 'False Positive', value: queueData.filter(alert => alert.disposition === 'False Positive').length + escalatedAlerts.filter(alert => alert.disposition === 'False Positive').length },
    { name: 'Escalated', value: queueData.filter(alert => alert.disposition === 'Escalated').length + escalatedAlerts.filter(alert => alert.disposition === 'Escalated').length },
    { name: 'Pending Review', value: queueData.filter(alert => alert.disposition === 'Pending Review').length + escalatedAlerts.filter(alert => alert.disposition === 'Pending Review').length },
  ];

  const watchlistData = [
    { name: 'OFAC SDN List', value: queueData.filter(alert => alert.match === 'OFAC SDN List').length + escalatedAlerts.filter(alert => alert.match === 'OFAC SDN List').length },
    { name: 'UN Consolidated List', value: queueData.filter(alert => alert.match === 'UN Consolidated List').length + escalatedAlerts.filter(alert => alert.match === 'UN Consolidated List').length },
    { name: 'EU Sanctions List', value: queueData.filter(alert => alert.match === 'EU Sanctions List').length + escalatedAlerts.filter(alert => alert.match === 'EU Sanctions List').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const monthlyData = [
    { month: 'Jan', alerts: 45, falsePositives: 30 },
    { month: 'Feb', alerts: 52, falsePositives: 35 },
    { month: 'Mar', alerts: 48, falsePositives: 28 },
    { month: 'Apr', alerts: 70, falsePositives: 45 },
    { month: 'May', alerts: 61, falsePositives: 39 },
    { month: 'Jun', alerts: 65, falsePositives: 42 },
  ]

  const renderAlertTable = (data) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            {columnOrder.map((column) => (
              <th key={column} className="pb-3 font-medium">
                <div className="flex items-center">
                  <span className="mr-2">
                    {column === 'id' ? 'Alert ID' :
                     column === 'name' ? 'Customer Name' :
                     column === 'match' ? 'Watchlist Match' :
                     column === 'disposition' ? 'Disposition' :
                     column === 'score' ? 'Risk Score' :
                     column === 'additionalAlertsCount' ? 'Additional Alerts' : column}
                  </span>
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleColumnOrderChange(column, -1)}
                      disabled={columnOrder.indexOf(column) === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleColumnOrderChange(column, 1)}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row.id} 
              className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => setSelectedAlert(row)}
            >
              {columnOrder.map((column) => (
                <td key={column} className="py-4">
                  {column === 'disposition' ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        row.disposition === 'Pending Review'
                          ? 'bg-yellow-100 text-yellow-800'
                          : row.disposition === 'False Positive'
                          ? 'bg-green-100 text-green-800'
                          : row.disposition === 'Escalated'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {row.disposition}
                    </span>
                  ) : column === 'score' ? (
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-red-500 h-full rounded-full"
                          style={{ width: `${row.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{row.score}</span>
                    </div>
                  ) : column === 'additionalAlertsCount' ? (
                    <span className="text-sm">{row.additionalAlertsCount}</span>
                  ) : (
                    row[column]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const handleUpdateDisposition = (newDisposition: string) => {
    const timestamp = new Date().toISOString();
    const newAuditLogEntry = {
      user: "Current User", // Replace with actual user name
      timestamp: timestamp,
      action: `Updated disposition to ${newDisposition}`,
      field: "disposition",
      oldValue: selectedAlert.disposition,
      newValue: newDisposition
    };

    const updatedAlert = { ...selectedAlert, disposition: newDisposition, details: { ...selectedAlert.details, auditLog: [newAuditLogEntry, ...selectedAlert.details.auditLog] } };
    setSelectedAlert(updatedAlert);

    // Update the alert in the queueData
    const updatedQueueData = queueData.map(alert =>
      alert.id === updatedAlert.id ? updatedAlert : alert
    );
    setQueueData(updatedQueueData);

    // If escalated, add to escalatedAlerts
    if (newDisposition === 'Escalated') {
      setEscalatedAlerts([...escalatedAlerts, updatedAlert]);
    } else if (newDisposition !== 'Escalated' && escalatedAlerts.find(alert => alert.id === updatedAlert.id)) {
      const updatedEscalatedAlerts = escalatedAlerts.filter(alert => alert.id !== updatedAlert.id);
      setEscalatedAlerts(updatedEscalatedAlerts);
    }

    console.log(`Updated disposition for alert ${selectedAlert.id} to ${newDisposition}`);
  };

  const handleColumnOrderChange = (column: string, direction: number) => {
    const currentIndex = columnOrder.indexOf(column);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < columnOrder.length) {
      const newOrder = [...columnOrder];
      newOrder.splice(currentIndex, 1);
      newOrder.splice(newIndex, 0, column);
      setColumnOrder(newOrder);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'alerts':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            {selectedAlert ? (
              <AlertDetails
                alert={selectedAlert}
                setAlert={setSelectedAlert}
                onBack={() => setSelectedAlert(null)}
                onUpdateDisposition={handleUpdateDisposition}
                allAlerts={[...queueData, ...escalatedAlerts]}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Alerts Dashboard</h2>
                  <div className="flex items-center space-x-4">
                    <Select defaultValue="thisYear">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thisYear">This Year</SelectItem>
                        <SelectItem value="lastYear">Last Year</SelectItem>
                        <SelectItem value="allTime">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
                <Tabs defaultValue="queue">
                  <TabsList className="mb-4">
                    <TabsTrigger value="queue">Alerts Queue</TabsTrigger>
                    <TabsTrigger value="analytics">Alerts Analytics</TabsTrigger>
                  </TabsList>
                  <TabsContent value="queue">
                    <div className="mb-4 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Select value={filterDisposition} onValueChange={setFilterDisposition}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by disposition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Dispositions</SelectItem>
                            <SelectItem value="True Positive">True Positive</SelectItem>
                            <SelectItem value="False Positive">False Positive</SelectItem>
                            <SelectItem value="Escalated">Escalated</SelectItem>
                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="id">Alert ID</SelectItem>
                            <SelectItem value="name">Customer Name</SelectItem>
                            <SelectItem value="score">Risk Score</SelectItem>
                            <SelectItem value="alertDateTime">Alert Date and Time</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                          <ArrowUpDown className="w-4 h-4 mr-2" />
                          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => setFilterDisposition('all')}>Clear Filters</Button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Column Order</h3>
                      <div className="flex flex-wrap gap-2">
                        {columnOrder.map((column, index) => (
                          <div key={column} className="flex items-center">
                            <span className="mr-2">{column}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleColumnOrderChange(column, -1)}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleColumnOrderChange(column, 1)}
                              disabled={index === columnOrder.length - 1}
                            >
                              ↓
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    {renderAlertTable(filteredAndSortedQueueData)}
                  </TabsContent>
                  <TabsContent value="analytics">
                    <div className="grid grid-cols-2 gap-6">
                      <Card className="bg-white shadow">
                        <CardContent>
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">Disposition Distribution</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={dispositionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {dispositionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      <Card className="bg-white shadow">
                        <CardContent>
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">Watchlist Distribution</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={watchlistData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {watchlistData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="bg-white shadow mt-6">
                      <CardContent>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Alert Summary</h3>
                        <table className="w-full text-gray-800">
                          <thead>
                            <tr className="text-left border-b border-gray-200">
                              <th className="pb-2">Metric</th>
                              <th className="pb-2">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2">Total Alerts</td>
                              <td className="py-2">{queueData.length + escalatedAlerts.length}</td>
                            </tr>
                            <tr>
                              <td className="py-2">Average Risk Score</td>
                              <td className="py-2">
                                {((queueData.reduce((sum, alert) => sum + alert.score, 0) + 
                                   escalatedAlerts.reduce((sum, alert) => sum + alert.score, 0)) / 
                                  (queueData.length + escalatedAlerts.length)).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2">Alerts Requiring Action</td>
                              <td className="py-2">
                                {queueData.filter(alert => ['True Positive', 'Escalated', 'Pending Review'].includes(alert.disposition)).length +
                                 escalatedAlerts.filter(alert => ['True Positive', 'Escalated', 'Pending Review'].includes(alert.disposition)).length}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2">Screenings Left</td>
                              <td className="py-2">
                                {Math.max(0, TOTAL_ALLOWED_SCREENINGS - (queueData.length + escalatedAlerts.length))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                    <Card className="bg-white shadow mt-6">
                      <CardContent>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Alert Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="alerts" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="falsePositives" stroke="#82ca9d" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        );
      case 'escalations':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Escalated Alerts</h2>
            {selectedAlert ? (
              <AlertDetails
                alert={selectedAlert}
                setAlert={setSelectedAlert}
                onBack={() => setSelectedAlert(null)}
                onUpdateDisposition={handleUpdateDisposition}
                allAlerts={[...queueData, ...escalatedAlerts]}
              />
            ) : (
              renderAlertTable(escalatedAlerts)
            )}
          </div>
        );
      case 'setup':
        return (
          <Card className="bg-white shadow-lg rounded-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Screening Setup</h2>
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="single">Single Search</TabsTrigger>
                  <TabsTrigger value="batch">Batch Search</TabsTrigger>
                </TabsList>
                <TabsContent value="single">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alias">Alias</Label>
                        <Input id="alias" placeholder="Enter alias" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="Enter address" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="citizenship">Citizenship</Label>
                        <Input id="citizenship" placeholder="Enter citizenship" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="countryOfResidence">Country of Residence</Label>
                        <Input id="countryOfResidence" placeholder="Enter country of residence" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationalId">National Identification Number</Label>
                        <Input id="nationalId" placeholder="Enter national ID" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passportNumber">Passport Number</Label>
                        <Input id="passportNumber" placeholder="Enter passport number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuzzyScore">Fuzzy Score: {fuzzyScore}</Label>
                      <Slider
                        id="fuzzyScore"
                        min={0}
                        max={100}
                        step={1}
                        value={[fuzzyScore]}
                        onValueChange={(value) => setFuzzyScore(value[0])}
                        className="w-full"
                      />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Perform Single Search
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="batch">
                  <div className="space-y-4">
                    <p className="text-gray-600">Configure settings for bulk entity searches.</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Set Up Batch Search
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <nav
        className={`fixed left-0 top-0 h-full bg-white shadow-lg p-4 transition-all duration-300 ease-in-out ${
          isMenuExpanded ? 'w-64' : 'w-20'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 w-full flex justify-center"
          onClick={() => setIsMenuExpanded(!isMenuExpanded)}
        >
          {isMenuExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.value}>
              <button
                onClick={() => setActiveTab(item.value)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                  activeTab === item.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {isMenuExpanded && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`flex-grow transition-all duration-300 ease-in-out ${isMenuExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-[1920px] mx-auto p-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Sentinela AI
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search alerts by customer name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white text-gray-800 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-gray-800">Courtney Henry</span>
              </div>
            </div>
          </header>

          <main>
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}