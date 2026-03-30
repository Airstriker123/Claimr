import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {Button} from "@/ui/button"

export interface HeroProps {
    OnNavigateToLogin?: () => void;
    OnNavigateToSignUp?: () => void;
}

export default function Hero({ OnNavigateToLogin, OnNavigateToSignUp }: HeroProps): JSX.Element {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const glowRef1 = useRef<HTMLDivElement>(null);
    const glowRef2 = useRef<HTMLDivElement>(null);
    const glowRef3 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set([titleRef.current, buttonRef.current], { opacity: 0, y: 30 });
            gsap.set([glowRef1.current, glowRef2.current, glowRef3.current], { scale: 0.8, opacity: 0 });

            const tl = gsap.timeline({ delay: 0.2 });

            tl.to([glowRef1.current, glowRef2.current, glowRef3.current], {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                stagger: 0.3,
                ease: "expo.out"
            })
                .to(titleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power4.out"
                }, "-=1")
                .to(buttonRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.6");

            // Subtle float loops
            gsap.to(glowRef1.current, { y: "+=30", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
            gsap.to(glowRef2.current, { y: "-=20", x: "+=15", duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img src="/background.png" className="w-full h-full object-cover opacity-40" alt="" />
                <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
            </div>

            {/* Dynamic Glows */}
            <div ref={glowRef1} className="absolute top-1/4 -left-10 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
            <div ref={glowRef2} className="absolute bottom-1/4 -right-10 w-64 h-64 md:w-96 md:h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            <div ref={glowRef3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-200 h-100 bg-cyan-400/5 rounded-full blur-[120px]" />

            <div className="relative z-10 text-center px-6 w-full max-w-5xl">
                <div ref={titleRef} className="flex flex-col items-center mb-12">
                    <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4">
                        Smart Receipt Management
                    </span>

                    <h1 className="text-white font-black text-7xl sm:text-8xl md:text-9xl tracking-tighter italic transform -skew-x-6 leading-none">
                        Claimr<span className="text-cyan-400">.</span>
                    </h1>

                    <p className="mt-6 text-slate-400 text-base sm:text-lg max-w-md mx-auto font-light leading-relaxed">
                        Snap. Scan. <span className="text-white font-medium">Claim</span>.<br />
                        Effortless data extraction for the modern spender.
                    </p>
                </div>

                {/* Updated Button Group */}
                <div ref={buttonRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Primary Action */}
                    {/* Primary Button */}
                    <Button
                        className="w-full sm:w-auto min-w-45 px-8 py-4 rounded-full
               bg-cyan-500 text-black font-bold
               transition-all duration-200 ease-out
               hover:scale-105 hover:-translate-y-1 hover:bg-cyan-400
               hover:shadow-[0_10px_30px_rgba(6,182,212,0.5)]
               active:scale-95 transform-gpu"
                        onClick={OnNavigateToSignUp}
                    >
                         Create account
                    </Button>

                    {/* Secondary Button */}
                    <Button
                        className="w-full sm:w-auto min-w-45 px-8 py-4 rounded-full
               bg-white/5 text-white font-semibold
               border border-white/10 backdrop-blur-md
               transition-all duration-200 ease-out
               hover:scale-105 hover:-translate-y-1 hover:bg-white/10
               active:scale-95 transform-gpu"
                        onClick={OnNavigateToLogin}
                    >
                        Login to Claimr
                    </Button>
                </div>
            </div>
        </section>
    );
}