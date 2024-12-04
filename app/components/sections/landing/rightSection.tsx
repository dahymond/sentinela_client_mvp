import { Brain, ShieldCheck, Zap } from "lucide-react"
import ParticleNetwork from "../../ui/particleNetwork"

const RightSectionLandingPage = ()=>{
    {/* Right Side - Particle Network Design */}
    return <div className="hidden lg:block flex-1 relative bg-[#0a192f] overflow-hidden">
        <ParticleNetwork />

        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
            <h2 className="text-4xl font-light leading-tight mb-6">
                Revolutionizing financial crime prevention
                <br />
                with hybrid AI technology.
            </h2>

            <p className="text-gray-300 mb-8 max-w-xl">
                Sentinela AI combines the expertise of subject matter experts with cutting-edge AI to provide unparalleled compliance solutions for financial institutions.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <ShieldCheck className="h-8 w-8 mb-2 text-[#4ade80]" />
                    <h3 className="text-lg font-semibold mb-1">Advanced Compliance</h3>
                    <p className="text-sm text-gray-300">AI-driven risk assessment and regulatory adherence</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <Brain className="h-8 w-8 mb-2 text-[#60a5fa]" />
                    <h3 className="text-lg font-semibold mb-1">Hybrid Intelligence</h3>
                    <p className="text-sm text-gray-300">Seamless integration of AI and human expertise</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <Zap className="h-8 w-8 mb-2 text-[#f59e0b]" />
                    <h3 className="text-lg font-semibold mb-1">Real-time Detection</h3>
                    <p className="text-sm text-gray-300">Instant identification of suspicious activities</p>
                </div>
            </div>
        </div>
    </div>
}

export default RightSectionLandingPage