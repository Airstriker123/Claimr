import { Button } from "@/ui/button"

export default function ProjectKeyFeatures(): JSX.Element
{
    // render component page layout instructions to DOM.
    return (
        <div
            className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full py-12 px-6 sm:px-12 lg:px-16"
        >
            {/* Text Section */}
            <div className="flex flex-col items-center lg:items-start justify-center gap-8 md:gap-12 flex-1 grow w-full">
                <h1
                    className="bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
  [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
  text-transparent  tracking-normal leading-[normal]  text-[32px] text-center font-medium"
                >
                    <b>What Claimr offers to users</b>
                </h1>
                <ul
                    className="list-none drop-shadow-[black_1px_1px_1px] text-slate-100 text-sm sm:text-base md:text-lg font-normal space-y-4 max-w-2xl"
                >
                    {[
                        "Track receipts and expenses in one place: Organise financial records and spending history in a simple dashboard.",
                        "Snap & extract receipt details instantly: Upload receipt images and automatically extract merchant, date, amount, and tax information using OCR.",
                        "Review spending summaries at a glance: Visualise expense categories and exported records for manual tax preparation.",
                        "Never miss a warranty expiry: Store receipts and track warranty periods with expiry reminders.",
                        "Built for accessibility and convenience: Works across desktop and mobile devices as a Progressive Web Application."
                    ].map((text, i) => (
                        <li key={i} className="font-medium flex gap-3 text-left">
                            <span className="text-cyan-400">▹</span> {text}
                        </li>
                    ))}
                </ul>

                <Button
                    onClick={() => window.open("https://github.com/Airstriker123/Claimr.git")}
                    className="w-full sm:w-auto px-10 py-6 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest
                    hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                    View Source Code
                </Button>
            </div>
            <div
                className="relative w-full lg:flex-1 h-64 sm:h-80 lg:h-108 border-[3px] border-solid border-transparent
    [border-image:linear-gradient(180deg,rgba(0,180,255,1)_0%,rgba(0,255,255,1)_100%)_1]
    /* This forces the image to stretch to all four corners */
    bg-[url(/Landing/ClaimrFeatures.png)] bg-[length:100%_100%] bg-no-repeat
    rounded-2xl transform-gpu overflow-hidden shadow-2xl shadow-cyan-500/20"
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>
        </div>
    );
}