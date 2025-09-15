package in.authforge.Service;

import in.authforge.IO.ProfileRequest;
import in.authforge.IO.ProfileResponse;

public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest request);

    ProfileResponse getProfileByEmail(String email);

    void sendResetOtp(String email);

    void resetPassword(String email , String otp , String newPassword);

    void sendOtp(String email);

    void verifyOtp(String email , String otp);
}
