import { Reducer } from '@reduxjs/toolkit';

export interface AuthState {
    user: any;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

declare const authReducer: Reducer<AuthState, any>;
export default authReducer;

export const loginUser: any;
export const registerUser: any;
export const forgotPasswordUser: any;
export const resetPasswordUser: any;
export const logout: any;
export const clearError: any;
export const clearSuccessMessage: any;
export const updateUserDetails: any;
export const uploadUserProfileImage: any;
export const changeUserPassword: any;
