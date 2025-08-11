"use client";
import Head from "next/head";
import { useState, useMemo, useRef, useEffect } from "react";
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
  const tabsRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    if (tabRefs.current[active] && tabsRef.current) {
      const tabElement = tabRefs.current[active];
      const tabsContainer = tabsRef.current;

      // Calcula a posição para centralizar a tab
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = tabsContainer.offsetWidth;
      const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

      tabsContainer.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [active]);

  // Função para buscar em todos os itens de todas as categorias
  const searchAllItems = useMemo(() => {
    if (!q) return null;

    const results = [];

    categories.forEach((categoryKey) => {
      const category = menu[categoryKey];
      if (!category) return;

      // Tratamento especial para a categoria "porcoes"
      if (categoryKey === "porcoes") {
        Object.entries(category.sections).forEach(([sectionName, items]) => {
          items.forEach((item) => {
            if (item.name.toLowerCase().includes(q.toLowerCase())) {
              results.push({
                ...item,
                category: category.title,
                section: sectionName,
              });
            }
          });
        });
      }
      // Para outras categorias
      else if (category.items) {
        category.items.forEach((item) => {
          if (item.name.toLowerCase().includes(q.toLowerCase())) {
            results.push({
              ...item,
              category: category.title,
            });
          }
        });
      }
    });

    return results;
  }, [q]);

  const renderItems = (catKey) => {
    const cat = menu[catKey];
    if (!cat) return null;

    // Se há termo de busca, mostra resultados globais
    if (q && searchAllItems) {
      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            Mostrando resultados para "{q}" em todas as categorias
          </div>

          {searchAllItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/5 rounded-lg flex justify-between items-start"
            >
              <div>
                <div className="font-medium text-lg">{item.name}</div>
                <div className="text-sm text-gray-400">
                  {item.category}
                  {item.section ? ` • ${item.section}` : ""}
                </div>
                {item.desc && (
                  <div className="text-sm text-gray-400 mt-1">{item.desc}</div>
                )}
              </div>
              <div className="text-right">
                {item.price.inteira ? (
                  <>
                    <div className="text-sm text-gray-300">Inteira</div>
                    <div className="font-semibold">
                      {formatPrice(item.price.inteira)}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">Meia</div>
                    <div>{formatPrice(item.price.meia)}</div>
                  </>
                ) : (
                  <div className="text-orange-400 font-bold text-lg">
                    {formatPrice(item.price)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Caso contrário, mostra os itens da categoria selecionada
    if (catKey === "porcoes") {
      return (
        <div className="space-y-8">
          {Object.entries(cat.sections).map(([sectionName, items]) => (
            <div key={sectionName} className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 capitalize border-b border-white/10 pb-2">
                {sectionName}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-lg">{it.name}</div>
                        {it.desc && (
                          <div className="text-sm text-gray-400 mt-1">
                            {it.desc}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">Inteira</div>
                        <div className="font-semibold text-orange-400">
                          {formatPrice(it.price.inteira)}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">Meia</div>
                        <div className="text-orange-300">
                          {formatPrice(it.price.meia)}
                        </div>
                      </div>
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
        {(cat.items || []).map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex justify-between items-start"
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
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Brasa Burger
          </h1>

          <div className="flex gap-3 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar em todos os itens..."
              className="bg-white/6 placeholder:text-gray-300 px-3 py-2 rounded-md outline-none"
            />
          </div>
        </header>

        {/* Tabs para navegação */}
        <div className="max-w-5xl mx-auto mt-6">
          <div
            ref={tabsRef}
            className="flex overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
          >
            <div className="flex space-x-2">
              {categories.map((key) => (
                <button
                  key={key}
                  ref={(el) => (tabRefs.current[key] = el)}
                  onClick={() => {
                    setActive(key);
                    setQ("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    active === key
                      ? "bg-orange-600 text-white"
                      : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  {menu[key]?.title || key}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="max-w-5xl mx-auto mt-4">
          <div className="bg-white/5 rounded-lg p-6">
            {!q && (
              <h2 className="text-2xl font-semibold mb-4">
                {menu[active]?.title}
              </h2>
            )}
            {renderItems(active)}
          </div>
        </section>
      </main>
    </>
  );
}
