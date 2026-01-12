// Variables globales para almacenar resultados
let waterResult = null;
let nutritionResult = null;
let aiRecommendation = null;

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar los event listeners para los formularios
    setupEventListeners();
});

function setupEventListeners() {
    // Calculadora de Agua
    const waterForm = document.getElementById('waterCalculator');
    if (waterForm) {
        waterForm.addEventListener('submit', calculateWaterNeeds);
    }
    
    // Calculadora Nutricional
    const nutritionForm = document.getElementById('nutritionCalculator');
    if (nutritionForm) {
        nutritionForm.addEventListener('submit', calculateNutritionNeeds);
    }
    
    // Botón para generar recomendación con IA
    const aiButton = document.getElementById('generateAIRecommendation');
    if (aiButton) {
        aiButton.addEventListener('click', generateAIRecommendation);
    }
    
    // Botones para descargar PDF
    const downloadPlanBtn = document.getElementById('downloadPlan');
    if (downloadPlanBtn) {
        downloadPlanBtn.addEventListener('click', () => downloadPDF('nutrition'));
    }
    
    const downloadAIPlanBtn = document.getElementById('downloadAIPlan');
    if (downloadAIPlanBtn) {
        downloadAIPlanBtn.addEventListener('click', () => downloadPDF('ai'));
    }
}

// ========== CALCULADORA DE AGUA ==========
function calculateWaterNeeds(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const weight = parseFloat(document.getElementById('weight').value);
    const activityFactor = parseFloat(document.getElementById('activityLevel').value);
    const climateFactor = parseFloat(document.getElementById('climate').value);
    
    if (!weight || weight < 30 || weight > 200) {
        alert('Por favor, ingresa un peso válido (30-200 kg)');
        return;
    }
    
    // Fórmula básica: 35ml por kg de peso
    let waterBase = weight * 35; // ml por día
    
    // Ajustar por actividad física
    waterBase *= activityFactor;
    
    // Ajustar por clima
    waterBase *= climateFactor;
    
    // Convertir a litros
    const waterLiters = waterBase / 1000;
    
    // Redondear a 2 decimales
    const roundedWater = Math.round(waterLiters * 100) / 100;
    
    // Guardar resultado globalmente
    waterResult = {
        liters: roundedWater,
        glasses: Math.round(roundedWater / 0.25), // 1 vaso = 250ml
        weight: weight,
        activity: document.getElementById('activityLevel').selectedOptions[0].text,
        climate: document.getElementById('climate').selectedOptions[0].text
    };
    
    // Mostrar resultado
    const resultDiv = document.getElementById('waterResult');
    const waterAmount = document.getElementById('waterAmount');
    const waterExplanation = document.getElementById('waterExplanation');
    
    waterAmount.textContent = `${roundedWater} litros por día`;
    waterExplanation.textContent = `Aproximadamente ${Math.round(roundedWater / 0.25)} vasos de 250ml. Basado en tu peso (${weight}kg), actividad (${waterResult.activity}) y clima (${waterResult.climate}).`;
    
    resultDiv.style.display = 'block';
}

