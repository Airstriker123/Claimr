import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import ReactLogo from "../../assets/tech_used/react.png"
import GSAPLogo from "../../assets/tech_used/gsap.png"
import TailWind from "../../assets/tech_used/tailwind.png"
import Flask from "../../assets/tech_used/flask.png"
import TypeScript from "../../assets/tech_used/typescript.png"
import WebStorm from "../../assets/tech_used/webstorm.png"
import Sqlite from "../../assets/tech_used/sqlite.png"
import Tesseract from "../../assets/tech_used/tesseract.png"

gsap.registerPlugin(ScrollTrigger)

const logos = [
    // logos to show
    ReactLogo,
    GSAPLogo,
    TailWind,
    Flask,
    TypeScript,
    WebStorm,
    Sqlite,
    Tesseract


]

export default function Logos(): JSX.Element
{
    // logo component to show
    const sectionRef = useRef(null)
    const marqueeRef = useRef(null)

    useEffect(() =>
    {
        // animation effects
        const ctx = gsap.context(() =>
        {
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
        }, sectionRef)

        return () => ctx.revert()
    }, []) // end of animation logic

    // render object page layout
    return (
        <div
            ref={sectionRef}
            className="flex flex-col items-center gap-8 px-16 py-20 w-full"
        >
            <h1
                className="bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(0,123,255,1)_100%)]
  [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
  text-transparent  tracking-[0] leading-[normal]  text-[32px] text-center font-medium"
            >
                 Claimr was made possible through the tools listed below
            </h1>

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
