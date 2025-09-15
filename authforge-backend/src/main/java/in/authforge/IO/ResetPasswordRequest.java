package in.authforge.IO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    @NotBlank(message = "New password must not be blank") // Hibernate Validator annotation to ensure the field is not blank
    private String newPassword;
    @NotBlank(message = "OTP must not be blank")
    private String otp;
    @NotBlank(message = "Email must not be blank")
    private String email;
}