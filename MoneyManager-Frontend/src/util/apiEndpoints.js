export const BASE_URL = "https://moneymanager-api-vf2f.onrender.com/api/v1.0";
// export const BASE_URL = "http://localhost:8080/api/v1.0";

const CLOUDINARY_CLOUD_NAME = "dtzdzz6ty";

export const API_ENDPOINTS = {
    // 🔐 Auth & Profile
    LOGIN: "/login",
    REGISTER: "/register",
    GET_USER_INFO: "/profile",

    // 🗂️ Category
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    DELETE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,

    // 💰 Income
    GET_ALL_INCOMES: "/incomes",
    ADD_INCOME: "/incomes",
    UPDATE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    INCOME_EXCEL_DONWLOAD: "/excel/download/income",
    EMAIL_INCOME: "/email/income-excel",

    // 💸 Expense
    GET_ALL_EXPENSE: "/expenses",
    ADD_EXPENSE: "/expenses",
    UPDATE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    EXPENSE_EXCEL_DOWNLOAD: "/excel/download/expense",
    EMAIL_EXPENSE: "/email/expense-excel",

    // 📊 Dashboard & Filters
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard",

    // ☁️ Upload (Cloudinary)
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};
