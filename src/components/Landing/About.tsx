import gsap from 'gsap';
import { Button } from "@/ui/button"

export default function AnimatedAbout()
{

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        // animation to handle button click using gsap
        gsap.to(e.currentTarget,
        {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
        });
        window.open("https://github.com/Airstriker123/Claimr/blob/docs/doc.md");
    };

    // return JXML to DOM (page section layout) of landing
    return (
        <section
            className="pt-10 md:pt-20 pb-10 px-6 sm:px-10 md:px-16 flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-16 w-full"
        >
            {/* Left content */}
            <div className="flex flex-col items-center lg:items-start justify-center gap-8 md:gap-12 flex-1 grow w-full">
                <h1
                    className="bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
  [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
  text-transparent  tracking-normal leading-[normal]  text-[32px] text-center font-medium"
                >
                  <b>About Claimr</b>
                </h1>
                <p
                    className="relative flex flex-col items-center lg:items-start justify-center self-stretch drop-shadow-[black_1px_1px_1px]
                       tracking-tight leading-relaxed
                       text-slate-100 text-sm sm:text-base md:text-lg font-normal space-y-4 max-w-2xl text-center lg:text-left"
                >
                   <b></b> Claimr is an open-source receipt and expense management application designed to help Australians organise financial records for tax preparation. It provides OCR receipt scanning, expense categorisation, warranty tracking, and CSV export tools in a simple and accessible interface.
                </p>
                <p
                className="relative flex flex-col items-center lg:items-start justify-center self-stretch drop-shadow-[black_1px_1px_1px]
                       tracking-tight leading-relaxed
                       text-slate-100 text-sm sm:text-base md:text-lg font-normal space-y-4 max-w-2xl text-center lg:text-left">
                    The project focuses on transparency by making the source code publicly available, allowing users to understand how data is processed and stored. Claimr is intended to support record organisation and manual tax preparation workflows and does not provide financial advice or automated tax lodgement.
                </p>

                <Button
                    onClick={handleButtonClick}
                    className="
                    w-full sm:w-auto px-10 py-6 rounded-full bg-cyan-500 text-black font-black  tracking-widest
                    hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer
                    "
                >
                    <div className="relative flex items-center justify-center w-fit -mt-px font-bold text-base md:text-lg text-center tracking-tight whitespace-nowrap">
                        Learn how to use Claimr!
                    </div>
                </Button>
            </div>

            {/* Right image configs */}
            <div
                className="relative w-full lg:flex-1 h-64 sm:h-80 lg:h-108 border-[3px] border-solid border-transparent
    [border-image:linear-gradient(180deg,rgba(0,180,255,1)_0%,rgba(0,255,255,1)_100%)_1]
    /* This forces the image to stretch to all four corners */
    bg-[url(/Landing/about.png)] bg-[length:100%_100%] bg-no-repeat
    rounded-2xl transform-gpu overflow-hidden shadow-2xl shadow-cyan-500/20"
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>
        </section>
    );
}