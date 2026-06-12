import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-black">
          Join <span className="gradient-text">Chanfle</span> 🎉
        </h1>
        <p className="mt-2 text-sm text-[#6b6b80]">Create an account to share your funniest moments</p>
      </div>
      <SignUp
        appearance={{
          variables: {
            colorBackground: "#1a1a24",
            colorText: "#f0f0f5",
            colorPrimary: "#ff3b5c",
            colorInputBackground: "#0f0f13",
            colorInputText: "#f0f0f5",
            colorTextSecondary: "#6b6b80",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}
