package in.authforge.Service;

import in.authforge.IO.ProfileRequest;
import in.authforge.IO.ProfileResponse;

public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest request);
}
