const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// NOTA: Endpoints públicos de la web. Por ahora devuelven datos de ejemplo
// para permitir la integración inmediata del HOME. Luego se conectarán a BD.

router.get('/menus', async (req, res, next) => {
  try {
    const menusRes = await query('SELECT id, nombre, url, orden, activo FROM menus ORDER BY orden ASC');
    const data = [];
    for (const m of menusRes.rows) {
      const subs = await query('SELECT nombre, url, orden, activo FROM submenus WHERE menu_id=$1 ORDER BY orden ASC', [m.id]);
      data.push({ nombre: m.nombre, url: m.url, orden: m.orden, activo: m.activo, submenus: subs.rows });
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/home/banner', async (req, res, next) => {
  try {
    const r = await query('SELECT imagen_url, altura_px, activo FROM home_banner WHERE activo = TRUE ORDER BY id DESC LIMIT 1');
    if (r.rowCount === 0) return res.json({ success: true, data: null });
    res.json({ success: true, data: r.rows[0] });
  } catch (err) { next(err); }
});

router.get('/home/principal', async (req, res, next) => {
  try {
    const r = await query('SELECT titulo, descripcion_larga, cita, activo FROM home_principal WHERE activo = TRUE ORDER BY id DESC LIMIT 1');
    if (r.rowCount === 0) return res.json({ success: true, data: null });
    res.json({ success: true, data: r.rows[0] });
  } catch (err) { next(err); }
});

// Endpoint genérico por página (mock inicial con fallback a "home")
router.get('/pages/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pageRes = await query('SELECT id, slug, titulo, estado FROM pages WHERE slug=$1', [slug]);
    if (pageRes.rowCount === 0) return res.json({ success: true, data: { page: null, sections: [] } });

    const page = pageRes.rows[0];
    const sectionsRes = await query('SELECT id, key, titulo, layout, orden FROM sections WHERE page_id=$1 ORDER BY orden ASC, id ASC', [page.id]);
    const sections = [];
    for (const s of sectionsRes.rows) {
      const blocksRes = await query('SELECT tipo, contenido_json, orden FROM blocks WHERE section_id=$1 ORDER BY orden ASC, id ASC', [s.id]);
      sections.push({ key: s.key, titulo: s.titulo, layout: s.layout, orden: s.orden, blocks: blocksRes.rows });
    }
    res.json({ success: true, data: { page, sections } });
  } catch (err) { next(err); }
});

module.exports = router;
