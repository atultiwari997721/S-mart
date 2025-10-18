'use client';

import { useUser } from '@clerk/nextjs';
import React, { useMemo, useState } from 'react';

// --- Global Configuration: Your Single Drive Link ---
// The link you want to apply to ALL resources once a Category is selected.
const GLOBAL_DRIVE_LINK = 'https://drive.google.com/drive/folders/1fUvwTJ2ftC-ULlKzPUnz_Kiyf0XGlTMA';

// --- Static Data Simulation (Kept for navigation only) ---
const BRANCHES = ['CSE', 'AIML', 'Civil', 'Chemical', 'Electrical', 'Electronics', 'ECE', 'IT', 'DS', 'FireTech'];
const CATEGORIES = ['MST1', 'MST2', 'EST', 'Notes', 'Assignments', 'PYQS'];
const SEMESTERS = ['Semester-1', 'Semester-2', 'Semester-3', 'Semester-4', 'Semester-5', 'Semester-6', 'Semester-7', 'Semester-8'];

/**
 * NOTE: ALL_RESOURCES is now DEPRECATED for the FileListItem and FilesView,
 * as we are now redirecting the user to a GLOBAL_DRIVE_LINK upon category selection.
 * I will remove the unused ALL_RESOURCES to simplify the code.
 */

// --- Reusable Components (Modified CardButton and BackButton are kept) ---

const CardButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="
            p-4 md:p-6 rounded-xl shadow-md transition duration-300 ease-in-out w-full bg-white text-gray-800 
            text-lg font-semibold text-center hover:ring-4 hover:ring-purple-300 hover:shadow-xl
            active:bg-purple-50 transform hover:-translate-y-0.5
        "
    >
        {label}
    </button>
);

const BackButton = ({ onClick }) => (
    <button
        onClick={onClick}
        aria-label="Go back to the previous selection stage"
        className="text-sm px-3 py-2 bg-purple-200 text-purple-800 rounded-full hover:bg-purple-300 transition shrink-0 font-medium shadow-sm"
    >
        <span className="mr-1">←</span> Back
    </button>
);

// --- View Components ---

const SemesterView = ({ onSelect }) => (
    <section className="p-4 md:p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
            Select Your <span className="text-purple-600">Semester</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {SEMESTERS.map(semester => (
                <CardButton key={semester} label={semester} onClick={() => onSelect(semester)} />
            ))}
        </div>
    </section>
);

const BranchView = ({ onSelect }) => (
    <section className="p-4 md:p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
            Select Your <span className="text-purple-600">Branch</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {BRANCHES.map(branch => (
                <CardButton key={branch} label={branch} onClick={() => onSelect(branch)} />
            ))}
        </div>
    </section>
);

const CategoryView = ({ branch, semester, onSelect }) => (
    <section className="p-4 md:p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
            <span className="text-purple-600">{branch} / {semester}</span> | Select Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {CATEGORIES.map(category => (
                <CardButton key={category} label={category} onClick={() => onSelect(category)} />
            ))}
        </div>
    </section>
);

// --- NEW View: Replaced FilesView with a simpler LinkView ---
const LinkView = ({ semester, branch, category }) => {
    return (
        <section className="p-4 md:p-8">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
                Access <span className="text-purple-600">{category}</span> Folder
            </h2>
            <p className="text-center text-gray-500 mb-8 text-lg">
                <span className="font-semibold">{semester} / {branch}</span> Resources
            </p>

            <div className="max-w-xl mx-auto text-center p-8 bg-purple-100 rounded-2xl shadow-xl border-t-8 border-purple-500">
                <p className="font-bold text-xl text-purple-700 mb-4">
                    Open {category} Resources on Google Drive
                </p>
                <p className="text-sm mt-2 text-purple-600 mb-6">
                    You're being directed to the centralized Google Drive folder for all subjects in this section.
                </p>
                
                {/* The main action button with the GLOBAL_DRIVE_LINK */}
                <a
                    href={GLOBAL_DRIVE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        inline-flex items-center justify-center
                        px-8 py-3 text-white font-bold rounded-full text-lg
                        bg-gradient-to-r from-green-500 to-teal-500
                        hover:from-green-600 hover:to-teal-600 transition duration-300 shadow-xl 
                        transform hover:scale-[1.02] active:scale-[0.98]
                    "
                    aria-label={`Open Google Drive folder for ${category}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Go to Folder
                </a>
            </div>
        </section>
    );
};


// --- Main Application Component ---

const App = () => {
    const { user } = useUser();

    // State tracks the selection path
    const [state, setState] = useState({
        semester: null,
        branch: null,
        category: null,
    });

    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-gray-400 p-4 bg-gradient-to-br from-purple-50 to-blue-50">
                <h1 className="text-2xl sm:text-4xl font-semibold text-center leading-tight">
                    Please <span className="text-purple-600">Login</span> to access the <span className="text-green-700">S-mart Student Hub</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600">Your gateway to academic resources.</p>
            </div>
        );
    }

    const handleSelect = (level, value) => {
        let newState = { ...state };
        newState[level] = value;

        if (level === 'semester') {
            newState.branch = null;
            newState.category = null;
        } else if (level === 'branch') {
            newState.category = null;
        }

        setState(newState);
    };

    const handleBack = () => {
        if (state.category) {
            setState(prev => ({ ...prev, category: null }));
        } else if (state.branch) {
            setState(prev => ({ ...prev, branch: null, category: null }));
        } else if (state.semester) {
            setState(prev => ({ ...prev, semester: null, branch: null, category: null }));
        }
    };

    let CurrentView;
    if (!state.semester) {
        CurrentView = <SemesterView onSelect={(semester) => handleSelect('semester', semester)} />;
    } else if (!state.branch) {
        CurrentView = <BranchView onSelect={(branch) => handleSelect('branch', branch)} />;
    } else if (!state.category) {
        // User is selecting the Category (e.g., MST1)
        CurrentView = <CategoryView
            branch={state.branch}
            semester={state.semester}
            onSelect={(category) => handleSelect('category', category)}
        />;
    } else {
        // User has selected all three (Semester, Branch, Category), show the final link
        CurrentView = <LinkView
            semester={state.semester}
            branch={state.branch}
            category={state.category}
        />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 antialiased font-['Inter']">
            {/* Header (Fixed at top) */}
            <header className="flex items-center justify-between p-4 md:p-6 bg-white shadow-lg sticky top-0 z-10 rounded-b-xl">
                <div className="flex items-center">
                    <h1 className="text-xl md:text-2xl font-extrabold truncate">
                        <span className="text-green-600">S-</span><span className="text-[#2c3e50]">Mart</span>{' '}
                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Student Hub</span>
                    </h1>
                </div>
                {/* Back button container */}
                {state.semester && (
                    <div id="back-button-container">
                        <BackButton onClick={handleBack} />
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main id="app-content" className="container mx-auto py-8 md:py-12">
                {CurrentView}
            </main>

            {/* Footer */}
            <footer className="w-full py-4 text-center text-gray-600 text-sm border-t mt-8 bg-white">
                &copy; 2025 S-mart Student Hub. {' '}
                {user && user.firstName ? `Made with ❤️ by you ${user.firstName}` : `A React Blueprint.`}
            </footer>
        </div>
    );
};

export default App;