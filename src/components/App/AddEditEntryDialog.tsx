import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import {toast} from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import type {TaxEntry, ATOCategory} from './types';
import {calculateWarrantyExpiry, HandleOCR} from './utils';
import { Loader2, Upload } from 'lucide-react';

interface AddEditEntryDialogProps
{
  open: boolean;
  onClose: () => void;
  onSave: (entry: Omit<TaxEntry, 'id' | 'createdAt'>) => void;
  entry?: TaxEntry;
}

// allowed categories
const ATO_CATEGORIES: ATOCategory[] = [
  'Work-Related',
  'Self-Education',
  'Vehicle Expenses',
  'Home Office',
  'Travel',
  'Clothing & Laundry',
  'Tools & Equipment',
  'Insurance',
  'Other Deductible',
  'Non-Deductible',
];

export function AddEditEntryDialog({ open, onClose, onSave, entry }: AddEditEntryDialogProps)
{
    /**
     * Dialog component for adding a new entry or editing an existing one.
     * Includes OCR capabilities to automatically extract data from receipt images.
     */
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  
  // Local state for numeric inputs to handle string-based input fields correctly
  const [amountInput, setAmountInput] = useState(entry?.amount ? entry.amount.toString() : '');
  const [taxInput, setTaxInput] = useState(entry?.tax ? entry.tax.toString() : '');


  const getEmptyForm = (): Omit<TaxEntry, 'id' | 'createdAt'> => ({
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    tax: 0,
    category: 'Work-Related',
    description: '',
    warrantyMonths: undefined,
    warrantyExpiryDate: undefined,
  });


  // Synchronize form data with the provided entry (if editing) or empty form (if adding)
  const [formData, setFormData] = useState<Omit<TaxEntry, 'id' | 'createdAt'>>(
      entry ? {
        merchant: entry.merchant,
        date: entry.date,
        amount: entry.amount,
        tax: entry.tax,
        category: entry.category,
        description: entry.description,
        warrantyMonths: entry.warrantyMonths,
        warrantyExpiryDate: entry.warrantyExpiryDate,
      } : getEmptyForm()
  );


  /**
   * Handles receipt image upload and triggers OCR processing.
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    try
    {
      // Call experimental OCR utility
      const extracted = await HandleOCR(file);
      const newAmount = extracted?.amount || formData.amount;
      const newTax = extracted?.tax || formData.tax;

      // Update form with extracted data
      setFormData(prev => ({
        ...prev,
        ...extracted,
        merchant: extracted?.merchant || prev.merchant,
        date: extracted?.date || prev.date,
        amount: newAmount,
        tax: newTax,
        description: extracted?.description || prev.description,
      }));
      
      // Update string-based numeric inputs for the UI
      if (extracted?.amount) setAmountInput(extracted.amount.toString());
      if (extracted?.tax) setTaxInput(extracted.tax.toString());
    }
    catch (error)
    {
      console.error('OCR extraction failed:', error);
      toast.error("Failed to extract Text from image");
    }
    finally
    {
      setOcrLoading(false);
    }
  };

  /**
   * Calculates warranty expiry date based on purchase date and months.
   */
  const handleWarrantyChange = (months: string) =>
  {
    const monthsNum = parseInt(months);
    if (isNaN(monthsNum) || monthsNum <= 0)
    {
      setFormData(prev => ({
        ...prev,
        warrantyMonths: undefined,
        warrantyExpiryDate: undefined,
      }));
    }
    else
    {
      setFormData(prev => ({
        ...prev,
        warrantyMonths: monthsNum,
        warrantyExpiryDate: calculateWarrantyExpiry(prev.date, monthsNum),
      }));
    }
  };

  /**
   * Submits the form and calls the onSave callback.
   */
  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    setLoading(true);
    try
    {
      onSave(formData);
      if (!entry)
      {
        // Reset form for next entry if we were adding a new one
        setFormData(getEmptyForm());
        setAmountInput('');
        setTaxInput('');
      }
      onClose();
    }
    catch (error)
    {
      console.error('Failed to save entry:', error);
    }
    finally
    {
      setLoading(false);
    }
  };

  return (
      //  form entries display
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
          <DialogDescription>
            {entry ? 'Update the details of your tax entry.' : 'Add a new tax deduction entry. Upload a receipt or enter details manually.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* OCR Upload */}
            {!entry && (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                  disabled={ocrLoading}
                />
                <label
                  htmlFor="receipt-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {ocrLoading ? (
                    <>
                      <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
                      <span className="text-sm text-muted-foreground">Extracting data...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-cyan-600" />
                      <span className="text-sm font-medium">Upload Receipt</span>
                      <span className="text-xs text-muted-foreground">
                        OCR will automatically extract details
                      </span>
                    </>
                  )}
                </label>
              </div>
            )}

            {/* Merchant */}
            <div>
              <Label htmlFor="merchant">Merchant *</Label>
              <Input
                id="merchant"
                value={formData.merchant}
                onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                required
              />
            </div>
            {/* Date */}
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    date: newDate,
                    warrantyExpiryDate: prev.warrantyMonths 
                      ? calculateWarrantyExpiry(newDate, prev.warrantyMonths)
                      : undefined,
                  }));
                }}
                required
              />
            </div>

            {/* Amount and Tax */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (AUD) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }));
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax (AUD) *</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  min="0"
                  value={taxInput}
                  onChange={(e) => {
                    setTaxInput(e.target.value);
                    setFormData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }));
                  }}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">ATO Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ATOCategory }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ATO_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Warranty */}
            <div>
              <Label htmlFor="warranty">Warranty Period (months)</Label>
              <Input
                id="warranty"
                type="number"
                min="0"
                placeholder="Optional"
                value={formData.warrantyMonths || ''}
                onChange={(e) => handleWarrantyChange(e.target.value)}
              />
              {formData.warrantyExpiryDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Expires: {new Date(formData.warrantyExpiryDate).toLocaleDateString('en-AU')}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional notes about this expense"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button className="dark:hover:text-cyan-300 hover:text-white " type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 dark:hover:text-white hover:text-black">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {entry ? 'Update' : 'Add'} Entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}