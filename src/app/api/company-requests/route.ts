import { NextResponse } from "next/server";
import { getAllCompanyRequests, createCompanyRequest } from "@/lib/data-service";

export async function GET() {
  const requests = await getAllCompanyRequests();
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, contactName, contactEmail, contactPhone, companySize, currentPaidApp, approximateAnnualCost, projectDescription } = body;

    if (!companyName || !contactName || !contactEmail || !currentPaidApp || !projectDescription) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires." }, { status: 400 });
    }

    const requestDoc = await createCompanyRequest({
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      companySize: companySize || "TPE (<10)",
      currentPaidApp,
      approximateAnnualCost,
      projectDescription,
      status: "new",
    });

    return NextResponse.json(requestDoc, { status: 201 });
  } catch (err) {
    console.error("Company Request POST error:", err);
    return NextResponse.json({ error: "Erreur serveur lors de l'enregistrement de votre demande." }, { status: 500 });
  }
}
