"use client";

import { useMessages } from "next-intl";
import Script from "next/script";
import { useEffect } from "react";

export default function CookieConsent() {
  const messages = useMessages();

  useEffect(() => {
    return () => {
        document.getElementById("silktide-wrapper")?.remove();
    }
  }, []);

  return (
    <>
      <Script strategy="afterInteractive" src="/silktide-consent-manager.js" />
      <Script strategy="lazyOnload">{`
        silktideCookieBannerManager.updateCookieBannerConfig({
  background: {
    showBackground: true
  },
  cookieIcon: {
    position: "bottomLeft"
  },
  cookieTypes: [
  {
    id: "technical",
    name: "${messages["cookie-consent"]["technical-cookies"]["name"]}",
    description: "${messages["cookie-consent"]["technical-cookies"]["description"]}",
    required: true,
  }
  ],
  text: {
    banner: {
      description: "${messages["cookie-consent"]["banner"]["description"]}",
      acceptAllButtonText: "${messages["cookie-consent"]["banner"]["acceptAllButtonText"]}",
      acceptAllButtonAccessibleLabel: "${messages["cookie-consent"]["banner"]["acceptAllButtonAccessibleLabel"]}",
      rejectNonEssentialButtonText: "${messages["cookie-consent"]["banner"]["rejectNonEssentialButtonText"]}",
      rejectNonEssentialButtonAccessibleLabel: "${messages["cookie-consent"]["banner"]["rejectNonEssentialButtonAccessibleLabel"]}",
      preferencesButtonText: "${messages["cookie-consent"]["banner"]["preferencesButtonText"]}",
      preferencesButtonAccessibleLabel: "${messages["cookie-consent"]["banner"]["preferencesButtonAccessibleLabel"]}"
    },
    preferences: {
      title: "${messages["cookie-consent"]["preferences"]["title"]}",
      description: "${messages["cookie-consent"]["preferences"]["description"]}",
      creditLinkText: "${messages["cookie-consent"]["preferences"]["creditLinkText"]}",
      creditLinkAccessibleLabel: "${messages["cookie-consent"]["preferences"]["creditLinkAccessibleLabel"]}"
    }
  },
  position: {
    banner: "bottomCenter"
  }
});
        `}</Script>
    </>
  );
}
