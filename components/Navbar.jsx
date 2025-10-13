"use client";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const router = useRouter();

  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <span className="text-green-600">S-</span>Mart
            <span className="text-green-600 text-5xl leading-0">.</span>
            <Protect plan="plus">
              <p className="absolute text-xs font-semibold -top-1 -right-6 px-2 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                plus
              </p>
            </Protect>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/" className="text-base">Home</Link>
            <Link href="/shop" className="text-base">Shop</Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              Cart
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>
            {!user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonPopoverFooter: "flex flex-col",
                  },
                  layout: {
                    userButtonPopoverFooter: ({ user }) => (
                      <>
                        <div className="clerk-user-button-popover-footer">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-slate-100"
                            onClick={() => router.push("/orders")}
                          >
                            My Orders
                          </button>
                        </div>
                      </>
                    ),
                  },
                }}
              />
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex sm:hidden items-center gap-1 text-slate-600">
            <Link href="/" className="text-sm px-1 py-1">Home</Link>
            <Link href="/shop" className="text-sm px-1 py-1">Shop</Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-1 text-slate-600 ml-2"
            >
              <ShoppingCart size={18} />
              <span className="absolute -top-3 -right-0 w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            {user ? (
              <div className="ml-2">
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={<ShoppingCart size={16} />}
                      label="My Orders"
                      onClick={() => router.push("/orders")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="px-5 py-1 bg-indigo-500 hover:bg-indigo-600 text-xs transition text-white rounded-full ml-2"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;