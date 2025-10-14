'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useUser, useAuth } from "@clerk/nextjs";
 // FIX: useAuth should come from @clerk/nextjs
import { uploadCart, fetchCart } from "@/lib/features/cart/cartSlice"; // FIX: import fetchCart
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";


export default function PublicLayout({ children }) {
    const dispatch = useDispatch()
    const { user } = useUser()
    const { getToken } = useAuth()
    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchProducts({}))
    }, [])

    useEffect(() => {
        if (user) {
            dispatch(fetchCart({ getToken }))
            dispatch(fetchAddress({getToken}))
            dispatch(fetchUserRatings({ getToken }))
        }
    }, [user])

    useEffect(() => {
        if (user) {
            dispatch(uploadCart({ getToken }))
        }
    }, [cartItems])

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
} 
