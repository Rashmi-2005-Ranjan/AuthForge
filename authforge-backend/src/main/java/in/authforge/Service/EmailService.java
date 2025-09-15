package in.authforge.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value ( "${spring.mail.properties.mail.smtp.from}" )
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail,String name){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to AuthForge!");
        message.setText("Dear " + name + ",\n\nWelcome to AuthForge! We're excited to have you on board.\n\nBest regards,\nThe AuthForge Team");
        mailSender.send(message);
    }

    public void sendResetOtpEmail(String toEmail,String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your Password Reset OTP");
        message.setText("Dear User,\n\nYour OTP for password reset is: " + otp + "\nThis OTP is valid for 15 minutes.\n\nBest regards,\nThe AuthForge Team");
        mailSender.send(message);
    }

    public void sendOtpEmail(String toEmail,String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Account Verification OTP");
        message.setText("Dear User,\n\nYour OTP for verification is: " + otp + "\nThis OTP is valid for 1 Hour.\n\nBest regards,\nThe AuthForge Team");
        mailSender.send(message);
    }
}
