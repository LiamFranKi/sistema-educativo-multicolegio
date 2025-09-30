const express = require('express');
const router = express.Router();
const {
  getPages,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  getSectionsByPage,
  createSection,
  updateSection,
  deleteSection,
  getBlocksBySection,
  createBlock,
  updateBlock,
  deleteBlock,
  getHomeBanner,
  updateHomeBanner,
  getHomePrincipal,
  updateHomePrincipal
} = require('../controllers/webAdminController');

// TODO: Agregar middleware de autenticación
// const { verificarToken, verificarAdmin } = require('../middleware/auth');
// router.use(verificarToken);

// ==================== PAGES ====================
router.get('/pages', getPages);
router.get('/pages/:id', getPageById);
router.post('/pages', createPage);
router.put('/pages/:id', updatePage);
router.delete('/pages/:id', deletePage);

// ==================== SECTIONS ====================
router.get('/pages/:pageId/sections', getSectionsByPage);
router.post('/sections', createSection);
router.put('/sections/:id', updateSection);
router.delete('/sections/:id', deleteSection);

// ==================== BLOCKS ====================
router.get('/sections/:sectionId/blocks', getBlocksBySection);
router.post('/blocks', createBlock);
router.put('/blocks/:id', updateBlock);
router.delete('/blocks/:id', deleteBlock);

// ==================== HOME LEGACY ====================
router.get('/home/banner', getHomeBanner);
router.put('/home/banner', updateHomeBanner);
router.get('/home/principal', getHomePrincipal);
router.put('/home/principal', updateHomePrincipal);

module.exports = router;
