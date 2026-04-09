import baseApi from "@/redux/baseApi";

// Define Payment type
// types/payment.ts

export enum PaymentMethod {
  SSLCOMMERZ = "SSLCOMMERZ",
}

export enum PaymentStatus {
  INITIATED = "INITIATED",
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentPurpose {
  MEMBERSHIP_FEE = "MEMBERSHIP_FEE",
  MONTHLY_DONATION = "MONTHLY_DONATION",
  PROJECT_DONATION = "PROJECT_DONATION",
}

export interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface Payment {
  _id: string;
  userId: User | string; // Can be populated user or just ID
  amount: number;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  purpose: PaymentPurpose;
  transactionId: string;
  senderNumber?: string;
  screenshot?: string;
  paidAt?: string; // ISO string
  createdAt: string;
  updatedAt: string;
}
export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate a new payment
    initiatePayment: builder.mutation({
      query: (data: { amount: number; method: string; purpose: string }) => ({
        url: "/payments/initiate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),

    // Get all payments (admin)
    getPayments: builder.query({
      query: (params?: any) => ({
        url: "/payments",
        params,
      }),
      providesTags: ["Payment"],
    }),

    // Get payments for the current user
    getMyPayments: builder.query<{
      data: Payment[];
      meta: { totalPages: number };
    }, { page: number; limit?: number, paymentStatus?: string, sortBy?: string, sortOrder?: string }>({
      query: ({ page, limit = 10, paymentStatus, sortBy, sortOrder }) => ({
        url: `/payments/my-payments`,
        params: { page, limit, paymentStatus, sortBy, sortOrder },
      }),
      providesTags: ["Payment"],
    }),

    // Approve a payment (admin)
    approvePayment: builder.mutation({
      query: (paymentId: string) => ({
        url: `/payments/${paymentId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

// Export all hooks
export const {
  useInitiatePaymentMutation,
  useGetPaymentsQuery,
  useGetMyPaymentsQuery,
  useApprovePaymentMutation,
} = paymentApi;