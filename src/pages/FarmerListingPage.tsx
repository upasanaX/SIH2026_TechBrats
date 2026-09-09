import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductListingInput } from '../types';
import { LISTING_COPY } from '../utils/authTranslations';
import { ArrowLeft, Camera, ImagePlus, Leaf, PackagePlus, Save, Upload } from 'lucide-react';

export const FarmerListingPage: React.FC = () => {
  const { addProductListing, setActiveTab, currentUser, currentPanchayat, language } = useApp();
  const copy = LISTING_COPY[language];
  const [form, setForm] = useState<ProductListingInput>({
    name: '',
    category: 'vegetables',
    quantityAvailable: 100,
    unit: 'kg',
    pricePerUnit: 30,
    village: '',
    district: currentPanchayat.district,
    harvestDate: new Date().toISOString().slice(0, 10),
    organic: false
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  const updateField = <K extends keyof ProductListingInput>(key: K, value: ProductListingInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.village.trim() || !form.image) return;
    addProductListing(form);
    setActiveTab('marketplace');
  };

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      updateField('image', image);
      setImagePreview(image);
    };
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported by this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setCameraError('Camera permission was denied or the camera is unavailable.');
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg', 0.88);
    updateField('image', image);
    setImagePreview(image);
    closeCamera();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <PackagePlus className="w-4 h-4" /> {copy.badge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{copy.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{copy.description}</p>
        </div>
        <button onClick={() => setActiveTab('marketplace')} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" /> {copy.back}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black">{currentUser?.name.charAt(0) || 'F'}</div>
          <div><div className="text-xs font-bold text-emerald-950">{copy.listingAs} {currentUser?.name || 'Farmer'}</div><div className="text-[11px] text-emerald-800">{currentPanchayat.name} Agro Grid</div></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.name} *</span><input required value={form.name} onChange={e => updateField('name', e.target.value)} placeholder={copy.placeholderName} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.category}</span><select value={form.category} onChange={e => updateField('category', e.target.value as ProductListingInput['category'])} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm"><option value="vegetables">{language === 'hi' ? 'सब्जियां' : language === 'bn' ? 'সবজি' : 'Vegetables'}</option><option value="grains">{language === 'hi' ? 'अनाज' : language === 'bn' ? 'শস্য' : 'Grains'}</option><option value="pulses">{language === 'hi' ? 'दालें' : language === 'bn' ? 'ডাল' : 'Pulses'}</option><option value="fruits">{language === 'hi' ? 'फल' : language === 'bn' ? 'ফল' : 'Fruits'}</option><option value="spices">{language === 'hi' ? 'मसाले' : language === 'bn' ? 'মশলা' : 'Spices'}</option></select></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.quantity} *</span><input required min="1" type="number" value={form.quantityAvailable} onChange={e => updateField('quantityAvailable', Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.unit}</span><select value={form.unit} onChange={e => updateField('unit', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm"><option value="kg">{language === 'hi' ? 'किलोग्राम' : language === 'bn' ? 'কিলোগ্রাম' : 'Kilograms'}</option><option value="quintal">{language === 'hi' ? 'क्विंटल' : language === 'bn' ? 'কুইন্টাল' : 'Quintals'}</option><option value="crate">{language === 'hi' ? 'क्रेट' : language === 'bn' ? 'ক্রেট' : 'Crates'}</option><option value="piece">{language === 'hi' ? 'पीस' : language === 'bn' ? 'পিস' : 'Pieces'}</option></select></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.price} *</span><input required min="1" type="number" value={form.pricePerUnit} onChange={e => updateField('pricePerUnit', Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.harvestDate}</span><input type="date" value={form.harvestDate} onChange={e => updateField('harvestDate', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.village} *</span><input required value={form.village} onChange={e => updateField('village', e.target.value)} placeholder={copy.placeholderVillage} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-slate-700">{copy.district}</span><input value={form.district} onChange={e => updateField('district', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm" /></label>
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer"><input type="checkbox" checked={form.organic} onChange={e => updateField('organic', e.target.checked)} className="w-4 h-4 accent-emerald-700" /><Leaf className="w-4 h-4 text-emerald-700" /><span className="text-xs font-bold text-slate-800">{copy.organic}</span></label>
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 block">{copy.details} *</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={openCamera} className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100">
              <Camera className="w-4 h-4" /> {copy.camera}
            </button>
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100">
              <Upload className="w-4 h-4" /> {copy.upload}
              <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
            </label>
          </div>
          {imagePreview && <img src={imagePreview} alt={copy.details} className="w-full h-52 object-cover rounded-xl border border-slate-200" />}
          {cameraError && <p className="text-xs text-red-700">{cameraError}</p>}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200"><div className="flex items-center gap-2 text-xs text-slate-500"><ImagePlus className="w-4 h-4" /> {copy.photoNote}</div><button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"><Save className="w-4 h-4" /> {copy.publish}</button></div>
      </form>

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-sm font-black text-slate-900">{copy.camera}</h2><button type="button" onClick={closeCamera} className="text-xs font-bold text-slate-600">Close</button></div>
            <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover rounded-xl bg-slate-950" />
            <button type="button" onClick={capturePhoto} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"><Camera className="w-4 h-4" /> {copy.camera}</button>
          </div>
        </div>
      )}
    </div>
  );
};
