package in.authforge.Controller;

import in.authforge.IO.AuthRequest;
import in.authforge.IO.AuthResponse;
import in.authforge.Utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticate ( request.getEmail ( ) , request.getPassword ( ) );
            final UserDetails userDetails = userDetailsService.loadUserByUsername ( request.getEmail ( ) );
            final String jwtToken = jwtUtil.generateToken ( userDetails );
            ResponseCookie cookie = ResponseCookie.from ( "jwt", jwtToken )
                    .httpOnly ( true )
                    .path ( "/" )
                    .maxAge ( Duration.ofDays ( 1 ) ) // 1 day expiration
                    .sameSite ( "Strict" )
                    .build ( );
            return ResponseEntity.ok (  ).header ( HttpHeaders.SET_COOKIE,cookie.toString () )
                    .body ( new AuthResponse ( request.getEmail () ,jwtToken) );
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
}
