import React, { useState, useEffect } from 'react';
import { Screen } from '../App';
import { apiService } from '../services/apiService';
import { Trash2, Loader2, Plus, X, Image as ImageIcon } from 'lucide-react';

interface CategoryScreenProps {
    onNavigate: (screen: Screen) => void;
}

export default function CategoryScreen({ onNavigate }: CategoryScreenProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ name?: string, description?: string, image?: string }>({});

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getCategories();
            setCategories(response?.data || []);
        } catch (err: any) {
            setError(err || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDeleteCategory = async (documentId: string) => {
        try {
            setActionLoading(`delete-${documentId}`);
            await apiService.deleteCategory(documentId);
            setCategories(categories.filter(c => c.documentId !== documentId));
            setDeleteConfirm(null);
        } catch (err: any) {
            alert(err || 'Failed to delete category');
        } finally {
            setActionLoading(null);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setFormErrors({ ...formErrors, image: 'Image must be less than 5MB' });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setFormErrors({ ...formErrors, image: undefined });
        }
    };

    const validateForm = () => {
        const errors: any = {};
        if (!formData.name.trim()) errors.name = 'Category name is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setActionLoading('add');
            let iconId = null;

            if (imageFile) {
                const formDataUpload = new FormData();
                formDataUpload.append('files', imageFile);
                const uploadRes = await apiService.uploadProfileImage(formDataUpload);
                // Strapi upload API returns an array of uploaded files
                if (uploadRes && uploadRes.length > 0) {
                    iconId = uploadRes[0].id;
                }
            }

            const payload = {
                data: {
                    name: formData.name,
                    description: formData.description,
                    ...(iconId && { icon: iconId })
                }
            };

            await apiService.addCategory(payload);
            setFormData({ name: '', description: '' });
            setImageFile(null);
            setImagePreview(null);
            setIsAddModalOpen(false);
            fetchCategories(); // Refresh list to get fully populated newly created category
        } catch (err: any) {
            alert(err || 'Failed to add category');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 lg:p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 lg:p-8">
                <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50 p-4 lg:p-8 relative">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors hover:opacity-90 shadow-sm"
                        style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-medium text-gray-500 text-sm w-16">Icon</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Category Name</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Description</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm text-center">Skills Based</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            {category.icon ? (
                                                <img
                                                    src={category.icon.formats?.thumbnail?.url}
                                                    alt={category.name}
                                                    className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">{category.name}</td>
                                        <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</td>
                                        <td className="p-4 text-sm text-center">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                                {category.skills?.length || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-right">
                                            <button
                                                onClick={() => setDeleteConfirm(category.documentId)}
                                                disabled={actionLoading === `delete-${category.documentId}`}
                                                className="p-2 inline-flex bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center w-9 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete Category"
                                            >
                                                {actionLoading === `delete-${category.documentId}` ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Category Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '400px' }}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Add New Category</h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCategory} className="p-4 space-y-4 text-left">
                            {/* Image Upload Box */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Icon (Optional)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors bg-gray-50 relative group cursor-pointer overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="space-y-1 text-center">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-lg shadow-sm" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-xs font-medium">
                                                    Change
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mx-auto h-12 w-12 text-gray-400">
                                                    <ImageIcon className="mx-auto h-12 w-12" />
                                                </div>
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <span className="relative bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                        Upload a file
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                                    }}
                                    placeholder="e.g. Programming"
                                    className={`mt-1 block w-full outline-none px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData({ ...formData, description: e.target.value });
                                        if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                                    }}
                                    placeholder="Brief description of the category..."
                                    className={`mt-1 block w-full resize-none outline-none px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading === 'add'}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                                >
                                    {actionLoading === 'add' ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                    ) : (
                                        'Add Category'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '400px' }}>
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Category</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this category? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={actionLoading === `delete-${deleteConfirm}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(deleteConfirm)}
                                    disabled={actionLoading === `delete-${deleteConfirm}`}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                                >
                                    {actionLoading === `delete-${deleteConfirm}` ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
