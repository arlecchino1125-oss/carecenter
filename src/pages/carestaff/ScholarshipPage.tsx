import { useState, useEffect } from 'react';
import { Plus, GraduationCap, Trash2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// PAGE 10: Scholarship Management (Basic Implementation)
const ScholarshipPage = ({ functions }: any) => {
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', amount: '', deadline: '' });

    useEffect(() => {
        fetchScholarships();
        const channel = supabase
            .channel('public:scholarships')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarships' }, fetchScholarships)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchScholarships = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('scholarships')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setScholarships(data || []);
        } catch (error) {
            console.error("Error fetching scholarships:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('scholarships').insert([form]);
            if (error) throw error;
            functions.showToast("Scholarship added!");
            setShowModal(false);
            setForm({ title: '', amount: '', deadline: '' });
            fetchScholarships();
        } catch (error) {
            functions.showToast("Error: " + error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this scholarship?")) return;
        try {
            const { error } = await supabase.from('scholarships').delete().eq('id', id);
            if (error) throw error;
            fetchScholarships();
        } catch (error) {
            functions.showToast("Error: " + error.message, 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div><h1 className="text-2xl font-bold text-gray-900">Scholarship Management</h1><p className="text-gray-500 text-sm mt-1">Manage scholarship programs and view applications.</p></div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md transition"><Plus size={16} /> Add Scholarship</button>
            </div>

            {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scholarships.map(s => (
                        <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4"><div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl"><GraduationCap size={20} /></div><span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${s.status === 'Closed' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{s.status || 'Open'}</span></div>
                            <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3><p className="text-sm text-gray-500 mb-4">Deadline: {s.deadline}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100"><span className="font-bold text-gray-900">₱{s.amount}</span><button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-sm"><Trash2 size={16} /></button></div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"><div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg text-gray-900">Add Scholarship</h3><button onClick={() => setShowModal(false)}><XCircle size={20} /></button></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><div><label className="block text-xs font-bold text-gray-700 mb-1">Title</label><input required className="w-full border rounded-lg p-2 text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div><div><label className="block text-xs font-bold text-gray-700 mb-1">Amount</label><input required className="w-full border rounded-lg p-2 text-sm" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div><div><label className="block text-xs font-bold text-gray-700 mb-1">Deadline</label><input required type="date" className="w-full border rounded-lg p-2 text-sm" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></div><button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-sm">Save</button></form></div>
                </div>
            )}
        </div>
    );
};

export default ScholarshipPage;
