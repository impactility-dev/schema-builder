import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Renderer from "./components/renderer";

export default function Home() {
  return (
    <div className="p-10">
      <Card>
        <CardHeader title="Define Schema">
          <p className="text-sm text-gray-500">Create a new schema</p>
        </CardHeader>
        <CardContent>
          <Renderer />
        </CardContent>
      </Card>
    </div>
  );
}
