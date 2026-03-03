import React, { useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiService } from '../services/apiService';

interface AddSkillFormProps {
    onClose: () => void;
    user: any;
    onSuccess?: () => void;
}

interface TimeSlot {
    date: string;
    start_time: string;
    end_time: string;
}

export default function AddSkillForm({ onClose, user, onSuccess }: AddSkillFormProps) {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [level, setLevel] = useState('');
    const [location, setLocation] = useState(user?.location || 'Remote');
    const [descriptionText, setDescriptionText] = useState('');
    const [availabilitySlots, setAvailabilitySlots] = useState<TimeSlot[]>([{ date: '', start_time: '', end_time: '' }]);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiService.getCategories();
                if (res?.data) {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleAddSlot = () => {
        setAvailabilitySlots([...availabilitySlots, { date: '', start_time: '', end_time: '' }]);
    };

    const handleRemoveSlot = (index: number) => {
        const newSlots = [...availabilitySlots];
        newSlots.splice(index, 1);
        setAvailabilitySlots(newSlots);
    };

    const handleSlotChange = (index: number, field: keyof TimeSlot, value: string) => {
        const newSlots = [...availabilitySlots];
        // For strapi time fields, we might need to append ':00' if it's only HH:mm (from input type="time")
        if ((field === 'start_time' || field === 'end_time') && value && value.split(':').length === 2) {
            newSlots[index][field] = `${value}:00`;
        } else {
            newSlots[index][field] = value;
        }
        setAvailabilitySlots(newSlots);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages((prev) => [...prev, ...filesArray]);

            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]); // Free memory
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !descriptionText || !categoryId || !level || !user?.id) {
            alert("Please fill in all required fields (Title, Category, Level, Description).");
            return;
        }

        // Validate slots
        const validSlots = availabilitySlots.filter(s => s.date && s.start_time && s.end_time);
        if (validSlots.length === 0) {
            alert("Please add at least one complete availability slot.");
            return;
        }

        setLoading(true);
        try {
            let uploadedImageIds: number[] = [];

            // Upload images first if any
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(img => {
                    formData.append('files', img);
                });
                const uploadRes = await apiService.uploadProfileImage(formData); // Using the same upload endpoint
                if (uploadRes && uploadRes.length > 0) {
                    uploadedImageIds = uploadRes.map((file: any) => file.id);
                }
            }

            // Determine approval status
            const isAdmin = user?.role?.name === 'Admin';
            const approvalStatus = isAdmin ? 'approved' : 'pending';

            const payload = {
                data: {
                    title,
                    type: "OFFER",
                    description_text: descriptionText,
                    skill_level: level,
                    location: location,
                    category: parseInt(categoryId),
                    availability_slots: validSlots,
                    user: user.id,
                    approval_status: approvalStatus,
                    ...(uploadedImageIds.length > 0 && { images: uploadedImageIds })
                }
            };

            await apiService.addSkill(payload);

            alert(isAdmin ? "Skill added and approved successfully!" : "Skill submitted for approval!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            console.log("Add skill error", error);
            alert(error || "Failed to add skill");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="text-sm font-medium mb-1 block">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                            <img src={preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Add Photo</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Skill Title *</label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Analytical reasoning"
                    className="h-11"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Category *</label>
                    <Select value={categoryId} onValueChange={setCategoryId} required>
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                            {categories.length === 0 && (
                                <SelectItem value="none" disabled>No categories available</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Skill Level *</label>
                    <Select value={level} onValueChange={setLevel} required>
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Remote, New York, etc."
                    className="h-11"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium block">Availability Slots *</label>
                    <Button type="button" variant="ghost" onClick={handleAddSlot} className="h-6 px-2 text-xs text-[#2563eb] hover:bg-blue-50">
                        <Plus className="w-3 h-3 mr-1" /> Add Slot
                    </Button>
                </div>
                <div className="space-y-2">
                    {availabilitySlots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Date</label>
                                    <Input
                                        type="date"
                                        value={slot.date}
                                        onChange={(e) => handleSlotChange(index, 'date', e.target.value)}
                                        className="h-9 text-sm px-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Start Time</label>
                                    <Input
                                        type="time"
                                        value={slot.start_time.substring(0, 5)}
                                        onChange={(e) => handleSlotChange(index, 'start_time', e.target.value)}
                                        className="h-9 text-sm px-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">End Time</label>
                                    <Input
                                        type="time"
                                        value={slot.end_time.substring(0, 5)}
                                        onChange={(e) => handleSlotChange(index, 'end_time', e.target.value)}
                                        className="h-9 text-sm px-2"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleRemoveSlot(index)}
                                className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 mt-4"
                                disabled={availabilitySlots.length === 1}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Description *</label>
                <Textarea
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    placeholder="Describe what you'll teach and what students will learn..."
                    className="min-h-[100px] resize-none"
                    required
                />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11" disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-1 h-11 bg-[#2563eb] hover:bg-[#1d4ed8]" disabled={loading} style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Skill'}
                </Button>
            </div>
        </form>
    );
}
