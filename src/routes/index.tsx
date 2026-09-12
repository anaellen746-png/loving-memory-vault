import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Droplets,
  Leaf,
  LockKeyhole,
  Minus,
  PackageCheck,
  Pix,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  WalletCards,
} from "lucide-react";

import pastilhasPrincipal from "@/assets/pastilhas-principal.avif.asset.json";
import pastilhasDetalhe from "@/assets/pastilhas-detalhe.avif.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pastilhas de Limpeza Multiefeito — Horizonte Prime" },
      {
        name: "description",
        content:
          "Pastilhas para limpeza de pisos: práticas, concentradas e sem enxágue. Escolha seu kit e compre com facilidade.",
      },
      { property: "og:title", content: "Pastilhas de Limpeza Multiefeito — Horizonte Prime" },
      {
        property: "og:description",
        content: "Limpeza prática e concentrada para o dia a dia. Escolha seu kit.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://loving-memory-vault.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://loving-memory-vault.lovable.app/" }],
  }),
  component: StorePage,
});

type Kit = {
  id: string;
  packages: number;
  units: number;
  label: string;
  price: number;
  compareAt: number;
  badge?: string;
};

type CartLine = Kit & { quantity: number };

const kits: Kit[] = [
  { id: "kit-1", packages: 1, units: 100, label: "1 pacote", price: 69.9, compareAt: 129.9 },
  {
    id: "kit-3",
    packages: 3,
    units: 300,
    label: "3 pacotes",
    price: 89.9,
    compareAt: 158,
    badge: "MAIS VENDIDO",
  },
  {
    id: "kit-5",
    packages: 5,
    units: 500,
    label: "5 pacotes",
    price: 119.9,
    compareAt: 199.9,
    badge: "MAIOR ECONOMIA",
  },
];

const benefits = [
  { icon: Sparkles, title: "Dissolve em segundos", text: "Uma pastilha concentrada se dissolve em água em cerca de 8 segundos." },
  { icon: Droplets, title: "Sem medir ou desperdiçar", text: "Uma dose pronta para preparar o seu balde de limpeza." },
  { icon: Leaf, title: "Aroma fresco", text: "Perfume de jasmim azul para uma sensação agradável após a limpeza." },
  { icon: PackageCheck, title: "Fácil de armazenar", text: "Pastilhas compactas, do tamanho aproximado de uma moeda de 25 centavos." },
  { icon: ShieldCheck, title: "Uso diário", text: "Fórmula indicada para o dia a dia, seguindo as instruções do fabricante." },
  { icon: Check, title: "Sem enxágue", text: "Limpa sem deixar resíduos pegajosos, segundo a descrição do produto." },
];

