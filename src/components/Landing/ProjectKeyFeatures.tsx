import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from "@/ui/button"

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectKeyFeatures(): JSX.Element
{
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split title letters logic remains same
            if (titleRef.current) {
                const titleText = titleRef.current.textContent || '';
                titleRef.current.innerHTML = titleText
                    .split('')
                    .map((char) =>
                        `<span class="inline-block bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
                        [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
                        text-transparent tracking-[0] leading-[normal] will-change-transform will-change-opacity"
                        >${char === ' ' ? '&nbsp;' : char}</span>`
                    ).join('');

                gsap.from(titleRef.current.children, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 0,
                    y: 20,
                    rotationX: -90,
                    stagger: 0.03,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                });
            }

            // List and Button animations triggered slightly earlier for mobile flow
            if (listRef.current) {
                gsap.from(listRef.current.children, {
                    scrollTrigger: {
                        trigger: listRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 0,
                    x: -20,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                });
            }

            gsap.from(buttonRef.current, {
                scrollTrigger: {
                    trigger: buttonRef.current,
                    start: 'top 95%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 20,
                scale: 0.9,
                duration: 0.8,
                ease: 'back.out(1.4)',
            });

            // Parallax adjusted for vertical scroll
            gsap.fromTo(imageRef.current,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1, scale: 1, duration: 1.2,
                    scrollTrigger: {
                        trigger: imageRef.current,
                        start: 'top 90%',
                        end: 'top 50%',
                        scrub: true,
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full py-12 px-6 sm:px-12 lg:px-16"
        >
            <div
                ref={imageRef}
                className="relative w-full lg:flex-1 h-64 sm:h-80 lg:h-108 border-[3px] border-solid border-transparent
    [border-image:linear-gradient(180deg,rgba(0,180,255,1)_0%,rgba(0,255,255,1)_100%)_1]
    /* This forces the image to stretch to all four corners */
    bg-[url(/Landing/ClaimrFeatures.webp)] bg-[length:100%_100%] bg-no-repeat
    rounded-2xl transform-gpu overflow-hidden shadow-2xl shadow-cyan-500/20"
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>
            {/* Text Section */}
            <div className="flex flex-col items-center lg:items-start justify-center gap-8 lg:gap-12 flex-1 w-full text-center lg:text-left">
                <div className="w-full">
                    <h2
                        ref={titleRef}
                        className="font-bold text-3xl sm:text-4xl tracking-tight leading-tight text-white uppercase italic"
                    >
                        Key Features Of our product Claimr
                    </h2>
                </div>

                <ul
                    ref={listRef}
                    className="list-none drop-shadow-[black_1px_1px_1px] text-slate-100 text-sm sm:text-base md:text-lg font-normal space-y-4 max-w-2xl"
                >
                    {[
                        "Track everything in one place: Organise income, deductions, and receipts without the stress.",
                        "Snap & extract receipts instantly: Upload images and automatically capture key details.",
                        "Understand your tax at a glance: Clear summaries show exactly what you can claim.",
                        "Never miss a warranty: Get reminders before your receipts expire.",
                        "Built for real life: Works seamlessly on mobile and desktop wherever you are."
                    ].map((text, i) => (
                        <li key={i} className="font-medium flex gap-3 text-left">
                            <span className="text-cyan-400">▹</span> {text}
                        </li>
                    ))}
                </ul>

                <Button
                    ref={buttonRef}
                    onClick={() => window.open("https://github.com/Airstriker123/Claimr.git")}
                    className="w-full sm:w-auto px-10 py-6 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest
                    hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                    View Source Code
                </Button>
            </div>
        </div>
    );
}