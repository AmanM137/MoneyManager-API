package in.finance.moneymanager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.from.email}")
    private String fromEmail;

    @Value("${brevo.api.url:https://api.brevo.com/v3/smtp/email}")
    private String url;

    private final RestTemplate restTemplate = new RestTemplate();

    //Sends a simple email using Brevo API (HTML supported).
    public void sendEmail(String to, String subject, String body) {
        try {
            Map<String, Object> payload = Map.of(
                    "sender", Map.of("email", fromEmail, "name", "Money Manager"),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", "<html><body>" + body + "</body></html>"
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(url, entity, String.class);

        } catch (Exception e) {
            System.err.println("⚠️ Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    //Sends an email with a file attachment via Brevo API.
    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String filename) {
        try {
            String base64Attachment = Base64.getEncoder().encodeToString(attachment);

            Map<String, Object> payload = Map.of(
                    "sender", Map.of("email", fromEmail, "name", "Money Manager"),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", "<html><body>" + body + "</body></html>",
                    "attachment", List.of(
                            Map.of(
                                    "content", base64Attachment,
                                    "name", filename
                            )
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(url, entity, String.class);

        } catch (Exception e) {
            System.err.println("⚠️ Failed to send email with attachment: " + e.getMessage());
            throw new RuntimeException("Failed to send email with attachment: " + e.getMessage());
        }
    }
}
