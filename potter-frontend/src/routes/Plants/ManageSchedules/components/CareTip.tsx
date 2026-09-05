import { Leaf } from "lucide-react";

export default function CareTip() {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-secondary/30 p-4">
            <Leaf className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
                <p className="font-medium">Little and often 🌱</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Consistentency is key! Regular care helps your plants stay healthy and
                    thrive.
                </p>
            </div>
        </div>
    );
}
