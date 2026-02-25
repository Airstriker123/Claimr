import './App.css'
import Landing from "./components/Landing/Landing.tsx"

export default function App(): JSX.Element
{
 return(
     <main className="min-h-screen text-white overflow-x-hidden relative smooth-scroll
             bg-cover bg-center bg-no-repeat">
        <Landing/>
     </main>
 )
}