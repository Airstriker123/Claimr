import { FileText, Shield, Download } from 'lucide-react';

export default function Cards()
{
    // return TSXML (component)
    return (
        <div
            className="grid md:grid-cols-3 gap-10 mb-16 justify-items-center max-w-8/12xl mx-auto px-6"
        >
            {/* Card 1 */}
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-sm border border-cyan-400 dark:border-cyan-400">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-lg p-3 w-fit mb-4">
                    <FileText className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-2">Automated Data Extraction</h3>
                <p className="text-sm text-white">
                    Upload receipt images and let OCR technology automatically extract merchant, date, amount, and tax information.
                </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-sm border border-cyan-400 dark:border-cyan-400">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 w-fit mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Warranty Tracking</h3>
                <p className="text-sm text-white">
                    Assign warranty periods to receipts and get notified before they expire. Never miss a warranty claim again.
                </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-sm border border-cyan-400 dark:border-cyan-400">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-lg p-3 w-fit mb-4">
                    <Download className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-2">Categorise expenses and export data as CSV</h3>
                <p className="text-sm text-white">
                    Categorise expenses and export CSV files for use in spreadsheets and external tools to analyse spending trends.
                </p>
            </div>
        </div>
    );
}