"use client";
import Head from "next/head";
import { useState } from "react";
import { menu } from "../data/menu";

function formatPrice(p) {
  if (typeof p === "number")
    return p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return p;
}

export default function Home() {
  const categories = [
    "somenteEspetinho",
    "espetinhosSimples",
    "espetinhosCompletos",
    "lanches",
    "combosLanche",
    "porcoes",
    "alacartes",
    "pratosExecutivos",
    "combos",
    "bebidas",
    "cervejas",
    "sucos",
  ];
  const [active, setActive] = useState("somenteEspetinho");
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const renderItems = (catKey) => {
    const cat = menu[catKey];
    if (!cat) return null;

    if (catKey === "porcoes") {
      return (
        <div className="space-y-6">
          {Object.entries(cat.sections).map(([sectionName, items]) => (
            <div key={sectionName}>
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {sectionName}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {items
                  .filter((item) =>
                    item.name.toLowerCase().includes(q.toLowerCase())
                  )
                  .map((it, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{it.name}</div>
                        {it.desc && (
                          <div className="text-sm text-gray-400">{it.desc}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">Inteira</div>
                        <div className="font-semibold">
                          {formatPrice(it.price.inteira)}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">Meia</div>
                        <div>{formatPrice(it.price.meia)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {(cat.items || [])
          .filter((it) => it.name.toLowerCase().includes(q.toLowerCase()))
          .map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/5 rounded-lg flex justify-between items-start"
            >
              <div>
                <div className="font-medium text-lg">{item.name}</div>
                {item.desc && (
                  <div className="text-sm text-gray-400 mt-1">{item.desc}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-orange-400 font-bold text-lg">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Brasa Burger — Cardápio</title>
        <meta
          name="description"
          content="Cardápio Brasa Burger — minimal e direto ao ponto."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#0b0b0b] to-[#141212] text-white p-6">
        <header className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8"
              aria-label="Abrir menu"
            >
              <span
                className={`block w-6 h-0.5 bg-white mb-1.5 transition-all ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white mb-1.5 transition-all ${
                  menuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white transition-all ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Brasa Burger
            </h1>
          </div>

          <div className="flex gap-3 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar item..."
              className="bg-white/6 placeholder:text-gray-300 px-3 py-2 rounded-md outline-none"
            />
          </div>
        </header>

        {/* Tabs para desktop */}
        <div className="max-w-5xl mx-auto mt-6 block">
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex space-x-1">
              {categories.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActive(key);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap ${
                    active === key
                      ? "bg-red-600 text-white"
                      : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  {menu[key]?.title || key}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="max-w-5xl mx-auto mt-0 md:mt-4">
          {/* Menu lateral para mobile */}
          <aside
            className={`${
              menuOpen ? "fixed inset-0 z-50 bg-[#0b0b0b] p-6" : "hidden"
            } md:hidden`}
          >
            <nav className="flex flex-col gap-2">
              <button
                onClick={toggleMenu}
                className="self-end mb-4 text-2xl"
                aria-label="Fechar menu"
              >
                &times;
              </button>

              {categories.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActive(key);
                    setMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`text-left px-3 py-2 rounded-md w-full ${
                    active === key
                      ? "bg-orange-600 text-white"
                      : "hover:bg-white/10 text-gray-200"
                  }`}
                >
                  {menu[key]?.title || key}
                </button>
              ))}
            </nav>
          </aside>

          <div className="bg-white/5 rounded-b-lg rounded-t-none md:rounded-t-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {menu[active]?.title}
            </h2>
            {renderItems(active)}
          </div>
        </section>
      </main>
    </>
  );
}
