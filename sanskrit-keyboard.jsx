import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Delete, ArrowUp, Globe, Copy, CheckCircle2, RotateCcw } from 'lucide-react';

/* =====================================================================
   1. TRANSLITERATION ENGINE (Harvard-Kyoto / IAST)
   ===================================================================== */

const CONSONANTS = {
  'ksh':'क्ष्', 'shr':'श्र्', 'tr':'त्र्', 'gy':'ज्ञ्',
  'kh':'ख्', 'gh':'घ्', 'ch':'छ्', 'jh':'झ्', 'Th':'ठ्', 'Dh':'ढ्', 'th':'थ्', 'dh':'ध्', 'ph':'फ्', 'bh':'भ्', 'sh':'ष्',
  'k':'क्', 'g':'ग्', 'c':'च्', 'j':'ज्', 'T':'ट्', 'D':'ड्', 'N':'ण्', 't':'त्', 'd':'द्', 'n':'न्', 'p':'प्', 'b':'ब्', 'm':'म्',
  'y':'य्', 'r':'र्', 'l':'ल्', 'v':'व्', 'w':'व्', 'S':'श्', 's':'स्', 'h':'ह्'
};

const IND_VOWELS = {
  'aa':'आ', 'ii':'ई', 'uu':'ऊ', 'ai':'ऐ', 'au':'औ',
  'a':'अ', 'i':'इ', 'I':'ई', 'u':'उ', 'U':'ऊ', 'e':'ए', 'o':'ओ', 'R':'ऋ'
};

const DEP_VOWELS = {
  'aa':'ा', 'ii':'ी', 'uu':'ू', 'ai':'ै', 'au':'ौ',
  'a':'', /* removes halant */ 'i':'ि', 'I':'ी', 'u':'ु', 'U':'ू', 'e':'े', 'o':'ो', 'R':'ृ'
};

const MODIFIERS = { 'M':'ं', 'H':'ः' };

/**
 * Transliterates Latin buffer into Devanagari.
 * Dynamically handles Halant (virama) removal when vowels are appended.
 */
function transliterate(latinText) {
  if (!latinText) return "";
  let result = '';
  let i = 0;
  let lastWasConsonant = false;

  while (i < latinText.length) {
    let matchLen = 0;
    let type = '';
    let val = '';

    // Greedy match: Check 3-char, then 2-char, then 1-char tokens
    for (let len = 3; len > 0; len--) {
      if (i + len > latinText.length) continue;
      let chunk = latinText.substr(i, len);
      
      if (CONSONANTS[chunk]) { val = CONSONANTS[chunk]; type = 'C'; matchLen = len; break; }
      if (IND_VOWELS[chunk]) { val = chunk; type = 'V'; matchLen = len; break; }
      if (MODIFIERS[chunk]) { val = MODIFIERS[chunk]; type = 'M'; matchLen = len; break; }
    }

    if (matchLen > 0) {
      if (type === 'C') {
        result += val;
        lastWasConsonant = true;
      } else if (type === 'V') {
        if (lastWasConsonant && result.endsWith('्')) {
          result = result.slice(0, -1) + DEP_VOWELS[val];
        } else {
          result += IND_VOWELS[val];
        }
        lastWasConsonant = false;
      } else if (type === 'M') {
        result += val;
      }
      i += matchLen;
    } else {
      result += latinText[i];
      lastWasConsonant = false;
      i++;
    }
  }
  return result;
}

/* =====================================================================
   2. KEYBOARD LAYOUTS
   ===================================================================== */

