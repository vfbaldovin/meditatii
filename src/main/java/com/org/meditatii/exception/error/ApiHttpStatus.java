package com.org.meditatii.exception.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ApiHttpStatus {
    SUCCESS(0, "Succes"),
    EMAIL_TAKEN(1, "Adresa de email este deja folosită."),
    EMAIL_NOT_FOUND(2, "Adresa de email nu este înregistrată."),
    PASSWORD_COMPLIANCE(3, "Parolele nu se potrivesc."),
    RESEND_ACTIVATION_MAIL(4, "Emailul este deja înregistrat. Un email de activare a fost trimis din nou, vă rugăm verificați inbox-ul și folderul de spam."),
    USER_NOT_ENABLED(5, "Contul dumneavoastră nu este activat. Vă rugăm să vă înregistrați din nou."),
    INVALID_PASSWORD(6, "Parola este incorectă."),
    INVALID_TOKEN(7, "Token invalid, vă rugăm încercați din nou."),

    BAD_REQUEST(8, "Cerere greșită"),
    UNKNOWN_EXCEPTION(60, "Excepție necunoscută");

    private final int code;
    private final String message;
}

