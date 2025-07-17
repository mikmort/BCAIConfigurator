export interface CompanyField {
  field: string;
  recommended: string;
  considerations: string;
  common: 'common' | 'sometimes' | 'unlikely';
  fieldType?: string;
  question?: string;
  bcFieldName?: string;
  lookupTable?: number;
  lookupField?: string;
}

export interface BasicInfo {
  companyName: string;
  industry: string;
  websiteUrl: string;
  description: string;
}
