import React, { useState, useEffect } from 'react';

const StudentHero = ({ firstName }: any) => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatFullDate = (date: any) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (date: any) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="student-hero rounded-3xl p-8 text-white flex justify-between items-center shadow-2xl shadow-blue-500/20 relative overflow-hidden animate-fade-in-up">
            <div className="student-hero__orb student-hero__orb--a" />
            <div className="student-hero__orb student-hero__orb--b" />
            <div className="student-hero__orb student-hero__orb--c" />
            <div className="relative z-10">
                <p className="student-hero__eyebrow text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Student Dashboard</p>
                <h2 className="text-3xl font-extrabold mb-1">Welcome back, <span className="bg-gradient-to-r from-sky-200 to-white bg-clip-text text-transparent">{firstName}</span>!</h2>
                <p className="text-blue-100/75 font-medium">{formatFullDate(time)}</p>
            </div>
            <div className="text-right relative z-10">
                <div className="text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-sky-200 bg-clip-text text-transparent">{formatTime(time)}</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100/60 mt-1">Current System Time</p>
            </div>
        </div>
    );
};

export default StudentHero;


