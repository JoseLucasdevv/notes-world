import { Link } from "react-router-dom";

export default function Onboarding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-primary">
          Bem-vindo ao Notes World!
        </h1>
        <p className="mb-6 text-primary/80">
          O Notes World é seu espaço pessoal para criar, organizar e acessar
          suas anotações de qualquer lugar. Gerencie tarefas, registre ideias e
          mantenha tudo seguro em um só lugar.
        </p>
        <div className="flex flex-col gap-4">
          <Link to="/login">
            <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90">
              Entrar
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full rounded-lg border border-primary bg-white px-4 py-2 font-semibold text-primary transition hover:bg-primary/10">
              Criar Conta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
