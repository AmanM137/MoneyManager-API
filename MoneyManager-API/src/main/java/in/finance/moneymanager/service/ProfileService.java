package in.finance.moneymanager.service;

import in.finance.moneymanager.dto.AuthDTO;
import in.finance.moneymanager.dto.ProfileDTO;
import in.finance.moneymanager.entity.ProfileEntity;
import in.finance.moneymanager.repository.ProfileRepository;
import in.finance.moneymanager.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Value("${app.activation.url}")
    private String activationUrl;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.from.email}")
    private String brevoFromEmail;

    //Register New Profile
    public ProfileDTO registerProfile(ProfileDTO profileDTO) {
        ProfileEntity newProfile = toEntity(profileDTO);
        newProfile.setActivationToken(UUID.randomUUID().toString());
        newProfile = profileRepository.save(newProfile);

        // Build activation email
        String activationLink = activationUrl + "/api/v1.0/activate?token=" + newProfile.getActivationToken();
        String subject = "Activate your Money Manager account";
        String body = "Click on the following link to activate your Money Manager account:<br><br>"
                + "<a href=\"" + activationLink + "\">Activate Account</a>";

        try {
            sendEmailViaBrevo(newProfile.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("⚠️ Email sending failed: " + e.getMessage());
        }

        return toDTO(newProfile);
    }

    //Send Email via Brevo
    private void sendEmailViaBrevo(String toEmail, String subject, String htmlContent) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.brevo.com/v3/smtp/email";

        Map<String, Object> payload = Map.of(
                "sender", Map.of("email", brevoFromEmail, "name", "Money Manager"),
                "to", new Object[]{Map.of("email", toEmail)},
                "subject", subject,
                "htmlContent", "<html><body>" + htmlContent + "</body></html>"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        restTemplate.postForEntity(url, entity, String.class);
    }

    //Activation
    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
                .map(profile -> {
                    profile.setIsActive(true);
                    profileRepository.save(profile);
                    return true;
                })
                .orElse(false);
    }

    // ---------------- Account Active Check ----------------
    public boolean isAccountActive(String email) {
        return profileRepository.findByEmail(email)
                .map(ProfileEntity::getIsActive)
                .orElse(false);
    }

    //Get Current Authenticated Profile
    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return profileRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new UsernameNotFoundException("Profile not found with email: " + authentication.getName()));
    }

    //Get Public Profile
    public ProfileDTO getPublicProfile(String email) {
        ProfileEntity currentUser;
        if (email == null) {
            currentUser = getCurrentProfile();
        } else {
            currentUser = profileRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new UsernameNotFoundException("Profile not found with email: " + email));
        }

        return toDTO(currentUser);
    }

    //Authenticate & Generate JWT Token
    public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
        Optional<ProfileEntity> optionalProfile = profileRepository.findByEmail(authDTO.getEmail());

        if (optionalProfile.isEmpty()) {
            // Email does not exist in DB
            throw new UsernameNotFoundException("User not found");
        }

        ProfileEntity profile = optionalProfile.get();

        // Verify password
        if (!passwordEncoder.matches(authDTO.getPassword(), profile.getPassword())) {
            throw new BadCredentialsException("Incorrect password");
        }

        // If we reached here, credentials are valid
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getPassword())
        );

        String token = jwtUtil.generateToken(authDTO.getEmail());
        return Map.of(
                "token", token,
                "user", getPublicProfile(authDTO.getEmail())
        );
    }

    //Entity Conversion
    public ProfileEntity toEntity(ProfileDTO profileDTO) {
        return ProfileEntity.builder()
                .id(profileDTO.getId())
                .fullName(profileDTO.getFullName())
                .email(profileDTO.getEmail())
                .password(passwordEncoder.encode(profileDTO.getPassword()))
                .profileImageUrl(profileDTO.getProfileImageUrl())
                .createdAt(profileDTO.getCreatedAt())
                .updatedAt(profileDTO.getUpdatedAt())
                .build();
    }

    public ProfileDTO toDTO(ProfileEntity profileEntity) {
        return ProfileDTO.builder()
                .id(profileEntity.getId())
                .fullName(profileEntity.getFullName())
                .email(profileEntity.getEmail())
                .profileImageUrl(profileEntity.getProfileImageUrl())
                .createdAt(profileEntity.getCreatedAt())
                .updatedAt(profileEntity.getUpdatedAt())
                .build();
    }
}
