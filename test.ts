import { createRefreshToken, getRefreshToken } from "@/server/auth/unityHelpers";

process.env.NEXTAUTH_SECRET = "dWhT9ytd/CHoSCiy6ZwA0PImaWw8heu79GuV2T4HKDs=";
(
  async () => {
    console.log(
      await createRefreshToken({
        userId: "abc",
        client_id: "as",
        scope: "asdasd",
        sessionToken: "cccc",
      })
    );
    const p = await getRefreshToken("eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..2nIh0P9ozjlQWAAM.j9aEP6yOgwT735rF8Ze4Y3qrXaqAYCEZCNTPVYSSl-V1ZyykQjyWnkoTXUMgEJv3Vb4Ld5dLd4hBO6KsTid0ol9Pq_ZCnA5Y9X4fNq2kTU-WSrYHS5Pb2E0qKHQjHOAaRdON4XmlB-SIUBY.VyOsFM_5XMGIMtuXjbx6XQ")
    console.log(p);
}

 
)();
