import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from "@/ui/button"

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedAbout()
{
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        const ctx = gsap.context(() =>
        {
            if (titleRef.current)
            {
                const titleText = titleRef.current.textContent || '';
                titleRef.current.innerHTML = titleText
                    .split('')
                    .map(
                        (char) =>
                            `<span class="inline-block 
                          will-change-transform will-change-opacity
                          bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
                          [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
                          text-transparent tracking-[0] leading-[normal]
                          "
              >${char === ' ' ? '&nbsp;' : char}</span>`
                    )
                    .join('');

                gsap.from(titleRef.current.children, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 0,
                    y: 20,
                    rotationX: -90,
                    stagger: 0.03,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                });

                gsap.to(titleRef.current.children, {
                    y: '+=5',
                    textShadow: '0 0 10px rgba(0,123,255,1)',
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    stagger: 0.03,
                });
            }

            if (paragraphRef.current)
            {
                gsap.from(paragraphRef.current, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 0,
                    y: 30,
                    duration: 1,
                    ease: 'power3.out',
                });
            }

            if (buttonRef.current)
            {
                gsap.from(buttonRef.current, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 0,
                    y: 20,
                    scale: 0.9,
                    duration: 0.8,
                    ease: 'back.out(1.4)',
                });
            }

            if (imageRef.current)
            {
                gsap.fromTo(
                    imageRef.current, { opacity: 0, scale: 0.9, y: 0 }, {
                        opacity: 1,
                        scale: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top 80%',
                            end: 'top 50%',
                            scrub: true,
                        },
                    }
                );

                gsap.to(imageRef.current,
                {
                    scrollTrigger:
                    {
                        trigger: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                    y: -40,
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        gsap.to(e.currentTarget,
        {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
        });
    };

    return (
        <section
            ref={containerRef}
            className="pt-10 md:pt-20 pb-10 px-6 sm:px-10 md:px-16 flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-16 w-full"
        >
            {/* Left content */}
            <div className="flex flex-col items-center lg:items-start justify-center gap-8 md:gap-12 flex-1 grow w-full">
                <h1 className="flex flex-col gap-6 w-full">
                    <div
                        ref={titleRef}
                        className="
            relative flex self-stretch mt-[-1px] font-bold
            text-3xl md:text-4xl tracking-tight leading-tight md:leading-[43.2px]

            items-center justify-center text-center
            lg:items-start lg:justify-start lg:text-center
        "
                    >
                        About Claimr
                    </div>
                </h1>

                <p
                    ref={paragraphRef}
                    className="relative flex flex-col items-center lg:items-start justify-center self-stretch drop-shadow-[black_1px_1px_1px]
                       tracking-tight leading-relaxed
                       text-slate-100 text-sm sm:text-base md:text-lg font-normal space-y-4 max-w-2xl text-center lg:text-left"
                >
                    Claimr is a tax return tracker built for
                    transparency and trust. It helps Australians organise income, deductions, and receipts
                    in one simple interface, with clear summaries that make tax time easier. Because the entire
                    codebase is public, users can verify exactly how their data is handled and rely on a tool
                    that’s secure, transparent, and community‑driven.
                </p>

                <Button
                    ref={buttonRef}
                    onClick={handleButtonClick}
                    className="
                    w-full sm:w-auto px-10 py-6 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest
                    hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer
                    "
                >
                    <div className="relative flex items-center justify-center w-fit -mt-px font-bold text-base md:text-lg text-center tracking-tight whitespace-nowrap">
                        Get in Contact with us!
                    </div>
                </Button>
            </div>

            {/* Right image configs */}
            <div
                ref={imageRef}
                className="
                flex flex-col h-64 sm:h-80 md:h-108 w-full lg:flex-1 grow border-[3px] border-solid border-transparent
                [border-image:linear-gradient(180deg,rgba(0,180,255,1)_0%,rgba(0,255,255,1)_100%)_1]
                bg-[url(/Landing/about.webp)] bg-cover bg-center rounded-2xl transform-gpu
                "
            >
                <div className="w-full h-full rounded-2xl" />
            </div>
        </section>
    );
}