package in.authforge.Controller;

import in.authforge.IO.AuthRequest;
import in.authforge.IO.AuthResponse;
import in.authforge.IO.ResetPasswordRequest;
import in.authforge.Service.ProfileService;
import in.authforge.Utils.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticate ( request.getEmail ( ) , request.getPassword ( ) );
            final UserDetails userDetails = userDetailsService.loadUserByUsername ( request.getEmail ( ) );
            final String jwtToken = jwtUtil.generateToken ( userDetails );
            ResponseCookie cookie = ResponseCookie.from ( "jwt" , jwtToken )
                    .httpOnly ( true )
                    .path ( "/" )
                    .maxAge ( Duration.ofDays ( 1 ) ) // 1 day expiration
                    .sameSite ( "Strict" )
                    .build ( );
            return ResponseEntity.ok ( ).header ( HttpHeaders.SET_COOKIE , cookie.toString ( ) )
                    .body ( new AuthResponse ( request.getEmail ( ) , jwtToken ) );
        } catch (BadCredentialsException e) {
            Map<String, Object> response = new HashMap<> ( );
            response.put ( "error" , true );
            response.put ( "message" , "Invalid Credentials" );
            return ResponseEntity.status ( HttpStatus.BAD_REQUEST ).body ( response );
        } catch (DisabledException e) {
            Map<String, Object> response = new HashMap<> ( );
            response.put ( "error" , true );
            response.put ( "message" , "Account Is Disabled" );
            return ResponseEntity.status ( HttpStatus.UNAUTHORIZED ).body ( response );
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<> ( );
            response.put ( "error" , true );
            response.put ( "message" , "Authentication Failed" );
            return ResponseEntity.status ( HttpStatus.UNAUTHORIZED ).body ( response );
        }
    }

    private void authenticate(String email , String password) {
        authenticationManager.authenticate ( new UsernamePasswordAuthenticationToken ( email , password ) );
    }

    @GetMapping("/is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return ResponseEntity.ok ( email != null );
    }

    @PostMapping("/send-reset-otp")
    public void sendResetOtp(@RequestParam String email) {
        try {
            profileService.sendResetOtp ( email );
        } catch (Exception e) {
            throw new ResponseStatusException ( HttpStatus.INTERNAL_SERVER_ERROR , "Unable To Process Request" + e.getMessage ( ) );
        }
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            profileService.resetPassword ( request.getEmail ( ) , request.getOtp ( ) , request.getNewPassword ( ) );
        } catch (Exception e) {
            throw new ResponseStatusException ( HttpStatus.INTERNAL_SERVER_ERROR , e.getMessage ( ) );
        }
    }

    @PostMapping("/send-otp")
    public void sendVerifyOtp(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        try {
            profileService.sendOtp ( email );
        } catch (Exception e) {
            throw new ResponseStatusException ( HttpStatus.INTERNAL_SERVER_ERROR , "Unable To Process Request" + e.getMessage ( ) );
        }
    }

    @PostMapping("/verify-otp")
    public void verifyEmailOtp(@RequestBody Map<String, Object> request ,
                               @CurrentSecurityContext(expression = "authentication?.name") String email) {
        if (request.get ( "otp" ).toString ( ) == null) {
            throw new ResponseStatusException ( HttpStatus.BAD_REQUEST , "OTP Must Not Be Blank" );
        }
        try {
            profileService.verifyOtp ( email , request.get ( "otp" ).toString ( ) );
        } catch (Exception e) {
            throw new ResponseStatusException ( HttpStatus.INTERNAL_SERVER_ERROR , "Unable To Process Request " + e.getMessage ( ) );
        }
    }
}