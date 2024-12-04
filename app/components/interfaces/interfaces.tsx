export interface AlertType {
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

export interface AlertDetailsProps {
    alert: AlertType;
    onBack: () => void;
    onUpdateDisposition: (disposition: string) => void;
    setAlert: (updatedAlert: AlertType) => void;
    allAlerts: AlertType[];
  }