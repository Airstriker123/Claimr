import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FileText, Shield, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Cards()
{
    const containerRef = useRef(null);

    useGSAP(() =>
    {
        // Targets all direct div children of the grid
        gsap.from(containerRef.current.children, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2, // This creates the "one-by-one" effect
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%", // Starts when the top of the container hits 85% of viewport height
                toggleActions: "play reverse play reverse", // Plays once and stays
            }
        });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="grid md:grid-cols-3 gap-10 mb-16 justify-items-center max-w-8/12xl mx-auto px-6"
        >
            {/* Card 1 */}
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-cyan-400 dark:border-cyan-400">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-lg p-3 w-fit mb-4">
                    <FileText className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-2">Automated Data Extraction</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload receipt images and let OCR technology automatically extract merchant, date, amount, and tax information.
                </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-cyan-400 dark:border-cyan-400">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 w-fit mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Warranty Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assign warranty periods to receipts and get notified before they expire. Never miss a warranty claim again.
                </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-cyan-400 dark:border-cyan-400">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-lg p-3 w-fit mb-4">
                    <Download className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-2">ATO Compliance & Export</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Categorize expenses according to ATO guidelines and export everything as CSV for easy tax filing.
                </p>
            </div>
        </div>
    );
}