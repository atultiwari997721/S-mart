import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {

    return (
        <div className='px-4 my-16 max-w-6xl mx-auto'>
            <Title visibleButton={false} title='Our Specifications' description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            {/* MODIFIED: Changed grid-cols-2 to grid-cols-3 to show all three side-by-side on mobile */}
            <div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 gap-y-5 mt-16'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            // FURTHER REDUCED: Padding, height, and text sizes for a smaller fit
                            <div className='relative h-32 px-1 flex flex-col items-center justify-center w-full text-center border rounded-lg group' style={{ backgroundColor: spec.accent + 10, borderColor: spec.accent + 30 }} key={index}>
                                <h3 className='text-slate-800 text-xs font-medium px-1'>{spec.title}</h3>
                                <p className='text-[10px] text-slate-600 mt-1 px-1 hidden sm:block'>{spec.description}</p>
                                
                                {/* Hide description on the smallest screens to save space and only show the title */}
                                <p className='text-[10px] text-slate-600 mt-1 px-1 sm:hidden'>{spec.description.split(' ').slice(0, 3).join(' ')}...</p> 
                                
                                <div className='absolute -top-3 text-white size-6 flex items-center justify-center rounded-md group-hover:scale-105 transition' style={{ backgroundColor: spec.accent }}>
                                    <spec.icon size={12} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default OurSpecs