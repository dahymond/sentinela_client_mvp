// export interface AlertType {
//   id: string;
//   name: string;
//   sanctions_source: string;
//   disposition: string;
//   score: number;
//   alertDateTime: string;
//   details: {
//     customerDetails: {
//       address: string;
//       country: string;
//       dob: string;
//       idNumber: string;
//     };
//     entityEnrichment: {
//       email: string;
//       previousAddress: string;
//       employment: string;
//       socialMedia: string[];
//       education: string;
//     };
//     watchlistDetails: {
//       notes?: string;
//       location?: string;
//       source?: string;
//       problematicTags?: string[];
//       alias?: string;
//       citizenship?: string;
//       countryOfResidence?: string;
//       dob?: string;
//       name?: string;
//       nationalID?: string;
//       passportNumber?: string;
//       referents?: string;
//       sanction_id?: string;
//       source_url?: string;
//     };
//     rawWatchlist: {
//       name: string;
//       dob: string;
//       nationality: string;
//       source: string;
//       reason: string;
//       nil: string;
//       emails: string[];
//       addresses: string[];
//       phones: string[];
//     };
//     dispositionOverview: string;
//     alertNarrative: string;
//     documentation: {
//       applicableRegulations: string;
//       referenceDocuments: string;
//       additionalNotes: string;
//     };
//     auditLog: Array<{
//       user: string;
//       timestamp: string;
//       action: string;
//       field?: string;
//       oldValue?: string;
//       newValue?: string;
//     }>;
//   };
//   additionalAlertsCount: number;
// }

export interface AlertDetailsProps {
  alert: MainAlert;
  onBack: () => void;
  onUpdateDisposition: (disposition: string) => void;
  allAlerts: MainAlert[];
}

//ACTIVE TABS
export type ActiveTabsType = "alerts" | "escalations" | "setup";

// ALERT RESULT
export interface CustomerDetails {
  id: string;
  name: string;
  alias: string;
  dob: string | null;
  address: string;
  citizenship: string;
  country_of_residence: string;
  national_id: string;
  passport_number: string;
}

export interface Employment {
  title: {
    raw: string[];
    name: string;
    role: string;
    levels: string[];
    role_v2: string;
    class_v2: string;
    sub_role: string;
    sub_role_v2: string;
  };
  company: {
    id: string;
    raw: string[];
    name: string;
    size: string;
    type: string;
    ticker: string | number | null;
    founded: number;
    website: string;
    industry: string;
    location: {
      geo: string | number | null;
      name: string;
      metro: string | number | null;
      region: string | number | null;
      country: string;
      locality: string | number | null;
      continent: string;
      last_seen: string | number | null;
      first_seen: string | number | null;
      num_sources: string | number | null;
      postal_code: string | number | null;
      address_line_2: string | number | null;
      street_address: string | number | null;
    };
    fuzzy_match: boolean;
    linkedin_id: string;
    twitter_url: string;
    facebook_url: string;
    linkedin_url: string;
  };
  summary: string | number | null;
  end_date: string | number | null;
  last_seen: string;
  first_seen: string;
  is_primary: boolean;
  start_date: string;
  num_sources: number;
  location_names: string[];
}

export interface EntityEnrichment {
  id: string;
  likelihood: number;
  name: string;
  email: string[];
  address: string | null;
  previous_address: string[];
  employment: Employment[];
  social_media: {
    id: string;
    url: string;
    network: string;
    username: string;
    last_seen: string;
    first_seen: string;
    num_sources: number | string;
  }[];
  education: {
    school: {
      name: string;
      type: string;
      id: string;
      location: {
        name: string;
        locality: string | number | null;
        region: string;
        metro: string | number | null;
        country: string;
        continent: string;
        street_address: string | number | null;
        address_line_2: string | number | null;
        postal_code: string | number | null;
        geo: string | number | null;
        first_seen: string | number | null;
        last_seen: string | number | null;
        num_sources: string | number | null;
      };
      linkedin_url: string;
      facebook_url: string | number | null;
      twitter_url: string | number | null;
      linkedin_id: string;
      website: string;
      domain: string;
      raw: string[];
    };
    degrees: string[];
    start_date: string;
    end_date: string;
    majors: string[];
    minors: [];
    gpa: string | number | null;
    raw: string[];
    summary: string | null;
  }[];
}

export interface WatchlistDetails {
  // id: string;
  // notes?: string;
  // location?: string;
  // source?: string;
  // problematicTags?: string[];
  // alias?: string;
  // citizenship?: string;
  // countryOfResidence?: string;
  // dob?: string;
  // name?: string;
  // phone: string;
  // nationalID?: string;
  // passportNumber?: string;
  // referents?: string;
  // sanction_id?: string;
  // source_url?: string;
  _id: string;
  caption: string;
  schema: string;
  properties: {
    name: string[];
    alias: string[];
    topics: string[];
    weakAlias:string[],
    phone:string[],
    birthDate: string[];
    addressEntity: string[];
    idNumber: string[];
    nationality: string[];
    position: string[];
    birthPlace: string[];
    lastName: string[];
    country: string[];
    address: string[];
    firstName: string[];
    gender: string[];
    sourceUrl: string[];
    notes:string[];
    source_Url: string[];

  };
  referents?: string;
  datasets: string[];
  first_seen: string;
  last_seen: string;
  last_change: string;
  target: boolean;
}

export interface Documentation {
  id: string;
  applicableRegulations: string;
  referenceDocuments: string[];
  additionalNotes: string;
}

export interface AuditLog {
  user: string;
  timestamp: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

export interface AlertDetails {
  id: string;
  customerDetails: CustomerDetails;
  entityEnrichment: EntityEnrichment;
  watchlistDetails: WatchlistDetails;
  dispositionOverview: string;
  alertNarrative: string;
  alertConclusion: string;
  documentation: Documentation;
  auditLog: AuditLog[];
}

export interface MainAlert {
  id: string;
  name: string;
  custom_id: string;
  sanctions_source:
    | "eu_fsf"
    | "us_ofac_sdn"
    | "fr_tresor_gels_avoir"
    | "gb_hmt_sanctions"
    | "un_sc_sanctions"
    | "qa_nctc_sanctions";
  disposition: string;
  score: number;
  alertDateTime: string;
  additionalAlertsCount: number;
  details: AlertDetails;
}

export interface APIResponse {
  main_alert: MainAlert;
  additional_alerts: MainAlert[];
}

export interface ResultState {
  main_alert: MainAlert | null;
  additional_alerts: MainAlert[];
}

export type Column =
  | "id"
  | "name"
  | "sanctions_source"
  | "disposition"
  | "score"
  | "additionalAlertsCount"
  | "delete";

export type SanctionsCountry = "eu" | "fr" | "us" | "uk" | "qr" | "un";
