/**
 * JAMF ASSISTANT - Documentation Auto-Update Script
 * 
 * Este script usa Gemini API con Google Search para verificar
 * cambios en la documentación oficial de Jamf y actualizar docs.json
 */

const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DOCS_PATH = path.join(__dirname, '..', 'data', 'docs.json');
const CHANGELOG_PATH = path.join(__dirname, '..', 'CHANGELOG.md');

const JAMF_DOC_SOURCES = [
    'https://learn.jamf.com/bundle/jamf-school-documentation/',
    'https://learn.jamf.com/bundle/jamf-pro-documentation/',
    'https://support.apple.com/guide/apple-school-manager/',
    'https://support.apple.com/guide/classroom/'
];

async function callGeminiWithSearch(prompt) {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                tools: [{ google_search: {} }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function checkForUpdates(currentDocs) {
    const articlesInfo = currentDocs.articles.map(a =>
        `- ${a.title} (${a.category}): ${a.content.substring(0, 100)}...`
    ).join('\n');

    const prompt = `Eres un experto en Jamf School/Pro y Apple Business Manager.

TAREA: Verifica si hay actualizaciones importantes en la documentación oficial de Jamf que deban reflejarse en nuestra base de conocimiento.

FUENTES OFICIALES A VERIFICAR:
${JAMF_DOC_SOURCES.map(s => `- ${s}`).join('\n')}

NUESTRA DOCUMENTACIÓN ACTUAL (última actualización: ${currentDocs.lastUpdated}):
${articlesInfo}

INSTRUCCIONES:
1. Busca en internet cambios recientes en la documentación de Jamf School/Pro
2. Identifica si hay nuevas funcionalidades, cambios en procedimientos o deprecaciones
3. Compara con nuestra documentación actual

RESPONDE EN FORMATO JSON EXACTO (sin markdown):
{
    "hasUpdates": true/false,
    "changes": [
        {
            "articleId": "id-del-articulo-existente o nuevo-id",
            "type": "update" | "new" | "deprecated",
            "title": "Título del artículo",
            "category": "Categoría",
            "summary": "Resumen del cambio",
            "newContent": "Contenido actualizado completo",
            "keywords": ["keyword1", "keyword2"],
            "officialDocUrl": "URL de la doc oficial"
        }
    ],
    "summary": "Resumen general de los cambios encontrados"
}

Si no hay cambios significativos, responde:
{
    "hasUpdates": false,
    "changes": [],
    "summary": "No se encontraron cambios significativos"
}`;

    const response = await callGeminiWithSearch(prompt);

    // Limpiar respuesta de markdown si viene envuelta
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7);
    }
    if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.slice(3);
    }
    if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3);
    }

    return JSON.parse(cleanResponse.trim());
}

function updateDocsJson(currentDocs, updateResult) {
    const updatedDocs = { ...currentDocs };
    const today = new Date().toISOString().split('T')[0];

    updatedDocs.lastUpdated = today;
    updatedDocs.lastAutoCheck = today;

    for (const change of updateResult.changes) {
        if (change.type === 'new') {
            // Añadir nuevo artículo
            updatedDocs.articles.push({
                id: change.articleId,
                title: change.title,
                category: change.category,
                officialDocUrl: change.officialDocUrl,
                content: change.newContent,
                keywords: change.keywords
            });
        } else if (change.type === 'update') {
            // Actualizar artículo existente
            const index = updatedDocs.articles.findIndex(a => a.id === change.articleId);
            if (index !== -1) {
                updatedDocs.articles[index] = {
                    ...updatedDocs.articles[index],
                    content: change.newContent,
                    keywords: change.keywords || updatedDocs.articles[index].keywords
                };
            }
        } else if (change.type === 'deprecated') {
            // Marcar como deprecado (añadir nota al contenido)
            const index = updatedDocs.articles.findIndex(a => a.id === change.articleId);
            if (index !== -1) {
                updatedDocs.articles[index].content =
                    `⚠️ NOTA: Este procedimiento puede estar desactualizado.\n\n${updatedDocs.articles[index].content}`;
            }
        }
    }

    return updatedDocs;
}

function updateChangelog(updateResult) {
    const today = new Date().toISOString().split('T')[0];
    let changelog = '';

    if (fs.existsSync(CHANGELOG_PATH)) {
        changelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
    } else {
        changelog = '# Changelog - Jamf Assistant Documentation\n\nRegistro de actualizaciones automáticas de la documentación.\n\n';
    }

    const newEntry = `## [${today}] - Auto-Update

### Resumen
${updateResult.summary}

### Cambios
${updateResult.changes.map(c => `- **${c.type.toUpperCase()}** - ${c.title}: ${c.summary}`).join('\n')}

---

`;

    // Insertar después del header
    const headerEnd = changelog.indexOf('\n\n', changelog.indexOf('---') > 0 ? 0 : changelog.indexOf('\n\n'));
    if (headerEnd > 0) {
        changelog = changelog.slice(0, headerEnd + 2) + newEntry + changelog.slice(headerEnd + 2);
    } else {
        changelog += newEntry;
    }

    fs.writeFileSync(CHANGELOG_PATH, changelog, 'utf-8');
}

async function main() {
    console.log('🔍 Iniciando verificación de documentación...\n');

    if (!GEMINI_API_KEY) {
        console.error('❌ Error: GEMINI_API_KEY no está configurada');
        process.exit(1);
    }

    // Cargar docs actuales
    const currentDocs = JSON.parse(fs.readFileSync(DOCS_PATH, 'utf-8'));
    console.log(`📚 Documentación actual: ${currentDocs.articles.length} artículos`);
    console.log(`📅 Última actualización: ${currentDocs.lastUpdated}\n`);

    try {
        // Verificar actualizaciones
        console.log('🌐 Consultando fuentes oficiales de Jamf...');
        const updateResult = await checkForUpdates(currentDocs);

        if (updateResult.hasUpdates) {
            console.log(`\n✅ Se encontraron ${updateResult.changes.length} cambios:\n`);
            updateResult.changes.forEach(c => {
                console.log(`  - [${c.type.toUpperCase()}] ${c.title}`);
            });

            // Actualizar docs.json
            const updatedDocs = updateDocsJson(currentDocs, updateResult);
            fs.writeFileSync(DOCS_PATH, JSON.stringify(updatedDocs, null, 4), 'utf-8');
            console.log('\n💾 docs.json actualizado');

            // Actualizar changelog
            updateChangelog(updateResult);
            console.log('📝 CHANGELOG.md actualizado');

        } else {
            console.log('\n✨ No se encontraron cambios significativos');

            // Actualizar solo lastAutoCheck
            currentDocs.lastAutoCheck = new Date().toISOString().split('T')[0];
            fs.writeFileSync(DOCS_PATH, JSON.stringify(currentDocs, null, 4), 'utf-8');
        }

        console.log('\n🎉 Verificación completada');

    } catch (error) {
        console.error('\n❌ Error durante la actualización:', error.message);
        process.exit(1);
    }
}

main();
