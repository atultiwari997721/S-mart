'use client';

import { useUser } from '@clerk/nextjs';
// Correct: Import React and necessary hooks from 'react'
import React, { useEffect, useMemo, useState } from 'react';

// --- Static Data Simulation ---
const BRANCHES = ['CSE', 'AIML', 'Civil', 'Chemical', 'Electrical', 'Electronics', 'ECE', 'IT', 'DS', 'FireTech'];
const CATEGORIES = ['MST1', 'MST2', 'EST', 'Notes', 'Assignments', 'PYQS'];

const ALL_RESOURCES = [
    { branch: 'CSE', category: 'Notes', subject: 'Data Structures', fileName: 'DS Handbook (Units 1-3)', fileSize: 2.8, url: 'https://docs.google.com/uc?export=download&id=dummy_ds_notes' },
    { branch: 'CSE', category: 'PYQS', subject: 'Data Structures', fileName: 'DS Previous Year Set A', fileSize: 1.1, url: 'https://docs.google.com/uc?export=download&id=dummy_ds_pyqs' },
    { branch: 'CSE', category: 'MST1', subject: 'Mathematics-I', fileName: 'M-I Formula Sheet', fileSize: 0.5, url: 'https://docs.google.com/uc?export=download&id=dummy_m1_mst1' },
    { branch: 'CSE', category: 'EST', subject: 'Programming in C', fileName: 'C Final Exam Review', fileSize: 3.2, url: 'https://docs.google.com/uc?export=download&id=dummy_c_est' },
    { branch: 'AIML', category: 'Notes', subject: 'Machine Learning', fileName: 'ML Core Concepts', fileSize: 4.5, url: 'https://docs.google.com/uc?export=download&id=dummy_ml_notes' },
    { branch: 'AIML', category: 'Assignments', subject: 'Deep Learning', fileName: 'DL Assignment 2', fileSize: 0.8, url: 'https://docs.google.com/uc?export=download&id=dummy_dl_assign' },
    { branch: 'Civil', category: 'Notes', subject: 'Structural Analysis', fileName: 'Structural Unit 1 Notes', fileSize: 1.9, url: 'https://docs.google.com/uc?export=download&id=dummy_civil_notes' },
    { branch: 'Electrical', category: 'PYQS', subject: 'Circuit Theory', fileName: 'Circuit Theory PYQS', fileSize: 1.4, url: 'https://docs.google.com/uc?export=download&id=dummy_electrical_pyqs' },
    // Adding more dummy data for better coverage
    { branch: 'Electrical', category: 'EST', subject: 'Circuit Theory', fileName: 'Circuit Theory EST Review', fileSize: 2.1, url: 'https://docs.google.com/uc?export=download&id=dummy_electrical_est_review' },
    { branch: 'ECE', category: 'Notes', subject: 'Digital Logic Design', fileName: 'DLD Full Syllabus Notes', fileSize: 3.5, url: 'https://docs.google.com/uc?export=download&id=dummy_ece_dld' },
];

// NOTE: The original ALL_RESOURCES was being called as a function in the useEffect.
// Since it's a static array here, I'll remove that call and assume it's just data.
// If ALL_RESOURCES was a fetch function, it would need to be defined outside or memoized.
// For now, I will treat ALL_RESOURCES as static data and remove the invalid useEffect.


// --- Reusable Components ---

const CardButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="
            p-4 md:p-6 rounded-xl shadow-md transition duration-300 ease-in-out w-full bg-white text-gray-800 
            text-lg font-semibold text-center hover:ring-4 hover:ring-indigo-300 hover:shadow-xl
            active:bg-indigo-50 transform hover:-translate-y-0.5
        "
    >
        {label}
    </button>
); 

