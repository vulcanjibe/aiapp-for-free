import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/data-service";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Un compte existe déjà avec cette adresse email." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRoles = ["user", "developer", "company"];
    const userRole = validRoles.includes(role) ? role : "user";

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: "Erreur serveur lors de l'inscription." }, { status: 500 });
  }
}
