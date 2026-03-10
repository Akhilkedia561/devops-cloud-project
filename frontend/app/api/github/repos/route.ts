import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {

  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const githubAccount = user.externalAccounts.find(
    (acc) => acc.provider === "oauth_github"
  );

  if (!githubAccount) {
    return Response.json({ error: "GitHub account not connected" }, { status: 400 });
  }

  // Clerk types don't expose the token → cast to any
  const token = (githubAccount as any).oauthAccessToken;

  if (!token) {
    return Response.json({ error: "GitHub token missing" }, { status: 400 });
  }

  const res = await fetch("https://api.github.com/user/repos?per_page=100", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const repos = await res.json();

  return Response.json(repos);
}