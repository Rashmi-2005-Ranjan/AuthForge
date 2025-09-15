package in.authforge.Service.Implementation;

import in.authforge.Entity.UserEntity;
import in.authforge.IO.ProfileRequest;
import in.authforge.IO.ProfileResponse;
import in.authforge.Repository.UserRepository;
import in.authforge.Service.EmailService;
import in.authforge.Service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProfileServiceImplementation implements ProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity newProfile = convertToEntity ( request );
        if (userRepository.existsByEmail ( newProfile.getEmail ( ) )) {
            throw new ResponseStatusException ( HttpStatus.CONFLICT , "Email already exists" );
        }
        newProfile = userRepository.save ( newProfile );
        return convertToResponse ( newProfile );
    }

    @Override
    public ProfileResponse getProfileByEmail(String email) {
        UserEntity existingUser = userRepository.findByEmail ( email )
                .orElseThrow ( () -> new UsernameNotFoundException ( "Profile Not Found" ) );
        return convertToResponse ( existingUser );
    }

    @Override
    public void sendResetOtp(String email) {
        UserEntity existingEntity = userRepository.findByEmail ( email )
                .orElseThrow ( () -> new UsernameNotFoundException ( "User Not Found With Email : " + email ) );
        // Logic to send OTP will be implemented here
        //6 Digit OTP Generation
        String otp = String.valueOf ( ThreadLocalRandom.current ( ).nextInt ( 100000 , 1000000 ) );

        //Calculate Expiry Time (current time + 15 minutes in milliseconds)
        long expiryTime = System.currentTimeMillis ( ) + (15 * 60 * 1000);

        //Update User Entity with OTP and Expiry Time
        existingEntity.setResetOtp ( otp );
        existingEntity.setResetOtpExpireAt ( expiryTime );

        //Save Into The Database
        userRepository.save ( existingEntity );

        try {
            //Send The Reset OTP Mail
            emailService.sendResetOtpEmail ( existingEntity.getEmail ( ) , otp );
        } catch (Exception ex) {
            throw new RuntimeException ( "Unable To Send  Email" );
        }
    }

    @Override
    public void resetPassword(String email , String otp , String newPassword) {
        UserEntity existingUser = userRepository.findByEmail ( email )
                .orElseThrow ( () -> new UsernameNotFoundException ( "User Not Found: " + email ) );
        if (existingUser.getResetOtp ( ) == null || !existingUser.getResetOtp ( ).equals ( otp )) {
            throw new RuntimeException ( "Invalid OTP" );
        }
        if (existingUser.getResetOtpExpireAt ( ) < System.currentTimeMillis ( )) {
            throw new RuntimeException ( "OTP Expired" );
        }
        existingUser.setPassword ( passwordEncoder.encode ( newPassword ) );
        existingUser.setResetOtp ( null );
        existingUser.setResetOtpExpireAt ( 0L );
        userRepository.save ( existingUser );
    }

    @Override
    public void sendOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail ( email )
                .orElseThrow ( () -> new UsernameNotFoundException ( "User Not Found: " + email ) );
        if (existingUser.getIsAccountVerified ( ) != null && existingUser.getIsAccountVerified ( )) {
            return;
        }
        //Generate 6 Digit OTP
        String otp = String.valueOf ( ThreadLocalRandom.current ( ).nextInt ( 100000 , 1000000 ) );
        //Calculate Expiry Time (current time + 24 hours in milliseconds)
        long expiryTime = System.currentTimeMillis ( ) + (24 * 60 * 60 * 1000);
        //Update User Entity with OTP and Expiry Time
        existingUser.setVerifyOtp ( otp );
        existingUser.setVerifyOtpExpireAt ( expiryTime );
        //Save Into The Database
        userRepository.save ( existingUser );
        try {
            emailService.sendOtpEmail ( existingUser.getEmail (),otp );
        }catch (Exception ex) {
            throw new RuntimeException ( "Unable To Send Email" );
        }
    }

    @Override
    public void verifyOtp(String email , String otp) {
        UserEntity existingUser = userRepository.findByEmail ( email )
                .orElseThrow ( () -> new UsernameNotFoundException ( "User Not Found: " + email ) );
        if(existingUser.getVerifyOtp () == null || !existingUser.getVerifyOtp ().equals ( otp )){
            throw new RuntimeException ( "Invalid OTP" );
        }
        if(existingUser.getVerifyOtpExpireAt () < System.currentTimeMillis ()){
            throw new RuntimeException ( "OTP Expired" );
        }
        existingUser.setIsAccountVerified ( true );
        existingUser.setVerifyOtp ( null );
        existingUser.setVerifyOtpExpireAt ( 0L );
        userRepository.save ( existingUser );
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
