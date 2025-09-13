package in.authforge.Service.Implementation;

import in.authforge.Entity.UserEntity;
import in.authforge.IO.ProfileRequest;
import in.authforge.IO.ProfileResponse;
import in.authforge.Repository.UserRepository;
import in.authforge.Service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImplementation implements ProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity newProfile = convertToEntity ( request );
        if (userRepository.existsByEmail ( newProfile.getEmail ( ) )) {
            throw new ResponseStatusException ( HttpStatus.CONFLICT , "Email already exists" );
        }
        newProfile = userRepository.save ( newProfile );
        return convertToResponse ( newProfile );
    }

    private ProfileResponse convertToResponse(UserEntity newProfile) {
        return ProfileResponse.builder ( )
                .userId ( newProfile.getUserId ( ) )
                .name ( newProfile.getName ( ) )
                .email ( newProfile.getEmail ( ) )
                .isAccountVerified ( newProfile.getIsAccountVerified ( ) )
                .build ( );
    }

    private UserEntity convertToEntity(ProfileRequest request) {
        return UserEntity.builder ( )
                .name ( request.getName ( ) )
                .email ( request.getEmail ( ) )
                .password ( passwordEncoder.encode ( request.getPassword ( ) ) )
                .isAccountVerified ( false )
                .userId ( UUID.randomUUID ( ).toString ( ) )
                .resetOtpExpireAt ( 0L )
                .verifyOtp ( null )
                .verifyOtpExpireAt ( 0L )
                .resetOtp ( null )
                .build ( );
    }
}