const FileListItem = ({ file }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 my-2 bg-white border-l-4 border-indigo-500 rounded-xl shadow-md transition hover:shadow-lg">
        <div className="mb-2 sm:mb-0 truncate flex-grow">
            <p className="font-medium text-gray-800 text-base md:text-lg">{file.fileName}</p>
            <p className="text-sm text-gray-500">
                <span className="font-mono text-indigo-600 font-semibold">{file.fileSize.toFixed(1)} MB</span> | {file.category}
            </p>
        </div>
        <a 
            href={file.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="
                px-4 py-2 bg-green-600 text-white font-semibold rounded-full text-sm
                hover:bg-green-700 transition duration-150 shadow-lg 
                active:bg-green-800 w-full sm:w-auto shrink-0 flex items-center justify-center
            "
            aria-label={`Download ${file.fileName}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
        </a>
    </div>
);

const BackButton = ({ onClick }) => (
    <button
        onClick={onClick}
        aria-label="Go back to the previous selection stage"
        className="text-sm px-3 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition shrink-0 font-medium shadow-sm"
    >
        <span className="mr-1">←</span> Back
    </button>
);

// --- View Components ---

const BranchView = ({ onSelect }) => (
    <section className="p-4 md:p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
            Select Your <span className="text-indigo-600">Branch</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {BRANCHES.map(branch => (
                <CardButton key={branch} label={branch} onClick={() => onSelect(branch)} />
            ))}
        </div>
    </section>
);

const CategoryView = ({ branch, onSelect }) => (
    <section className="p-4 md:p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
            <span className="text-indigo-600">{branch}</span> | Select Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {CATEGORIES.map(category => (
                <CardButton key={category} label={category} onClick={() => onSelect(category)} />
            ))}
        </div>
    </section>
);

const SubjectView = ({ branch, category, onSelect }) => {
    // Utility to get subjects based on current filters
    const subjects = useMemo(() => {
        const uniqueSubjects = ALL_RESOURCES
            .filter(r => r.branch === branch && r.category === category)
            .map(r => r.subject);
        return [...new Set(uniqueSubjects)];
    }, [branch, category]);

    return (
        <section className="p-4 md:p-8">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
                <span className="text-indigo-600">{branch} / {category}</span> | Select Subject
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                {subjects.length > 0 ? (
                    subjects.map(subject => (
                        <CardButton key={subject} label={subject} onClick={() => onSelect(subject)} />
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 text-center text-gray-500 p-8 bg-yellow-100 rounded-2xl shadow-inner border border-yellow-300">
                        <p className="font-bold text-xl text-yellow-800">No Content Available</p>
                        <p className="text-sm mt-2">
                            There are currently no resources for the **{category}** category in the **{branch}** branch.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

const FilesView = ({ branch, category, subject }) => {
    // Utility to get files based on current filters
    const filesList = useMemo(() => {
        return ALL_RESOURCES.filter(r => 
            r.branch === branch && 
            r.category === category && 
            r.subject === subject
        );
    }, [branch, category, subject]);

    return (
        <section className="p-4 md:p-8">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
                <span className="text-indigo-600">{subject}</span> Resources
            </h2>
            <p className="text-center text-gray-500 mb-6 text-lg">
                <span className="font-semibold">{branch} / {category}</span>
            </p>
            
            <div className="max-w-4xl mx-auto">
                {filesList.length > 0 ? (
                    filesList.map((file, index) => (
                        <FileListItem key={index} file={file} />
                    ))
                ) : (
                    <div className="text-center text-gray-500 p-8 bg-red-100 rounded-2xl shadow-inner border border-red-300">
                        <p className="font-bold text-xl text-red-800">No Files Found</p>
                        <p className="text-sm mt-2">
                            Please check back later, or report this if you believe this is an error.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};


// --- Main Application Component ---

const App = () => {
    // 1. Move Hook Calls INSIDE the component body
    const { user } = useUser();

    // The original useEffect had an invalid function call (ALL_RESOURCES()).
    // If you need to run some side effect upon user login, this is where you'd put it.
    // Since ALL_RESOURCES is just static data, I'm removing the original useEffect.
    // If ALL_RESOURCES was a function to fetch data, you would re-add a proper effect here.
    // Example (if ALL_RESOURCES was a fetch function):
    /*
    useEffect(() => {
        if (user) {
            // fetchData(); // Call your real data-fetching function here
        }
    }, [user]);
    */

    // State to manage navigation path
    // Changed to use React.useState to satisfy environments that flag destructured imports
    const [state, setState] = useState({
        branch: null,
        category: null,
        subject: null,
    });
    
    // 2. Add the UN-AUTHENTICATED early return here, where 'user' is defined
    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-400">
                <h1 className="text-2xl sm:text-4xl font-semibold">
                    Please <span className="text-slate-800">Login</span> to access student resources
                </h1>
            </div>
        );
    }

    // Unified handler for selecting a path item
    const handleSelect = (level, value) => {
        let newState = { ...state };
        newState[level] = value;

        // Reset lower levels when a higher level is selected
        if (level === 'branch') {
            newState.category = null;
            newState.subject = null;
        } else if (level === 'category') {
            newState.subject = null;
        }
        
        setState(newState);
    };

    // Handler for the back button
    const handleBack = () => {
        if (state.subject) {
            setState(prev => ({ ...prev, subject: null }));
        } else if (state.category) {
            setState(prev => ({ ...prev, category: null }));
        } else if (state.branch) {
            setState(prev => ({ ...prev, branch: null }));
        }
    };

    // Determine the current view to render
    let CurrentView;
    if (!state.branch) {
        CurrentView = <BranchView onSelect={(branch) => handleSelect('branch', branch)} />;
    } else if (!state.category) {
        CurrentView = <CategoryView 
                        branch={state.branch} 
                        onSelect={(category) => handleSelect('category', category)}
                    />;
    } else if (!state.subject) {
        CurrentView = <SubjectView 
                        branch={state.branch} 
                        category={state.category} 
                        onSelect={(subject) => handleSelect('subject', subject)}
                    />;
    } else {
        CurrentView = <FilesView 
                        branch={state.branch} 
                        category={state.category} 
                        subject={state.subject}
                    />;
    }

    return (
        <div className="min-h-screen bg-gray-100 antialiased font-['Inter']">
            {/* Header (Fixed at top) */}
            <header className="flex items-center justify-between p-4 md:p-6 bg-white shadow-lg sticky top-0 z-10 rounded-b-xl border-b-4 border-indigo-100">
                <div className="flex items-center">
                    {/* Placeholder for Logo - In a real React app, you'd import an SVG/PNG */}
                    <div className="h-8 w-8 md:h-10 md:w-10 bg-indigo-600 rounded-lg mr-3 flex items-center justify-center text-white font-black text-xl shadow-md">
                        S
                    </div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 truncate">S-mart Student Hub</h1>
                </div>
                {/* Back button container */}
                {state.branch && (
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
            <footer className="w-full py-4 text-center text-gray-500 text-sm border-t mt-8 bg-white">
                &copy; 2024 S-mart Student Hub. A React Blueprint.
            </footer>
        </div>
    );
};

export default App; 