"use client"

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useAuth } from '@clerk/nextjs';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export default function Product() {
    const { getToken } = useAuth();
    const [idea, setIdea] = useState<string>('…loading');

    // React 18 runs effects twice in development (Strict Mode).
    // `hasRunRef` ensures the stream is only started once.
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        const abortController = new AbortController();
        let buffer = '';
        let firstChunkReceived = false;
        let retries = 0;

        const startStream = async () => {
            const jwt = await getToken();
            if (!jwt) {
                setIdea('Authentication required');
                return;
            }

            try {
                await fetchEventSource('/api', {
                    signal: abortController.signal,
                    headers: { Authorization: `Bearer ${jwt}` },
                    openWhenHidden: true,
                    async onopen(res) {
                        if (
                            !res.ok ||
                            !res.headers.get('content-type')?.startsWith('text/event-stream')
                        ) {
                            throw new Error(`Unexpected response ${res.status}`);
                        }
                    },
                    onmessage(ev) {
                        if (!ev.data.trim()) return;
                        firstChunkReceived = true;
                        buffer += ev.data;
                        setIdea(buffer);
                    },
                    onerror(err) {
                        if (!firstChunkReceived && retries < 1) {
                            retries += 1;
                            return 1000;
                        }
                        throw err;
                    }
                });
            } catch (e) {
                console.error('Streaming failed:', e);
            }
        };

        startStream();

        // Cleanup on unmount
        return () => {
            abortController.abort();
        };
    }, [getToken]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Business Idea Generator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        AI-powered innovation at your fingertips
                    </p>
                </header>

                {/* Content Card */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95">
                        {idea === '…loading' ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-pulse text-gray-400">
                                    Generating your business idea...
                                </div>
                            </div>
                        ) : (
                            <div className="markdown-content text-gray-700 dark:text-gray-300">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                >
                                    {idea}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}