// Landing.tsx
import Hero from "./Hero";
import Logos from "./Logos";
import About from "./About";
import ProjectKeyFeatures from "./ProjectKeyFeatures";
import Footer from "./Footer";
//animations
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);



export default function Landing(): JSX.Element
{
    return (
        <main>
            {/* Render content */}
                <div
                    className="bg-[linear-gradient(180deg,rgba(0,40,60,0.35)_50%,rgba(0,40,60,0.7)_65%,rgba(0,0,0,1)_83%,rgba(0,255,255,0.8)_100%)]
" data-model-id="1:6"
                    >
                    <Hero/>
                    <Logos />
                    <About/>
                    <ProjectKeyFeatures/>
                    <Footer />
                </div>
        </main>
    );
}
