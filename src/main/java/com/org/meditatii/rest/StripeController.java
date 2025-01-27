package com.org.meditatii.rest;

import com.org.meditatii.service.StripeService;
import com.stripe.model.checkout.Session;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

//    @PostMapping("/create-checkout")
//    public ResponseEntity<String> createCheckout() {
//        try {
//            Session session = stripeService.createCheckout();
//            return ResponseEntity.ok(session.getUrl());
//        } catch (StripeException e) {
//            return ResponseEntity.status(500).body("Failed to create Stripe Checkout session: " + e.getMessage());
//        }
//    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            stripeService.handleWebhook(payload, sigHeader);
            return ResponseEntity.ok("Webhook handled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook handling failed: " + e.getMessage());
        }
    }
}
