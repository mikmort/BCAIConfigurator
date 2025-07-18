import { CompanyField } from './types';

/**
 * List of fields used throughout the wizard.
 * Keeping them in a separate module keeps app.tsx concise.
 */
export const companyFieldNames = [
  'Company Name',
  'Address',
  'City',
  'State',
  'ZIP Code',
  'Phone No.',
  'Email',
  'Country/Region Code',
  'Tax Registration No.',
  'Fed. Tax ID (if available)',
  'Company Website',
  'Base Calendar Code',
  'Invoice Address Code',
  'Logo (Picture)',
];

export const glFieldNames = [
  'Allow Posting From',
  'Allow Posting To',
  'Register Time',
  'Allow Deferral Posting From',
  'Allow Deferral Posting To',
  'Local Currency (LCY) Code',
  'EMU Currency',
  'Additional Reporting Currency',
  'Amount Decimal Places',
  'Unit-Amount Decimal Places',
  'Amount Rounding Precision',
  'Invoice Rounding Precision (LCY)',
  'Invoice Rounding Type (LCY)',
  'Summarize G/L Entries',
  'Mark Cr. Memos as Corrections',
  'Allow G/L Acc. Deletion Before',
  'Block Deletion of G/L Accounts',
  'Acc. Sched. for Retained Earn.',
  'Fin. Rep. for Retained Earn.',
  'Global Dimension 1 Code',
  'Global Dimension 2 Code',
  'Shortcut Dimension 3 Code',
  'Shortcut Dimension 4 Code',
  'Shortcut Dimension 5 Code',
  'Shortcut Dimension 6 Code',
  'Shortcut Dimension 7 Code',
  'Shortcut Dimension 8 Code',
  'Unrealized VAT',
  'VAT Tolerance %',
  'Max. VAT Difference Allowed',
  'VAT Calculation Type',
];

export const srFieldNames = [
  'Discount Posting',
  'Credit Warnings',
  'Stockout Warning',
  'Shipment on Invoice',
  'Invoice Rounding',
  'Ext. Doc. No. Mandatory',
  'Default Posting Date',
  'Default Quantity to Ship',
  'Customer Nos.',
  'Quote Nos.',
  'Order Nos.',
  'Invoice Nos.',
  'Posted Invoice Nos.',
  'Credit Memo Nos.',
  'Posted Credit Memo Nos.',
  'Posted Shipment Nos.',
  'Blanket Order Nos.',
  'Return Order Nos.',
  'Posted Return Receipt Nos.',
  'Calc. Inv. Discount',
  'Posted Prepayment Inv. Nos.',
  'Posted Prepayment Cr. Memo Nos.',
  'Copy Comments Blanket Order to Order',
];

export const ppFieldNames = [
  'Receipt on Invoice',
  'Ext. Doc. No. Mandatory (Purchases)',
  'Vendor Nos.',
  'Quote Nos. (Purchases)',
  'Order Nos. (Purchases)',
  'Invoice Nos. (Purchases)',
  'Posted Invoice Nos. (Purchases)',
  'Credit Memo Nos. (Purchases)',
  'Posted Credit Memo Nos. (Purchases)',
  'Posted Receipt Nos.',
  'Blanket Order Nos. (Purchases)',
  'Return Order Nos. (Purchases)',
  'Posted Return Shpt. Nos.',
];

export const faFieldNames = [
  'FA Nos.',
  'Depreciation Book Nos.',
  'FA Journal Batch Name',
];

/**
 * Convert a list of names into basic CompanyField objects.
 */
export function makeFields(names: string[]): CompanyField[] {
  return names.map(n => ({
    field: n,
    recommended: '',
    considerations: '',
    common: 'unlikely',
  }));
}