const LAYOUTS = {
  latin: {
    normal: [
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['{shift}', 'z','x','c','v','b','n','m', '{bksp}'],
      ['{globe}', ',', '{space}', '.', '{enter}']
    ],
    shift: [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['{shift}', 'Z','X','C','V','B','N','M', '{bksp}'],
      ['{globe}', '!', '{space}', '?', '{enter}']
    ]
  },
  devanagari: {
    normal: [
      ['ौ','ै','ा','ी','ू','ब','ह','ग','द','ज','ड'],
      ['ो','े','्','ि','ु','प','र','क','त','च','ट'],
      ['{shift}', 'ॉ','ं','म','न','व','ल','स','य', '{bksp}'],
      ['{globe}', ',', '{space}', '।', '{enter}']
    ],
    shift: [
      ['औ','ऐ','आ','ई','ऊ','भ','ङ','घ','ध','झ','ढ'],
      ['ओ','ए','अ','इ','उ','फ','ऱ','ख','थ','छ','ठ'],
      ['{shift}', 'ऑ','ः','ण','ञ','श','ष','ज्ञ','त्र', '{bksp}'],
      ['{globe}', '?', '{space}', '॥', '{enter}']
    ]
  }
};

/* =====================================================================
   3. MAIN APPLICATION COMPONENT
   ===================================================================== */

