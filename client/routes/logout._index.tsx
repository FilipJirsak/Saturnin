import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { MetaFunction } from "@remix-run/node";

export const loader = async (args: LoaderFunctionArgs) => {
  // TODO (NL): Implementovat skutečné odhlášení (zneplatnění session)
  return redirect("/login");
};

export const meta: MetaFunction = () => {
  return [
    { title: "Odhlášení | Saturnin" },
    { name: "description", content: "Odhlášení z účtu" },
  ];
};

// TODO (NL): Tato komponenta by měla být nahrazena komponentou, která bude informovat uživatele o úspěšném odhlášení
export default function LogoutRoute() {
  return (
      <div>Odhlašování...</div>
  );
}
