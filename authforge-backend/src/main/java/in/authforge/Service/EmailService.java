package in.authforge.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;
 /*
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
     */

    public void sendOtpEmail(String toEmail , String otp) throws MessagingException {
        Context context = new Context ( );
        context.setVariable ( "email" , toEmail );
        context.setVariable ( "otp" , otp );

        String process = templateEngine.process ( "verifyEmail" , context );
        MimeMessage mimeMessage = mailSender.createMimeMessage ( );
        MimeMessageHelper helper = new MimeMessageHelper ( mimeMessage );

        helper.setFrom ( fromEmail );
        helper.setTo ( toEmail );
        helper.setSubject ( "Account Verification OTP" );
        helper.setText ( process , true );
        mailSender.send ( mimeMessage );
    }

    public void sendResetOtpEmail(String toEmail , String otp) throws MessagingException {
        Context context = new Context ( );
        context.setVariable ( "email" , toEmail );
        context.setVariable ( "otp" , otp );

        String process = templateEngine.process ( "passwordReset" , context );
        MimeMessage mimeMessage = mailSender.createMimeMessage ( );
        MimeMessageHelper helper = new MimeMessageHelper ( mimeMessage );

        helper.setFrom ( fromEmail );
        helper.setTo ( toEmail );
        helper.setSubject ( "Your Password Reset OTP" );
        helper.setText ( process , true );
        mailSender.send ( mimeMessage );
    }

    public void sendWelcomeEmail(String toEmail , String name) throws MessagingException {
        Context context = new Context ( );
        context.setVariable ( "name" , name );

        String process = templateEngine.process ( "welcomeEmail" , context );
        MimeMessage mimeMessage = mailSender.createMimeMessage ( );
        MimeMessageHelper helper = new MimeMessageHelper ( mimeMessage );

        helper.setFrom ( fromEmail );
        helper.setTo ( toEmail );
        helper.setSubject ( "Welcome to AuthForge!" );
        helper.setText ( process , true );
        mailSender.send ( mimeMessage );
    }
}
