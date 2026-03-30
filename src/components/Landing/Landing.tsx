// Landing.tsx
import Hero from "./Hero";
import Logos from "./Logos";
import About from "./About";
import ProjectKeyFeatures from "./ProjectKeyFeatures";
import Footer from "./Footer";
import Cards from "./Cards";
//animations
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";


gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export interface LandingProps {
    onNavigateToSignUp: () => void;
    onNavigateToLogin: () => void;
}



export default function Landing({onNavigateToSignUp, onNavigateToLogin}: LandingProps): JSX.Element
{
    return (
                <div
                    className="bg-[linear-gradient(180deg,rgba(0,40,60,0.35)_50%,rgba(0,40,60,0.7)_65%,rgba(0,0,0,1)_83%,rgba(0,255,255,0.1)_100%)]
" data-model-id="1:6"
                    >
                    {/* Render content */}
                    <main className="bg-cover bg-center bg-no-repeat">
                        <Hero OnNavigateToLogin={onNavigateToLogin}
                        OnNavigateToSignUp={onNavigateToSignUp}/>
                    </main>
                    <Logos />
                    <About/>
                    <Cards/>
                    <ProjectKeyFeatures/>
                    <Footer />
                </div>

    );
}
