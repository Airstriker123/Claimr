import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface HeroProps {
    OnNavigateToLogin?: () => void;
    OnNavigateToSignUp?: () => void;
}


export default function Hero({ OnNavigateToLogin, OnNavigateToSignUp }: HeroProps): JSX.Element
{
    /*
    component for the hero section of the homepage
    - uses gsap for animations
    - uses tailwind for styling
    - uses useRef for reference to elements
    - uses useEffect for animations
    - handles look of the hero section
     */
    // useRef = reacts version of getelementbyid
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const glowRef1 = useRef<HTMLDivElement>(null);
    const glowRef2 = useRef<HTMLDivElement>(null);
    const glowRef3 = useRef<HTMLDivElement>(null);


    // Button hover + click
    const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        gsap.to(e.currentTarget, {
            scale: 1.05,
            boxShadow: '0 10px 30px rgba(0, 243, 255, 0.467)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        gsap.to(e.currentTarget, {
            scale: 1,
            boxShadow: '0 0 0px rgba(144,0,255,0)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };


    //animations for the hero section
    useEffect(() =>
    {
        const ctx = gsap.context(() =>
        {
            // Initial state - hide elements
            gsap.set([titleRef.current, buttonRef.current], { opacity: 0, y: 50 });
            gsap.set([glowRef1.current, glowRef2.current, glowRef3.current], { scale: 0.8, opacity: 0 });

            // Create timeline for hero entrance
            const tl = gsap.timeline({ delay: 0.5 });

            // Animate glow effects first
            tl.to([glowRef1.current, glowRef2.current, glowRef3.current], {
                scale: 1,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out"
            })
                // Then animate title
                .to(titleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.8")
                // Finally animate button
                .to(buttonRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }, "-=0.4");

            // Floating animation for glow effects
            gsap.to(glowRef1.current, {
                y: "+=20",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(glowRef2.current, {
                y: "-=15",
                x: "+=10",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(glowRef3.current, {
                scale: 1.1,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, sectionRef);

        return ():void => ctx.revert();
    }, []);

    const title = "tk-nasalization\n" +
        "  bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]\n" +
        "  [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]\n" +
        "  font-bold text-transparent text-[200px] tracking-[0] leading-[normal] [-webkit-text-stroke:1px_#FFFFFF]\n" +
        "                text-9xl md:text-8xl  mb-8 uppercase"

    return (
        <section ref={sectionRef} className="bg-[url('/background.png')] bg-cover bg-center bg-no-repeat relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">

            {/* Cyan/Aqua Gradient Background */}
            <div className="bg-cover bg-center bg-no-repeat  absolute inset-0 bg-linear-to-br from-black via-cyan-900/10 to-black">
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40"></div>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400/10 to-transparent"></div>
            </div>

            {/* Cyan Glow Effects */}
            <div ref={glowRef1} className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl"></div>
            <div ref={glowRef2} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl"></div>
            <div ref={glowRef3} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center px-6">
                <h1 ref={titleRef} className="">
                    <b>
                        <span className={title + "drop-shadow-cyan-300"}>Welcome to<br /></span>
                   <span className={title}>Claimr</span></b>
                </h1>

                <div ref={buttonRef}>
                    <button
                        className="mr-2 px-6 py-3 rounded-lg  text-base
                 bg-linear-to-r from-cyan-200 via-cyan-400 to-cyan-800
                border-2 border-cyan-500 hover:border-cyan-400 hover:text-cyan-100
                transition duration-300 text-white font-bold transform-gpu"
                        onClick={OnNavigateToLogin}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                    >
                        Login to Claimr
                    </button>

                    <button
                        className="px-8 py-3 rounded-lg  text-base
                 bg-linear-to-r from-cyan-200 via-cyan-400 to-cyan-800
                border-2 border-cyan-500 hover:border-cyan-400 hover:text-cyan-100
                transition duration-300 transform-gpu text-white font-bold"
                        onClick={OnNavigateToSignUp}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                    >
                        Create an account
                    </button>
                </div>
            </div>
        </section>

    );
}