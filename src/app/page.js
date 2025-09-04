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

  const searchAllItems = useMemo(() => {
    if (!q) return null;
    const searchTerm = q.toLowerCase();
    const results = [];

    categories.forEach((categoryKey) => {
      const category = menu[categoryKey];
      if (!category) return;

      if (categoryKey === "porcoes") {
        Object.entries(category.sections).forEach(([sectionName, items]) => {
          items.forEach((item) => {
            if (
              item.name.toLowerCase().includes(searchTerm) ||
              category.title.toLowerCase().includes(searchTerm)
            ) {
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
          if (
            item.name.toLowerCase().includes(searchTerm) ||
            category.title.toLowerCase().includes(searchTerm)
          ) {
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

    if (catKey === "porcoes") {
      return (
        <div
          key={catKey}
          ref={(el) => (categoryRefs.current[catKey] = el)}
          className="space-y-8 mb-12"
        >
          <h2 className="text-3xl font-bold tracking-wide mb-4 sticky top-0 border-b rounded-lg text-white p-3 shadow">
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
                    className="p-4 bg-neutral-900/20 rounded-2xl transition-colors flex justify-between items-center shadow-md"
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
                        <div className="text-sm text-white/80">Inteira</div>
                        <div className="font-semibold text-white">
                          {formatPrice(it.price.inteira)}
                        </div>
                        <div className="text-sm text-white/80 mt-1">Meia</div>
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

    return (
      <div
        key={catKey}
        ref={(el) => (categoryRefs.current[catKey] = el)}
        className="mb-12"
      >
        <h2
          className={`text-3xl font-bold tracking-wide mb-4 sticky top-0 border-b rounded-lg text-white p-3 shadow`}
        >
          {cat.title}
        </h2>
        <div className="grid gap-8">
          {(cat.items || []).map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-neutral-900/20 rounded-2xl transition-colors flex justify-between items-center shadow-md"
            >
              <div className="flex flex-col gap-y-4">
                <div
                  className={`font-semibold tracking-wide text-2xl text-white`}
                >
                  {item.name}
                </div>
                {item.desc && (
                  <div className="text-sm text-white/90">{item.desc}</div>
                )}
                <div className="text-white font-normal tracking-wider text-lg bg-neutral-900/40 max-w-max p-2 rounded-xl">
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

      <main className="min-h-screen bg-gradient-to-br from-[#bc2f00] to-[#da6403] text-white">
        {/* Header */}
        <header className="max-w-screen mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-b border-neutral-800">
          <Image src={Logo} alt="" className="w-32" />
          <div className="flex gap-3 items-center w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar"
              className="bg-neutral-900 text-white placeholder:text-gray-300 px-4 py-2 rounded-full outline-none w-full md:w-64"
            />
          </div>
        </header>

        {/* Tabs */}
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
                      ? "bg-neutral-800 text-white"
                      : "bg-neutral-800/20 text-white hover:bg-neutral-700/20"
                  }`}
                >
                  {menu[key]?.title || key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="max-w-5xl mx-auto mt-8 p-3">
          {q && searchAllItems ? (
            <div className="space-y-4">
              <div className="text-sm text-white mb-4">
                Mostrando resultados para "{q}"
              </div>
              {searchAllItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-900/20 rounded-xl flex justify-between items-center shadow-md"
                >
                  <div>
                    <div className="font-semibold text-lg">{item.name}</div>
                    {item.desc && (
                      <div className="text-sm text-white/85 mt-1">
                        {item.desc}
                      </div>
                    )}
                    <div className="text-black/85 p-2 font-semibold rounded-xl max-w-max mt-2 bg-[#fc7303]">
                      {item.price.inteira
                        ? `${formatPrice(item.price.inteira)} / ${formatPrice(
                            item.price.meia
                          )}`
                        : formatPrice(item.price)}
                    </div>
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
