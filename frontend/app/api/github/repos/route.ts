import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {

  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const client = await clerkClient();

  const tokens = await client.users.getUserOauthAccessToken(
    userId,
    "oauth_github"
  );

  const token = tokens?.data?.[0]?.token;

  if (!token) {
    return Response.json({ error: "GitHub token missing" });
  }

  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const repos = await res.json();

  return Response.json(repos);
}