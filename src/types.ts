export interface CompanyField {
  field: string;
  recommended: string;
  considerations: string;
  common: 'common' | 'sometimes' | 'unlikely';
}

export interface BasicInfo {
  companyName: string;
  industry: string;
  websiteUrl: string;
  description: string;
}
