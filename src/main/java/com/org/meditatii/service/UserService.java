package com.org.meditatii.service;

import com.org.meditatii.exception.AppException;
import com.org.meditatii.exception.AppNotFoundException;
import com.org.meditatii.model.User;
import com.org.meditatii.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class UserService {

    Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("User not found with id: " + id));
    }

    public byte[] getUserAvatar(Long id) {
        User user = findById(id);

        if (user.getUserProfileImage() == null || user.getUserProfileImage().getImage() == null || user.getUserProfileImage().getImage().length == 0) {
            return null;
        }

        try {
            ByteArrayInputStream bis = new ByteArrayInputStream(user.getUserProfileImage().getImage());
            BufferedImage bufferedImage = ImageIO.read(bis);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "jpeg", bos);
            return bos.toByteArray();
        } catch (IOException e) {
            log.error("Unable to build jpeg from byte array", new AppException("Unable building avatar"));
            throw new AppException("Unable building avatar");
        }

    }

}
