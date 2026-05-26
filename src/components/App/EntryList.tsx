import type {TaxEntry} from './types';
import { formatCurrency, formatDate } from './utils';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Trash2, Edit, AlertCircle } from 'lucide-react';

interface EntryListProps
{
    /**
     * Properties for the EntryList component.
     */
    entries: TaxEntry[];         // Array of entries to display
    onEdit: (entry: TaxEntry) => void; // Callback when edit button is clicked
    onDelete: (id: string) => void;    // Callback when delete button is clicked
}

export function EntryList({ entries, onEdit, onDelete }: EntryListProps)
{
    /**
     * Component that renders a scrollable list of tax entries.
     * Entries are sorted by date in descending order.
     */
    const sortedEntries = [...entries].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    /**
     * Determines if a warranty is expiring within the next 30 days.
     */
    const isWarrantyExpiringSoon = (expiryDate?: string) =>
    {
        if (!expiryDate) return false;
        const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 30;
    };

    if (entries.length === 0)
    {
        return (
            <Card>
                <CardContent className="py-16 text-center">
                    <p className="text-muted-foreground">No entries yet. Click "Add Entry" to get started.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {sortedEntries.map((entry) =>
            (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="truncate font-semibold">{entry.merchant}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {entry.category}
                                    </Badge>
                                    
                                    {/* Visual alert for expiring warranties */}
                                    {entry.warrantyExpiryDate && isWarrantyExpiringSoon(entry.warrantyExpiryDate) && (
                                        <Badge variant="destructive" className="text-xs flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            Warranty expiring soon
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                                    <div>
                                        <span className="block text-xs uppercase tracking-wider">Date</span>
                                        <span>{formatDate(entry.date)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs uppercase tracking-wider">Amount</span>
                                        <span className="font-medium text-foreground">{formatCurrency(entry.amount)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs uppercase tracking-wider">Tax (GST)</span>
                                        <span>{formatCurrency(entry.tax)}</span>
                                    </div>
                                    {entry.warrantyExpiryDate && (
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider">Warranty Until</span>
                                            <span className={isWarrantyExpiringSoon(entry.warrantyExpiryDate) ? "text-destructive font-medium" : ""}>
                                                {formatDate(entry.warrantyExpiryDate)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {entry.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 italic">
                                        "{entry.description}"
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {/* Action Buttons */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(entry)}
                                    title="Edit Entry"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(entry.id)}
                                    title="Delete Entry"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
