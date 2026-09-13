package backend.example.backend.module.notification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

    JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        log.info("[OTP Service] Mã OTP gửi đến {}: {}", toEmail, otp);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("MedicalNet - Mã xác thực đặt lại mật khẩu");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #0284c7; margin: 0; font-size: 24px;">MedicalNet Health Care</h1>
                        <p style="color: #64748b; margin-top: 4px; font-size: 14px;">Hệ thống đặt lịch khám bệnh trực tuyến</p>
                    </div>
                    
                    <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                        <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Xin chào,</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với địa chỉ email này.
                            Dưới đây là mã xác thực <b>OTP</b> của bạn:
                        </p>
                        
                        <div style="text-align: center; margin: 28px 0;">
                            <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #0284c7; background: #e0f2fe; padding: 12px 32px; border-radius: 8px; border: 2px dashed #0284c7;">
                                %s
                            </span>
                        </div>
                        
                        <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
                            ️  Mã xác thực này có hiệu lực trong vòng <b>5 phút</b>.<br>
                             Nếu bạn không yêu cầu đặt lại mật khẩu, xin vui lòng bỏ qua email này để bảo vệ tài khoản.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 MedicalNet System. All rights reserved.</p>
                    </div>
                </div>
            """.formatted(otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Send OTP successfully through SMTP to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Can not send email OTP through SMTP to {}: {}", toEmail, e.getMessage());
        }
    }
}
