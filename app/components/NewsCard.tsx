'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { NewsArticle } from '../types/news';

interface NewsCardProps {
  article: NewsArticle;
  currentIndex: number;
  totalArticles: number;
  depth: number;
  isActive: boolean;
}

export function NewsCard({
  article,
  currentIndex,
  totalArticles,
  depth,
  isActive,
}: NewsCardProps) {
  const [isContextExpanded, setIsContextExpanded] = useState(false);

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] shadow-lg overflow-hidden"
      style={{
        transform: `translateY(${depth * 20}px) scale(${1 - depth * 0.05})`,
        zIndex: 10 - depth,
      }}
      initial={false}
      animate={{
        y: depth * 20,
        scale: 1 - depth * 0.05,
        opacity: isActive ? 1 : 0.7,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--background)]">
        <motion.div
          className="h-full bg-[var(--accent)]"
          initial={false}
          animate={{
            width: `${((currentIndex + 1) / totalArticles) * 100}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="h-full flex flex-col p-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[var(--accent)] font-medium text-sm">
              {article.source.name}
            </span>
            <span className="text-[var(--muted)] text-sm">•</span>
            <time
              className="text-[var(--muted)] text-sm"
              dateTime={article.publishedAt}
            >
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
          <span className="text-[var(--muted)] text-sm">
            {currentIndex + 1}/{totalArticles}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">
            {article.title}
          </h2>

          <p className="text-[var(--muted)] text-base leading-relaxed mb-4">
            {article.description}
          </p>

          {article.author && (
            <p className="text-sm text-[var(--muted)] mb-6">
              By {article.author}
            </p>
          )}

          {/* Read more link */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-[var(--accent)] hover:opacity-80 transition-opacity text-sm font-medium"
          >
            <span>Read full article</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        {/* Context panel */}
        <motion.div
          className="mt-6 bg-[var(--background)] rounded-xl overflow-hidden"
          animate={{ height: isContextExpanded ? 'auto' : '40px' }}
        >
          <button
            onClick={() => setIsContextExpanded(!isContextExpanded)}
            className="w-full p-3 flex items-center justify-between text-sm"
          >
            <span className="text-[var(--accent)] font-medium">
              Additional Context
            </span>
            <motion.span
              animate={{ rotate: isContextExpanded ? 180 : 0 }}
              className="text-[var(--accent)]"
            >
              ↓
            </motion.span>
          </button>
          {isContextExpanded && (
            <div className="px-3 pb-3">
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                This article is from {article.source.name}'s top headlines.
                Consider exploring multiple perspectives for a comprehensive
                understanding.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
