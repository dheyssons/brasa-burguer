"use client";
import Head from "next/head";
import { useState, useMemo, useRef, useEffect } from "react";
import { menu } from "../data/menu";
import Image from "next/image";
import Logo from "../../public/logo.png";

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
  const [q, setQ] = useState("");
  const [active, setActive] = useState("somenteEspetinho");
  const tabsRef = useRef(null);
  const tabRefs = useRef({});
  const categoryRefs = useRef({});

  useEffect(() => {
    if (tabRefs.current[active] && tabsRef.current) {
      const tabElement = tabRefs.current[active];
      const tabsContainer = tabsRef.current;

      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = tabsContainer.offsetWidth;
      const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

      tabsContainer.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }

    if (categoryRefs.current[active]) {
      const offset = 100;
      const element = categoryRefs.current[active];
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [active]);

  // Função para buscar em todos os itens de todas as categorias
  const searchAllItems = useMemo(() => {
    if (!q) return null;

    const searchTerm = q.toLowerCase();
    const results = [];

    // Primeiro verifica se a pesquisa corresponde a uma categoria
    const matchingCategories = categories.filter((catKey) => {
      const catTitle = menu[catKey]?.title?.toLowerCase();
      return catTitle?.includes(searchTerm);
    });

    // Se encontrou categorias correspondentes, adiciona todos os itens dessas categorias
    if (matchingCategories.length > 0) {
      matchingCategories.forEach((categoryKey) => {
        const category = menu[categoryKey];
        if (!category) return;

        if (categoryKey === "porcoes") {
          Object.entries(category.sections).forEach(([sectionName, items]) => {
            items.forEach((item) => {
              results.push({
                ...item,
                category: category.title,
                section: sectionName,
              });
            });
          });
        } else if (category.items) {
          category.items.forEach((item) => {
            results.push({
              ...item,
              category: category.title,
            });
          });
        }
      });
    }

    // Depois verifica os itens individuais
    categories.forEach((categoryKey) => {
      const category = menu[categoryKey];
      if (!category) return;

      if (categoryKey === "porcoes") {
        Object.entries(category.sections).forEach(([sectionName, items]) => {
          items.forEach((item) => {
            if (item.name.toLowerCase().includes(searchTerm)) {
              results.push({
                ...item,
                category: category.title,
                section: sectionName,
              });
            }
          });
        });
      } else if (category.items) {
        category.items.forEach((item) => {
          if (item.name.toLowerCase().includes(searchTerm)) {
            results.push({
              ...item,
              category: category.title,
            });
          }
        });
      }
    });

    return results.length > 0 ? results : null;
  }, [q]);

  const renderCategory = (catKey) => {
    const cat = menu[catKey];
    if (!cat) return null;

    // Se for a categoria de porções, renderiza de forma especial
    if (catKey === "porcoes") {
      return (
        <div
          key={catKey}
          ref={(el) => (categoryRefs.current[catKey] = el)}
          className="space-y-8 mb-12"
        >
          <h2 className="text-3xl sticky top-0 bg-[#5C1A1A] font-semibold mb-6 border-b border-white/10 p-4">
            {cat.title}
          </h2>

          {Object.entries(cat.sections).map(([sectionName, items]) => (
            <div key={sectionName} className="bg-white/5 rounded-lg p-3 mb-6">
              <h3 className="text-xl font-semibold mb-4 capitalize border-b border-white/10 pb-2">
                {sectionName}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="w-56 font-bold text-xl">{it.name}</div>
                        {it.desc && (
                          <div className="text-sm text-white/75 mt-1">
                            {it.desc}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">Inteira</div>
                        <div className="font-semibold text-white">
                          {formatPrice(it.price.inteira)}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">Meia</div>
                        <div className="text-white">
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

    // Para outras categorias
    return (
      <div
        key={catKey}
        ref={(el) => (categoryRefs.current[catKey] = el)}
        className="mb-12"
      >
        <h2 className="text-3xl font-semibold mb-6 sticky top-0 border-b bg-[#5C1A1A] border-white/10 p-4">
          {cat.title}
        </h2>
        <div className="grid gap-4">
          {(cat.items || []).map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex justify-between items-start"
            >
              <div>
                <div className="w-56 font-bold text-xl">{item.name}</div>
                {item.desc && (
                  <div className="text-sm text-white/75 mt-1">{item.desc}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-white font-thin text-lg">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
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

      <main className="min-h-screen bg-[#5C1A1A] text-white">
        <header className="max-w-screen mx-auto flex flex-col md:flex-row items-center justify-around gap-4 p-6 ">
          <Image src={Logo} alt="" className="w-40" />

          <div className="flex gap-3 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar"
              className="bg-white/6 placeholder:text-gray-300 px-3 py-2 rounded-md outline-none"
            />
          </div>
        </header>
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
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    active === key
                      ? "bg-[#7B1E1E] text-white"
                      : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  {menu[key]?.title || key}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="max-w-5xl mx-auto mt-8 p-3">
          {q && searchAllItems ? (
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
                    <div className="font-bold text-xl">{item.name}</div>
                    <div className="text-sm text-white/75 hidden">
                      {item.category}
                      {item.section ? ` • ${item.section}` : ""}
                    </div>
                    {item.desc && (
                      <div className="text-sm text-white/75 mt-1">
                        {item.desc}
                      </div>
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
                      <div className="text-white font-thin text-lg">
                        {formatPrice(item.price)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((catKey) => renderCategory(catKey))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
