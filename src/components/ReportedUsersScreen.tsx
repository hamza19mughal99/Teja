import React, { useState, useEffect } from 'react';
import { Screen } from '../App';
import { apiService } from '../services/apiService';
import { Loader2, X, AlertTriangle, Eye, FileText } from 'lucide-react';

interface ReportedUsersScreenProps {
    onNavigate: (screen: Screen) => void;
}

const STATUS_OPTIONS = ['pending', 'reviewed', 'resolved', 'rejected'] as const;
const ACTION_OPTIONS = ['none', 'warning', 'suspended', 'banned'] as const;

type ReportStatus = typeof STATUS_OPTIONS[number];
type ActionTaken = typeof ACTION_OPTIONS[number];

const statusColors: Record<ReportStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    rejected: 'bg-gray-100 text-gray-600',
};

const actionColors: Record<ActionTaken, string> = {
    none: 'bg-gray-100 text-gray-600',
    warning: 'bg-orange-100 text-orange-700',
    suspended: 'bg-red-100 text-red-700',
    banned: 'bg-red-200 text-red-800',
};

export default function ReportedUsersScreen({ onNavigate }: ReportedUsersScreenProps) {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Update modal state
    const [editingReport, setEditingReport] = useState<any | null>(null);
    const [formData, setFormData] = useState<{
        status: ReportStatus;
        admin_note: string;
        action_taken: ActionTaken;
    }>({
        status: 'pending',
        admin_note: '',
        action_taken: 'none',
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    // Detail view modal
    const [viewingReport, setViewingReport] = useState<any | null>(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getReports();
            setReports(data?.data || data || []);
        } catch (err: any) {
            setError(err || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const openEditModal = (report: any) => {
        setEditingReport(report);
        setFormData({
            status: report.status || 'pending',
            admin_note: report.admin_note || '',
            action_taken: report.action_taken || 'none',
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReport) return;

        try {
            setUpdateLoading(true);
            const reportId = editingReport.id;
            await apiService.updateReport(reportId, {
                status: formData.status,
                admin_note: formData.admin_note,
                action_taken: formData.action_taken,
            });
            // Update local state
            setReports(reports.map(r =>
                r.id === reportId
                    ? { ...r, status: formData.status, admin_note: formData.admin_note, action_taken: formData.action_taken }
                    : r
            ));
            setEditingReport(null);
        } catch (err: any) {
            alert(err || 'Failed to update report');
        } finally {
            setUpdateLoading(false);
        }
    };

    const getReporterName = (report: any) => {
        return report.reporter?.username || report.reported_by?.username || report.reporter_name || 'Unknown';
    };

    const getReportedUserName = (report: any) => {
        return report.reported_user?.username || report.reported?.username || report.reported_user_name || 'Unknown';
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
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reported Users</h1>
                        <p className="text-sm text-gray-500">{reports.length} total report{reports.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-medium text-gray-500 text-sm">ID</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Reporter</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Reported User</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Reason</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Action Taken</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Date</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-900">{report.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {getReporterName(report).substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{getReporterName(report)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                                    {getReportedUserName(report).substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{getReportedUserName(report)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 max-w-[200px] truncate">
                                            {report.reason || report.description || '-'}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[report.status as ReportStatus] || 'bg-gray-100 text-gray-600'}`}>
                                                {report.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${actionColors[report.action_taken as ActionTaken] || 'bg-gray-100 text-gray-600'}`}>
                                                {report.action_taken || 'none'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4 text-sm text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setViewingReport(report)}
                                                    className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center w-9 h-9"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(report)}
                                                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center w-9 h-9"
                                                    title="Update Report"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reports.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-gray-500">
                                            No reports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Detail Modal */}
            {viewingReport !== null && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '500px' }}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Report Details</h2>
                            <button
                                onClick={() => setViewingReport(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Report ID</p>
                                    <p className="text-sm font-semibold text-gray-900">{viewingReport.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-sm text-gray-900">{viewingReport.createdAt ? new Date(viewingReport.createdAt).toLocaleString() : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Reporter</p>
                                    <p className="text-sm font-semibold text-gray-900">{getReporterName(viewingReport)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Reported User</p>
                                    <p className="text-sm font-semibold text-red-600">{getReportedUserName(viewingReport)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[viewingReport.status as ReportStatus] || 'bg-gray-100 text-gray-600'}`}>
                                        {viewingReport.status || 'pending'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Action Taken</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${actionColors[viewingReport.action_taken as ActionTaken] || 'bg-gray-100 text-gray-600'}`}>
                                        {viewingReport.action_taken || 'none'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Reason</p>
                                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{viewingReport.reason || viewingReport.description || 'No reason provided'}</p>
                            </div>
                            {viewingReport.admin_note && (
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Admin Note</p>
                                    <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-100">{viewingReport.admin_note}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setViewingReport(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { setViewingReport(null); openEditModal(viewingReport); }}
                                className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                            >
                                Update Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Report Modal */}
            {editingReport !== null && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '460px' }}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Update Report</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Report #{editingReport.id} — {getReportedUserName(editingReport)}</p>
                            </div>
                            <button
                                onClick={() => setEditingReport(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-5 space-y-5 text-left">
                            {/* Status */}
                            <div>
                                <label htmlFor="report-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    id="report-status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ReportStatus })}
                                    className="w-full h-11 px-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm capitalize"
                                >
                                    {STATUS_OPTIONS.map(s => (
                                        <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Taken */}
                            <div>
                                <label htmlFor="action-taken" className="block text-sm font-medium text-gray-700 mb-1">Action Taken</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ACTION_OPTIONS.map(action => (
                                        <button
                                            key={action}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, action_taken: action })}
                                            className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all capitalize ${formData.action_taken === action
                                                    ? 'border-[#2563eb] bg-blue-50 text-blue-700 ring-4 ring-blue-500/10'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {action === 'none' && '⊘ '}
                                            {action === 'warning' && '⚠️ '}
                                            {action === 'suspended' && '⏸️ '}
                                            {action === 'banned' && '🚫 '}
                                            {action.charAt(0).toUpperCase() + action.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Note */}
                            <div>
                                <label htmlFor="admin-note" className="block text-sm font-medium text-gray-700 mb-1">Admin Note</label>
                                <textarea
                                    id="admin-note"
                                    rows={3}
                                    value={formData.admin_note}
                                    onChange={(e) => setFormData({ ...formData, admin_note: e.target.value })}
                                    placeholder="e.g. Reviewed the report. User was warned."
                                    className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingReport(null)}
                                    disabled={updateLoading}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                                >
                                    {updateLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