const steps = [
  { number: "01", title: "Encha o balde", text: "Coloque água no balde do esfregão." },
  { number: "02", title: "Adicione 1 pastilha", text: "Aguarde cerca de 8 segundos até dissolver." },
  { number: "03", title: "Limpe normalmente", text: "Passe o esfregão sobre o piso como de costume." },
  { number: "04", title: "Guarde o restante", text: "Mantenha as pastilhas restantes em local adequado." },
];

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function StorePage() {
  const [selectedKit, setSelectedKit] = useState(kits[1]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payment, setPayment] = useState("pix");
  const [imageIndex, setImageIndex] = useState(0);
  const offerRef = useRef<HTMLElement>(null);

  const images = [pastilhasPrincipal.url, pastilhasDetalhe.url];
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.compareAt * item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { subtotal, discount: subtotal - total, total };
  }, [cart]);

  const addToCart = (kit = selectedKit) => {
    setCart((current) => {
      const found = current.find((item) => item.id === kit.id);
      if (found) {
        return current.map((item) =>
          item.id === kit.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...kit, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const setQuantity = (id: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const beginCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
    window.setTimeout(() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground sm:text-sm">
        Compra simples e segura • Pagamento por PIX ou cartão
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:h-20 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold sm:text-lg">Horizonte Prime</p>
              <p className="truncate text-xs text-muted-foreground">Praticidade para a sua casa</p>
            </div>
          </div>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative size-10" aria-label={`Abrir carrinho com ${itemCount} itens`}>
                <ShoppingBag />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <CartDrawer cart={cart} totals={totals} setQuantity={setQuantity} beginCheckout={beginCheckout} />
          </Sheet>
        </div>
      </header>

      <main>
        <section className="border-b border-border bg-secondary/45">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
            <div>
              <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <img
                  src={images[imageIndex]}
                  alt={imageIndex === 0 ? "Pastilhas de limpeza de pisos multiefeito" : "Detalhes das pastilhas de limpeza"}
                  className="aspect-square w-full object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Imagem anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/90"
                  onClick={() => setImageIndex((imageIndex + images.length - 1) % images.length)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Próxima imagem"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/90"
                  onClick={() => setImageIndex((imageIndex + 1) % images.length)}
                >
                  <ChevronRight />
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`Ver imagem ${index + 1}`}
                    className={cn(
                      "overflow-hidden rounded-md border-2 bg-card transition-colors",
                      index === imageIndex ? "border-primary" : "border-transparent",
                    )}
                  >
                    <img src={image} alt="" className="aspect-[3/1] w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                <Sparkles className="size-3.5" /> LIMPEZA CONCENTRADA
              </p>
              <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Limpeza prática, rápida e sem desperdício
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Pastilhas de limpeza de pisos multiefeito com aroma de jasmim azul. Basta dissolver em água e limpar normalmente.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Dissolve em cerca de 8 segundos", "Sem medir e sem enxágue", "Aroma fresco de jasmim azul", "Compacta e fácil de guardar"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-medium">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"><Check className="size-3.5" /></span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-y border-border py-6">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">De <span className="line-through">{money(selectedKit.compareAt)}</span></p>
                    <p className="text-4xl font-black text-primary">{money(selectedKit.price)}</p>
                  </div>
                  <span className="mb-1 rounded-md bg-accent px-3 py-1 text-sm font-extrabold text-accent-foreground">
                    {Math.round((1 - selectedKit.price / selectedKit.compareAt) * 100)}% OFF
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{selectedKit.label} • {selectedKit.units} unidades</p>
              </div>

              <Button className="mt-6 h-14 w-full text-base font-extrabold" onClick={() => addToCart()}>
                COMPRAR AGORA <ArrowRight />
              </Button>
              <div className="mt-4 flex items-center justify-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><LockKeyhole className="size-4 text-primary" /> Compra protegida</span>
                <span className="flex items-center gap-1.5"><WalletCards className="size-4 text-primary" /> PIX ou cartão</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="MENOS ESFORÇO, MAIS PRATICIDADE" title="Feito para simplificar a limpeza" text="Uma solução concentrada para tornar o cuidado com os pisos mais simples no dia a dia." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="grid size-11 place-items-center rounded-md bg-accent text-accent-foreground"><Icon className="size-5" /></div>
                  <h2 className="mt-5 text-lg font-bold">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground px-4 py-16 text-background sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase text-background/65">Como funciona</p>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">Do pacote ao piso limpo em quatro passos</h2>
                <p className="mt-4 leading-relaxed text-background/65">Sem dosadores, sem complicação. Prepare a solução e siga sua rotina de limpeza.</p>
              </div>
              <ol className="grid gap-px overflow-hidden rounded-lg bg-background/20 sm:grid-cols-2">
                {steps.map((step) => (
                  <li key={step.number} className="bg-foreground p-6 sm:p-8">
                    <span className="text-sm font-black text-background/45">{step.number}</span>
                    <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-background/65">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section ref={offerRef} className="bg-secondary/45 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="ESCOLHA SUA OFERTA" title="Quanto mais você leva, mais economiza" text="Selecione a quantidade ideal para a sua rotina. Todos os kits incluem pastilhas multiefeito." />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {kits.map((kit) => {
                const saving = kit.compareAt - kit.price;
                const selected = selectedKit.id === kit.id;
                return (
                  <article key={kit.id} className={cn("relative flex flex-col rounded-lg border bg-card p-6 shadow-sm transition", selected ? "border-primary ring-2 ring-primary/15" : "border-border")}>
                    {kit.badge && <span className="absolute -top-3 left-5 rounded-md bg-primary px-3 py-1 text-[11px] font-extrabold text-primary-foreground">{kit.badge}</span>}
                    <button type="button" onClick={() => setSelectedKit(kit)} className="flex flex-1 flex-col text-left">
                      <div className="flex items-start justify-between gap-4">
                        <div><h3 className="text-xl font-black">{kit.label}</h3><p className="mt-1 text-sm text-muted-foreground">{kit.units} pastilhas</p></div>
                        <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2", selected ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                          {selected && <Check className="size-3" />}
                        </span>
                      </div>
                      <div className="mt-7">
                        <p className="text-sm text-muted-foreground line-through">{money(kit.compareAt)}</p>
                        <p className="text-3xl font-black text-primary">{money(kit.price)}</p>
                        <p className="mt-2 text-sm font-semibold text-accent-foreground">Economize {money(saving)}</p>
                      </div>
                      <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">Aproximadamente {money(kit.price / kit.packages)} por pacote</p>
                    </button>
                    <Button variant={selected ? "default" : "outline"} className="mt-5 h-11 w-full font-bold" onClick={() => { setSelectedKit(kit); addToCart(kit); }}>
                      ADICIONAR AO CARRINHO
                    </Button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
            <TrustItem icon={LockKeyhole} title="Ambiente protegido" text="Seus dados são enviados com conexão segura." />
            <TrustItem icon={CreditCard} title="Pagamento flexível" text="Estrutura preparada para PIX e cartão." />
            <TrustItem icon={Truck} title="Resumo transparente" text="Confira produtos, descontos e total antes de avançar." />
          </div>
        </section>

        {checkoutOpen && (
          <Checkout cart={cart} totals={totals} payment={payment} setPayment={setPayment} onBack={() => { setCheckoutOpen(false); offerRef.current?.scrollIntoView({ behavior: "smooth" }); }} />
        )}
      </main>

      <footer className="bg-foreground px-4 py-10 text-background sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-b border-background/15 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-lg font-extrabold">Horizonte Prime</p><p className="mt-1 text-sm text-background/60">Praticidade para a sua casa.</p></div>
          <div className="flex items-center gap-2 text-sm text-background/70"><ShieldCheck className="size-5" /> Compra simples e protegida</div>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-xs leading-relaxed text-background/50">As características e condições exibidas foram baseadas nas informações da página de referência consultada. Depoimentos e experiências podem variar conforme o tipo de piso, forma de uso e condições de limpeza.</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background p-3 shadow-lg sm:hidden">
        <Button className="h-12 w-full font-extrabold" onClick={() => addToCart()}>
          COMPRAR • {money(selectedKit.price)}
        </Button>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold text-primary">{eyebrow}</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{text}</p></div>;
}

function TrustItem({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return <div className="flex gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground"><Icon className="size-5" /></div><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{text}</p></div></div>;
}

function CartDrawer({ cart, totals, setQuantity, beginCheckout }: { cart: CartLine[]; totals: { subtotal: number; discount: number; total: number }; setQuantity: (id: string, quantity: number) => void; beginCheckout: () => void }) {
  return (
    <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
      <SheetHeader className="border-b border-border p-6 pr-14 text-left"><SheetTitle>Seu carrinho</SheetTitle><SheetDescription>{cart.length ? `${cart.reduce((sum, item) => sum + item.quantity, 0)} item(ns) selecionado(s)` : "Seu carrinho está vazio"}</SheetDescription></SheetHeader>
      <div className="flex-1 overflow-y-auto p-6">
        {cart.length === 0 ? (
          <div className="grid h-full place-items-center text-center"><div><div className="mx-auto grid size-16 place-items-center rounded-full bg-secondary"><ShoppingBag className="size-7 text-muted-foreground" /></div><p className="mt-5 font-bold">Nada por aqui ainda</p><p className="mt-2 text-sm text-muted-foreground">Escolha um kit para começar.</p><SheetClose asChild><Button variant="outline" className="mt-5">Continuar comprando</Button></SheetClose></div></div>
        ) : cart.map((item) => (
          <div key={item.id} className="border-b border-border py-5 first:pt-0">
            <div className="flex gap-4">
              <img src={pastilhasPrincipal.url} alt="Pastilhas multiefeito" className="size-20 rounded-md border border-border object-cover" />
              <div className="min-w-0 flex-1"><p className="font-bold">{item.label} — {item.units} unidades</p><p className="mt-1 text-sm text-muted-foreground">{money(item.price)}</p></div>
              <Button variant="ghost" size="icon" aria-label={`Remover ${item.label}`} onClick={() => setQuantity(item.id, 0)}><Trash2 /></Button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center rounded-md border border-border">
                <Button variant="ghost" size="icon" aria-label="Diminuir quantidade" onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus /></Button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <Button variant="ghost" size="icon" aria-label="Aumentar quantidade" onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus /></Button>
              </div>
              <p className="font-extrabold">{money(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && <div className="border-t border-border bg-secondary/40 p-6"><OrderTotals totals={totals} /><Button className="mt-5 h-12 w-full font-extrabold" onClick={beginCheckout}>IR PARA O CHECKOUT <ArrowRight /></Button><SheetClose asChild><Button variant="ghost" className="mt-2 w-full">Continuar comprando</Button></SheetClose></div>}
    </SheetContent>
  );
}

function OrderTotals({ totals }: { totals: { subtotal: number; discount: number; total: number } }) {
  return <div className="space-y-2 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div><div className="flex justify-between text-accent-foreground"><span>Desconto</span><span>− {money(totals.discount)}</span></div><div className="flex justify-between text-muted-foreground"><span>Frete</span><span>Calculado no checkout</span></div><div className="flex justify-between border-t border-border pt-3 text-lg font-black"><span>Total</span><span>{money(totals.total)}</span></div></div>;
}

function Checkout({ cart, totals, payment, setPayment, onBack }: { cart: CartLine[]; totals: { subtotal: number; discount: number; total: number }; payment: string; setPayment: (value: string) => void; onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="checkout" className="bg-secondary/45 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4"><Button variant="outline" size="icon" onClick={onBack} aria-label="Voltar às ofertas"><ChevronLeft /></Button><div><p className="text-xs font-extrabold text-primary">FINALIZAÇÃO SEGURA</p><h2 className="mt-1 text-3xl font-black">Checkout</h2></div></div>
        <form className="grid gap-8 lg:grid-cols-[1fr_380px]" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          <div className="space-y-6">
            <fieldset className="rounded-lg border border-border bg-card p-5 sm:p-7"><legend className="px-2 text-lg font-bold">1. Dados do cliente</legend><div className="mt-3 grid gap-4 sm:grid-cols-2"><Field label="Nome completo" name="name" autoComplete="name" className="sm:col-span-2" /><Field label="CPF" name="cpf" inputMode="numeric" /><Field label="Telefone" name="phone" type="tel" autoComplete="tel" /><Field label="E-mail" name="email" type="email" autoComplete="email" className="sm:col-span-2" /></div></fieldset>
            <fieldset className="rounded-lg border border-border bg-card p-5 sm:p-7"><legend className="px-2 text-lg font-bold">2. Endereço de entrega</legend><div className="mt-3 grid gap-4 sm:grid-cols-6"><Field label="CEP" name="postal-code" autoComplete="postal-code" inputMode="numeric" className="sm:col-span-2" /><Field label="Rua" name="street" autoComplete="street-address" className="sm:col-span-4" /><Field label="Número" name="number" className="sm:col-span-2" /><Field label="Complemento" name="complement" required={false} className="sm:col-span-4" /><Field label="Bairro" name="district" className="sm:col-span-3" /><Field label="Cidade" name="city" autoComplete="address-level2" className="sm:col-span-2" /><Field label="UF" name="state" autoComplete="address-level1" maxLength={2} className="sm:col-span-1" /></div></fieldset>
            <fieldset className="rounded-lg border border-border bg-card p-5 sm:p-7"><legend className="px-2 text-lg font-bold">3. Pagamento</legend><RadioGroup value={payment} onValueChange={setPayment} className="mt-3 grid gap-3 sm:grid-cols-2"><PaymentOption value="pix" icon={Pix} title="PIX" text="Pagamento à vista" /><PaymentOption value="card" icon={CreditCard} title="Cartão de crédito" text="Insira os dados do cartão" /></RadioGroup>{payment === "card" && <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Número do cartão" name="card-number" inputMode="numeric" className="sm:col-span-2" /><Field label="Validade" name="expiry" placeholder="MM/AA" /><Field label="CVV" name="cvv" inputMode="numeric" maxLength={4} /></div>}</fieldset>
          </div>
          <aside className="h-fit rounded-lg border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 sm:p-6"><h3 className="text-lg font-bold">Resumo do pedido</h3><div className="my-5 space-y-4 border-y border-border py-5">{cart.map((item) => <div key={item.id} className="flex gap-3"><img src={pastilhasPrincipal.url} alt="" className="size-14 rounded-md border border-border object-cover" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.label} ({item.units} un.)</p><p className="text-xs text-muted-foreground">Quantidade: {item.quantity}</p></div><span className="text-sm font-bold">{money(item.price * item.quantity)}</span></div>)}</div><OrderTotals totals={totals} />{submitted && <div role="status" className="mt-5 rounded-md border border-accent bg-accent/40 p-4 text-sm text-accent-foreground">Estrutura de checkout validada. Conecte um provedor de pagamento para concluir pedidos reais.</div>}<Button type="submit" className="mt-5 h-12 w-full font-extrabold"><LockKeyhole /> FINALIZAR PEDIDO</Button><p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">Esta demonstração não processa cobranças reais.</p></aside>
        </form>
      </div>
    </section>
  );
}

function Field({ label, className, required = true, ...props }: { label: string; className?: string; required?: boolean } & React.ComponentProps<typeof Input>) {
  return <label className={cn("grid gap-1.5 text-sm font-semibold", className)}>{label}<Input required={required} className="h-11 bg-background font-normal" {...props} /></label>;
}

function PaymentOption({ value, icon: Icon, title, text }: { value: string; icon: typeof CreditCard; title: string; text: string }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/40"><RadioGroupItem value={value} /><Icon className="size-5 text-primary" /><span><span className="block text-sm font-bold">{title}</span><span className="block text-xs text-muted-foreground">{text}</span></span></label>;
}