export enum FirebaseAuthErrorCode {
  InvalidEmail = "auth/invalid-email",
  UserDisabled = "auth/user-disabled",
  UserNotFound = "auth/user-not-found",
  WrongPassword = "auth/wrong-password",
  TooManyRequests = "auth/too-many-requests",
  NetworkRequestFailed = "auth/network-request-failed",
  WeakPassword = "auth/weak-password",
  OperationNotAllowed = "auth/operation-not-allowed",
  InternalError = "auth/internal-error",
  AppNotAuthorized = "auth/app-not-authorized",
  RequiresRecentLogin = "auth/requires-recent-login",
  InvalidUserToken = "auth/invalid-user-token",
  InvalidCredential = "auth/invalid-credential",
  InvalidVerificationCode = "auth/invalid-verification-code",
  AccountExistsWithDifferentCredential = "auth/account-exists-with-different-credential",
  EmailAlreadyInUse = "auth/email-already-in-use",
  MultiFactorAuthRequired = "auth/multi-factor-auth-required",
  Timeout = "auth/timeout",
  QuotaExceeded = "auth/quota-exceeded",
  SessionCookieExpired = "auth/session-cookie-expired",
  UnverifiedEmail = "auth/unverified-email",
  WebStorageUnsupported = "auth/web-storage-unsupported",
  CorsUnsupported = "auth/cors-unsupported",
}

interface FirebaseAuthErrorDetail {
  code: FirebaseAuthErrorCode;
  description: string;
}

export const firebaseAuthErrorDetails: Record<
  FirebaseAuthErrorCode,
  FirebaseAuthErrorDetail
> = {
  [FirebaseAuthErrorCode.InvalidEmail]: {
    code: FirebaseAuthErrorCode.InvalidEmail,
    description: "E-post eller passord er feil.",
  },

  [FirebaseAuthErrorCode.UserDisabled]: {
    code: FirebaseAuthErrorCode.UserDisabled,
    description: "Kontoen din er deaktivert.",
  },

  [FirebaseAuthErrorCode.UserNotFound]: {
    code: FirebaseAuthErrorCode.UserNotFound,
    description: "E-post eller passord er feil.",
  },

  [FirebaseAuthErrorCode.WrongPassword]: {
    code: FirebaseAuthErrorCode.WrongPassword,
    description: "E-post eller passord er feil.",
  },

  [FirebaseAuthErrorCode.TooManyRequests]: {
    code: FirebaseAuthErrorCode.TooManyRequests,
    description:
      "Brukeren er midlertidig blokkert på grunn av for mange mislykkede innloggingsforsøk.",
  },

  [FirebaseAuthErrorCode.NetworkRequestFailed]: {
    code: FirebaseAuthErrorCode.NetworkRequestFailed,
    description:
      "En nettverksfeil oppstod. Kontroller internettforbindelsen din.",
  },

  [FirebaseAuthErrorCode.WeakPassword]: {
    code: FirebaseAuthErrorCode.WeakPassword,
    description: "Passordet er ikke sterkt nok.",
  },

  [FirebaseAuthErrorCode.OperationNotAllowed]: {
    code: FirebaseAuthErrorCode.OperationNotAllowed,
    description: "E-post/passord-innlogging er ikke aktivert.",
  },

  [FirebaseAuthErrorCode.InternalError]: {
    code: FirebaseAuthErrorCode.InternalError,
    description:
      "En intern feil har oppstått på Firebase Authentication-serveren.",
  },

  [FirebaseAuthErrorCode.AppNotAuthorized]: {
    code: FirebaseAuthErrorCode.AppNotAuthorized,
    description:
      "Appen er ikke autorisert til å bruke Firebase Authentication.",
  },

  [FirebaseAuthErrorCode.RequiresRecentLogin]: {
    code: FirebaseAuthErrorCode.RequiresRecentLogin,
    description: "Denne operasjonen krever en nylig innlogging.",
  },

  [FirebaseAuthErrorCode.InvalidUserToken]: {
    code: FirebaseAuthErrorCode.InvalidUserToken,
    description: "Brukerens legitimasjon er ikke lenger gyldig.",
  },

  [FirebaseAuthErrorCode.InvalidCredential]: {
    code: FirebaseAuthErrorCode.InvalidCredential,
    description: "E-post eller passord er feil.",
  },

  [FirebaseAuthErrorCode.InvalidVerificationCode]: {
    code: FirebaseAuthErrorCode.InvalidVerificationCode,
    description:
      "Bekreftelseskoden som ble brukt for å verifisere brukerlegitimasjonen, er ugyldig.",
  },

  [FirebaseAuthErrorCode.AccountExistsWithDifferentCredential]: {
    code: FirebaseAuthErrorCode.AccountExistsWithDifferentCredential,
    description:
      "Det finnes allerede en konto med den e-postadressen, tilknyttet en annen påloggingsmetode.",
  },

  [FirebaseAuthErrorCode.EmailAlreadyInUse]: {
    code: FirebaseAuthErrorCode.EmailAlreadyInUse,
    description: "E-postadressen er allerede i bruk.",
  },

  [FirebaseAuthErrorCode.MultiFactorAuthRequired]: {
    code: FirebaseAuthErrorCode.MultiFactorAuthRequired,
    description:
      "Brukeren må fullføre et steg for flerfaktorautentisering (MFA).",
  },

  [FirebaseAuthErrorCode.Timeout]: {
    code: FirebaseAuthErrorCode.Timeout,
    description: "Operasjonen har tidsavbrutt.",
  },

  [FirebaseAuthErrorCode.QuotaExceeded]: {
    code: FirebaseAuthErrorCode.QuotaExceeded,
    description:
      "Kvoten for Firebase Authentication-forespørsler har blitt overskredet.",
  },

  [FirebaseAuthErrorCode.SessionCookieExpired]: {
    code: FirebaseAuthErrorCode.SessionCookieExpired,
    description: "Firebase-øktkaken har utløpt.",
  },

  [FirebaseAuthErrorCode.UnverifiedEmail]: {
    code: FirebaseAuthErrorCode.UnverifiedEmail,
    description: "Brukerens e-postadresse er ikke bekreftet.",
  },

  [FirebaseAuthErrorCode.WebStorageUnsupported]: {
    code: FirebaseAuthErrorCode.WebStorageUnsupported,
    description:
      "Nettleseren støtter ikke web-lagring, eller det er deaktivert.",
  },

  [FirebaseAuthErrorCode.CorsUnsupported]: {
    code: FirebaseAuthErrorCode.CorsUnsupported,
    description: "Nettleseren er ikke støttet på grunn av CORS-problemer.",
  },
};
