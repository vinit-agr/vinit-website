import KeyboardScroll from "@/components/KeyboardScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tars | Pure Feel",
    description: "Experience the next generation of mechanical keyboards.",
};

export default function TarsPage() {
    return (
        <main className="bg-[#050505] min-h-screen">
            <KeyboardScroll />
        </main>
    );
}
