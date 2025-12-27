package in.finance.moneymanager.controller;

import in.finance.moneymanager.dto.AuthDTO;
import in.finance.moneymanager.dto.ProfileDTO;
import in.finance.moneymanager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // ---------------- Register Profile ----------------
    @PostMapping("/register")
    public ResponseEntity<ProfileDTO> registerProfile(@RequestBody ProfileDTO profileDTO) {
        ProfileDTO registeredProfile = profileService.registerProfile(profileDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredProfile);
    }

    // ---------------- Activate Profile ----------------
    @GetMapping("/activate")
    public ResponseEntity<String> activateProfile(@RequestParam String token) {
        boolean isActivated = profileService.activateProfile(token);
        if (isActivated) {
            return ResponseEntity.status(HttpStatus.OK).body("Profile activated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found or already used");
        }
    }

    // ---------------- Login ----------------
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO) {
        try {
            // Step 1: Authenticate first (checks email and password)
            Map<String, Object> response = profileService.authenticateAndGenerateToken(authDTO);

            // Step 2: Then check if account is active
            if (!profileService.isAccountActive(authDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "message", "Account is not active. Please activate your account first."
                ));
            }

            // Step 3: Successful login
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            // Step 4: Handle invalid credentials and unexpected errors
            String message = e.getMessage();

            if (message != null && (message.equalsIgnoreCase("User not found")
                    || message.equalsIgnoreCase("Invalid credentials")
                    || message.equalsIgnoreCase("Invalid email or password"))) {
                message = "Invalid email or password";
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", message != null ? message : "Login failed. Please try again."
            ));
        }
    }

    //Get Profile
    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getPublicProfile() {
        ProfileDTO profileDTO = profileService.getPublicProfile(null);
        return ResponseEntity.status(HttpStatus.OK).body(profileDTO);
    }
}
