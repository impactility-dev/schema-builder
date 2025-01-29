import { Card, CardContent } from "@/components/ui/card";
import Renderer from "./components/renderer";

export default function Home() {
  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <Renderer />
        </CardContent>
      </Card>
    </div>
  );
}
