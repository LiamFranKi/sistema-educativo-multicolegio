const { query } = require('../config/database');

// ==================== PAGES ====================
exports.getPages = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, slug, titulo, estado, creado_en as created_at, actualizado_en as updated_at FROM pages ORDER BY creado_en DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getPageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pageRes = await query('SELECT * FROM pages WHERE id = $1', [id]);

    if (pageRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Página no encontrada' });
    }

    const sectionsRes = await query(
      'SELECT id, key, titulo, layout, orden FROM sections WHERE page_id = $1 ORDER BY orden ASC',
      [id]
    );

    const sections = [];
    for (const section of sectionsRes.rows) {
      const blocksRes = await query(
        'SELECT id, tipo, contenido_json, orden FROM blocks WHERE section_id = $1 ORDER BY orden ASC',
        [section.id]
      );
      sections.push({ ...section, blocks: blocksRes.rows });
    }

    res.json({ success: true, data: { ...pageRes.rows[0], sections } });
  } catch (error) {
    next(error);
  }
};

exports.createPage = async (req, res, next) => {
  try {
    const { slug, titulo, estado } = req.body;

    if (!slug || !titulo) {
      return res.status(400).json({ success: false, message: 'Slug y título son requeridos' });
    }

    const result = await query(
      'INSERT INTO pages (slug, titulo, estado) VALUES ($1, $2, $3) RETURNING *',
      [slug, titulo, estado || 'borrador']
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ success: false, message: 'El slug ya existe' });
    }
    next(error);
  }
};

exports.updatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { slug, titulo, estado } = req.body;

    const result = await query(
      'UPDATE pages SET slug = $1, titulo = $2, estado = $3, actualizado_en = NOW() WHERE id = $4 RETURNING *',
      [slug, titulo, estado, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Página no encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.deletePage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Eliminar bloques de todas las secciones
    await query(
      'DELETE FROM blocks WHERE section_id IN (SELECT id FROM sections WHERE page_id = $1)',
      [id]
    );

    // Eliminar secciones
    await query('DELETE FROM sections WHERE page_id = $1', [id]);

    // Eliminar página
    const result = await query('DELETE FROM pages WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Página no encontrada' });
    }

    res.json({ success: true, message: 'Página eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

// ==================== SECTIONS ====================
exports.getSectionsByPage = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const result = await query(
      'SELECT id, key, titulo, layout, orden FROM sections WHERE page_id = $1 ORDER BY orden ASC',
      [pageId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.createSection = async (req, res, next) => {
  try {
    const { page_id, key, titulo, layout, orden } = req.body;

    if (!page_id || !key || !titulo) {
      return res.status(400).json({ success: false, message: 'page_id, key y titulo son requeridos' });
    }

    const result = await query(
      'INSERT INTO sections (page_id, key, titulo, layout, orden) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [page_id, key, titulo, layout || 'text', orden || 1]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { key, titulo, layout, orden } = req.body;

    const result = await query(
      'UPDATE sections SET key = $1, titulo = $2, layout = $3, orden = $4 WHERE id = $5 RETURNING *',
      [key, titulo, layout, orden, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Sección no encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.deleteSection = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Eliminar bloques de la sección
    await query('DELETE FROM blocks WHERE section_id = $1', [id]);

    // Eliminar sección
    const result = await query('DELETE FROM sections WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Sección no encontrada' });
    }

    res.json({ success: true, message: 'Sección eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

// ==================== BLOCKS ====================
exports.getBlocksBySection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const result = await query(
      'SELECT id, tipo, contenido_json, orden FROM blocks WHERE section_id = $1 ORDER BY orden ASC',
      [sectionId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.createBlock = async (req, res, next) => {
  try {
    const { section_id, tipo, contenido_json, orden } = req.body;

    if (!section_id || !tipo || !contenido_json) {
      return res.status(400).json({ success: false, message: 'section_id, tipo y contenido_json son requeridos' });
    }

    const result = await query(
      'INSERT INTO blocks (section_id, tipo, contenido_json, orden) VALUES ($1, $2, $3, $4) RETURNING *',
      [section_id, tipo, JSON.stringify(contenido_json), orden || 1]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo, contenido_json, orden } = req.body;

    const result = await query(
      'UPDATE blocks SET tipo = $1, contenido_json = $2, orden = $3 WHERE id = $4 RETURNING *',
      [tipo, JSON.stringify(contenido_json), orden, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Bloque no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM blocks WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Bloque no encontrado' });
    }

    res.json({ success: true, message: 'Bloque eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

// ==================== HOME LEGACY (backward compatibility) ====================
exports.getHomeBanner = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM home_banner WHERE activo = TRUE ORDER BY id DESC LIMIT 1'
    );
    res.json({ success: true, data: result.rows[0] || null });
  } catch (error) {
    next(error);
  }
};

exports.updateHomeBanner = async (req, res, next) => {
  try {
    const { imagen_url, altura_px, activo } = req.body;

    // Desactivar todos los banners anteriores
    await query('UPDATE home_banner SET activo = FALSE');

    // Crear nuevo banner activo
    const result = await query(
      'INSERT INTO home_banner (imagen_url, altura_px, activo) VALUES ($1, $2, $3) RETURNING *',
      [imagen_url, altura_px || 320, activo !== false]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getHomePrincipal = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM home_principal WHERE activo = TRUE ORDER BY id DESC LIMIT 1'
    );
    res.json({ success: true, data: result.rows[0] || null });
  } catch (error) {
    next(error);
  }
};

exports.updateHomePrincipal = async (req, res, next) => {
  try {
    const { titulo, descripcion_larga, cita, activo } = req.body;

    // Desactivar todos los anteriores
    await query('UPDATE home_principal SET activo = FALSE');

    // Crear nuevo activo
    const result = await query(
      'INSERT INTO home_principal (titulo, descripcion_larga, cita, activo) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, descripcion_larga, cita, activo !== false]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
