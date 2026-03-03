import React, { useState, useEffect } from 'react';
import { Screen } from '../App';
import { apiService } from '../services/apiService';
import { Trash2, Shield, ShieldOff, Loader2 } from 'lucide-react';

interface UsersScreenProps {
    onNavigate: (screen: Screen) => void;
}

export default function UsersScreen({ onNavigate }: UsersScreenProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // To store "block-1", "delete-2" etc.
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [blockConfirm, setBlockConfirm] = useState<{ id: number, currentStatus: boolean } | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: number) => {
        try {
            setActionLoading(`delete-${id}`);
            await apiService.deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
            setDeleteConfirm(null);
        } catch (err: any) {
            alert(err || 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleBlock = async (id: number, currentStatus: boolean) => {
        const actionText = currentStatus ? 'unblock' : 'block';
        try {
            setActionLoading(`block-${id}`);
            await apiService.updateUserBlockStatus(id, !currentStatus);
            setUsers(users.map(user => user.id === id ? { ...user, blocked: !currentStatus } : user));
            setBlockConfirm(null);
        } catch (err: any) {
            alert(err || `Failed to ${actionText} user`);
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
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Users Management</h1>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-medium text-gray-500 text-sm">ID</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">User Details</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Role</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Joined</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-900">{user.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role?.name === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {user.role?.name === "Admin" ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.blocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setBlockConfirm({ id: user.id, currentStatus: user.blocked })}
                                                    disabled={actionLoading === `block-${user.id}`}
                                                    className={`p-2 rounded-lg transition-colors flex items-center justify-center w-9 h-9 ${user.blocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    title={user.blocked ? 'Unblock User' : 'Block User'}
                                                >
                                                    {actionLoading === `block-${user.id}` ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : user.blocked ? (
                                                        <Shield className="w-4 h-4" />
                                                    ) : (
                                                        <ShieldOff className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(user.id)}
                                                    disabled={actionLoading === `delete-${user.id}`}
                                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center w-9 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete User"
                                                >
                                                    {actionLoading === `delete-${user.id}` ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {
                deleteConfirm !== null && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '400px' }}>
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                    <Trash2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to delete this user? This action cannot be undone.
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
                                        onClick={() => handleDeleteUser(deleteConfirm)}
                                        disabled={actionLoading === `delete-${deleteConfirm}`}
                                        className="flex-1 flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                        style={{ backgroundColor: 'rgb(220, 38, 38)', color: '#ffffff' }}
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
                )
            }

            {/* Block/Unblock Confirmation Modal */}
            {
                blockConfirm !== null && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '400px' }}>
                            <div className="p-6 text-center">
                                <div className={`w-16 h-16 ${blockConfirm.currentStatus ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    {blockConfirm.currentStatus ? <Shield className="w-8 h-8" /> : <ShieldOff className="w-8 h-8" />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {blockConfirm.currentStatus ? 'Unblock User' : 'Block User'}
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    {blockConfirm.currentStatus
                                        ? 'Are you sure you want to unblock this user? They will regain access to the platform.'
                                        : 'Are you sure you want to block this user? They will lose access to the platform until unblocked.'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setBlockConfirm(null)}
                                        disabled={actionLoading === `block-${blockConfirm.id}`}
                                        className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleToggleBlock(blockConfirm.id, blockConfirm.currentStatus)}
                                        disabled={actionLoading === `block-${blockConfirm.id}`}
                                        className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${blockConfirm.currentStatus ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'} outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                                        style={{ backgroundColor: 'rgb(220, 38, 38)', color: '#ffffff' }}
                                    >
                                        {actionLoading === `block-${blockConfirm.id}` ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            blockConfirm.currentStatus ? 'Unblock' : 'Block'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
