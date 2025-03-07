import { NextResponse } from "next/server";
import mongoClientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = await mongoClientPromise;
  }
  return client.db("requests");
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("vc-schemas");
    const result = await collection.findOne({ schemaId: id });

    if (!result) {
      return NextResponse.json({ error: "Schema not found" }, { status: 404 });
    }

    if (result && result.json) {
      return NextResponse.json(result.jsonLd); // Return the JSON-LD schema
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
