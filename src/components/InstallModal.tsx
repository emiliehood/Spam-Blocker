import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useInstallPrompt, isIOS, isSamsungInternet } from '../services/installPrompt';
import { 
  X, 
  Smartphone, 
  Copy, 
  Check, 
  QrCode,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { canInstall, isMobile, promptInstall } = useInstallPrompt();
  const onIOS = isIOS();
  const onSamsung = isSamsungInternet();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Permanent public URL (GitHub Pages).
  const activeUrl = 'https://emiliehood.github.io/Spam-Blocker/';

  useEffect(() => {
    if (isMobile) return; // QR is only useful on a laptop/desktop
    QRCode.toDataURL(activeUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR code:', err));
  }, [activeUrl, isMobile]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              {isMobile ? 'Install ShieldS26' : 'Install ShieldS26 to Your Phone'}
            </h3>
            <p className="text-xs text-slate-300">
              {isMobile
                ? 'Add ShieldS26 to your home screen so it opens like a regular app.'
                : 'Scan the code or open the link on your phone, then install it from there.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isMobile && canInstall && (
          <button
            onClick={async () => { if (await promptInstall()) onClose(); }}
            className="w-full py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-colors"
          >
            Install now
          </button>
        )}

        {!isMobile && (<>
        {/* QR Code Scan Option */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
          {/* QR Canvas */}
          <div className="bg-white p-2 rounded-xl shrink-0 shadow-md">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Scan QR with Samsung Camera" className="w-36 h-36 rounded-lg" />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-500">
                Generating QR...
              </div>
            )}
          </div>

          {/* QR Instructions */}
          <div className="space-y-2 min-w-0 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-cyan-300 font-bold text-xs">
              <QrCode className="w-4 h-4" />
              <span>Scan with your Samsung S26 Camera</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open your Galaxy S26 Camera app, point it at this QR code, and tap the link pop-up to open directly in Samsung Internet or Chrome!
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-slate-400">
              <span>Points to:</span>
              <span className="font-mono text-cyan-400 truncate max-w-[200px]">{activeUrl}</span>
            </div>
          </div>
        </div>

        {/* App URL with Copy Button */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>App URL:</span>
            <button
              onClick={() => handleCopy(activeUrl)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 select-all truncate">
            {activeUrl}
          </div>
        </div>

        </>)}

        {/* Step-by-Step Install in Samsung Phone */}
        <div className="space-y-2 pt-1 border-t border-slate-800 text-xs">
          <label className="font-bold text-white block">
            {isMobile
              ? (canInstall ? 'Or install from the browser menu:' : 'Install from your browser menu:')
              : 'After the page opens on your phone:'}
          </label>
          <div className={`grid grid-cols-1 gap-2 ${isMobile ? '' : 'sm:grid-cols-2'}`}>
            {(!isMobile || onSamsung) && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-300 block">Samsung Internet</span>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
                <li>Tap <strong>Menu (☰)</strong> at bottom right.</li>
                <li>Tap <strong>+ Add page to</strong>.</li>
                <li>Select <strong>App screen</strong>.</li>
              </ol>
            </div>
            )}
            {(!isMobile || (!onSamsung && !onIOS)) && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-300 block">Google Chrome</span>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
                <li>Tap <strong>Three Dots (⋮)</strong> at top right.</li>
                <li>Tap <strong>Install app</strong> or <strong>Add to Home</strong>.</li>
                <li>Tap <strong>Install</strong> to confirm.</li>
              </ol>
            </div>
            )}
            {isMobile && onIOS && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-300 block">Safari (iPhone)</span>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
                <li>Tap the <strong>Share</strong> button.</li>
                <li>Tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong>.</li>
              </ol>
            </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
