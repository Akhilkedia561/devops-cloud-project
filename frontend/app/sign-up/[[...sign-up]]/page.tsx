import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">

      {/* background glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md">

        <div className="text-center mb-6">

          <h1 className="text-3xl font-semibold text-white">
            Create your ShipStack account
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Start deploying your projects in seconds
          </p>

        </div>

        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-2xl">

          <SignUp
            appearance={{
              elements: {

                formButtonPrimary:
                  "bg-green-500 hover:bg-green-400 text-black",

                card: "bg-transparent shadow-none",

                headerTitle: "hidden",

                headerSubtitle: "hidden",

                socialButtonsBlockButton:
                  "border border-gray-700 hover:bg-[#1a1a1a]",

                formFieldInput:
                  "bg-black border-gray-700 text-white",

              },
            }}
            routing="path"
            path="/sign-up"
          />

        </div>

      </div>

    </div>
  );
}