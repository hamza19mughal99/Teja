import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Info, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/apiService';

interface StaticPageScreenProps {
    pageType: 'privacy' | 'about' | 'terms';
    onNavigate: (screen: 'login') => void;
}

export default function StaticPageScreen({ pageType, onNavigate }: StaticPageScreenProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPageData = async () => {
            setLoading(true);
            setError('');
            try {
                let response;
                if (pageType === 'privacy') {
                    response = await apiService.getPrivacyPolicy();
                } else if (pageType === 'about') {
                    response = await apiService.getAboutUs();
                } else if (pageType === 'terms') {
                    response = await apiService.getTermsAndConditions();
                }

                if (response?.data) {
                    setData(response.data);
                } else {
                    setError('No content available.');
                }

            } catch (err: any) {
                setError(err || 'Failed to load page content.');
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [pageType]);

    const getPageConfig = () => {
        switch (pageType) {
            case 'privacy':
                return {
                    title: 'Privacy Policy',
                    icon: <ShieldCheck className="w-8 h-8 text-[#2563eb]" />,
                    bgColor: 'bg-blue-50',
                };
            case 'about':
                return {
                    title: 'About Us',
                    icon: <Info className="w-8 h-8 text-[#2563eb]" />,
                    bgColor: 'bg-blue-50',
                };
            case 'terms':
                return {
                    title: 'Terms & Conditions',
                    icon: <FileText className="w-8 h-8 text-[#2563eb]" />,
                    bgColor: 'bg-blue-50',
                };
        }
    };

    const config = getPageConfig();

    // Helper to render Strapi Rich Text JSON structure
    const renderContent = (contentBlocks: any[]) => {
        if (!Array.isArray(contentBlocks)) return null;

        return contentBlocks.map((block, index) => {
            if (block.type === 'paragraph') {
                return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4 text-justify">
                        {block.children?.map((child: any, childIdx: number) => (
                            <span key={childIdx} className={child.bold ? 'font-bold' : ''}>
                                {child.text}
                            </span>
                        ))}
                    </p>
                );
            }
            return null;
        });
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center shadow-sm mb-4">
                <button
                    onClick={() => onNavigate('login')}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-gray-600"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 flex items-center justify-center -ml-10">
                    <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 md:py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">

                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                        <div className={`w-16 h-16 rounded-2xl ${config.bgColor} flex items-center justify-center`}>
                            {config.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{data?.title || config.title}</h2>
                            <p className="text-sm text-gray-500">
                                {data?.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString()}` : 'Information and guidelines'}
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-blue max-w-none">
                        {loading ? (
                            <div className="flex flex-col space-y-4 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
                                    <Info className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to load content</h3>
                                <p className="text-gray-500">{error}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {data?.content ? renderContent(data.content) : (
                                    <p className="text-gray-500 italic">No content has been published yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
