// src/features/events/CreateEventModal.tsx
import { useState, useRef, useEffect } from 'react';
import { useTicketStore } from '../../store/useTicketStore';
import { X, PlusCircle, Loader2, Image as ImageIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast'; // Import de react-hot-toast

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; 
}

export default function CreateEventModal({ isOpen, onClose, initialData }: CreateEventModalProps) {
  const { addEvent, updateEvent, uploadEventImage } = useTicketStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    price: 0,
    available: 0,
    totalSlots: 100,
    location: '',
    date: '',
    image: '',
    category: 'Concert'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        artist: initialData.artist || '',
        price: initialData.price || 0,
        available: initialData.available || 0,
        totalSlots: initialData.totalSlots || 100,
        location: initialData.location || '',
        date: initialData.date ? initialData.date.substring(0, 16) : '', 
        image: initialData.image || '',
        category: initialData.category || 'Concert'
      });
      setImagePreview(initialData.image || null);
    } else {
      setFormData({
        title: '', artist: '', price: 0, available: 0, 
        totalSlots: 100, location: '', date: '', image: '', category: 'Concert'
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image;

      // 1. Upload de l'image si sélectionnée
      if (selectedFile) {
        setUploading(true);
        try {
          const uploadedPath = await uploadEventImage(selectedFile);
          finalImageUrl = `http://localhost:5000${uploadedPath}`;
        } catch (uploadErr) {
          toast.error("Échec de l'upload de l'image.");
          throw uploadErr;
        } finally {
          setUploading(false);
        }
      }

      // 2. Préparation des données
      const finalData = { 
        ...formData, 
        image: finalImageUrl,
        totalSlots: Number(formData.totalSlots),
        available: Number(formData.available),
        price: Number(formData.price)
      };

      // 3. Action : Update ou Add
      if (initialData) {
        await updateEvent(initialData.id, finalData);
        toast.success("Événement mis à jour !"); // Notification Modification
      } else {
        if (!finalImageUrl) {
          toast.error("Veuillez ajouter une image.");
          setLoading(false);
          return;
        }
        await addEvent(finalData);
        toast.success("Nouvel événement créé avec succès !"); // Notification Création
      }

      onClose();
    } catch (err: any) {
      // Gestion d'erreur plus fine
      const errorMsg = err.response?.data?.message || err.message || "Une erreur est survenue.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${initialData ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`}>
              {initialData ? <Save size={20} className="text-emerald-500" /> : <PlusCircle size={20} className="text-indigo-500" />}
            </div>
            <h2 className="text-xl font-bold text-white italic uppercase tracking-tight">
              {initialData ? "Modifier" : "Créer"} <span className="text-slate-400">Event</span>
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* IMAGE UPLOAD SECTION */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Visuel de l'événement</label>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square md:aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl cursor-pointer hover:border-indigo-600 group overflow-hidden transition-all shadow-inner"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                  <div className="p-4 bg-slate-900 rounded-2xl group-hover:text-indigo-500 transition-colors">
                    <ImageIcon size={32} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Choisir une image</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-indigo-500" />
                  <span className="text-[10px] font-bold text-indigo-500">UPLOAD EN COURS...</span>
                </div>
              )}
            </div>
          </div>

          {/* INPUTS SECTION */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Titre du concert</label>
              <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-all" 
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}/>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Artiste / Groupe</label>
              <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-all" 
                value={formData.artist} onChange={(e) => setFormData({...formData, artist: e.target.value})}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Lieu / Salle</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-all" 
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Date & Heure</label>
                <input type="datetime-local" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none text-xs focus:border-indigo-500 transition-all" 
                  value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Prix unitaire</label>
                <input type="number" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-all" 
                  value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}/>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Dispo</label>
                <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500 transition-all" 
                  value={formData.available} onChange={(e) => setFormData({...formData, available: Number(e.target.value)})}/>
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Capacité</label>
                <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-all" 
                  value={formData.totalSlots} onChange={(e) => setFormData({...formData, totalSlots: Number(e.target.value)})}/>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${initialData ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'} text-white font-black py-4 rounded-2xl mt-4 transition-all flex justify-center items-center shadow-2xl transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs`}
            >
              {loading ? <Loader2 className="animate-spin" /> : (initialData ? "Sauvegarder les changements" : "Publier l'événement")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}