// ========== CALCULADORA NUTRICIONAL ==========
function calculateNutritionNeeds(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = parseInt(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('nutritionWeight').value);
    const goal = document.getElementById('goal').value;
    const activityFactor = parseFloat(document.getElementById('nutritionActivity').value);
    
    // Validaciones
    if (!age || age < 15 || age > 80) {
        alert('Por favor, ingresa una edad válida (15-80 años)');
        return;
    }
    
    if (!height || height < 100 || height > 250) {
        alert('Por favor, ingresa una estatura válida (100-250 cm)');
        return;
    }
    
    if (!weight || weight < 30 || weight > 200) {
        alert('Por favor, ingresa un peso válido (30-200 kg)');
        return;
    }
    
    // 1. Calcular TMB (Tasa Metabólica Basal) usando la fórmula de Mifflin-St Jeor
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // 2. Calcular TDEE (Gasto Energético Total Diario)
    const tdee = bmr * activityFactor;
    
    // 3. Ajustar por objetivo
    let dailyCalories;
    let goalText;
    
    switch(goal) {
        case 'loss':
            dailyCalories = tdee * 0.85; // Déficit del 15%
            goalText = 'Pérdida de peso';
            break;
        case 'gain':
            dailyCalories = tdee * 1.15; // Superávit del 15%
            goalText = 'Aumento de masa muscular';
            break;
        default:
            dailyCalories = tdee;
            goalText = 'Mantenimiento';
    }
    
    // 4. Calcular macronutrientes (proteínas, carbohidratos, grasas)
    let proteinGrams, fatGrams, carbGrams;
    
    // Proteínas: 1.6-2.2g/kg para objetivos de musculación
    if (goal === 'gain') {
        proteinGrams = weight * 2.2;
    } else if (goal === 'loss') {
        proteinGrams = weight * 2.0;
    } else {
        proteinGrams = weight * 1.6;
    }
    
    // Grasas: 0.8-1.2g/kg
    fatGrams = weight * 1.0;
    
    // Calorías restantes para carbohidratos
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const remainingCalories = dailyCalories - proteinCalories - fatCalories;
    
    if (remainingCalories < 0) {
        // Ajustar si hay error de cálculo
        carbGrams = 150; // mínimo
    } else {
        carbGrams = remainingCalories / 4;
    }
    
    // Redondear valores
    dailyCalories = Math.round(dailyCalories);
    proteinGrams = Math.round(proteinGrams);
    fatGrams = Math.round(fatGrams);
    carbGrams = Math.round(carbGrams);
    
    // Guardar resultado globalmente
    nutritionResult = {
        calories: dailyCalories,
        protein: proteinGrams,
        fat: fatGrams,
        carbs: carbGrams,
        tdee: Math.round(tdee),
        bmr: Math.round(bmr),
        goal: goalText,
        activity: document.getElementById('nutritionActivity').selectedOptions[0].text,
        gender: gender === 'male' ? 'Hombre' : 'Mujer',
        age: age,
        height: height,
        weight: weight
    };
    
    // Mostrar resultado
    const resultDiv = document.getElementById('nutritionResult');
    const nutritionDetails = document.getElementById('nutritionDetails');
    const downloadPlanBtn = document.getElementById('downloadPlan');
    
    nutritionDetails.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
            <div style="background: #e3f2fd; padding: 0.75rem; border-radius: 8px;">
                <strong style="color: #1976d2;">Calorías</strong>
                <div style="font-size: 1.25rem; font-weight: bold;">${dailyCalories} kcal</div>
            </div>
            <div style="background: #f3e5f5; padding: 0.75rem; border-radius: 8px;">
                <strong style="color: #7b1fa2;">Proteínas</strong>
                <div style="font-size: 1.25rem; font-weight: bold;">${proteinGrams}g</div>
            </div>
            <div style="background: #e8f5e9; padding: 0.75rem; border-radius: 8px;">
                <strong style="color: #388e3c;">Carbohidratos</strong>
                <div style="font-size: 1.25rem; font-weight: bold;">${carbGrams}g</div>
            </div>
            <div style="background: #fff3e0; padding: 0.75rem; border-radius: 8px;">
                <strong style="color: #f57c00;">Grasas</strong>
                <div style="font-size: 1.25rem; font-weight: bold;">${fatGrams}g</div>
            </div>
        </div>
        <p><strong>Objetivo:</strong> ${goalText}</p>
        <p><strong>TMB (Metabolismo basal):</strong> ${Math.round(bmr)} kcal</p>
        <p><strong>Gasto diario total:</strong> ${Math.round(tdee)} kcal</p>
    `;
    
    downloadPlanBtn.style.display = 'block';
    resultDiv.style.display = 'block';
}

// ========== INTEGRACIÓN CON GEMINI API ==========
async function generateAIRecommendation() {
    const goals = document.getElementById('userGoals').value.trim();
    const restrictions = document.getElementById('dietaryRestrictions').value.trim();
    
    if (!goals) {
        alert('Por favor, describe tus objetivos para generar recomendaciones personalizadas.');
        return;
    }
    
    const aiButton = document.getElementById('generateAIRecommendation');
    const originalText = aiButton.textContent;
    
    try {
        // Mostrar indicador de carga
        aiButton.textContent = 'Generando...';
        aiButton.disabled = true;
        
        const API_KEY = 'AIzaSyBwwlBbe_t2BthpQAUGmkQ9oB1xpg3jsjw';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        // Crear el prompt
        const prompt = `Como nutricionista experto, genera un plan nutricional personalizado basado en:
        
        Objetivos del usuario: ${goals}
        Restricciones dietéticas: ${restrictions || 'Ninguna'}
        
        Incluye:
        1. Resumen de necesidades calóricas y de macronutrientes
        2. Distribución de comidas (desayuno, almuerzo, cena, snacks)
        3. Ejemplos de alimentos recomendados
        4. Consejos prácticos para implementar el plan
        5. Hidratación recomendada
        
        Formato la respuesta en HTML básico para mostrar en una web, usando etiquetas como <h3>, <p>, <ul>, <li>.
        Sé específico y práctico.`;
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extraer el texto de la respuesta
        const aiText = data.candidates[0].content.parts[0].text;
        
        // Guardar recomendación
        aiRecommendation = {
            text: aiText,
            goals: goals,
            restrictions: restrictions,
            timestamp: new Date().toLocaleDateString()
        };
        
        // Mostrar resultado
        const resultDiv = document.getElementById('aiResult');
        const recommendationDiv = document.getElementById('aiRecommendation');
        
        recommendationDiv.innerHTML = aiText;
        resultDiv.style.display = 'block';
        
        // Desplazar hacia la sección de resultados
        resultDiv.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error con Gemini API:', error);
        
        // En caso de error, mostrar recomendación de ejemplo (para desarrollo)
        showFallbackRecommendation(goals, restrictions);
        
        alert('Error al conectar con la IA. Mostrando recomendación de ejemplo.');
    } finally {
        // Restaurar botón
        aiButton.textContent = originalText;
        aiButton.disabled = false;
    }
}

// Función de respaldo si la API falla
function showFallbackRecommendation(goals, restrictions) {
    aiRecommendation = {
        text: `
            <h3>Plan Nutricional Personalizado</h3>
            <p><strong>Objetivos:</strong> ${goals}</p>
            <p><strong>Restricciones:</strong> ${restrictions || 'Ninguna'}</p>
            
            <h4>Recomendaciones Generales:</h4>
            <ul>
                <li>Consume 3 comidas principales y 2 snacks saludables al día</li>
                <li>Mantén hidratación con 2-3 litros de agua diarios</li>
                <li>Prioriza proteínas magras en cada comida</li>
                <li>Incluye verduras en al menos 2 comidas al día</li>
                <li>Controla las porciones según tus objetivos</li>
            </ul>
            
            <h4>Ejemplo de Distribución Diaria:</h4>
            <p><strong>Desayuno:</strong> Proteína + carbohidrato complejo + fruta</p>
            <p><strong>Almuerzo:</strong> Proteína + vegetales + carbohidrato moderado</p>
            <p><strong>Cena:</strong> Proteína ligera + vegetales abundantes</p>
        `,
        goals: goals,
        restrictions: restrictions,
        timestamp: new Date().toLocaleDateString()
    };
    
    const resultDiv = document.getElementById('aiResult');
    const recommendationDiv = document.getElementById('aiRecommendation');
    
    recommendationDiv.innerHTML = aiRecommendation.text;
    resultDiv.style.display = 'block';
}

// ========== GENERACIÓN DE PDF ==========
function downloadPDF(type) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let content = '';
    let filename = '';
    
    if (type === 'nutrition' && nutritionResult) {
        filename = `Plan_Nutricional_${Date.now()}.pdf`;
        
        // Configuración del PDF
        doc.setFontSize(20);
        doc.text('Plan Nutricional Personalizado', 20, 20);
        doc.setFontSize(12);
        doc.text('EVOLUM - Calculadora Nutricional', 20, 30);
        
        // Datos personales
        doc.setFontSize(14);
        doc.text('Datos Personales:', 20, 45);
        doc.setFontSize(12);
        doc.text(`Género: ${nutritionResult.gender}`, 20, 55);
        doc.text(`Edad: ${nutritionResult.age} años`, 20, 62);
        doc.text(`Estatura: ${nutritionResult.height} cm`, 20, 69);
        doc.text(`Peso: ${nutritionResult.weight} kg`, 20, 76);
        doc.text(`Objetivo: ${nutritionResult.goal}`, 20, 83);
        doc.text(`Nivel de actividad: ${nutritionResult.activity}`, 20, 90);
        
        // Tabla de nutrientes
        doc.setFontSize(14);
        doc.text('Recomendaciones Diarias:', 20, 105);
        
        const startY = 115;
        const col1 = 20;
        const col2 = 120;
        
        // Encabezado de tabla
        doc.setFillColor(200, 200, 200);
        doc.rect(col1, startY, 90, 10, 'F');
        doc.text('Nutriente', col1 + 5, startY + 7);
        doc.text('Cantidad', col2 + 5, startY + 7);
        
        // Filas de la tabla
        const nutrients = [
            ['Calorías totales', `${nutritionResult.calories} kcal`],
            ['Proteínas', `${nutritionResult.protein} gramos`],
            ['Carbohidratos', `${nutritionResult.carbs} gramos`],
            ['Grasas', `${nutritionResult.fat} gramos`]
        ];
        
        nutrients.forEach((nutrient, index) => {
            const y = startY + 10 + (index * 10);
            if (index % 2 === 0) {
                doc.setFillColor(240, 240, 240);
                doc.rect(col1, y, 90, 10, 'F');
            }
            doc.text(nutrient[0], col1 + 5, y + 7);
            doc.text(nutrient[1], col2 + 5, y + 7);
        });
        
    } else if (type === 'ai' && aiRecommendation) {
        filename = `Plan_IA_${Date.now()}.pdf`;
        
        // Para contenido HTML simple
        doc.setFontSize(16);
        doc.text('Plan Nutricional con IA', 20, 20);
        doc.setFontSize(12);
        
        // Convertir HTML simple a texto para PDF
        const plainText = aiRecommendation.text
            .replace(/<[^>]*>/g, '') // Eliminar etiquetas HTML
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        
        const splitText = doc.splitTextToSize(plainText, 170);
        doc.text(splitText, 20, 35);
        
    } else {
        alert('Primero genera un plan para poder descargarlo.');
        return;
    }
    
    // Guardar PDF
    doc.save(filename);
}

// ========== FUNCIONES ADICIONALES ==========
function convertToPounds(kg) {
    return Math.round(kg * 2.20462);
}

function convertToFeet(cm) {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
}