import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { 
    SendOtpRequest, SendOtpResponse,
    VerifyOtpRequest, VerifyOtpResponse,
    CompleteRegistrationRequest, CompleteRegistrationResponse,
    MeResponse,
    LogoutResponse
} from "@/types/auth.types";

export const sendOtp = async (payload: SendOtpRequest): Promise<ApiResponse<SendOtpResponse>> => {
    const { data } = await api.post<ApiResponse<SendOtpResponse>>(
        "/Auth/send-otp",
        payload
    );
    return data;
};

export const verifyOtp = async (payload: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> => {
    const { data } = await api.post<ApiResponse<VerifyOtpResponse>>(
        "/Auth/verify-otp",
        payload
    );
    return data;
};

export const completeRegistration = async (payload: CompleteRegistrationRequest): Promise<ApiResponse<CompleteRegistrationResponse>> => { 
    const { data } = await api.post<ApiResponse<CompleteRegistrationResponse>>(
        "/Auth/complete-registration",
        payload
    );
    return data;
};

export const getMe = async (): Promise<ApiResponse<MeResponse>> => {
    const { data } = await api.get<ApiResponse<MeResponse>>(
        "Auth/me"
    );
    return data;
}

export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
    const { data } = await api.post<ApiResponse<LogoutResponse>>(
        "Auth/logout"
    );
    return data;
}