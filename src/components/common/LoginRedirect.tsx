"use client";

import { signIn } from "next-auth/react";

export default function LoginRedirect() {
    signIn("keycloak");

    return null;
}