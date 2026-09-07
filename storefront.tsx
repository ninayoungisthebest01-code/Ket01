'use client'

import { useEffect, useMemo, useState } from 'react'
import { Heart, Menu, Search, ShoppingBag, Sparkles, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/stripe'
import { PRODUCTS as products } from '@/lib/products'

const logo = '/victorias-logo-transparent.png'
const currency = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
const formatPrice = (value: number) => currency.format(value)

export function Storefront() {
  const [category, setCategory] = useState('Todo')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('victorias-favorites')
      if (saved) setFavorites(JSON.parse(saved))
    } catch {}
  }, [])
  useEffect(() => {
    window.localStorage.setItem('victorias-favorites', JSON.stringify(favorites))
  }, [favorites])
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const categories = ['Todo', 'Skincare', 'Maquillaje', 'Cabello', 'Fragancias']
  const filtered = useMemo(() => products.filter(p => (category === 'Todo' || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === 'price-low' ? a.price-b.price : sort === 'price-high' ? b.price-a.price : a.id-b.id), [category, query, sort])
  const cartItems = products.filter(p => cart[p.id])
  const total = cartItems.reduce((sum, p) => sum + p.price * cart[p.id], 0)
  const count = Object.values(cart).reduce((a,b) => a+b, 0)
  const favoriteItems = products.filter(p => favorites.includes(p.id))
  const toggleFavorite = (id: number) => setFavorites(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id])
  const add = (id: number) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = (id: number) => setCart(c => { const next = { ...c }; if (next[id] > 1) next[id]--; else delete next[id]; return next })
  const checkout = async () => {
    setIsCheckingOut(true)
    try {
      const url = await createCheckoutSession(Object.entries(cart).map(([id, quantity]) => ({ id: Number(id), quantity })))
      if (url) window.location.assign(url)
    } catch {
      setIsCheckingOut(false)
      window.alert('No pudimos iniciar el pago. Inténtalo nuevamente.')
    }
  }

  return <div className="site-shell">
    {welcomeOpen && <section className="welcome-screen" aria-label="Bienvenida a Victorias">
      <div className="welcome-video-crop"><video className="welcome-video" autoPlay muted loop playsInline aria-hidden="true"><source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Anuncio%20de%20maquillaje%20de%20lujo-mYwa6v2zq5PvtmUsOL7UplUNwiVvki.mp4" type="video/mp4" /></video></div>
      <div className="welcome-overlay" />
      <div className="welcome-content">
        <img src={logo} alt="Victorias" className="welcome-logo" />
        <p className="welcome-kicker">Un ritual creado para ti</p>
        <h1>WELCOME</h1>
        <p className="welcome-copy">Un ritual de belleza creado para celebrar tu esencia.</p>
        <button className="welcome-enter" onClick={() => setWelcomeOpen(false)}>Empecemos <ArrowRight size={17} /></button>
      </div>
      <span className="welcome-footer">Belleza para reinas reales · Lima, Perú</span>
    </section>}
    <div className="announcement"><Sparkles size={14} /> Envío gratis en pedidos superiores a S/ 60 <span>·</span> Compra segura y protegida</div>
    <header className="header"><button className="icon-btn mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={21}/></button><a className="brand" href="#inicio"><img src={logo} alt="Victorias" /></a><nav className={menuOpen ? 'nav nav-open' : 'nav'}>{categories.map(c => <button key={c} className={category === c ? 'nav-link active' : 'nav-link'} onClick={() => { setCategory(c); setMenuOpen(false); document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'}) }}>{c}</button>)}<a className="nav-link" href="#historia">Nuestra historia</a><a className="nav-link admin-access" href="/admin/login">Acceso equipo</a></nav><div className="header-actions"><label className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar productos..." /></label><button className="icon-btn favorite-header-btn" onClick={() => setFavoritesOpen(true)} aria-label="Abrir favoritos"><Heart size={20}/><span>{favorites.length}</span></button><button className="bag-btn" onClick={() => setCartOpen(true)} aria-label="Abrir carrito"><ShoppingBag size={20}/><span>{count}</span></button></div></header>
    <main>
      <section id="inicio" className="hero"><div className="hero-copy"><p className="eyebrow">Bienvenida a Victorias</p><h1>Tu ritual.<br/><em>Tu corona.</em></h1><p className="hero-text">Bienvenida a un universo de belleza pensado para ti: detalles exquisitos, fórmulas sensoriales y un lujo que comienza en cada elección.</p><button className="primary-btn" onClick={() => document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'})}>Explorar colección <ArrowRight size={17}/></button><div className="hero-note"><span>★★★★★</span> Más de 2,000 mujeres felices</div></div><div className="hero-art"><div className="halo"></div><img src={logo} alt="Logo de Victorias con corona" /></div><div className="hero-sticker">NUEVA<br/><strong>COLECCIÓN</strong></div></section>
      <section className="promise"><div><strong>Envío express</strong><span>Recibe en 24–72 horas</span></div><div><strong>Fórmulas conscientes</strong><span>Sin crueldad animal</span></div><div><strong>Compra con confianza</strong><span>Garantía Victorias</span></div></section>
      <section id="catalogo" className="catalog"><div className="section-head"><div><p className="eyebrow">Seleccionado para ti</p><h2>Favoritos de la casa</h2></div><div className="catalog-tools"><span>{filtered.length} productos</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar productos"><option value="featured">Destacados</option><option value="price-low">Precio: menor a mayor</option><option value="price-high">Precio: mayor a menor</option></select></div></div><div className="filter-row">{categories.map(c => <button key={c} className={category === c ? 'filter active' : 'filter'} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="product-grid">{filtered.map(p => <article className="product-card" key={p.id}><div className="product-image">{p.tag && <span className="tag">{p.tag}</span>}<button className={favorites.includes(p.id) ? 'heart-card is-favorite' : 'heart-card'} onClick={() => toggleFavorite(p.id)} aria-label={`${favorites.includes(p.id) ? 'Quitar' : 'Añadir'} ${p.name} ${favorites.includes(p.id) ? 'de' : 'a'} favoritos`}><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><img src={p.image} alt={p.name}/><button className="quick-add" onClick={() => { add(p.id); setCartOpen(true) }}>Añadir al carrito</button></div><div className="product-info"><p>{p.category}</p><h3>{p.name}</h3><div className="price">{formatPrice(p.price)} {p.oldPrice && <del>{formatPrice(p.oldPrice)}</del>}</div></div></article>)}</div></section>
      <section id="historia" className="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=85" alt="Productos de belleza Victorias"/></div><div className="story-copy"><p className="eyebrow">El universo Victorias</p><h2>La belleza no se impone.<br/><em>Se revela.</em></h2><p>Creemos en rituales que celebran tu individualidad. Productos sensoriales, fórmulas honestas y ese pequeño lujo diario que te recuerda lo poderosa que eres.</p><a href="#catalogo" className="text-link">Conoce nuestra esencia <ArrowRight size={16}/></a></div></section>
    </main>
    <footer><div className="footer-brand"><img src={logo} alt="Victorias"/><p>Belleza para reinas reales.</p></div><div><h4>Descubre</h4><a href="#catalogo">Colección</a><a href="#historia">Nuestra historia</a></div><div><h4>Ayuda</h4><a href="#">Envíos y devoluciones</a><a href="#">Contáctanos</a><a href="/admin/login" className="admin-footer-link">Acceso administrador</a></div><div className="newsletter"><h4>Únete al círculo</h4><p>Recibe novedades y beneficios exclusivos.</p><div><input placeholder="Tu correo electrónico" type="email"/><button aria-label="Suscribirse"><ArrowRight size={17}/></button></div></div></footer>
    {favoritesOpen && <div className="cart-overlay" onClick={() => setFavoritesOpen(false)}><aside className="cart favorites-panel" onClick={e => e.stopPropagation()}><div className="cart-head"><div><p className="eyebrow">Guardados para ti</p><h2>Mis favoritos <span>({favorites.length})</span></h2></div><button className="icon-btn" onClick={() => setFavoritesOpen(false)} aria-label="Cerrar favoritos"><X/></button></div>{favoriteItems.length ? <div className="cart-list">{favoriteItems.map(p => <div className="cart-item favorite-item" key={p.id}><img src={p.image} alt={p.name}/><div><h3>{p.name}</h3><p>{formatPrice(p.price)}</p><div className="favorite-actions"><button className="secondary-btn" onClick={() => { add(p.id); setCartOpen(true); setFavoritesOpen(false) }}>Añadir al carrito</button><button className="remove-favorite" onClick={() => toggleFavorite(p.id)} aria-label={`Quitar ${p.name} de favoritos`}><Trash2 size={15}/></button></div></div></div>)}</div> : <div className="empty-cart"><Heart size={38}/><h3>Aún no tienes favoritos</h3><p>Guarda aquí los productos que quieras volver a encontrar.</p><button className="primary-btn" onClick={() => setFavoritesOpen(false)}>Explorar productos</button></div>}</aside></div>}
    {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)}><aside className="cart" onClick={e => e.stopPropagation()}><div className="cart-head"><div><p className="eyebrow">Tu selección</p><h2>Mi carrito <span>({count})</span></h2></div><button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><X/></button></div>{cartItems.length ? <><div className="cart-list">{cartItems.map(p => <div className="cart-item" key={p.id}><img src={p.image} alt=""/><div><h3>{p.name}</h3><p>${p.price.toFixed(2)}</p><div className="quantity"><button onClick={() => remove(p.id)} aria-label="Reducir cantidad">{cart[p.id] === 1 ? <Trash2 size={14}/> : <Minus size={14}/>}</button><span>{cart[p.id]}</span><button onClick={() => add(p.id)} aria-label="Aumentar cantidad"><Plus size={14}/></button></div></div></div>)}</div><div className="cart-total"><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><small>Envío calculado al finalizar</small><button className="primary-btn" onClick={checkout} disabled={isCheckingOut}>{isCheckingOut ? 'Conectando con Stripe…' : 'Finalizar compra'} {!isCheckingOut && <ArrowRight size={17}/>}</button></div></> : <div className="empty-cart"><ShoppingBag size={38}/><h3>Tu carrito está esperando</h3><p>Añade tus favoritos para comenzar.</p><button className="primary-btn" onClick={() => setCartOpen(false)}>Explorar productos</button></div>}</aside></div>}
  </div>
}
