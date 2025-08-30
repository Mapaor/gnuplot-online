'use client';

import { useState } from 'react';
import Link from 'next/link';
import { gnuplotExamples, categories, GnuplotExample } from '@/data/examples';

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedExample, setSelectedExample] = useState<GnuplotExample | null>(null);

  const filteredExamples = selectedCategory === 'All' 
    ? gnuplotExamples 
    : gnuplotExamples.filter(ex => ex.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📊 Gnuplot Examples Gallery
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Explore our collection of Gnuplot examples and learn from real-world plotting scenarios
          </p>
          <Link 
            href="/"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Compiler
          </Link>
        </header>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Filter by Category:</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >
              <option value="All">All Categories ({gnuplotExamples.length} examples)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({gnuplotExamples.filter(ex => ex.category === cat).length} examples)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredExamples.map(example => (
            <div
              key={example.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedExample(selectedExample?.id === example.id ? null : example)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                    {example.title}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {example.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{example.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Click to {selectedExample?.id === example.id ? 'hide' : 'view'} code
                  </span>
                  <Link
                    href={`/?example=${example.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open in Compiler
                  </Link>
                </div>
              </div>
              
              {selectedExample?.id === example.id && (
                <div className="border-t bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Gnuplot Code:</h4>
                  <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Category Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Example Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{gnuplotExamples.length}</div>
              <div className="text-gray-600">Total Examples</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(gnuplotExamples.length / categories.length)}
              </div>
              <div className="text-gray-600">Avg per Category</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-gray-600">Browser Compatible</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            All examples are ready to run in the Gnuplot Web Compiler • No installation required
          </p>
        </footer>
      </div>
    </div>
  );
}
