package in.authforge.IO;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {
    @NotBlank(message = "Name Should Not Be Empty")
    private String name;
    @Email(message = "Invalid Email Format")
    @NotNull(message = "Email Should Not Be Null")
    private String email;
    @Size(min = 6, message = "Password Should Be At Least 6 Characters")
    private String password;
}
