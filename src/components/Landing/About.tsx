import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);


export default function AnimatedAbout() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // --- Split title letters for gradient + animation ---
            if (titleRef.current) {
                const titleText = titleRef.current.textContent || '';
                titleRef.current.innerHTML = titleText
                    .split('')
                    .map(
                        (char) =>
                            `<span class="inline-block 
                          will-change-transform will-change-opacity
                          bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
  [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
  text-transparent  tracking-[0] leading-[normal]
                          "
              >${char === ' ' ? '&nbsp;' : char}</span>`
                    )
                    .join('');

                // Scroll reveal
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

                // Floating + glow effect
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

            // Paragraph fade/slide
            if (paragraphRef.current) {
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

            // Button animation
            if (buttonRef.current) {
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

            // Image fade + parallax
            if (imageRef.current) {
                gsap.fromTo(
                    imageRef.current,
                    { opacity: 0, scale: 0.9, y: 0 },
                    {
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

                gsap.to(imageRef.current, {
                    scrollTrigger: {
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


    // Button hover + click
    const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
        gsap.to(e.currentTarget, {
            scale: 1.05,
            boxShadow: '0 10px 30px rgba(0, 243, 255, 0.467)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        gsap.to(e.currentTarget, {
            scale: 1,
            boxShadow: '0 0 0px rgba(144,0,255,0)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        gsap.to(e.currentTarget, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
        });
    };


    return (
        <div
            ref={containerRef}
            className="pt-20 pb-10 px-16 flex items-center justify-center gap-16 w-full"
        >
            {/* Left content */}
            <div className="flex flex-col items-start justify-center gap-12 flex-1 grow">
                <div className="flex flex-col gap-6 w-full">
                    <div
                        ref={titleRef}
                        className="relative flex items-center justify-center self-stretch mt-[-1px] font-bold text-4xl tracking-[-0.72px] leading-[43.2px]"
                    >
                        About Claimr
                    </div>
                </div>

                <p
                    ref={paragraphRef}
                    className="relative flex items-center justify-center self-stretch font-medium
                     text-white text-lg tracking-[-0.09px] leading-[26.1px]"
                >
                    Claimr is a tax return tracker built for
                    transparency and trust. It helps Australians organise income, deductions, and receipts
                    in one simple interface, with clear summaries that make tax time easier. Because the entire
                    codebase is public, users can verify exactly how their data is handled and rely on a tool
                    that’s secure, transparent, and community‑driven.
                </p>

                <button
                    ref={buttonRef}
                    onClick={handleButtonClick}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                    className="all-[unset] box-border inline-flex items-center
                    justify-center gap-2 px-4 py-3 rounded-xl
                    bg-linear-to-r from-cyan-200 via-cyan-400 to-cyan-800
                    "
                >
                    <div className="relative flex items-center justify-center w-fit mt-[-1px] font-medium text-white text-lg text-center tracking-[-0.09px] leading-[26.1px] whitespace-nowrap">
                        Get in Contact with us!
                    </div>
                </button>
            </div>

            {/* Right image */}
            <div
                ref={imageRef}
                className="
                flex flex-col h-[432px] flex-1 grow border-[3px] border-solid border-transparent
                [border-image:linear-gradient(180deg,rgba(0,180,255,1)_0%,rgba(0,255,255,1)_100%)_1]
                bg-[url(/3d.webp)] bg-cover bg-center rounded-2xl transform-gpu
                "
            >
                <div className="w-full h-full rounded-2xl" />
            </div>
        </div>
    );
}
