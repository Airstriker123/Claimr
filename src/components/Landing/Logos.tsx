import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import ReactLogo from "../../assets/tech_used/react.png"
import GSAPLogo from "../../assets/tech_used/gsap.png"
import TailWind from "../../assets/tech_used/tailwind.png"
import Three from "../../assets/tech_used/three.png"
import TypeScript from "../../assets/tech_used/typescript.png"
import WebStorm from "../../assets/tech_used/webstorm.png"

gsap.registerPlugin(ScrollTrigger)

const logos = [
    ReactLogo,
    GSAPLogo,
    TailWind,
    Three,
    TypeScript,
    WebStorm,
]

export default function Logos(): JSX.Element {
    const sectionRef = useRef(null)
    const titleRef = useRef(null)
    const marqueeRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* Fade + slide section in/out (scroll back supported) */
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                        end: "top 40%",
                        scrub: true,
                    },
                }
            )

            /* Title subtle pop */
            gsap.from(titleRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
            })

            /* Marquee entrance */
            gsap.from(marqueeRef.current, {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: marqueeRef.current,
                    start: "top 85%",
                },
            })

            /* Infinite marquee motion */
            gsap.to(marqueeRef.current, {
                xPercent: -50,
                duration: 25,
                ease: "none",
                repeat: -1,
            })

            /* Scroll velocity affects marquee speed */
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                onUpdate: () => {
                    gsap.to(marqueeRef.current, {
                        timeScale: gsap.utils.clamp(0.8, 2, 1 + 0.002),
                        duration: 0.25,
                        ease: "power2.out",
                    })
                },
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [])


    return (
        <div
            ref={sectionRef}
            className="flex flex-col items-center gap-8 px-16 py-20 w-full"
        >
            <p
                ref={titleRef}
                className="bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
  [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
  text-transparent  tracking-[0] leading-[normal]  text-[32px] text-center font-medium"
            >
                 Claimr was made possible through the tools listed below
            </p>

            {/* Marquee container */}
            <div className="relative self-stretch overflow-hidden
        bg-linear-to-r from-blue-600/20 to-cyan-400/80">

                {/* Moving track */}
                <div
                    ref={marqueeRef}
                    className="flex w-max items-center gap-6"
                >
                    {[...logos, ...logos].map((logo, index) => (
                        <div
                            key={index}
                            className="h-20 p-4 flex justify-center items-center"
                        >
                            <img
                                src={logo}
                                className="w-48 h-28 object-contain"
                                alt="Tech logo"
                            />
                        </div>
                    ))}
                </div>

                {/* Fade edges */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-black/60 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-black/60 to-transparent" />
            </div>
        </div>
    )
}
