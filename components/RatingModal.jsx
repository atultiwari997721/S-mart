'use client'
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addRating } from "@/lib/features/rating/ratingSlice";
import { XIcon, Star } from "lucide-react";
import axios from "axios";

const RatingModal = ({ ratingModal, setRatingModal }) => {
    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            toast('Please select a rating');
            return;
        }
        if (review.length < 5) {
            toast('Write a short review');
            return;
        }
        setSubmitting(true);
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/rating', {
                orderId: ratingModal.orderId,
                productId: ratingModal.productId,
                rating,
                review
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(addRating(data.rating));
            toast.success(data.message);
            setRatingModal(null);
        } catch (error) {
            const msg = error?.response?.data?.error || error.message;
            if (msg.toLowerCase().includes('already rated')) {
                toast.error('You have already rated this product.');
                setRatingModal(null);
            } else {
                toast.error(msg);
            }
        }
        setSubmitting(false);
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${rating > i ? "text-green-400 fill-current" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400'
                    placeholder='Write your review (optional)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button
                    onClick={handleSubmit}
                    className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition'
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
            </div>
        </div>
    )
}

export default RatingModal