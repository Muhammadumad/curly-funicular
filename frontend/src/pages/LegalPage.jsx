import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Scale } from 'lucide-react';

// Determine which document to load based on URL path
const getDocConfig = (path) => {
  switch (path) {
    case '/terms':
      return { filename: 'terms.md', defaultTitle: 'Terms of Service' };
    case '/privacy':
      return { filename: 'privacy.md', defaultTitle: 'Privacy Policy' };
    case '/refund-policy':
      return { filename: 'refund-policy.md', defaultTitle: 'Refund Policy' };
    default:
      return { filename: 'terms.md', defaultTitle: 'Terms of Service' };
  }
};

export default function LegalPage() {
  const location = useLocation();
  const [contentBlocks, setContentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { filename, defaultTitle } = getDocConfig(location.pathname);

  const [prevFilename, setPrevFilename] = useState(filename);
  if (filename !== prevFilename) {
    setPrevFilename(filename);
    setLoading(true);
  }

  useEffect(() => {
    const parseMarkdown = (markdownText) => {
      // Basic regex parser for headers, paragraphs, and list items
      const blocks = markdownText.split(/\n\n+/);
      const parsed = [];

      blocks.forEach((block) => {
        const trimmed = block.trim();
        if (!trimmed) return;

        if (trimmed.startsWith('# ')) {
          const text = trimmed.replace('# ', '');
          parsed.push({ type: 'h1', text });
        } else if (trimmed.startsWith('## ')) {
          parsed.push({ type: 'h2', text: trimmed.replace('## ', '') });
        } else if (trimmed.startsWith('- ')) {
          const items = trimmed
            .split('\n')
            .map((item) => item.replace(/^- /, '').trim())
            .filter(Boolean);
          parsed.push({ type: 'ul', items });
        } else {
          parsed.push({ type: 'p', text: trimmed });
        }
      });

      setContentBlocks(parsed);
    };

    fetch(`/legal/${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load legal document.');
        return res.text();
      })
      .then((text) => {
        parseMarkdown(text);
      })
      .catch((err) => {
        console.error(err);
        setContentBlocks([
          { type: 'h1', text: defaultTitle },
          { type: 'p', text: 'Failed to load document content. Please try again later.' }
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filename, defaultTitle]);

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'h1':
        return (
          <h1 key={idx} className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">
            {block.text}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={idx} className="text-lg font-bold text-slate-800 tracking-wide mt-8 mb-4 border-b border-slate-200/50 pb-2">
            {block.text}
          </h2>
        );
      case 'ul':
        return (
          <ul key={idx} className="space-y-3 my-6 pl-5 list-disc text-slate-600 text-xs font-bold leading-relaxed">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      case 'p':
        return (
          <p key={idx} className="text-xs text-slate-600 font-medium leading-relaxed my-4">
            {block.text}
          </p>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-slate-900 pt-24 relative z-10 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase font-bold">Retrieving Document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-900 pb-24 font-sans select-none z-10 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <main className="relative max-w-3xl mx-auto px-6 pt-32 z-10">
        
        <div className="flex items-center gap-4 mb-10">
          <Link 
            to="/" 
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-slate-500 hover:text-slate-900 hover:bg-white transition-all duration-300 shadow-sm"
          >
            <ChevronLeft size={16} />
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase font-mono tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl shadow-2xs">
            <Scale size={13} />
            <span>Official Legal Notice</span>
          </div>
        </div>

        <div className="relative w-full rounded-[32px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-white/10 shadow-[0_20px_40px_rgba(31,38,135,0.05)]">
          <div className="relative w-full rounded-[31px] bg-white/40 backdrop-blur-xl p-8 sm:p-12 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {contentBlocks.map((block, idx) => renderBlock(block, idx))}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
