import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Get All Blogs
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${Baseurl}/api/v1/blog/get`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Get Single Blog by ID
export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${Baseurl}/api/v1/blog/get/${id}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Create Blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, thunkAPI) => {
    try {
      const res = await axios.post(`${Baseurl}/api/v1/blog/create`, blogData);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Update Blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${Baseurl}/api/v1/blog/update/${id}`,
        updatedData
      );
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Delete Blog
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${Baseurl}/api/v1/blog/delete/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Upload Blog Image to Cloudinary
export const uploadBlogImage = createAsyncThunk(
  "blog/uploadBlogImage",
  async (imageData, thunkAPI) => {
    try {
      const res = await axios.post(
        `${Baseurl}/api/v1/blog/upload-image`,
        imageData
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Upload Blog Banner Image to Cloudinary
export const uploadBlogBannerImage = createAsyncThunk(
  "blog/uploadBlogBannerImage",
  async (bannerData, thunkAPI) => {
    try {
      const res = await axios.post(
        `${Baseurl}/api/v1/blog/upload-banner`,
        bannerData
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Delete Blog Image from Cloudinary
export const deleteBlogImage = createAsyncThunk(
  "blog/deleteBlogImage",
  async (publicId, thunkAPI) => {
    try {
      const res = await axios.delete(`${Baseurl}/api/v1/blog/delete-image`, {
        data: { public_id: publicId },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    blog: null,
    loading: false,
    imageLoading: false,
    error: null,
    message: null,
    uploadedImages: {
      blogImage: null,
      bannerImage: null,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearUploadedImages: (state) => {
      state.uploadedImages = {
        blogImage: null,
        bannerImage: null,
      };
    },
    setUploadedImage: (state, action) => {
      const { type, url } = action.payload;
      state.uploadedImages[type] = url;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📌 Fetch All Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Fetch Blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload);
        state.message = "Blog created successfully!";
        state.uploadedImages = { blogImage: null, bannerImage: null };
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog
        );
        state.message = "Blog updated successfully!";
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
        state.message = "Blog deleted successfully!";
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Upload Blog Image
      .addCase(uploadBlogImage.pending, (state) => {
        state.imageLoading = true;
      })
      .addCase(uploadBlogImage.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.uploadedImages.blogImage = action.payload.blogImages;
        state.message = "Blog image uploaded successfully!";
      })
      .addCase(uploadBlogImage.rejected, (state, action) => {
        state.imageLoading = false;
        state.error = action.payload;
      })

      // 📌 Upload Blog Banner Image
      .addCase(uploadBlogBannerImage.pending, (state) => {
        state.imageLoading = true;
      })
      .addCase(uploadBlogBannerImage.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.uploadedImages.bannerImage = action.payload.blogBannerImages;
        state.message = "Blog banner uploaded successfully!";
      })
      .addCase(uploadBlogBannerImage.rejected, (state, action) => {
        state.imageLoading = false;
        state.error = action.payload;
      })

      // 📌 Delete Blog Image
      .addCase(deleteBlogImage.fulfilled, (state, action) => {
        state.message = "Image deleted successfully!";
      })
      .addCase(deleteBlogImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearUploadedImages,
  setUploadedImage,
} = blogSlice.actions;
export default blogSlice.reducer;
