import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Screen } from '../App';
import { apiService } from '../services/apiService';
import { RootState } from '../store';
import { Loader2, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare, Flag, ArrowRight, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface BookingsScreenProps {
    onNavigate: (screen: Screen) => void;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    accept: 'bg-blue-100 text-blue-700 border-blue-200',
    complete: 'bg-green-100 text-green-700 border-green-200',
    reject: 'bg-red-100 text-red-700 border-red-200',
    cancel: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function BookingsScreen({ onNavigate }: BookingsScreenProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<any>(null);
    const [reportModal, setReportModal] = useState<{ isOpen: boolean; booking: any | null; reason: string }>({
        isOpen: false,
        booking: null,
        reason: ''
    });
    const [reportLoading, setReportLoading] = useState(false);

    const { user } = useSelector((state: RootState) => state.auth);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await apiService.getBookings();
            if (res?.data) {
                const myBookings = res.data.filter((b: any) => {
                    const isRequester = b.requester?.id === user?.id;
                    const isProvider = b.provider?.id === user?.id;

                    if (isRequester) return true;
                    if (isProvider && b.booking_status !== 'cancel') return true;

                    return false;
                });
                myBookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBookings(myBookings);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchBookings();
        }
    }, [user?.id]);

    const handleUpdateStatus = async (bookingId: any, status: string) => {
        try {
            setActionLoading(bookingId);
            const data: any = { booking_status: status };
            if (status === 'complete') {
                data.completed_at = new Date().toISOString();
            }

            // Call the API to update the status
            await apiService.updateBooking(bookingId, data);

            // Re-fetch bookings to get the latest state from the server
            await fetchBookings();
            toast.success(`Booking ${status}ed successfully`);
        } catch (err: any) {
            toast.error(err || "Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReportUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportModal.booking || !reportModal.reason.trim()) return;

        try {
            setReportLoading(true);
            const booking = reportModal.booking;
            // The reported user is the OTHER person in the booking
            const reportedUserId = booking.requester?.id === user?.id
                ? booking.provider?.id
                : booking.requester?.id;

            await apiService.createReport({
                reason: reportModal.reason,
                reporter: user?.id,
                reported_user: reportedUserId
            });

            toast.success("Report submitted successfully.");
            setReportModal({ isOpen: false, booking: null, reason: '' });
        } catch (err: any) {
            toast.error(err || "Failed to submit report");
        } finally {
            setReportLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-sm text-gray-500">Track and manage your skill exchanges</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-medium text-gray-500 text-sm">Booking Detail</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Type</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">With User</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Scheduled</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bookings.map((booking) => {
                                    const isRequester = booking.requester?.id === user?.id;
                                    const otherUser = isRequester ? booking.provider : booking.requester;
                                    const mySkill = isRequester ? booking.offered_skill : booking.requested_skill;
                                    const theirSkill = isRequester ? booking.requested_skill : booking.offered_skill;

                                    return (
                                        <tr key={booking.documentId} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {theirSkill?.title || 'Unknown Skill'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                        <ArrowRight className="w-3 h-3" />
                                                        Trading: {mySkill?.title || 'Unknown Skill'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="secondary" className={`text-xs ${isRequester ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                    {isRequester ? 'Sent' : 'Received'}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">{otherUser?.username || 'User'}</span>
                                                        <span className="text-xs text-gray-500">{otherUser?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {booking.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={`capitalize border shadow-none ${statusColors[booking.booking_status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {booking.booking_status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Actions for Provider (Receiver) */}
                                                    {!isRequester && booking.booking_status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 border-green-200 hover:bg-green-50 h-8 text-xs px-4"
                                                                onClick={() => handleUpdateStatus(booking.documentId, 'accept')}
                                                                disabled={actionLoading === booking.documentId}
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs"
                                                                onClick={() => handleUpdateStatus(booking.documentId, 'reject')}
                                                                disabled={actionLoading === booking.documentId}
                                                            >
                                                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}

                                                    {/* Actions for Accepted Bookings */}
                                                    {booking.booking_status === 'accept' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 text-xs px-4"
                                                                onClick={() => handleUpdateStatus(booking.documentId, 'complete')}
                                                                disabled={actionLoading === booking.documentId}
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                                Mark Complete
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-gray-600 border-gray-200 hover:bg-gray-50 h-8 text-xs"
                                                                onClick={() => handleUpdateStatus(booking.documentId, 'cancel')}
                                                                disabled={actionLoading === booking.documentId}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    )}

                                                    {/* Actions for Completed Bookings */}
                                                    {booking.booking_status === 'complete' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-orange-600 border-orange-200 hover:bg-orange-50 h-8 text-xs"
                                                            onClick={() => setReportModal({ isOpen: true, booking, reason: '' })}
                                                        >
                                                            <Flag className="w-3.5 h-3.5 mr-1" />
                                                            Report User
                                                        </Button>
                                                    )}

                                                    {/* Cancel for Pending (Requester) */}
                                                    {isRequester && booking.booking_status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-gray-600 border-gray-200 hover:bg-gray-50 h-8 text-xs"
                                                            onClick={() => handleUpdateStatus(booking.documentId, 'cancel')}
                                                            disabled={actionLoading === booking.documentId}
                                                        >
                                                            Cancel Request
                                                        </Button>
                                                    )}

                                                    {actionLoading === booking.documentId && (
                                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Calendar className="w-12 h-12 text-gray-200 mb-2" />
                                                <p className="font-medium text-gray-900">No bookings found</p>
                                                <p className="text-sm">When you request or receive an exchange, it will appear here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {reportModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '400px' }}>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                <Flag className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Report User</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Please provide a reason for reporting this user. Our admins will review it.
                            </p>
                            <form onSubmit={handleReportUser}>
                                <textarea
                                    className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm min-h-[100px] mb-4"
                                    placeholder="e.g. Abusive messages, didn't show up, etc."
                                    value={reportModal.reason}
                                    onChange={(e) => setReportModal({ ...reportModal, reason: e.target.value })}
                                    required
                                />
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setReportModal({ isOpen: false, booking: null, reason: '' })}
                                        className="flex-1"
                                        disabled={reportLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        className="flex-1"
                                        disabled={reportLoading || !reportModal.reason.trim()}
                                    >
                                        {reportLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Submit Report'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
