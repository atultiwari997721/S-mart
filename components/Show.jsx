'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Show = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

    return (
        <div className='mx-6'>
            <div className='flex flex-row gap-4 max-w-2xl mx-auto my-8'>
                {/* First Section */}
                <div className='flex-1 flex flex-col items-start justify-between bg-orange-200 rounded-2xl p-4 group min-w-[120px]'>
                    <div>
                        <p className='text-lg font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-32'>Best products</p>
                        <p className='flex items-center gap-1 mt-2 text-xs'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={14} /></p>
                    </div>
                    <Image className='w-20 mt-2' src={assets.hero_product_img1} alt="" />
                </div>
                {/* Second Section */}
                <div className='flex-1 flex flex-col items-start justify-between bg-blue-200 rounded-2xl p-4 group min-w-[120px]'>
                    <div>
                        <p className='text-lg font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-32'>20% discounts</p>
                        <p className='flex items-center gap-1 mt-2 text-xs'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={14} /></p>
                    </div>
                    <Image className='w-20 mt-2' src={assets.hero_product_img2} alt="" />
                </div>
            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Show