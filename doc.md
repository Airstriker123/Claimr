# Claimr Documentation

Claimr is a receipt tracking and expense management system designed to help users store, organise, and analyse receipt data in a structured and secure manner.

---

## Overview

Claimr allows users to:

- Upload and store receipt images
- Automatically extract receipt data using OCR
- Manually enter receipt information when required
- View structured spending summaries
- Export data for external analysis

The system is designed to improve personal financial organisation through structured data management and retrieval.

---

## Getting Started

To begin using Claimr:

1. Create an account
2. Log in with your credentials
3. Access the dashboard
4. Add receipts using either upload or manual entry

---

## Uploading Receipts (OCR Processing)

Claimr supports automatic receipt processing using optical character recognition (OCR).

### Steps

- Navigate to Upload Receipt
- Select an image file (JPG, PNG, WEBP)
- Wait for OCR processing to complete
- Review extracted data
- Save the receipt

### Extracted Data

- Merchant name
- Purchase date
- Total amount
- Category (if detected)

---

## Manual Entry Guide

Manual entry is used when receipts cannot be processed automatically.

### When to use manual entry

- Receipt image is unclear or unreadable
- OCR fails to extract correct information
- Digital receipts such as emails or PDFs
- Physical receipt is missing or damaged

### Required fields

| Field | Description |
|------|-------------|
| Merchant | Business or store name |
| Date | Purchase date shown on receipt |
| Amount | Total amount paid |
| Category | Type of expense (e.g. Food, Transport, Utilities) |
| Payment Method | Optional field such as card or cash |

### Best practice

All values should be entered exactly as shown on the receipt to ensure data accuracy.

---

## Dashboard

The dashboard provides an overview of user spending activity.

### Features

- Total spending summary
- Recent receipts overview
- Category breakdowns
- Spending insights

Note: The dashboard does not include a search feature. Users navigate receipts through filters and categorisation tools.

---

## Organising Receipts

Receipts can be organised and managed through categories and filtering.

- Assign categories to receipts
- Sort receipts by date, merchant, or amount
- Analyse spending patterns over time
- Filter receipts by category

---

## Warranty Tracking

Claimr supports warranty tracking for purchases.

- Assign warranty duration to receipts
- Track expiry dates automatically
- Receive reminders before warranty expiration

---

## Exporting Data

Users can export receipt data for external use.

### Format

- CSV (Comma-Separated Values)

### Steps

1. Navigate to the export section
2. Select CSV export
3. Download the file
4. Open in spreadsheet software such as Excel or Google Sheets

### Use cases

- Budget tracking
- Expense analysis
- Financial reporting

---

## Security and Privacy

Claimr implements security measures to protect user data.

### Security features

- Passwords are securely hashed and never stored in plain text
- Authentication is required for all data access
- Rate limiting is used to prevent abuse
- Users can only access their own data

### Data handling

- Receipt data is stored securely per user account
- Data is not shared with third parties
- Users may delete their data at any time

---

## Frequently Asked Questions

### What file formats are supported?

JPG, JPEG, PNG, WEBP

---

### Does OCR always produce accurate results?

No. OCR accuracy depends on image quality. Users should review extracted data before saving.

---

### Can receipts be edited after saving?

Yes. All receipt data can be edited at any time.

---

### Why is there no search feature?

Claimr focuses on structured browsing through categories and filters rather than keyword search.

---

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

Users are permitted to:

- Use the software
- Modify the source code
- Distribute copies

under the terms of the GPL-3.0 license.

---

## Disclaimer

Claimr is a receipt tracking and expense management system.

It does not provide financial, accounting, legal, or tax advice.

Users are responsible for verifying all data before relying on it.
