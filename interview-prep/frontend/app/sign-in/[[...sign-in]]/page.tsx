import { SignIn } from "@clerk/nextjs";
import { MotionPage } from "@/components/MotionPage";

export default function Page() {
  return (
    <MotionPage>
      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-white/10 bg-[#17171D]/80 p-6 backdrop-blur-xl">
        <SignIn
          appearance={{
            elements: {
              card: "bg-transparent shadow-none border-0",
              headerTitle: "text-[#F1F0FF]",
              headerSubtitle: "text-[#9B99B8]",
              socialButtonsBlockButton: "bg-[#0F0F13] border border-white/10 text-[#F1F0FF] hover:bg-white/5",
              formButtonPrimary: "bg-gradient-to-r from-indigo-500 to-violet-600",
              formFieldInput: "bg-[#0F0F13] border border-white/10 text-[#F1F0FF]"
            }
          }}
        />
      </div>
    </MotionPage>
  );
}
