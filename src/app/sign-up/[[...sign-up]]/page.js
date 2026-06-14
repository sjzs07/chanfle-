import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-black">
          Join <span className="gradient-text">Chanfle</span> 🎉
        </h1>
        <p className="mt-2 text-sm text-[#6b6b80]">
          Create an account to share your funniest moments
        </p>
      </div>
      <SignUp
        appearance={{
          variables: {
            colorBackground: "#1a1a24",
            colorText: "#f0f0f5",
            colorPrimary: "#ff3b5c",
            colorInputBackground: "#0f0f13",
            colorInputText: "#f0f0f5",
            colorTextSecondary: "#a0a0b0",
            colorNeutral: "#f0f0f5",
            colorAlphaShaded: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontFamily: "inherit",
          },
          elements: {
            card: {
              backgroundColor: "#1a1a24",
              border: "1px solid #2a2a3a",
              boxShadow: "0 0 40px rgba(255,59,92,0.08)",
            },
            headerTitle: { color: "#f0f0f5" },
            headerSubtitle: { color: "#a0a0b0" },
            socialButtonsBlockButton: {
              backgroundColor: "#0f0f13",
              border: "1px solid #2a2a3a",
              color: "#f0f0f5",
            },
            socialButtonsBlockButtonText: { color: "#f0f0f5" },
            socialButtonsBlockButtonArrow: { color: "#f0f0f5" },
            dividerLine: { backgroundColor: "#2a2a3a" },
            dividerText: { color: "#6b6b80" },
            formFieldLabel: { color: "#f0f0f5" },
            formFieldInput: {
              backgroundColor: "#0f0f13",
              border: "1px solid #2a2a3a",
              color: "#f0f0f5",
            },
            formFieldInputShowPasswordButton: { color: "#6b6b80" },
            footerActionText: { color: "#a0a0b0" },
            footerActionLink: { color: "#ff3b5c" },
            identityPreviewText: { color: "#f0f0f5" },
            identityPreviewEditButton: { color: "#ff3b5c" },
            formButtonPrimary: {
              backgroundColor: "#ff3b5c",
              color: "#ffffff",
            },
            otpCodeFieldInput: {
              backgroundColor: "#0f0f13",
              border: "1px solid #2a2a3a",
              color: "#f0f0f5",
            },
          },
        }}
      />
    </div>
  );
}
