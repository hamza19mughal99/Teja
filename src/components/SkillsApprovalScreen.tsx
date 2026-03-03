import React, { useState, useEffect } from 'react';
import { Screen } from '../App';
import { apiService } from '../services/apiService';
import { Trash2, Loader2, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface SkillsApprovalScreenProps {
    onNavigate: (screen: Screen) => void;
}

export default function SkillsApprovalScreen({ onNavigate }: SkillsApprovalScreenProps) {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Modals
    const [confirmAction, setConfirmAction] = useState<{ id: string, action: 'approved' | 'rejected' } | null>(null);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getAllSkills();
            setSkills(response?.data || []);
        } catch (err: any) {
            setError(err || 'Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleUpdateStatus = async (documentId: string, status: 'approved' | 'rejected') => {
        try {
            setActionLoading(`${status}-${documentId}`);
            await apiService.updateSkillApproval(documentId, status);
            // Update local state to reflect change immediately without refetching all
            setSkills(skills.map(skill =>
                skill.documentId === documentId
                    ? { ...skill, approval_status: status }
                    : skill
            ));
            setConfirmAction(null);
        } catch (err: any) {
            alert(err || `Failed to ${status} skill`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 h-full p-4 lg:p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 h-full p-4 lg:p-8">
                <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error: {error}</div>
            </div>
        );
    }

    // Sort so pending is at the top usually, or just leave as is.
    const sortedSkills = [...skills].sort((a, b) => {
        if (a.approval_status === 'pending' && b.approval_status !== 'pending') return -1;
        if (a.approval_status !== 'pending' && b.approval_status === 'pending') return 1;
        return 0;
    });

    return (
        <div className="h-full overflow-y-auto bg-gray-50 p-4 lg:p-8 relative">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Skills Approval</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-medium text-gray-500 text-sm w-16">Image</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Skill Details</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Provider</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedSkills.map((skill) => (
                                    <tr key={skill.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 align-top">
                                            {skill.images && skill.images.length > 0 ? (
                                                <img
                                                    src={skill.images[0].formats?.thumbnail?.url || skill.images[0].url}
                                                    alt={skill.title}
                                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                                                    <ImageIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="font-semibold text-gray-900">{skill.title}</div>
                                            <div className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-sm">{skill.description_text || 'No description'}</div>
                                            <div className="mt-2 flex gap-2">
                                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                                    {skill.category?.name || 'Uncategorized'}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="font-medium text-gray-900">{skill.user?.username || 'Unknown'}</div>
                                            <div className="text-sm text-gray-500">{skill.user?.email || ''}</div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <Badge
                                                className={
                                                    skill.approval_status === 'approved'
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : skill.approval_status === 'rejected'
                                                            ? 'bg-red-100 text-red-700 border-red-200'
                                                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }
                                            >
                                                {skill.approval_status === 'approved' ? 'Approved' : skill.approval_status === 'rejected' ? 'Rejected' : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {skill.approval_status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => setConfirmAction({ id: skill.documentId, action: 'approved' })}
                                                            disabled={actionLoading !== null}
                                                            className="p-2 inline-flex bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center w-9 h-9 disabled:opacity-50"
                                                            title="Approve Skill"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmAction({ id: skill.documentId, action: 'rejected' })}
                                                            disabled={actionLoading !== null}
                                                            className="p-2 inline-flex bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center w-9 h-9 disabled:opacity-50"
                                                            title="Reject/Cancel Skill"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {/* {skill.approval_status === 'approved' && (
                                                    <button
                                                        onClick={() => setConfirmAction({ id: skill.documentId, action: 'rejected' })}
                                                        disabled={actionLoading !== null}
                                                        className="text-xs font-medium text-red-600 hover:text-red-700 underline underline-offset-2 disabled:opacity-50"
                                                    >
                                                        Revoke
                                                    </button>
                                                )}
                                                {skill.approval_status === 'rejected' && (
                                                    <button
                                                        onClick={() => setConfirmAction({ id: skill.documentId, action: 'approved' })}
                                                        disabled={actionLoading !== null}
                                                        className="text-xs font-medium text-green-600 hover:text-green-700 underline underline-offset-2 disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                )} */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sortedSkills.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No skills found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmAction !== null && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '400px' }}>
                        <div className="p-6 text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmAction.action === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {confirmAction.action === 'approved' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {confirmAction.action === 'approved' ? 'Approve Skill' : 'Reject Skill'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {confirmAction.action === 'approved'
                                    ? 'Are you sure you want to approve this skill? It will become visible to users searching for mentors.'
                                    : 'Are you sure you want to reject this skill? It will remain hidden from other users.'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    disabled={actionLoading === `${confirmAction.action}-${confirmAction.id}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(confirmAction.id, confirmAction.action)}
                                    disabled={actionLoading === `${confirmAction.action}-${confirmAction.id}`}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 border-0"
                                    style={{
                                        backgroundColor: confirmAction.action === 'approved' ? '#16a34a' : '#dc2626',
                                        color: '#ffffff'
                                    }}
                                >
                                    {actionLoading === `${confirmAction.action}-${confirmAction.id}` ? (
                                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        confirmAction.action === 'approved' ? 'Approve' : 'Reject'
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
