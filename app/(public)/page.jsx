'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import Show from "@/components/Show";


export default function Home() {
    return (
        <div>
            {/* Show Hero only on md (laptop) and up */}
            <div className="hidden md:block">
                <Hero />
            </div>
            {/* Show Show.jsx only on mobile */}
            <div className="block md:hidden">
                <Show />
            </div>
            {/* Remove gap between LatestProducts and BestSelling */}
            <div className="p-0 m-0">
                <LatestProducts />
                <BestSelling />
            </div>
            <OurSpecs />
            <Newsletter />
        </div>
    );
} 
