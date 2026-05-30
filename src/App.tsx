import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, FileText, Plus, Settings, Download, Share2, Printer, 
  Trash2, Image as ImageIcon, Sparkles, ChevronLeft, Save, 
  AlertCircle, Upload, Eye, FileSpreadsheet, Menu, X
} from 'lucide-react';


// ฟังก์ชันแปลงตัวเลขเป็นภาษาไทย (BahtText) สำหรับใบเสนอราคา
const THBText = (amount) => {
  const num = parseFloat(amount || 0);
  if (num === 0) return "ศูนย์บาทถ้วน";
  const str = num.toFixed(2).split('.');
  const baht = str[0];
  const satang = str[1];

  const tNum = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const tUnit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  
  const convert = (s) => {
    let res = '';
    for(let i=0; i<s.length; i++) {
      const n = parseInt(s[i]);
      if (n !== 0) {
        if (i === s.length - 2 && n === 1) res += 'สิบ';
        else if (i === s.length - 2 && n === 2) res += 'ยี่สิบ';
        else if (i === s.length - 1 && n === 1 && s.length > 1) res += 'เอ็ด';
        else res += tNum[n] + tUnit[s.length - 1 - i];
      }
    }
    return res;
  };

  return convert(baht) + "บาท" + (satang === '00' ? "ถ้วน" : convert(satang) + "สตางค์");
};

export default function App() {
  const [view, setView] = useState('home');
  const [theme, setTheme] = useState('premium');
  const [quoteData, setQuoteData] = useState({
    docNumber: 'TT-QN-054-26',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    customerName: '',
    items: [{ id: Date.now(), desc: '', qty: 1, unit: 'ตร.ม.', price: 0 }],
    discount: 0,
    overhead: 0,
    useVat: true
  });

  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('tt_data');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 font-sans transition-all`}>
      {/* Mobile Navbar */}
      <nav className="p-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-yellow-600 flex items-center justify-center font-bold text-zinc-950">TT</div>
          <span className="font-bold tracking-wider">เที่ยงทำ ดีเวลลอปเม้นท์</span>
        </div>
        <button onClick={() => setView(view === 'home' ? 'history' : 'home')} className="p-2">
          {view === 'home' ? <FileSpreadsheet /> : <Home />}
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="p-4 pb-20">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-center">
                <h1 className="text-2xl font-black mb-2">ยินดีต้อนรับ</h1>
                <p className="text-zinc-400 mb-6 text-sm">จัดการใบเสนอราคาด้วย AI อัจฉริยะ</p>
                <button 
                  onClick={() => setView('editor')}
                  className="w-full bg-yellow-600 text-zinc-950 font-bold py-4 rounded-xl"
                >
                  เริ่มสร้างใบเสนอราคาใหม่
                </button>
              </div>
            </motion.div>
          )}

          {view === 'editor' && (
            <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-4">
              <input 
                value={quoteData.customerName}
                onChange={(e) => setQuoteData({...quoteData, customerName: e.target.value})}
                placeholder="ชื่อลูกค้า"
                className="w-full bg-zinc-800 p-4 rounded-xl border border-zinc-700"
              />
              {/* รายการสินค้า... */}
              <button 
                onClick={() => {
                  setHistory([...history, quoteData]);
                  localStorage.setItem('tt_data', JSON.stringify([...history, quoteData]));
                  setView('history');
                }}
                className="w-full bg-emerald-600 font-bold py-3 rounded-lg"
              >
                บันทึกใบเสนอราคา
              </button>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {history.map((h, i) => (
                <div key={i} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between">
                  <div>
                    <p className="font-bold">{h.customerName || 'ลูกค้าไม่ระบุชื่อ'}</p>
                    <p className="text-xs text-zinc-500">{h.docNumber}</p>
                  </div>
                  <Trash2 className="text-red-500" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}