import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiService.login(credentials);

            let token = response?.jwt || response?.data?.token;
            let user = response?.user || response?.data?.user;

            if (token) {
                localStorage.setItem('teja-token', token);

                try {
                    const details = await apiService.getProfileDetails();
                    const reviews = await apiService.getProfileReviews();
                    user = {
                        ...user,
                        ...details,
                        reviews_as_reviewed_user: reviews.reviews_as_reviewed_user || [],
                        reviews_as_reviewer: reviews.reviews_as_reviewer || []
                    };
                } catch (e) {
                    console.error("Failed to fetch full profile:", e);
                }

                localStorage.setItem('teja-details', JSON.stringify(user));
                if (response.user) response.user = user;
                if (response.data && response.data.user) response.data.user = user;
            }

            return response;
        } catch (error) {
            return rejectWithValue(error || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiService.register(userData);

            let token = response?.jwt || response?.data?.token;
            let user = response?.user || response?.data?.user;

            if (token) {
                localStorage.setItem('teja-token', token);

                try {
                    const details = await apiService.getProfileDetails();
                    const reviews = await apiService.getProfileReviews();
                    user = {
                        ...user,
                        ...details,
                        reviews_as_reviewed_user: reviews.reviews_as_reviewed_user || [],
                        reviews_as_reviewer: reviews.reviews_as_reviewer || []
                    };
                } catch (e) {
                    console.error("Failed to fetch full profile:", e);
                }

                localStorage.setItem('teja-details', JSON.stringify(user));
                if (response.user) response.user = user;
                if (response.data && response.data.user) response.data.user = user;
            }

            return response;
        } catch (error) {
            return rejectWithValue(error || 'Registration failed');
        }
    }
);

export const forgotPasswordUser = createAsyncThunk(
    'auth/forgotPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiService.forgotPassword(data);
            return response;
        } catch (error) {
            return rejectWithValue(error || 'Forgot password failed');
        }
    }
);

export const resetPasswordUser = createAsyncThunk(
    'auth/resetPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiService.resetPassword(data);
            return response;
        } catch (error) {
            return rejectWithValue(error || 'Reset password failed');
        }
    }
);

export const updateUserDetails = createAsyncThunk(
    'auth/updateUserDetails',
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            await apiService.updateProfile(id, data);

            // fetch updated
            const details = await apiService.getProfileDetails();
            const reviews = await apiService.getProfileReviews();
            const { user } = getState().auth;

            const updatedUser = {
                ...user,
                ...details,
                reviews_as_reviewed_user: reviews.reviews_as_reviewed_user || [],
                reviews_as_reviewer: reviews.reviews_as_reviewer || []
            };

            localStorage.setItem('teja-details', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error || 'Update profile failed');
        }
    }
);

export const uploadUserProfileImage = createAsyncThunk(
    'auth/uploadUserProfileImage',
    async ({ id, file }, { rejectWithValue, getState }) => {
        try {
            const formData = new FormData();
            formData.append('files', file);
            formData.append('ref', 'plugin::users-permissions.user');
            formData.append('refId', id);
            formData.append('field', 'profile_image');

            await apiService.uploadProfileImage(formData);

            // fetch updated
            const details = await apiService.getProfileDetails();
            const reviews = await apiService.getProfileReviews();
            const { user } = getState().auth;

            const updatedUser = {
                ...user,
                ...details,
                reviews_as_reviewed_user: reviews.reviews_as_reviewed_user || [],
                reviews_as_reviewer: reviews.reviews_as_reviewer || []
            };

            localStorage.setItem('teja-details', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error || 'Upload failed');
        }
    }
);

export const changeUserPassword = createAsyncThunk(
    'auth/changeUserPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiService.changePassword(data);
            return response;
        } catch (error) {
            return rejectWithValue(error || 'Change password failed');
        }
    }
);

const initialState = {
    user: localStorage.getItem('teja-details') ? JSON.parse(localStorage.getItem('teja-details')) : null,
    token: localStorage.getItem('teja-token'),
    isAuthenticated: !!localStorage.getItem('teja-token'),
    loading: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.successMessage = null;
            localStorage.removeItem('teja-token');
            localStorage.removeItem('teja-details');
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload?.jwt || action.payload?.data?.token;
                state.user = action.payload?.user || action.payload?.data?.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload?.jwt || action.payload?.data?.token;
                state.user = action.payload?.user || action.payload?.data?.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Forgot Password
            .addCase(forgotPasswordUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(forgotPasswordUser.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = "Password reset email sent successfully.";
            })
            .addCase(forgotPasswordUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPasswordUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resetPasswordUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = "Password has been successfully reset. You can now login.";
                state.token = action.payload?.jwt || action.payload?.data?.token;
                state.user = action.payload?.user || action.payload?.data?.user;
                if (state.token) {
                    state.isAuthenticated = true;
                    localStorage.setItem('teja-token', state.token);
                    localStorage.setItem('teja-details', JSON.stringify(state.user));
                }
            })
            .addCase(resetPasswordUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update User Profile
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.successMessage = "Profile updated successfully";
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Upload Profile Image
            .addCase(uploadUserProfileImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(uploadUserProfileImage.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.successMessage = "Profile image updated successfully";
            })
            .addCase(uploadUserProfileImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Change Password
            .addCase(changeUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(changeUserPassword.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = "Password changed successfully";
            })
            .addCase(changeUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;