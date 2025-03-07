import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import mongoClientPromise from "@/lib/mongodb";

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = await mongoClientPromise;
  }
  return client.db("requests");
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("vc-schemas");
    const data = await collection.find({}).toArray();
    return NextResponse.json({ message: "Data fetched successfully", data });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: { [x: string]: any; json: () => any }) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("vc-schemas");
    const body = await req.json();
    const { name, schemaId, json, jsonLd, orgId } = body;

    const protocol = req.headers.get("x-forwarded-proto");
    const hostUrl = `${protocol}://${req.headers.get("host")}`;
    console.log("hostUrl", hostUrl);
    console.log(
      "body.$metadata.uris.jsonLdContext : ",
      body.json.$metadata.uris.jsonLdContext
    );
    body.json.$metadata.uris.jsonLdContext = `${hostUrl}/api/schemas/jsonLd/${schemaId}`;

    if (!name || !schemaId || !json || !jsonLd || !orgId) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          missingFields: [
            !name ? "name" : null,
            !schemaId ? "schemaId" : null,
            !json ? "json" : null,
            !jsonLd ? "jsonLd" : null,
            !orgId ? "orgId" : null,
          ].filter(Boolean),
        },
        { status: 400 }
      );
    }

    const result = await collection.insertOne(body);
    return NextResponse.json({
      message: "Schema created successfully",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
