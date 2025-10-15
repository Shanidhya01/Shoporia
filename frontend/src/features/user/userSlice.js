import { Update } from "@mui/icons-material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Registration API
export const register = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post("/api/v1/register", userData, config);
    console.log("Registration Data:", data);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Registration Failed . Please try again.");
  }
});

//Login
export const login = createAsyncThunk("user/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/api/v1/login", {email, password}, config);
    console.log("Login Data:", data);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Login Failed . Please try again.");
  }
});

// Load User
export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/v1/profile");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to load user . Please try again.");
  }
});

// Logout User
export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await axios.post("/api/v1/logout",{ withCredentials: true });
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to logout . Please try again.");
  }
});

// Update Profile
export const updateProfile = createAsyncThunk("user/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.put("/api/v1/profile/update", userData, config);
    console.log("Update Profile Data:", data);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || {message : "Profile Update Failed . Please try again."});
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
    message: null,
  },
  reducers : {
    removeErrors : (state) => {
      state.error = null;
    },
    removeSuccess : (state) => {
      state.success = false;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    // Registration
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration Failed . Please try again.";
        state.isAuthenticated = false;
        state.user = null;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        // console.log(state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login Failed . Please try again.";
        state.isAuthenticated = false;
        state.user = null;
      });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        // console.log(state.user);
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load user . Please try again.";
        state.isAuthenticated = false;
        state.user = null;
      });

    // Logout User
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to logout . Please try again.";
      });

      // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.message = action.payload.message || "Profile updated successfully!";
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Profile Update Failed . Please try again.";
      });
  },
})

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;