-- PostgreSQL
-- Seed para la sección "Saber Más" del HOME
-- Se agrega como una nueva section en la página 'home'

-- Insertar section "Saber Más" (nosotros)
INSERT INTO sections (page_id, key, titulo, layout, orden)
SELECT id, 'saber-mas', '¿Por qué estudiar en Vanguard Schools?', 'expandible', 3
FROM pages WHERE slug = 'home'
ON CONFLICT DO NOTHING;

-- Obtener section_id para insertar blocks
DO $$
DECLARE
    v_section_id INT;
BEGIN
    SELECT id INTO v_section_id FROM sections WHERE key = 'saber-mas' AND page_id = (SELECT id FROM pages WHERE slug = 'home');

    -- Block 1: Nuestra Identidad
    INSERT INTO blocks (section_id, tipo, contenido_json, orden) VALUES
    (v_section_id, 'subsection', '{
        "titulo": "Nuestra Identidad",
        "items": [
            {
                "icono": "🎯",
                "titulo": "Misión",
                "descripcion": "Formar estudiantes íntegros con excelencia académica y valores sólidos."
            },
            {
                "icono": "👁️",
                "titulo": "Visión",
                "descripcion": "Ser líderes en educación innovadora y de calidad en el Perú."
            },
            {
                "icono": "⭐",
                "titulo": "Valores",
                "descripcion": "Respeto, responsabilidad, solidaridad y excelencia en todo lo que hacemos."
            }
        ]
    }', 1);

    -- Block 2: Nuestras Instalaciones
    INSERT INTO blocks (section_id, tipo, contenido_json, orden) VALUES
    (v_section_id, 'subsection', '{
        "titulo": "Nuestras Instalaciones",
        "items": [
            {
                "icono": "🔬",
                "titulo": "Laboratorios",
                "descripcion": "Equipados con tecnología de última generación para ciencias y computación."
            },
            {
                "icono": "📚",
                "titulo": "Biblioteca",
                "descripcion": "Moderna biblioteca digital con acceso a miles de recursos educativos."
            },
            {
                "icono": "⚽",
                "titulo": "Áreas Deportivas",
                "descripcion": "Canchas polideportivas, piscinas temperadas para formación integral."
            },
            {
                "icono": "🏊",
                "titulo": "Natación (piscinas temperadas)",
                "descripcion": "Piscinas climatizadas para clases de natación durante todo el año."
            },
            {
                "icono": "🏟️",
                "titulo": "02 Canchas Sintéticas Polideportivas",
                "descripcion": "Canchas de última generación para fútbol, básquet, vóley y más."
            }
        ]
    }', 2);

    -- Block 3: Programas Especiales
    INSERT INTO blocks (section_id, tipo, contenido_json, orden) VALUES
    (v_section_id, 'subsection', '{
        "titulo": "Programas Especiales",
        "items": [
            {
                "icono": "⚽",
                "titulo": "Deportes",
                "descripcion": "Fútbol, vóley, balonmano y atletismo con instructores especializados."
            },
            {
                "icono": "💻",
                "titulo": "Tecnología Educativa",
                "descripcion": "Programación, diseño digital y herramientas tecnológicas avanzadas."
            },
            {
                "icono": "🎨",
                "titulo": "Arte y Cultura",
                "descripcion": "Talleres de artes plásticas, danza y expresión artística."
            },
            {
                "icono": "🌎",
                "titulo": "Programa Bilingüe",
                "descripcion": "Inglés intensivo con metodología internacional de alto nivel."
            },
            {
                "icono": "📖",
                "titulo": "Libros Digitales Interactivos",
                "descripcion": "Material educativo digital gratuito de última generación."
            },
            {
                "icono": "🗣️",
                "titulo": "Club con Trainers Extranjeros (inglés)",
                "descripcion": "Conversación con profesores nativos para dominio del idioma."
            }
        ]
    }', 3);

    -- Block 4: Niveles Educativos
    INSERT INTO blocks (section_id, tipo, contenido_json, orden) VALUES
    (v_section_id, 'subsection', '{
        "titulo": "Niveles Educativos",
        "items": [
            {
                "icono": "👶",
                "titulo": "Educación Inicial",
                "descripcion": "Metodología STEAM. De 3 a 5 años con enfoque en desarrollo integral."
            },
            {
                "icono": "📖",
                "titulo": "Educación Primaria",
                "descripcion": "1° a 6° grado con énfasis en competencias y habilidades."
            },
            {
                "icono": "🎓",
                "titulo": "Educación Secundaria",
                "descripcion": "1° a 5° año preparando para la universidad y la vida."
            }
        ]
    }', 4);

END $$;
