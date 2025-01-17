'use client';

import { useState, useEffect } from 'react';
import { NewsArticle } from './types/news';
import { NewsCard } from './components/NewsCard';
import { LoadingIntro } from './components/LoadingIntro';
import { motion } from 'framer-motion';

export default function Home() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/fetchNews');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setNewsData(data.articles.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Add handleSwipe function
  const handleSwipe = (direction: number) => {
    setCurrentIndex((prevIndex) => {
      const newIndex =
        (prevIndex + direction + newsData.length) % newsData.length;
      return newIndex;
    });
  };

  if (loading || showIntro) {
    return <LoadingIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-4">
      <div className="max-w-2xl mx-auto relative h-[80vh] mt-12">
        <div className="relative w-full h-full">
          {newsData.map((article, idx) => {
            const depth =
              (idx - currentIndex + newsData.length) % newsData.length;
            if (depth > 2) return null;

            return (
              <motion.div
                key={article.title}
                className="absolute inset-0"
                drag={depth === 0 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -100) handleSwipe(1);
                  if (offset.x > 100) handleSwipe(-1);
                }}
              >
                <NewsCard
                  article={article}
                  currentIndex={currentIndex}
                  totalArticles={newsData.length}
                  depth={depth}
                  isActive={depth === 0}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
