package com.wbr.meditatii.service;

import com.wbr.meditatii.exception.AppException;
import com.wbr.meditatii.exception.AppNotFoundException;
import com.wbr.meditatii.model.User;
import com.wbr.meditatii.repository.UserRepository;
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

        if (user.getImage() == null || user.getImage().length == 0) {
            try {
                Resource defaultImageResource = new ClassPathResource("/static/img/user-default.jpg");
                return StreamUtils.copyToByteArray(defaultImageResource.getInputStream());
            } catch (IOException e) {
                log.error("Unable to fetch /static/img/user-default.jpg", new AppException("Error default image"));
                throw new AppException("Error default image");
            }
        }

        try {
            ByteArrayInputStream bis = new ByteArrayInputStream(user.getImage());
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
