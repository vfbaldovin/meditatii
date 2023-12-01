package com.wbr.meditatii.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class AppUtils {

    public static String removeDiacritics(String str) {
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("");
    }
}
