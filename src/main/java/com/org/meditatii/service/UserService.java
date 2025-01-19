package com.org.meditatii.service;

import com.org.meditatii.exception.AppException;
import com.org.meditatii.exception.AppNotFoundException;
import com.org.meditatii.model.Listing;
import com.org.meditatii.model.User;
import com.org.meditatii.model.UserProfileImage;
import com.org.meditatii.model.dto.AvailableUserSubjects;
import com.org.meditatii.model.dto.PersonalListingRow;
import com.org.meditatii.model.dto.UserPersonalInfoResponse;
import com.org.meditatii.repository.ListingRepository;
import com.org.meditatii.repository.SubjectRepository;
import com.org.meditatii.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final ListingRepository listingRepository;
    private final SubjectRepository subjectRepository;

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "image/heic"
    );

    public UserService(UserRepository userRepository, AuthService authService, ListingRepository listingRepository, SubjectRepository subjectRepository) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.listingRepository = listingRepository;
        this.subjectRepository = subjectRepository;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("User not found with id: " + id));
    }

    public List<PersonalListingRow> findPersonalListingsByUserId() {
        return listingRepository.findByUserId(authService.getCurrentUser().getId())
                .stream().map(this::mapListingToPersonalListingRow).toList();
    }


    public List<AvailableUserSubjects> findAvailableUserSubjects() {
        Set<Long> existingUserSubjectIDs = findById(authService.getCurrentUser().getId())
                .getListings().stream().map(x -> x.getSubject().getId()).collect(Collectors.toSet());
        return subjectRepository.findAll().stream().filter(subject -> !existingUserSubjectIDs.contains(subject.getId()))
                .map(subject -> new AvailableUserSubjects(subject.getId(), subject.getName()))
                .toList();
    }

    private PersonalListingRow mapListingToPersonalListingRow(Listing listing) {
        return new PersonalListingRow(
                listing.getId(),
                listing.getSubject().getName(),
                listing.getViews(),
                listing.getPromoted(),
                listing.getRefreshDate()
        );
    }

    public byte[] getUserAvatar(Long id) {
        User user = findById(id);
        return Optional.ofNullable(user.getUserProfileImage())
                .map(UserProfileImage::getImage)
                .orElse(null);
    }

    public void updateUserAvatar(Long userId, MultipartFile file) {
        User user = findById(userId);
        validateImageFile(file);

        UserProfileImage profileImage = Optional.ofNullable(user.getUserProfileImage())
                .orElseGet(() -> createProfileImage(user));

        setProfileImage(profileImage, file);
        userRepository.save(user);
    }

    private void validateImageFile(MultipartFile file) {
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new AppException("Tip de fișier nevalid. Sunt permise numai JPEG, PNG, WebP și HEIC.");
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new AppException("Fișier mai mare de 5MB.");
        }
    }

    private UserProfileImage createProfileImage(User user) {
        UserProfileImage profileImage = new UserProfileImage();
        profileImage.setUser(user);
        user.setUserProfileImage(profileImage);
        return profileImage;
    }

    private void setProfileImage(UserProfileImage profileImage, MultipartFile file) {
        try {
            profileImage.setImage(file.getBytes());
        } catch (IOException e) {
            throw new AppException("Failed to process image", e);
        }
    }

    // Method to handle HEIC file conversion using ImageMagick
    public String convertHeicToJpeg(MultipartFile file, String outputDir) throws IOException, InterruptedException {
        // Save the original HEIC file temporarily
        Path heicFilePath = saveTemporaryFile(file, outputDir);

        // Define the output JPEG file path
        String jpegFilePath = outputDir + File.separator + removeExtension(file.getOriginalFilename()) + ".jpg";

        // Use ImageMagick (convert command) to convert HEIC to JPEG
        ProcessBuilder processBuilder = new ProcessBuilder(
                "magick",
                heicFilePath.toString(),  // Input HEIC file
                jpegFilePath              // Output JPEG file
        );

        Process process = processBuilder.start();
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException("Failed to convert HEIC to JPEG. Exit code: " + exitCode);
        }

        // Clean up the temporary HEIC file
        Files.delete(heicFilePath);

        return jpegFilePath;  // Return the path to the new JPEG file
    }

    // Helper method to save the MultipartFile as a temporary file
    private Path saveTemporaryFile(MultipartFile file, String outputDir) throws IOException {
        String tempFileName = outputDir + File.separator + file.getOriginalFilename();
        Path path = Paths.get(tempFileName);
        Files.write(path, file.getBytes());
        return path;
    }

    // Helper method to remove file extension
    private String removeExtension(String fileName) {
        return fileName.substring(0, fileName.lastIndexOf('.'));
    }

    public UserPersonalInfoResponse getPersonalInfo() {
        User user = authService.getCurrentUser();
        return new UserPersonalInfoResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getOccupation(),
                user.getEducation(),
                user.getExperience(),
                user.getPhone(),
                user.getCity(),
                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null
        );
    }

    public void savePersonalInfo(UserPersonalInfoResponse personalInfo) {
        User user = authService.getCurrentUser();
        user.setFirstName(personalInfo.firstName());
        user.setLastName(personalInfo.lastName());
        user.setOccupation(personalInfo.occupation());
        user.setEducation(personalInfo.education());
        user.setExperience(personalInfo.experience());
        user.setPhone(personalInfo.phone());
        user.setCity(personalInfo.city());
        user.setDateOfBirth(personalInfo.dateOfBirth() != null ? ZonedDateTime.parse(personalInfo.dateOfBirth()).toLocalDate() : null);
        userRepository.save(user);
    }
}