export default function App() {
  const [mode, setMode] = useState('latin'); // 'latin' | 'devanagari'
  const [isShift, setIsShift] = useState(false);
  const [text, setText] = useState('');
  const [buffer, setBuffer] = useState('');
  const [copied, setCopied] = useState(false);
  
  const endOfTextRef = useRef(null);

  // Auto-scroll to bottom when typing
  useEffect(() => {
    endOfTextRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [text, buffer]);

  // Physical Keyboard Hooks
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // Allow system shortcuts
      
      const key = e.key;
      
      if (key === 'Backspace') {
        e.preventDefault();
        handleKey('{bksp}');
      } else if (key === 'Enter') {
        e.preventDefault();
        handleKey('{enter}');
      } else if (key === ' ') {
        e.preventDefault();
        handleKey('{space}');
      } else if (key.length === 1) {
        // Normal character
        e.preventDefault();
        handleKey(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buffer, text, mode]);

  const commitBuffer = () => {
    if (buffer) {
      setText(prev => prev + transliterate(buffer));
      setBuffer('');
    }
  };

  const handleKey = (key) => {
    if (key === '{bksp}') {
      if (buffer.length > 0) {
        setBuffer(prev => prev.slice(0, -1));
      } else {
        setText(prev => prev.slice(0, -1));
      }
    } else if (key === '{space}') {
      commitBuffer();
      setText(prev => prev + ' ');
    } else if (key === '{enter}') {
      commitBuffer();
      setText(prev => prev + '\n');
    } else if (key === '{shift}') {
      setIsShift(prev => !prev);
    } else if (key === '{globe}') {
      commitBuffer();
      setMode(prev => prev === 'latin' ? 'devanagari' : 'latin');
      setIsShift(false);
    } else {
      // Character Input
      if (mode === 'latin') {
        setBuffer(prev => prev + key);
      } else {
        setText(prev => prev + key);
      }
      
      // Auto-reset shift after a character if we are typing (standard keyboard behavior)
      if (isShift && mode === 'latin') {
        setIsShift(false);
      }
    }
  };

  const handleClear = () => {
    setText('');
    setBuffer('');
  };

  const handleCopy = async () => {
    commitBuffer();
    try {
      await navigator.clipboard.writeText(text + (buffer ? transliterate(buffer) : ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text + (buffer ? transliterate(buffer) : '');
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentLayout = useMemo(() => {
    return LAYOUTS[mode][isShift ? 'shift' : 'normal'];
  }, [mode, isShift]);

  const renderKey = (key, idx) => {
    let content = key;
    let classes = "flex items-center justify-center font-medium rounded-xl text-lg md:text-xl transition-all shadow-[0_1px_1px_rgba(0,0,0,0.1)] active:scale-95 active:shadow-none bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600";
    let style = { flex: 1 };

    if (key.startsWith('{') && key.endsWith('}')) {
      const action = key.slice(1, -1);
      classes = "flex items-center justify-center font-medium rounded-xl transition-all shadow-[0_1px_1px_rgba(0,0,0,0.15)] active:scale-95 active:shadow-none bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-900";
      
      if (action === 'bksp') {
        content = <Delete size={20} strokeWidth={2.5} />;
        style = { flex: 1.5, maxWidth: '80px' };
      } else if (action === 'shift') {
        content = <ArrowUp size={20} strokeWidth={2.5} />;
        style = { flex: 1.5, maxWidth: '80px' };
        if (isShift) classes += " !bg-indigo-500 !text-white hover:!bg-indigo-600";
      } else if (action === 'space') {
        content = mode === 'latin' ? 'Space' : 'अन्तरालम्';
        style = { flex: 4, maxWidth: '400px' };
        classes += " text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider";
      } else if (action === 'enter') {
        content = <CornerDownLeft size={20} strokeWidth={2.5} />;
        style = { flex: 1.5, maxWidth: '80px' };
        classes += " !bg-indigo-500 !text-white hover:!bg-indigo-600 shadow-indigo-500/20";
      } else if (action === 'globe') {
        content = <Globe size={20} strokeWidth={2.5} />;
        style = { flex: 1.2, maxWidth: '70px' };
      }
    } else {
      if (mode === 'devanagari') {
        classes += " text-2xl font-serif";
      }
    }

    return (
      <button
        key={`${idx}-${key}`}
        style={style}
        className={`${classes} h-12 md:h-14 touch-manipulation select-none`}
        onClick={(e) => {
          e.preventDefault();
          handleKey(key);
        }}
        onPointerDown={(e) => e.preventDefault()}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300 selection:bg-indigo-500/30">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-serif">वा</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">VaakBoard</h1>
            <p className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-widest">Premium Edition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClear}
            className="p-2.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors tooltip-trigger"
            title="Clear Text"
          >
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
              copied 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/20'
            }`}
          >
            {copied ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.5} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </header>

      {/* EDITOR AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center w-full">
        <div className="w-full max-w-4xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-10 flex flex-col">
          
          <div className="flex-1 relative font-serif text-3xl md:text-5xl lg:text-6xl text-slate-800 dark:text-slate-100 leading-tight md:leading-normal whitespace-pre-wrap break-words focus:outline-none">
            {!text && !buffer && (
              <span className="absolute top-0 left-0 text-slate-300 dark:text-slate-700 pointer-events-none font-sans font-medium text-2xl md:text-4xl">
                Start typing...
              </span>
            )}
            
            {/* Committed Text */}
            {text}
            
            {/* Live Buffer (Preview) */}
            {buffer && (
              <span className="text-indigo-600 dark:text-indigo-400 border-b-4 border-indigo-500/30">
                {transliterate(buffer)}
              </span>
            )}
            
            {/* Blinking Cursor */}
            <span className="inline-block w-[3px] h-[1em] bg-indigo-500 animate-pulse align-middle ml-1 -mt-2 rounded-full"></span>
            
            <div ref={endOfTextRef} />
          </div>

        </div>
      </main>

      {/* KEYBOARD CONTROLS & INFO */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
        
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
            <button 
              onClick={() => { commitBuffer(); setMode('latin'); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === 'latin' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Latin → सं
            </button>
            <button 
              onClick={() => { commitBuffer(); setMode('devanagari'); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === 'devanagari' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Direct Deva
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono font-medium text-slate-500">
            <span>Try: 'ksh' → क्ष</span>
            <span>'aa' → आ</span>
          </div>
        </div>

        {/* VIRTUAL KEYBOARD GRIDS */}
        <div className="max-w-4xl mx-auto p-2 sm:p-4 flex flex-col gap-2 md:gap-3 touch-manipulation">
          {currentLayout.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-1.5 md:gap-2 w-full">
              {row.map((key, keyIndex) => renderKey(key, keyIndex))}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

