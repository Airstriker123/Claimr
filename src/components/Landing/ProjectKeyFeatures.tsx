import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
            // Split title letters for gradient animation
            if (titleRef.current) {
                const titleText = titleRef.current.textContent || '';
                titleRef.current.innerHTML = titleText
                    .split('')
                    .map(
                        (char) =>
                            `<span class="inline-block bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
  [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
  text-transparent  tracking-[0] leading-[normal] 
                         will-change-transform will-change-opacity"
              >${char === ' ' ? '&nbsp;' : char}</span>`
                    )
                    .join('');

                // Animate letters in sequence
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

                // Floating + subtle glow
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

            // Animate list items
            if (listRef.current) {
                gsap.from(listRef.current.children, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 0,
                    x: -50,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                });
            }

            // Button animation
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

            // Image parallax
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



    return (
        <div
            ref={containerRef}
            className="pt-10 pb-20 px-16 flex items-center justify-center gap-16 w-full"
        >
            {/* Image */}
            <div
                ref={imageRef}
                className="flex flex-col h-[432px] flex-1 grow border-[3px] border-solid border-transparent
[border-image:linear-gradient(180deg,rgba(0,180,255,1)_0%,rgba(0,255,255,1)_100%)_1] bg-[url(/3d.webp)] bg-cover bg-center rounded-2xl transform-gpu

"
            >
                <div className="w-full h-full rounded-2xl" />
            </div>

            {/* Text */}
            <div className="flex flex-col items-start justify-center gap-12 flex-1 grow">
                <div className="flex flex-col gap-6 w-full">
                    <div
                        ref={titleRef}
                        className="relative flex items-center justify-center self-stretch mt-[-1px] font-bold text-4xl tracking-[-0.72px] leading-[43.2px]"
                    >
                        Claimr is 100% open source!
                    </div>
                </div>

                <ul
                    ref={listRef}
                    className="list-none text-white text-lg font-normal tracking-[-0.09px] leading-[26.1px] space-y-3"
                >
                    <li className="font-medium">
                        100% Open Source: Claimr’s tax return tracker is fully transparent, allowing users to inspect the code, verify how data is handled, and trust that no hidden processes occur.
                    </li>
                    <li className="font-medium">
                        Dynamic Animations: GSAP was used to animate elements such as transitions, text, and movement between sections.
                    </li>
                    <li className="font-medium">
                        Responsive Interface: Styled using TailwindCSS for a futuristic, game-like aesthetic that adapts across devices.
                    </li>
                    <li className="font-medium">
                        Secure: We took multiple measures to ensure the security of this app and your data.
                    </li>
                </ul>


                <button
                    ref={buttonRef}
                    onClick={
                    ()=> window.open("https://github.com/Airstriker123/Claimr.git")
                }
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                    className="all-[unset] box-border inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-200 via-cyan-400 to-cyan-800 cursor-pointer transform-gpu"
                >
                    <div className="relative flex items-center justify-center w-fit mt-[-1px] font-medium text-white text-lg text-center tracking-[-0.09px] leading-[26.1px] whitespace-nowrap">
                        View Claimr source code
                    </div>
                </button>
            </div>
        </div>
    );
}

