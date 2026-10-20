export const observabilityEvents = {
  navigationStarted: "navigation_started",
  localeSwitchSelected: "locale_switch_selected",
  clientError: "client_error",
  clientUnhandledRejection: "client_unhandled_rejection",
  homeCtaClicked: "home_cta_clicked",
  homeClientStoryViewed: "home_client_story_viewed",
  blogListViewed: "blog_list_viewed",
  blogArticleViewed: "blog_article_viewed",
  blogCtaClicked: "blog_cta_clicked",
  footerSocialClicked: "footer_social_clicked",
  consentChoiceRecorded: "consent_choice_recorded",
  consentPreferencesOpened: "consent_preferences_opened",
  contactFormViewed: "contact_form_viewed",
  contactFormSubmitAttempt: "contact_form_submit_attempt",
  contactRequestAccepted: "contact_request_accepted",
  contactRequestValidationError: "contact_request_validation_error",
  contactRequestDeliveryError: "contact_request_delivery_error",
  contactRequestClientError: "contact_request_client_error",
  securityForbiddenOrigin: "security_forbidden_origin",
  securityRateLimitTriggered: "security_rate_limit_triggered",
  securityPreviewSecretInvalid: "security_preview_secret_invalid",
  securityRevalidateSignatureInvalid: "security_revalidate_signature_invalid",
  payloadAuthLoginSuccess: "payload_auth_login_success",
  payloadAuthError: "payload_auth_error",
  payloadUserChanged: "payload_user_changed",
} as const

export type ObservabilityEventName =
  (typeof observabilityEvents)[keyof typeof observabilityEvents]

export type ObservabilityPayload = Record<
  string,
  string | number | boolean | null | undefined
>
