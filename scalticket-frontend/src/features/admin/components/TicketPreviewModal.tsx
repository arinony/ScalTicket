import { useRef } from 'react';
import { X, Printer, Download, Calendar, User, Ticket } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface TicketPreviewProps {
  order: any;
  onClose: () => void;
}

export const TicketPreviewModal = ({ order, onClose }: TicketPreviewProps) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  // --- FONCTION EXPORT IMAGE (PNG) ---
  const downloadImage = async () => {
    if (!ticketRef.current) return;
    const loadId = toast.loading("Génération de l'image...");

    try {
      const dataUrl = await toPng(ticketRef.current, { 
        cacheBust: true, 
        pixelRatio: 2, // Double la résolution pour un rendu net
        backgroundColor: '#0f172a' 
      });
      
      const link = document.createElement('a');
      link.download = `ticket-${order.id.substring(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Image téléchargée !", { id: loadId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération de l'image", { id: loadId });
    }
  };

  // --- FONCTION EXPORT PDF ---
  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    const loadId = toast.loading("Préparation du PDF...");

    try {
      // On génère d'abord une image haute qualité pour le PDF
      const dataUrl = await toPng(ticketRef.current, { pixelRatio: 2 });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // On place le ticket avec une petite marge en haut (20mm)
      pdf.addImage(dataUrl, 'PNG', 0, 20, pdfWidth, pdfHeight);
      pdf.save(`ticket-${order.id.substring(0, 8)}.pdf`);
      
      toast.success("PDF prêt !", { id: loadId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du PDF", { id: loadId });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl relative">
        
        {/* Header Modale */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Ticket size={18} className="text-indigo-500" />
            </div>
            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Aperçu <span className="text-indigo-500">Billet</span></h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Partie à capturer (REF) */}
        <div className="p-8 bg-slate-900" ref={ticketRef}>
          <div className="bg-white rounded-[2.5rem] p-8 text-slate-950 space-y-6 relative shadow-2xl border border-slate-100">
            
            {/* Design Ticket */}
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em]">Pass Officiel</p>
              <h3 className="text-2xl font-black leading-tight tracking-tighter uppercase italic">
                {order.event?.title || "Événement"}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 py-4 border-y border-slate-100">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-1">
                  <Calendar size={10} /> Date
                </p>
                <p className="text-xs font-black">
                  {order.event?.date ? new Date(order.event.date).toLocaleDateString('fr-FR') : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-1">
                  <User size={10} /> Client
                </p>
                <p className="text-xs font-black truncate">{order.user?.name || "Invité"}</p>
              </div>
            </div>

            {/* Zone QR Code */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <QRCodeSVG 
                value={`SCALTICKET-${order.id}`} 
                size={150} 
                level="H" 
                className="mix-blend-multiply"
              />
              <p className="mt-4 font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest italic text-center">
                ID: {order.id?.substring(0, 16).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions en bas */}
        <div className="p-6 bg-slate-950/80 grid grid-cols-2 gap-4 border-t border-slate-800">
          <button 
            onClick={downloadImage}
            className="flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            <Download size={16} /> Image PNG
          </button>
          <button 
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            <Printer size={16} /> Fichier PDF
          </button>
        </div>
      </div>
    </div>
  );
};