import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Layers,
  ChevronRight,
  FolderOpen,
  Tag
} from 'lucide-react';
import { getCategories, createCategory, deleteCategory } from '../utils/api';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories from API", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    try {
      const payload = {
        name: newCatName,
        slug: newCatSlug.toLowerCase().replace(/\s+/g, '-')
      };
      const created = await createCategory(payload);
      setCategories([...categories, created]);
      setNewCatName('');
      setNewCatSlug('');
      setShowAddForm(false);
      alert("Category added successfully!");
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  const handleDeleteCategory = async (id, slug) => {
    // Avoid deleting core system categories easily
    const coreCategories = ['server', 'remote', 'file', 'group', 'banners', 'bestselling', 'recent'];
    if (coreCategories.includes(slug)) {
      if (!window.confirm(`"${slug}" is a core system category. Deleting it may impact existing products. Are you sure you want to proceed?`)) {
        return;
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this category?")) {
        return;
      }
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      alert("Category deleted successfully!");
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  };

  return (
    <div className="space-y-8 text-slate-200 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gradient-gold">
            Categories
          </h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1.5">
            Configure B2B service groups, catalog categories, and catalog filters
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-gold px-4 py-2.5 flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>{showAddForm ? 'Close panel' : 'Add New Category'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-xl border border-slate-200 shadow-lg p-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-5 pb-3 border-b border-slate-200 flex items-center gap-2">
              <FolderOpen size={15} className="text-[#d4af37]" />
              Active Product Categories ({categories.length})
            </h3>

            {loading ? (
              <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-wider">
                Loading categories...
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                      <th className="pb-3">Category Name</th>
                      <th className="pb-3">Database slug</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-slate-800 flex items-center gap-2">
                          <Tag size={13} className="text-[#d4af37]" />
                          {cat.name}
                        </td>
                        <td className="py-4 font-mono font-bold text-slate-500">
                          {cat.slug}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.slug)}
                            className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-transparent rounded transition-all cursor-pointer inline-flex items-center shadow-sm"
                            title="Delete Category"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-8 text-slate-500 font-bold uppercase tracking-wider">
                          No categories configured. Click 'Add New Category' to begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Category Form Panel (1 col) */}
        <div>
          {showAddForm && (
            <div className="glass-card p-6 rounded-2xl shadow-lg border border-slate-200 space-y-4 animate-scale-up">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center gap-2">
                <Layers size={16} className="text-[#d4af37]" />
                Create New Category
              </h2>

              <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">
                    Category Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Server Service"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (!newCatSlug) {
                        setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">
                    Url Slug
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. server-service"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-gold py-3 flex items-center justify-center gap-2 shadow-gold-md"
                >
                  <FolderOpen size={14} />
                  <span>Register Category</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
