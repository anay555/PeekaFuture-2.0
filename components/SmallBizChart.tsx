
import React, { useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

declare const Chart: any; // Using Chart.js from CDN

const SmallBizChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);
    const { theme } = useTheme();

    // Data from user's example
    const data = useMemo(() => [
        { label: "Shop Owner", value: 400000 },
        { label: "Software Engineer", value: 800000 },
        { label: "Freelancer", value: 500000 }
    ], []);

    const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                const isDark = theme === 'dark';
                const textColor = isDark ? '#e5e7eb' : '#4b5563';
                const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                const tooltipTitle = isDark ? '#f3f4f6' : '#111827';
                const tooltipBody = isDark ? '#9ca3af' : '#4b5563';
                const borderColor = isDark ? '#334155' : '#e5e7eb';
                const segmentBorderColor = isDark ? '#1e293b' : '#ffffff';

                // Modern Chart Config
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'doughnut', 
                    data: {
                        labels: data.map((d) => d.label),
                        datasets: [
                            {
                                data: data.map((d) => d.value),
                                backgroundColor: [
                                    'rgba(168, 85, 247, 0.9)', // Purple
                                    'rgba(99, 102, 241, 0.9)', // Indigo
                                    'rgba(236, 72, 153, 0.9)'  // Pink
                                ],
                                hoverBackgroundColor: [
                                    'rgba(168, 85, 247, 1)',
                                    'rgba(99, 102, 241, 1)',
                                    'rgba(236, 72, 153, 1)'
                                ],
                                borderColor: segmentBorderColor,
                                borderWidth: 2,
                                hoverOffset: 10,
                                borderRadius: 8, // Modern rounded segments
                                spacing: 4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%', // Thinner ring for modern look
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        plugins: {
                            legend: { 
                                position: 'bottom' as const,
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                    padding: 20,
                                    font: { family: "'Inter', sans-serif", size: 12, weight: 600 },
                                    color: textColor
                                }
                            },
                            tooltip: {
                                backgroundColor: tooltipBg,
                                titleColor: tooltipTitle,
                                bodyColor: tooltipBody,
                                borderColor: borderColor,
                                borderWidth: 1,
                                padding: 12,
                                boxPadding: 6,
                                cornerRadius: 8,
                                displayColors: true,
                                callbacks: {
                                    label: (ctx: any) => {
                                        const v = ctx.raw as number;
                                        const pct = ((v / total) * 100).toFixed(1);
                                        const format =
                                            v >= 100000
                                                ? `₹${(v / 100000).toFixed(1)} L`
                                                : `₹${v.toLocaleString()}`;
                                        return ` ${ctx.label}: ${format} (${pct}%)`;
                                    }
                                }
                            }
                        }
                    },
                });
            }
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, total, theme]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-slate-700 p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Income Comparison</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Annual average income by profession</p>
            <div className="relative h-72 w-full max-w-sm mx-auto">
                <canvas ref={chartRef}></canvas>
                {/* Center Text for Doughnut Chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Avg Annual</span>
                     <span className="text-2xl font-extrabold text-gray-800 dark:text-white">₹{(total / 100000 / 3).toFixed(1)}L</span>
                </div>
            </div>
        </div>
    );
};

export default SmallBizChart;
