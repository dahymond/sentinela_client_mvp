import { useState } from "react";
import { AlertType } from "../../../../interfaces/interfaces";
import { AlertDetailsProps } from '../../../../interfaces/interfaces'
import { Button } from "../../../../ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Download, Edit2, RefreshCw, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { AdditionalAlertsQueue } from "./additonalAlertQueue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs";
import { Textarea } from "../../../../ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../../ui/collapsible";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Separator } from "../../../../ui/separator";

export function AlertDetails({ alert, onBack, onUpdateDisposition, setAlert, allAlerts }: AlertDetailsProps) {
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
      const selectedAreas = Array.from(document.querySelectorAll('select[multiple] option:checked')).map((option:any) => option.value);
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
              <Select>
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