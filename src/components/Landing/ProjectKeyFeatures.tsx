import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {Button} from "@/ui/button"
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

             // 1. Entrance Animation
             gsap.from(buttonRef.current, {
                 scrollTrigger: {
                     trigger: containerRef.current,
                     start: 'top 75%',
                     toggleActions: 'play none none reverse',
                 },
                 opacity: 0,
                 y: 30,
                 scale: 0.8,
                 duration: 1,
                 ease: 'elastic.out(1, 0.5)', // Adds a slight "bounce" to the entrance
             });

// 2. Idle "Pulse" Animation (Starts after entrance)
             gsap.to(buttonRef.current, {
                 boxShadow: "0 0 20px rgba(34, 211, 238, 0.6)",
                 repeat: -1,
                 yoyo: true,
                 duration: 2,
                 ease: "sine.inOut"
             });


             const btn = buttonRef.current;
             if (btn) {
                 btn.addEventListener("mousemove", (e) => {
                     const rect = btn.getBoundingClientRect();
                     const x = e.clientX - rect.left - rect.width / 2;
                     const y = e.clientY - rect.top - rect.height / 2;

                     gsap.to(btn, {
                         x: x * 0.2,
                         y: y * 0.2,
                         duration: 0.3,
                         ease: "power2.out"
                     });
                 });

                 btn.addEventListener("mouseleave", () => {
                     gsap.to(btn, {
                         x: 0,
                         y: 0,
                         duration: 0.5,
                         ease: "elastic.out(1, 0.3)"
                     });
                 });
             }

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






    return (
        <div
            ref={containerRef}
            className="bg-background/0 rounded-full pt-10 pb-20 px-16 flex items-center justify-center gap-16 w-full"
        >
            {/* Image */}
            <div
                ref={imageRef}
                className="flex flex-col h-108 flex-1 grow border-[3px] border-solid border-transparent
[border-image:linear-gradient(180deg,rgba(0,180,255,1)_0%,rgba(0,255,255,1)_100%)_1] bg-[url(/3d.webp)] bg-cover bg-center rounded-4xl transform-gpu

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
                    <li className="font-medium">
                        Progressive Web App: Downloadable on mobile and other devices with access to a web browser.
                    </li>
                </ul>


                <Button
                    ref={buttonRef}
                    onClick={
                    ()=> window.open("https://github.com/Airstriker123/Claimr.git")
                }

                    className="all-[unset] box-border inline-flex items-center
                     justify-center gap-2  bg-linear-to-r
                     from-cyan-200 via-cyan-400 to-cyan-800 cursor-pointer
                     w-full sm:w-auto min-w-45 px-8 py-4 rounded-full
               bg-cyan-500 text-black font-bold
               transition-all duration-200 ease-out
               hover:scale-105 hover:-translate-y-1 hover:bg-cyan-400
               hover:shadow-[0_10px_30px_rgba(6,182,212,0.5)]
               active:scale-95 transform-gpu
                     "
                >
                    <div className="relative flex items-center justify-center bg-blend-color text-balance w-fit -mt-px
                    font-medium  text-lg text-center tracking-[-0.09px] leading-[26.1px] whitespace-nowrap">
                       View Claimr source code
                    </div>
                </Button>
            </div>
        </div>
    );
}

