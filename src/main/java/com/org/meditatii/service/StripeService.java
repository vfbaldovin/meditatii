package com.org.meditatii.service;

import com.org.meditatii.exception.AppNotFoundException;
import com.org.meditatii.model.User;
import com.org.meditatii.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.stripe.param.checkout.SessionCreateParams.Locale.RO;

@Service
@Slf4j
public class StripeService {

    private final UserRepository userRepository;
    private final AuthService authService;

    @Value("${stripe.price.listing.id}")
    private String priceId;

    @Value("${app.url}")
    private String appUrl;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    public StripeService(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    /**
     * Creates a Stripe Checkout session for a subscription.
     */
    public Session createCheckout() throws StripeException {
        User user = authService.getCurrentUser();

        // Step 1: Create a Stripe Customer if it doesn't exist
        if (user.getStripeCustomerId() == null) {
            com.stripe.model.Customer customer = com.stripe.model.Customer.create(
                    com.stripe.param.CustomerCreateParams.builder()
                            .setEmail(user.getEmail())
                            .build()
            );

            // Save the newly created customer ID in the database
            user.setStripeCustomerId(customer.getId());
            userRepository.save(user);
        }

        // Step 2: Create the Checkout Session
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(appUrl + "/dashboard?p=success")
                .setCancelUrl(appUrl + "/dashboard")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build())
                .setCustomer(user.getStripeCustomerId()) // Use the existing or newly created customer
                .putMetadata("userId", String.valueOf(user.getId())) // Attach userId as metadata
                .setLocale(RO) // Set the language to Romanian
                .build();

        return Session.create(params);
    }

    /**
     * Handles Stripe webhook events.
     */
    public void handleWebhook(String payload, String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Stripe webhook signature", e);
        }

        switch (event.getType()) {
            case "invoice.payment_succeeded":
                handlePaymentSucceeded(event);
                break;

            case "invoice.payment_failed":
                handlePaymentFailed(event);
                break;

            default:
                log.info("Unhandled event type: " + event.getType());
        }
    }

    /**
     * Handles the "invoice.payment_succeeded" event.
     * This is triggered for both initial and subsequent payments.
     */
    private void handlePaymentSucceeded(Event event) {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        if (dataObjectDeserializer.getObject().isPresent()) {
            Invoice invoice = (Invoice) dataObjectDeserializer.getObject().get();

            // Get the Stripe customer ID from the invoice
            String customerId = invoice.getCustomer();

            // Check if this is a subsequent payment
            boolean isSubscriptionRenewal = invoice.getBillingReason().equals("subscription_cycle");

            // Find the user by Stripe customer ID
            User user = userRepository.findByStripeCustomerId(customerId).orElseThrow(
                    () -> new AppNotFoundException("User not found for stripeCustomerId: " + customerId)
            );

            if (user != null) {
                if (isSubscriptionRenewal) {
                    log.info("Subscription renewal payment succeeded for user: " + user.getEmail());
                } else {
                    log.info("Initial subscription payment succeeded for user: " + user.getEmail());
                }

                grantUserPromotion(user);
            } else {
                log.info("Customer ID not found in the database");
            }
        }
    }

    /**
     * Handles the "invoice.payment_failed" event.
     * This is triggered when a payment fails for any reason.
     */
    private void handlePaymentFailed(Event event) {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        if (dataObjectDeserializer.getObject().isPresent()) {
            Invoice invoice = (Invoice) dataObjectDeserializer.getObject().get();

            // Get the Stripe customer ID from the invoice
            String customerId = invoice.getCustomer();

            // Find the user by Stripe customer ID
            User user = userRepository.findByStripeCustomerId(customerId).orElseThrow(
                    () -> new AppNotFoundException("User not found for stripeCustomerId: " + customerId)
            );

            if (user != null) {
                log.warn("Payment failed for user: " + user.getEmail());
                revokeUserAccess(user);
            } else {
                log.warn("Customer ID not found in the database for failed payment");
            }
        }
    }

    /**
     * Grants user promotion or access after successful payment.
     */
    private void grantUserPromotion(User user) {
        user.setPromoted(true);
        user.setVerified(true);
        user.setPromotionDate(LocalDateTime.now());
        userRepository.save(user);
        log.info("Successfully promoted user: " + user.getEmail());
    }

    /**
     * Revokes user access after a failed payment.
     */
    private void revokeUserAccess(User user) {
        user.setPromoted(false);
        userRepository.save(user);
        log.info("Access revoked for user: " + user.getEmail());
    }
}
