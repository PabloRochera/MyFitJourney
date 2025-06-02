const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Exercise = require("../models/Exercise")
const TrainingPlan = require("../models/TrainingPlan")
const Diet = require("../models/Diet")
const Progress = require("../models/Progress")
const Routine = require("../models/Routine")

const seedDatabase = async () => {
  try {
    console.log("🔗 Attempting to connect to MongoDB...")
    console.log("URI:", process.env.MONGODB_URI ? "✅ Found" : "❌ Missing")

    // Connect to database with better options
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myfitjourney", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
      socketTimeoutMS: 45000,
      retryWrites: true,
    })

    console.log("✅ Connected to MongoDB successfully!")

    // Test the connection
    await mongoose.connection.db.admin().ping()
    console.log("🏓 Database ping successful!")

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await User.deleteMany({})
    await Exercise.deleteMany({})
    await TrainingPlan.deleteMany({})
    await Diet.deleteMany({})
    await Progress.deleteMany({})
    await Routine.deleteMany({})
    console.log("✅ Cleared existing data")

    // Create diverse users
    console.log("👥 Creating users...")
    const users = await User.insertMany([
      {
        name: "Ana García",
        email: "ana.garcia@email.com",
        password: await bcrypt.hash("password123", 10),
        height: 165,
        weight: 62,
        age: 29,
        gender: "female",
        avatar: "/avatars/ana.jpg",
        goal: "lose-weight",
        activityLevel: "light",
        experience: "beginner",
        role: "user"
      },
      {
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@email.com",
        password: await bcrypt.hash("password123", 10),
        height: 178,
        weight: 75,
        age: 34,
        gender: "male",
        avatar: "/avatars/carlos.jpg",
        goal: "gain-muscle",
        activityLevel: "active",
        experience: "intermediate",
        role: "user"
      },
      {
        name: "María López",
        email: "maria.lopez@email.com",
        password: await bcrypt.hash("password123", 10),
        height: 170,
        weight: 68,
        age: 41,
        gender: "female",
        avatar: "/avatars/maria.jpg",
        goal: "improve-fitness",
        activityLevel: "very-active",
        experience: "advanced",
        role: "user"
      },
      {
        name: "David Trainer",
        email: "david.trainer@email.com",
        password: await bcrypt.hash("trainerpass", 10),
        height: 182,
        weight: 82,
        age: 38,
        gender: "male",
        avatar: "/avatars/david.jpg",
        goal: "gain-muscle",
        activityLevel: "very-active",
        experience: "advanced",
        role: "trainer"
      },
      {
        name: "Lucía Nutri",
        email: "lucia.nutri@email.com",
        password: await bcrypt.hash("nutripass", 10),
        height: 160,
        weight: 54,
        age: 32,
        gender: "female",
        avatar: "/avatars/lucia.jpg",
        goal: "maintain",
        activityLevel: "moderate",
        experience: "intermediate",
        role: "nutritionist"
      },
      {
        name: "Sistema",
        email: "sistema@myfitjourney.com",
        password: await bcrypt.hash("password123", 10),
        height: 175,
        weight: 70,
        age: 30,
        gender: "other",
        avatar: "/avatars/sistema.png",
        goal: "improve-fitness",
        activityLevel: "moderate",
        experience: "intermediate",
        role: "admin"
      },
      // Usuarios extra para simular comunidad
      {
        name: "Elena Torres",
        email: "elena.torres@email.com",
        password: await bcrypt.hash("password123", 10),
        height: 168,
        weight: 60,
        age: 27,
        gender: "female",
        avatar: "/avatars/elena.jpg",
        goal: "lose-weight",
        activityLevel: "light",
        experience: "beginner",
        role: "user"
      },
      {
        name: "Miguel Ángel",
        email: "miguel.angel@email.com",
        password: await bcrypt.hash("password123", 10),
        height: 180,
        weight: 85,
        age: 36,
        gender: "male",
        avatar: "/avatars/miguel.jpg",
        goal: "gain-muscle",
        activityLevel: "active",
        experience: "intermediate",
        role: "user"
      },
      {
        name: "Sara Fit",
        email: "sara.fit@email.com",
        password: await bcrypt.hash("password123", 10),
        height: 158,
        weight: 52,
        age: 24,
        gender: "female",
        avatar: "/avatars/sara.jpg",
        goal: "improve-fitness",
        activityLevel: "very-active",
        experience: "advanced",
        role: "user"
      }
    ])

    console.log(`✅ Created ${users.length} users`)

    // Create comprehensive exercise database (45 exercises)
    console.log("💪 Creating exercises...")
    const exercises = await Exercise.insertMany([
      // BEGINNER EXERCISES (15)
      {
        title: "Flexiones de Rodillas",
        description: "Versión modificada de flexiones para principiantes",
        instructions: [
          "Colócate en posición de plancha pero apoyando las rodillas",
          "Mantén el cuerpo recto desde las rodillas hasta la cabeza",
          "Baja el pecho hacia el suelo controladamente",
          "Empuja hacia arriba hasta la posición inicial",
        ],
        category: "chest",
        level: "beginner",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["mat"],
        duration: "30 segundos",
        intensity: "low",
        calories: 35,
        tags: ["bodyweight", "modified", "upper-body"],
        image: "https://blog.skinnyfit.com/wp-content/uploads/2020/03/shutterstock_1092027824-1024x701.jpg",
      },
      {
        title: "Sentadillas Asistidas",
        description: "Sentadillas con apoyo para aprender la técnica correcta",
        instructions: [
          "Párate frente a una silla o banco",
          "Baja lentamente como si fueras a sentarte",
          "Toca ligeramente la silla y vuelve a subir",
          "Mantén el peso en los talones",
        ],
        category: "legs",
        level: "beginner",
        muscleGroups: ["quadriceps", "glutes"],
        equipment: ["none"],
        duration: "45 segundos",
        intensity: "low",
        calories: 40,
        tags: ["bodyweight", "assisted", "lower-body"],
        image: "https://aws.glamour.es/prod/designs/v1/assets/620x620/650689.jpg",
      },
      {
        title: "Plancha de Rodillas",
        description: "Plancha modificada para desarrollar fuerza del core",
        instructions: [
          "Colócate en posición de plancha sobre las rodillas",
          "Mantén los antebrazos en el suelo",
          "Forma una línea recta desde las rodillas hasta la cabeza",
          "Contrae el abdomen y respira normalmente",
        ],
        category: "core",
        level: "beginner",
        muscleGroups: ["core", "shoulders"],
        equipment: ["mat"],
        duration: "20-30 segundos",
        intensity: "low",
        calories: 25,
        tags: ["isometric", "modified", "core"],
        image: "https://www.terra.com/u/fotografias/m/2024/5/18/f768x1-40479_40606_5050.jpg",
      },
      {
        title: "Marcha en el Lugar",
        description: "Ejercicio cardiovascular básico para principiantes",
        instructions: [
          "Párate derecho con los pies separados al ancho de caderas",
          "Levanta una rodilla hacia el pecho",
          "Alterna las piernas como si estuvieras marchando",
          "Mantén un ritmo constante y cómodo",
        ],
        category: "cardio",
        level: "beginner",
        muscleGroups: ["cardio"],
        equipment: ["none"],
        duration: "2-3 minutos",
        intensity: "low",
        calories: 45,
        tags: ["cardio", "low-impact", "warm-up"],
        image: "https://th.bing.com/th/id/OIP.pfLXraExCvf2aLpLUP6osAHaHa?rs=1&pid=ImgDetMain",
      },
      {
        title: "Elevaciones de Brazos",
        description: "Ejercicio básico para hombros sin peso",
        instructions: [
          "Párate con los pies separados al ancho de hombros",
          "Extiende los brazos a los lados hasta la altura de los hombros",
          "Baja lentamente los brazos",
          "Repite el movimiento de forma controlada",
        ],
        category: "shoulders",
        level: "beginner",
        muscleGroups: ["shoulders"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "low",
        calories: 20,
        tags: ["bodyweight", "shoulders", "mobility"],
        image: "https://static.vecteezy.com/system/resources/previews/016/126/552/original/man-doing-double-arm-side-or-lateral-raises-exercise-raise-both-arms-laterally-until-horizontal-flat-illustration-isolated-on-white-background-vector.jpg",
      },
      {
        title: "Puente de Glúteos",
        description: "Ejercicio básico para fortalecer glúteos y core",
        instructions: [
          "Acuéstate boca arriba con las rodillas dobladas",
          "Mantén los pies planos en el suelo",
          "Levanta las caderas formando una línea recta",
          "Aprieta los glúteos en la parte superior",
        ],
        category: "legs",
        level: "beginner",
        muscleGroups: ["glutes", "hamstrings", "core"],
        equipment: ["mat"],
        duration: "30 segundos",
        intensity: "low",
        calories: 30,
        tags: ["bodyweight", "glutes", "core"],
        image: "https://static1.mujerhoy.com/www/multimedia/202203/02/media/cortadas/puente-gluteos-como-se-hace-kqcH--624x624@MujerHoy.jpg",
      },
      {
        title: "Estiramiento de Gato-Vaca",
        description: "Ejercicio de movilidad para la columna vertebral",
        instructions: [
          "Colócate en posición de cuatro patas",
          "Arquea la espalda hacia arriba como un gato",
          "Luego arquea hacia abajo como una vaca",
          "Alterna entre ambas posiciones lentamente",
        ],
        category: "back",
        level: "beginner",
        muscleGroups: ["back", "core"],
        equipment: ["mat"],
        duration: "1 minuto",
        intensity: "low",
        calories: 15,
        tags: ["mobility", "flexibility", "warm-up"],
        image: "https://thumbs.dreamstime.com/z/hombre-que-hace-ejercicio-de-la-vaca-del-gato-estiramiento-posterior-trasero-en-el-gimnasio-aptitud-y-forma-vida-sana-carrocer-143610898.jpg",
      },
      {
        title: "Elevaciones de Talones",
        description: "Ejercicio básico para fortalecer las pantorrillas",
        instructions: [
          "Párate derecho con los pies separados al ancho de caderas",
          "Levanta los talones del suelo lo más alto posible",
          "Mantén la posición por un segundo",
          "Baja lentamente a la posición inicial",
        ],
        category: "legs",
        level: "beginner",
        muscleGroups: ["calves"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "low",
        calories: 25,
        tags: ["bodyweight", "calves", "balance"],
        image: "https://porunavidaactiva.es/wp-content/uploads/2022/11/Elevar-talones-1536x1450.png",
      },
      {
        title: "Flexiones de Pared",
        description: "Flexiones verticales para principiantes",
        instructions: [
          "Párate a un brazo de distancia de una pared",
          "Coloca las palmas contra la pared a la altura de los hombros",
          "Inclínate hacia la pared doblando los codos",
          "Empuja de vuelta a la posición inicial",
        ],
        category: "chest",
        level: "beginner",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "low",
        calories: 30,
        tags: ["bodyweight", "wall", "upper-body"],
        image: "https://static1.abc.es/media/bienestar/2020/03/23/flexiones-pared-k7PE--510x287@abc.jpg",
      },
      {
        title: "Respiración Diafragmática",
        description: "Ejercicio de respiración para relajación y core",
        instructions: [
          "Acuéstate boca arriba con las rodillas dobladas",
          "Coloca una mano en el pecho y otra en el abdomen",
          "Respira profundamente inflando el abdomen",
          "Exhala lentamente contrayendo el abdomen",
        ],
        category: "core",
        level: "beginner",
        muscleGroups: ["core"],
        equipment: ["mat"],
        duration: "2-3 minutos",
        intensity: "low",
        calories: 10,
        tags: ["breathing", "relaxation", "core"],
        image: "https://stat.ameba.jp/user_images/20200116/14/kms-hokuto/9b/e0/j/o0750070414697062871.jpg",
      },
      {
        title: "Caminar en el Lugar",
        description: "Ejercicio cardiovascular suave",
        instructions: [
          "Párate derecho y comienza a caminar en el lugar",
          "Levanta las rodillas ligeramente",
          "Mueve los brazos naturalmente",
          "Mantén un ritmo cómodo y constante",
        ],
        category: "cardio",
        level: "beginner",
        muscleGroups: ["cardio"],
        equipment: ["none"],
        duration: "3-5 minutos",
        intensity: "low",
        calories: 35,
        tags: ["cardio", "low-impact", "walking"],
        image: "https://i.pinimg.com/originals/e8/a5/08/e8a508d3c3be68ad7aa225b67640f74d.jpg",
      },
      {
        title: "Rotaciones de Hombros",
        description: "Ejercicio de movilidad para los hombros",
        instructions: [
          "Párate con los brazos a los lados",
          "Rota los hombros hacia adelante en círculos pequeños",
          "Después rota hacia atrás",
          "Mantén el movimiento lento y controlado",
        ],
        category: "shoulders",
        level: "beginner",
        muscleGroups: ["shoulders"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "low",
        calories: 15,
        tags: ["mobility", "warm-up", "shoulders"],
        image: "https://static.vecteezy.com/system/resources/previews/017/457/662/non_2x/woman-demonstrates-how-to-do-shoulder-rotation-flat-illustration-female-exercise-isolated-on-white-background-athletic-girl-doing-exercises-vector.jpg",
      },
      {
        title: "Sentadilla en Silla",
        description: "Ejercicio de sentarse y levantarse de una silla",
        instructions: [
          "Siéntate en una silla con los pies planos en el suelo",
          "Cruza los brazos sobre el pecho",
          "Levántate sin usar las manos",
          "Siéntate lentamente de vuelta",
        ],
        category: "legs",
        level: "beginner",
        muscleGroups: ["quadriceps", "glutes"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "low",
        calories: 35,
        tags: ["functional", "chair", "lower-body"],
        image: "https://th.bing.com/th/id/OIP.mbJVl_vQdFKoHyCwGNl6agHaHa?rs=1&pid=ImgDetMain",
      },
      {
        title: "Extensión de Brazos",
        description: "Ejercicio básico para tríceps",
        instructions: [
          "Párate con los brazos extendidos hacia arriba",
          "Dobla los codos llevando las manos hacia los hombros",
          "Extiende los brazos de vuelta hacia arriba",
          "Mantén los codos cerca de la cabeza",
        ],
        category: "arms",
        level: "beginner",
        muscleGroups: ["triceps"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "low",
        calories: 25,
        tags: ["bodyweight", "triceps", "upper-body"],
        image: "https://static.vecteezy.com/system/resources/previews/008/056/881/non_2x/woman-doing-dumbbell-triceps-extension-exercise-flat-illustration-isolated-on-white-background-free-vector.jpg",
      },
      {
        title: "Inclinaciones Laterales",
        description: "Ejercicio básico para los oblicuos",
        instructions: [
          "Párate con los pies separados al ancho de caderas",
          "Coloca las manos en las caderas",
          "Inclínate hacia un lado manteniendo la espalda recta",
          "Regresa al centro y repite hacia el otro lado",
        ],
        category: "core",
        level: "beginner",
        muscleGroups: ["core"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "low",
        calories: 20,
        tags: ["bodyweight", "obliques", "core"],
        image: "https://i.pinimg.com/originals/ca/22/8a/ca228a44a4bd32a285b827bf9c0d6383.jpg",
      },

      // INTERMEDIATE EXERCISES (15)
      {
        title: "Flexiones Estándar",
        description: "Flexiones clásicas para fortalecer el tren superior",
        instructions: [
          "Colócate en posición de plancha con las manos al ancho de hombros",
          "Mantén el cuerpo recto desde la cabeza hasta los talones",
          "Baja el pecho hacia el suelo",
          "Empuja hacia arriba hasta la posición inicial",
        ],
        category: "chest",
        level: "intermediate",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["none"],
        duration: "45 segundos",
        intensity: "moderate",
        calories: 60,
        tags: ["bodyweight", "compound", "upper-body"],
        image: "https://static.vecteezy.com/system/resources/previews/008/631/574/original/woman-doing-diamond-pyramid-push-ups-exercise-flat-illustration-isolated-on-white-background-vector.jpg",
      },
      {
        title: "Sentadillas con Salto",
        description: "Sentadillas explosivas para potencia y cardio",
        instructions: [
          "Realiza una sentadilla normal",
          "Al subir, salta explosivamente hacia arriba",
          "Aterriza suavemente en posición de sentadilla",
          "Repite el movimiento de forma continua",
        ],
        category: "legs",
        level: "intermediate",
        muscleGroups: ["quadriceps", "glutes", "calves"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "high",
        calories: 80,
        tags: ["plyometric", "explosive", "cardio"],
        image: "https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Jump-Squat_600x600.png?v=1655223952",
      },
      {
        title: "Plancha Estándar",
        description: "Plancha completa para fortalecer el core",
        instructions: [
          "Colócate en posición de plancha sobre los antebrazos",
          "Mantén el cuerpo recto desde la cabeza hasta los talones",
          "Contrae el abdomen y los glúteos",
          "Respira de manera controlada",
        ],
        category: "core",
        level: "intermediate",
        muscleGroups: ["core", "shoulders", "back"],
        equipment: ["mat"],
        duration: "45-60 segundos",
        intensity: "moderate",
        calories: 45,
        tags: ["isometric", "core", "stability"],
        image: "https://i.pinimg.com/474x/0f/ac/cd/0faccd63502b59ca730c47c2a1d5e4ed.jpg?nii=t",
      },
      {
        title: "Burpees Modificados",
        description: "Burpees sin salto para nivel intermedio",
        instructions: [
          "Comienza de pie",
          "Baja a posición de cuclillas y coloca las manos en el suelo",
          "Salta los pies hacia atrás a posición de plancha",
          "Salta los pies hacia adelante y ponte de pie",
        ],
        category: "cardio",
        level: "intermediate",
        muscleGroups: ["chest", "core", "legs"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "high",
        calories: 90,
        tags: ["hiit", "full-body", "compound"],
        image: "https://static.toiimg.com/photo/94421347.cms",
      },
      {
        title: "Flexiones de Tríceps",
        description: "Flexiones con enfoque en tríceps usando una silla",
        instructions: [
          "Siéntate en el borde de una silla con las manos a los lados",
          "Desliza el cuerpo hacia adelante fuera de la silla",
          "Baja el cuerpo doblando los codos",
          "Empuja hacia arriba hasta la posición inicial",
        ],
        category: "arms",
        level: "intermediate",
        muscleGroups: ["triceps", "shoulders"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "moderate",
        calories: 50,
        tags: ["bodyweight", "triceps", "chair"],
        image: "https://th.bing.com/th/id/R.4554c824cc6df1436c64e5375da5991b?rik=%2fwa8GO9kEBMhLw&pid=ImgRaw&r=0",
      },
      {
        title: "Zancadas",
        description: "Ejercicio unilateral para piernas y glúteos",
        instructions: [
          "Da un paso grande hacia adelante",
          "Baja el cuerpo hasta que ambas rodillas estén a 90 grados",
          "Empuja con el talón delantero para volver a la posición inicial",
          "Alterna las piernas",
        ],
        category: "legs",
        level: "intermediate",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: ["none"],
        duration: "45 segundos",
        intensity: "moderate",
        calories: 65,
        tags: ["unilateral", "functional", "lower-body"],
        image: "https://media.vogue.es/photos/5ff6eec72361f90ef2d5de21/master/w_1600%2Cc_limit/zancasas.jpg",
      },
      {
        title: "Plancha Lateral",
        description: "Plancha lateral para fortalecer oblicuos",
        instructions: [
          "Acuéstate de lado apoyándote en el antebrazo",
          "Levanta las caderas formando una línea recta",
          "Mantén la posición contrayendo el core",
          "Repite en ambos lados",
        ],
        category: "core",
        level: "intermediate",
        muscleGroups: ["core", "shoulders"],
        equipment: ["mat"],
        duration: "30 segundos cada lado",
        intensity: "moderate",
        calories: 40,
        tags: ["isometric", "obliques", "unilateral"],
        image: "https://mood.sapo.pt/wp-content/uploads/2029/06/2-2-750x292.jpg",
      },
      {
        title: "Mountain Climbers",
        description: "Ejercicio dinámico de core y cardio",
        instructions: [
          "Comienza en posición de plancha",
          "Lleva una rodilla hacia el pecho",
          "Alterna rápidamente las piernas",
          "Mantén las caderas estables",
        ],
        category: "cardio",
        level: "intermediate",
        muscleGroups: ["core", "cardio", "shoulders"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "high",
        calories: 75,
        tags: ["hiit", "dynamic", "core"],
        image: "https://images.squarespace-cdn.com/content/v1/55b7f4ffe4b0a286c4c3499e/16b4e8f3-8766-418d-beeb-00addce2a3b9/how-to-do-mountain-climbers",
      },
      {
        title: "Sentadilla Sumo",
        description: "Sentadilla con piernas abiertas para glúteos",
        instructions: [
          "Párate con los pies más anchos que los hombros",
          "Apunta los dedos de los pies hacia afuera",
          "Baja en sentadilla manteniendo las rodillas alineadas",
          "Sube apretando los glúteos",
        ],
        category: "legs",
        level: "intermediate",
        muscleGroups: ["glutes", "quadriceps", "adductors"],
        equipment: ["none"],
        duration: "45 segundos",
        intensity: "moderate",
        calories: 55,
        tags: ["bodyweight", "glutes", "wide-stance"],
        image: "https://th.bing.com/th/id/R.ff73162fa26f1f58e606ce6ecd0d0f8b?rik=C91vh0mFTlMl0w&pid=ImgRaw&r=0",
      },
      {
        title: "Flexiones Diamante",
        description: "Flexiones con manos en forma de diamante para tríceps",
        instructions: [
          "Colócate en posición de flexión",
          "Junta las manos formando un diamante con los dedos",
          "Baja el pecho hacia las manos",
          "Empuja hacia arriba manteniendo los codos cerca del cuerpo",
        ],
        category: "arms",
        level: "intermediate",
        muscleGroups: ["triceps", "chest", "shoulders"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "moderate",
        calories: 55,
        tags: ["bodyweight", "triceps", "advanced-pushup"],
        image: "https://static.vecteezy.com/system/resources/previews/008/631/574/original/woman-doing-diamond-pyramid-push-ups-exercise-flat-illustration-isolated-on-white-background-vector.jpg",
      },
      {
        title: "Puente de Glúteos a Una Pierna",
        description: "Puente unilateral para mayor dificultad",
        instructions: [
          "Acuéstate boca arriba con una rodilla doblada",
          "Extiende la otra pierna hacia arriba",
          "Levanta las caderas apoyándote en una pierna",
          "Mantén la posición y alterna",
        ],
        category: "legs",
        level: "intermediate",
        muscleGroups: ["glutes", "hamstrings", "core"],
        equipment: ["mat"],
        duration: "30 segundos cada pierna",
        intensity: "moderate",
        calories: 45,
        tags: ["unilateral", "glutes", "stability"],
        image: "https://holisimavida.com/wp-content/uploads/Ejercicios-de-movilidad-de-cadera-levantamiento.png",
      },
      {
        title: "Jumping Jacks",
        description: "Ejercicio cardiovascular clásico",
        instructions: [
          "Párate con los pies juntos y brazos a los lados",
          "Salta abriendo las piernas y levantando los brazos",
          "Salta de vuelta a la posición inicial",
          "Mantén un ritmo constante",
        ],
        category: "cardio",
        level: "intermediate",
        muscleGroups: ["cardio", "shoulders", "legs"],
        equipment: ["none"],
        duration: "45 segundos",
        intensity: "moderate",
        calories: 70,
        tags: ["cardio", "full-body", "coordination"],
        image: "https://th.bing.com/th/id/OIP.RzXDwRrdSUdMxGODXmsnAgHaGj?rs=1&pid=ImgDetMain",
      },
      {
        title: "Abdominales Bicicleta",
        description: "Ejercicio dinámico para oblicuos y abdomen",
        instructions: [
          "Acuéstate boca arriba con las manos detrás de la cabeza",
          "Lleva el codo derecho hacia la rodilla izquierda",
          "Alterna llevando el codo izquierdo hacia la rodilla derecha",
          "Mantén un movimiento fluido",
        ],
        category: "core",
        level: "intermediate",
        muscleGroups: ["core", "obliques"],
        equipment: ["mat"],
        duration: "45 segundos",
        intensity: "moderate",
        calories: 50,
        tags: ["dynamic", "obliques", "rotation"],
        image: "https://blog.skinnyfit.com/wp-content/uploads/2020/03/shutterstock_1092027824-1024x701.jpg",
      },
      {
        title: "Escaladores Laterales",
        description: "Mountain climbers con movimiento lateral",
        instructions: [
          "Comienza en posición de plancha",
          "Lleva la rodilla derecha hacia el codo derecho",
          "Regresa y lleva la rodilla izquierda hacia el codo izquierdo",
          "Alterna manteniendo el ritmo",
        ],
        category: "core",
        level: "intermediate",
        muscleGroups: ["core", "obliques", "shoulders"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "high",
        calories: 65,
        tags: ["dynamic", "lateral", "core"],
        image: "https://media.vogue.es/photos/61f9092242d1cb4eb45c0de3/master/w_1600%2Cc_limit/tabla%2520de%2520ejercicios6_Mesa%2520de%2520trabajo%25201%2520copia%25206.jpeg",
      },
      {
        title: "Sentadilla con Pausa",
        description: "Sentadilla con pausa en la parte inferior",
        instructions: [
          "Realiza una sentadilla normal",
          "Mantén la posición inferior por 3 segundos",
          "Sube explosivamente a la posición inicial",
          "Repite manteniendo la pausa",
        ],
        category: "legs",
        level: "intermediate",
        muscleGroups: ["quadriceps", "glutes"],
        equipment: ["none"],
        duration: "45 segundos",
        intensity: "moderate",
        calories: 60,
        tags: ["isometric", "strength", "control"],
        image: "https://www.mundofitness.com/wp-content/uploads/34.png",
      },

      // ADVANCED EXERCISES (15)
      {
        title: "Burpees Completos",
        description: "Burpees con flexión y salto para máxima intensidad",
        instructions: [
          "Comienza de pie",
          "Baja a cuclillas y coloca las manos en el suelo",
          "Salta a posición de plancha y haz una flexión",
          "Salta los pies hacia adelante y salta hacia arriba con los brazos extendidos",
        ],
        category: "cardio",
        level: "advanced",
        muscleGroups: ["cardio", "chest", "core", "legs"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "very-high",
        calories: 120,
        tags: ["hiit", "explosive", "full-body"],
        image: "https://nutricion360.es/wp-content/uploads/2020/06/ejercicios-para-tonificar-burpee.jpg",
      },
      {
        title: "Flexiones con Palmada",
        description: "Flexiones explosivas con palmada en el aire",
        instructions: [
          "Comienza en posición de flexión",
          "Baja el pecho hacia el suelo",
          "Empuja explosivamente para despegar las manos del suelo",
          "Da una palmada y aterriza en posición de flexión",
        ],
        category: "chest",
        level: "advanced",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["none"],
        duration: "20 segundos",
        intensity: "very-high",
        calories: 80,
        tags: ["plyometric", "explosive", "advanced"],
        image: "https://th.bing.com/th/id/R.ab4ce75a99bb7d82d488fb99ea532c48?rik=VM5n2wZ9geCJ%2bw&pid=ImgRaw&r=0",
      },
      {
        title: "Plancha con Elevación de Piernas",
        description: "Plancha dinámica alternando elevación de piernas",
        instructions: [
          "Mantén la posición de plancha estándar",
          "Levanta una pierna manteniendo la cadera estable",
          "Baja y levanta la otra pierna",
          "Alterna manteniendo la posición de plancha",
        ],
        category: "core",
        level: "advanced",
        muscleGroups: ["core", "glutes", "shoulders"],
        equipment: ["mat"],
        duration: "45 segundos",
        intensity: "high",
        calories: 70,
        tags: ["dynamic", "stability", "unilateral"],
        image: "https://media.vogue.es/photos/5eb13d80a2686abb984c2bc7/master/w_1600%2Cc_limit/tabla-de-ejercicios2-2.jpg",
      },
      {
        title: "Pistol Squats Asistidas",
        description: "Sentadillas a una pierna con asistencia",
        instructions: [
          "Párate en una pierna con la otra extendida hacia adelante",
          "Usa una pared o TRX para asistencia",
          "Baja lentamente en sentadilla a una pierna",
          "Sube usando principalmente la pierna de apoyo",
        ],
        category: "legs",
        level: "advanced",
        muscleGroups: ["quadriceps", "glutes", "core"],
        equipment: ["none"],
        duration: "20 segundos cada pierna",
        intensity: "very-high",
        calories: 90,
        tags: ["unilateral", "strength", "balance"],
        image: "https://static.vecteezy.com/system/resources/previews/027/439/527/original/woman-doing-trx-pistol-single-leg-squat-extended-arm-exercise-flat-illustration-isolated-on-white-background-vector.jpg",
      },
      {
        title: "Flexiones Arqueras",
        description: "Flexiones unilaterales alternando brazos",
        instructions: [
          "Colócate en posición de flexión con brazos muy abiertos",
          "Baja hacia un lado cargando el peso en un brazo",
          "El otro brazo se mantiene extendido",
          "Alterna hacia el otro lado",
        ],
        category: "chest",
        level: "advanced",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "very-high",
        calories: 85,
        tags: ["unilateral", "strength", "advanced"],
        image: "https://th.bing.com/th/id/OIP.8cAkuQee9gqkt2dnxeiQvAHaHa?rs=1&pid=ImgDetMain",
      },
      {
        title: "Saltos de Caja",
        description: "Saltos explosivos sobre una superficie elevada",
        instructions: [
          "Párate frente a una caja o banco estable",
          "Salta explosivamente sobre la caja",
          "Aterriza suavemente con ambos pies",
          "Baja controladamente y repite",
        ],
        category: "legs",
        level: "advanced",
        muscleGroups: ["quadriceps", "glutes", "calves"],
        equipment: ["bench"],
        duration: "30 segundos",
        intensity: "very-high",
        calories: 100,
        tags: ["plyometric", "explosive", "power"],
        image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/saltos-cajo-n-1585574626.jpg?resize=320:*",
      },
      {
        title: "Plancha a Pike",
        description: "Transición dinámica de plancha a pike",
        instructions: [
          "Comienza en posición de plancha",
          "Levanta las caderas hacia arriba formando una V invertida",
          "Regresa a la posición de plancha",
          "Mantén el movimiento fluido y controlado",
        ],
        category: "core",
        level: "advanced",
        muscleGroups: ["core", "shoulders", "hamstrings"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "high",
        calories: 75,
        tags: ["dynamic", "flexibility", "strength"],
        image: "https://selfweightloss.com/wp-content/uploads/2020/07/Pike.jpg",
      },
      {
        title: "Dominadas Asistidas",
        description: "Dominadas con banda elástica o asistencia",
        instructions: [
          "Cuelga de una barra con agarre pronado",
          "Usa una banda elástica bajo los pies para asistencia",
          "Tira hacia arriba hasta que la barbilla pase la barra",
          "Baja controladamente",
        ],
        category: "back",
        level: "advanced",
        muscleGroups: ["back", "biceps"],
        equipment: ["pull-up-bar", "resistance-bands"],
        duration: "Variable",
        intensity: "very-high",
        calories: 95,
        tags: ["pull", "assisted", "upper-body"],
        image: "https://danitrainer.com/wp-content/uploads/2020/07/dominada-goma.jpg",
      },
      {
        title: "Flexiones Hindu",
        description: "Flexiones dinámicas con movimiento fluido",
        instructions: [
          "Comienza en posición de perro boca abajo",
          "Baja en un movimiento fluido hacia adelante",
          "Termina en posición de cobra",
          "Regresa fluidamente a la posición inicial",
        ],
        category: "chest",
        level: "advanced",
        muscleGroups: ["chest", "shoulders", "core", "back"],
        equipment: ["mat"],
        duration: "30 segundos",
        intensity: "high",
        calories: 80,
        tags: ["dynamic", "flexibility", "flow"],
        image: "https://th.bing.com/th/id/OIP.25O1EFzQKwb3nDPtzmD-ugHaHa?rs=1&pid=ImgDetMain",
      },
      {
        title: "Sentadillas con Salto 180°",
        description: "Sentadillas con salto y giro de 180 grados",
        instructions: [
          "Realiza una sentadilla normal",
          "Salta explosivamente girando 180 grados",
          "Aterriza en sentadilla mirando la dirección opuesta",
          "Repite girando de vuelta",
        ],
        category: "legs",
        level: "advanced",
        muscleGroups: ["quadriceps", "glutes"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "very-high",
        calories: 110,
        tags: ["plyometric", "rotation", "agility"],
        image: "https://st4.depositphotos.com/1177537/23363/v/950/depositphotos_233637976-stock-illustration-jump-squats-squat-sport-exersice.jpg",
      },
      {
        title: "Plancha con Toque de Hombro",
        description: "Plancha con toque alternado de hombros",
        instructions: [
          "Mantén la posición de plancha",
          "Levanta una mano y toca el hombro opuesto",
          "Regresa la mano al suelo",
          "Alterna manteniendo las caderas estables",
        ],
        category: "core",
        level: "advanced",
        muscleGroups: ["core", "shoulders"],
        equipment: ["none"],
        duration: "45 segundos",
        intensity: "high",
        calories: 65,
        tags: ["stability", "unilateral", "anti-rotation"],
        image: "https://th.bing.com/th/id/OIP.DiPQqWYBX382QWnCxgWuGgHaHa?rs=1&pid=ImgDetMain",
      },
      {
        title: "Zancadas con Salto",
        description: "Zancadas explosivas alternando piernas en el aire",
        instructions: [
          "Comienza en posición de zancada",
          "Salta explosivamente cambiando las piernas en el aire",
          "Aterriza en zancada con la pierna opuesta adelante",
          "Repite el movimiento de forma continua",
        ],
        category: "legs",
        level: "advanced",
        muscleGroups: ["quadriceps", "glutes", "calves"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "very-high",
        calories: 105,
        tags: ["plyometric", "explosive", "alternating"],
        image: "https://th.bing.com/th/id/OIP.BL4ccmrGbzlcqxopQg-X-QAAAA?rs=1&pid=ImgDetMain",
      },
      {
        title: "Flexiones en T",
        description: "Flexiones con rotación lateral del torso",
        instructions: [
          "Realiza una flexión normal",
          "Al subir, rota el torso y extiende un brazo hacia arriba",
          "Regresa a posición de flexión",
          "Alterna la rotación hacia ambos lados",
        ],
        category: "chest",
        level: "advanced",
        muscleGroups: ["chest", "core", "shoulders"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "high",
        calories: 75,
        tags: ["rotation", "dynamic", "core"],
        image: "https://www.victorianeagle.com/wp-content/uploads/2020/11/Flexiones-t-720x720.png",
      },
      {
        title: "Bear Crawl",
        description: "Gateo del oso para fuerza y coordinación",
        instructions: [
          "Comienza en posición de cuatro patas",
          "Levanta las rodillas del suelo",
          "Camina hacia adelante manteniendo las rodillas elevadas",
          "Mantén la espalda recta y el core contraído",
        ],
        category: "full-body",
        level: "advanced",
        muscleGroups: ["core", "shoulders", "legs"],
        equipment: ["none"],
        duration: "30 segundos",
        intensity: "high",
        calories: 85,
        tags: ["locomotion", "coordination", "full-body"],
        image: "https://th.bing.com/th/id/OIP.Tuw7MQPm6_81Z-B9adTW4QHaHa?rs=1&pid=ImgDetMain",
      },
      {
        title: "Handstand Progression",
        description: "Progresión hacia la parada de manos",
        instructions: [
          "Comienza con los pies en la pared",
          "Camina los pies hacia arriba por la pared",
          "Mantén los brazos rectos y el core contraído",
          "Progresa gradualmente hacia la vertical",
        ],
        category: "shoulders",
        level: "advanced",
        muscleGroups: ["shoulders", "core", "arms"],
        equipment: ["none"],
        duration: "20-30 segundos",
        intensity: "very-high",
        calories: 70,
        tags: ["inversion", "balance", "strength"],
        image: "https://th.bing.com/th/id/OIP.ukhlyLmI6f-GEo3pOU9D0AHaHa?rs=1&pid=ImgDetMain",
      },
    ])

    console.log(`✅ Created ${exercises.length} exercises (15 per level)`)

    // Create comprehensive training plans
    console.log("🏋️ Creating training plans...")
    const trainingPlans = await TrainingPlan.insertMany([
      // Ana García (Principiante, perder peso)
      {
        user: users[0]._id,
        title: "Principiante - Pérdida de Peso",
        description: "Plan de 4 semanas para principiantes enfocado en pérdida de peso y tonificación general.",
        goal: "lose-weight",
        level: "beginner",
        duration: 4,
        daysPerWeek: 3,
        isTemplate: false,
        days: [
          {
            dayOfWeek: 1,
            name: "Lunes - Full Body",
            exercises: [
              { exercise: exercises[0]._id, sets: 3, reps: 12, rest: 60 },
              { exercise: exercises[3]._id, sets: 3, duration: 120, rest: 60 },
              { exercise: exercises[5]._id, sets: 3, reps: 15, rest: 60 },
            ],
          },
          {
            dayOfWeek: 3,
            name: "Miércoles - Cardio y Core",
            exercises: [
              { exercise: exercises[7]._id, sets: 3, duration: 180, rest: 60 },
              { exercise: exercises[2]._id, sets: 3, duration: 30, rest: 60 },
              { exercise: exercises[10]._id, sets: 3, reps: 12, rest: 60 },
            ],
          },
          {
            dayOfWeek: 5,
            name: "Viernes - Piernas y Glúteos",
            exercises: [
              { exercise: exercises[1]._id, sets: 3, reps: 15, rest: 60 },
              { exercise: exercises[6]._id, sets: 3, reps: 12, rest: 60 },
              { exercise: exercises[8]._id, sets: 3, reps: 10, rest: 60 },
            ],
          },
        ],
      },
      // Carlos Rodríguez (Intermedio, ganar músculo)
      {
        user: users[1]._id,
        title: "Intermedio - Hipertrofia y Fuerza",
        description: "Plan de 6 semanas para ganar masa muscular y fuerza, 4 días por semana.",
        goal: "gain-muscle",
        level: "intermediate",
        duration: 6,
        daysPerWeek: 4,
        isTemplate: false,
        days: [
          {
            dayOfWeek: 1,
            name: "Lunes - Pecho y Tríceps",
            exercises: [
              { exercise: exercises[15]._id, sets: 4, reps: 10, rest: 90 },
              { exercise: exercises[19]._id, sets: 4, reps: 12, rest: 90 },
              { exercise: exercises[20]._id, sets: 3, reps: 12, rest: 90 },
            ],
          },
          {
            dayOfWeek: 2,
            name: "Martes - Espalda y Bíceps",
            exercises: [
              { exercise: exercises[23]._id, sets: 4, reps: 10, rest: 90 },
              { exercise: exercises[25]._id, sets: 4, reps: 12, rest: 90 },
              { exercise: exercises[27]._id, sets: 3, reps: 12, rest: 90 },
            ],
          },
          {
            dayOfWeek: 4,
            name: "Jueves - Piernas",
            exercises: [
              { exercise: exercises[16]._id, sets: 4, reps: 12, rest: 120 },
              { exercise: exercises[20]._id, sets: 4, reps: 15, rest: 90 },
              { exercise: exercises[29]._id, sets: 3, reps: 15, rest: 90 },
            ],
          },
          {
            dayOfWeek: 6,
            name: "Sábado - Full Body y Core",
            exercises: [
              { exercise: exercises[17]._id, sets: 4, duration: 45, rest: 60 },
              { exercise: exercises[21]._id, sets: 3, duration: 30, rest: 60 },
              { exercise: exercises[27]._id, sets: 3, reps: 20, rest: 45 },
            ],
          },
        ],
      },
      // María López (Avanzada, mejorar fitness)
      {
        user: users[2]._id,
        title: "Avanzado - Fitness Total",
        description: "Plan avanzado de 8 semanas para mejorar fuerza, resistencia y movilidad.",
        goal: "improve-fitness",
        level: "advanced",
        duration: 8,
        daysPerWeek: 5,
        isTemplate: false,
        days: [
          {
            dayOfWeek: 1,
            name: "Lunes - HIIT y Core",
            exercises: [
              { exercise: exercises[30]._id, sets: 5, duration: 30, rest: 40 },
              { exercise: exercises[32]._id, sets: 4, duration: 45, rest: 60 },
              { exercise: exercises[36]._id, sets: 4, reps: 8, rest: 90 },
            ],
          },
          {
            dayOfWeek: 2,
            name: "Martes - Tren Superior",
            exercises: [
              { exercise: exercises[31]._id, sets: 5, reps: 8, rest: 120 },
              { exercise: exercises[34]._id, sets: 4, reps: 10, rest: 120 },
              { exercise: exercises[38]._id, sets: 4, reps: 10, rest: 120 },
            ],
          },
          {
            dayOfWeek: 3,
            name: "Miércoles - Tren Inferior",
            exercises: [
              { exercise: exercises[35]._id, sets: 5, reps: 10, rest: 120 },
              { exercise: exercises[39]._id, sets: 4, reps: 12, rest: 120 },
              { exercise: exercises[41]._id, sets: 4, reps: 12, rest: 120 },
            ],
          },
          {
            dayOfWeek: 5,
            name: "Viernes - Cardio y Movilidad",
            exercises: [
              { exercise: exercises[40]._id, sets: 4, duration: 45, rest: 60 },
              { exercise: exercises[43]._id, sets: 3, duration: 30, rest: 60 },
              { exercise: exercises[44]._id, sets: 3, duration: 20, rest: 90 },
            ],
          },
          {
            dayOfWeek: 6,
            name: "Sábado - Full Body",
            exercises: [
              { exercise: exercises[38]._id, sets: 3, reps: 12, rest: 60 },
              { exercise: exercises[33]._id, sets: 3, reps: 8, rest: 90 },
              { exercise: exercises[36]._id, sets: 3, reps: 10, rest: 60 },
            ],
          },
        ],
      },
      // Usuarios extra (Elena, Miguel, Sara)
      {
        user: users[6]._id,
        title: "Principiante - Tonificación Femenina",
        description: "Plan de 4 semanas para tonificar y perder grasa, adaptado a mujeres principiantes.",
        goal: "lose-weight",
        level: "beginner",
        duration: 4,
        daysPerWeek: 3,
        isTemplate: false,
        days: [
          {
            dayOfWeek: 1,
            name: "Lunes - Full Body",
            exercises: [
              { exercise: exercises[0]._id, sets: 3, reps: 12, rest: 60 },
              { exercise: exercises[3]._id, sets: 3, duration: 120, rest: 60 },
              { exercise: exercises[5]._id, sets: 3, reps: 15, rest: 60 },
            ],
          },
          {
            dayOfWeek: 3,
            name: "Miércoles - Cardio y Core",
            exercises: [
              { exercise: exercises[7]._id, sets: 3, duration: 180, rest: 60 },
              { exercise: exercises[2]._id, sets: 3, duration: 30, rest: 60 },
              { exercise: exercises[10]._id, sets: 3, reps: 12, rest: 60 },
            ],
          },
          {
            dayOfWeek: 5,
            name: "Viernes - Piernas y Glúteos",
            exercises: [
              { exercise: exercises[1]._id, sets: 3, reps: 15, rest: 60 },
              { exercise: exercises[6]._id, sets: 3, reps: 12, rest: 60 },
              { exercise: exercises[8]._id, sets: 3, reps: 10, rest: 60 },
            ],
          },
        ],
      },
      {
        user: users[7]._id,
        title: "Intermedio - Volumen Masculino",
        description: "Plan de 6 semanas para ganar volumen muscular, adaptado a hombres intermedios.",
        goal: "gain-muscle",
        level: "intermediate",
        duration: 6,
        daysPerWeek: 4,
        isTemplate: false,
        days: [
          {
            dayOfWeek: 1,
            name: "Lunes - Pecho y Tríceps",
            exercises: [
              { exercise: exercises[15]._id, sets: 4, reps: 10, rest: 90 },
              { exercise: exercises[19]._id, sets: 4, reps: 12, rest: 90 },
              { exercise: exercises[20]._id, sets: 3, reps: 12, rest: 90 },
            ],
          },
          {
            dayOfWeek: 2,
            name: "Martes - Espalda y Bíceps",
            exercises: [
              { exercise: exercises[23]._id, sets: 4, reps: 10, rest: 90 },
              { exercise: exercises[25]._id, sets: 4, reps: 12, rest: 90 },
              { exercise: exercises[27]._id, sets: 3, reps: 12, rest: 90 },
            ],
          },
          {
            dayOfWeek: 4,
            name: "Jueves - Piernas",
            exercises: [
              { exercise: exercises[16]._id, sets: 4, reps: 12, rest: 120 },
              { exercise: exercises[20]._id, sets: 4, reps: 15, rest: 90 },
              { exercise: exercises[29]._id, sets: 3, reps: 15, rest: 90 },
            ],
          },
          {
            dayOfWeek: 6,
            name: "Sábado - Full Body y Core",
            exercises: [
              { exercise: exercises[17]._id, sets: 4, duration: 45, rest: 60 },
              { exercise: exercises[21]._id, sets: 3, duration: 30, rest: 60 },
              { exercise: exercises[27]._id, sets: 3, reps: 20, rest: 45 },
            ],
          },
        ],
      },
      {
        user: users[8]._id,
        title: "Avanzado - Fitness Femenino",
        description: "Plan avanzado de 8 semanas para mujeres fitness, fuerza y resistencia.",
        goal: "improve-fitness",
        level: "advanced",
        duration: 8,
        daysPerWeek: 5,
        isTemplate: false,
        days: [
          {
            dayOfWeek: 1,
            name: "Lunes - HIIT y Core",
            exercises: [
              { exercise: exercises[30]._id, sets: 5, duration: 30, rest: 40 },
              { exercise: exercises[32]._id, sets: 4, duration: 45, rest: 60 },
              { exercise: exercises[36]._id, sets: 4, reps: 8, rest: 90 },
            ],
          },
          {
            dayOfWeek: 2,
            name: "Martes - Tren Superior",
            exercises: [
              { exercise: exercises[31]._id, sets: 5, reps: 8, rest: 120 },
              { exercise: exercises[34]._id, sets: 4, reps: 10, rest: 120 },
              { exercise: exercises[38]._id, sets: 4, reps: 10, rest: 120 },
            ],
          },
          {
            dayOfWeek: 3,
            name: "Miércoles - Tren Inferior",
            exercises: [
              { exercise: exercises[35]._id, sets: 5, reps: 10, rest: 120 },
              { exercise: exercises[39]._id, sets: 4, reps: 12, rest: 120 },
              { exercise: exercises[41]._id, sets: 4, reps: 12, rest: 120 },
            ],
          },
          {
            dayOfWeek: 5,
            name: "Viernes - Cardio y Movilidad",
            exercises: [
              { exercise: exercises[40]._id, sets: 4, duration: 45, rest: 60 },
              { exercise: exercises[43]._id, sets: 3, duration: 30, rest: 60 },
              { exercise: exercises[44]._id, sets: 3, duration: 20, rest: 90 },
            ],
          },
          {
            dayOfWeek: 6,
            name: "Sábado - Full Body",
            exercises: [
              { exercise: exercises[38]._id, sets: 3, reps: 12, rest: 60 },
              { exercise: exercises[33]._id, sets: 3, reps: 8, rest: 90 },
              { exercise: exercises[36]._id, sets: 3, reps: 10, rest: 60 },
            ],
          },
        ],
      },
    ])

    console.log(`✅ Created ${trainingPlans.length} training plans`)

    // Create comprehensive diet plans
    console.log("🥗 Creating diet plans...")
    const diets = await Diet.insertMany([
      {
        user: users[3]._id,
        title: "Plan Mediterráneo",
        description: "Dieta mediterránea rica en grasas saludables y antioxidantes",
        calories: 2000,
        macros: { protein: 20, carbs: 45, fat: 35 },
        meals: [
          {
            name: "Desayuno Mediterráneo",
            description: "Tostada integral con aguacate, tomate y aceite de oliva",
            calories: 380,
            macros: { protein: 12, carbs: 45, fat: 35 },
            mealType: "breakfast",
            prepTime: 10,
            ingredients: [
              { name: "Pan integral", amount: "2", unit: "rebanadas" },
              { name: "Aguacate", amount: "1/2", unit: "pieza" },
              { name: "Tomate", amount: "1", unit: "pieza mediana" },
              { name: "Aceite de oliva", amount: "1", unit: "cucharada" },
            ],
          },
          {
            name: "Almuerzo Mediterráneo",
            description: "Salmón a la plancha con quinoa y verduras mediterráneas",
            calories: 650,
            macros: { protein: 35, carbs: 35, fat: 30 },
            mealType: "lunch",
            prepTime: 25,
            ingredients: [
              { name: "Salmón", amount: "150", unit: "gramos" },
              { name: "Quinoa", amount: "80", unit: "gramos" },
              { name: "Calabacín", amount: "100", unit: "gramos" },
              { name: "Pimientos", amount: "80", unit: "gramos" },
            ],
          },
          {
            name: "Cena Mediterránea",
            description: "Ensalada griega con pollo y aceitunas",
            calories: 520,
            macros: { protein: 30, carbs: 25, fat: 40 },
            mealType: "dinner",
            prepTime: 15,
            ingredients: [
              { name: "Pechuga de pollo", amount: "120", unit: "gramos" },
              { name: "Queso feta", amount: "50", unit: "gramos" },
              { name: "Aceitunas", amount: "30", unit: "gramos" },
              { name: "Pepino", amount: "100", unit: "gramos" },
            ],
          },
          {
            name: "Snack Mediterráneo",
            description: "Nueces y yogur griego con miel",
            calories: 250,
            macros: { protein: 15, carbs: 20, fat: 45 },
            mealType: "snack",
            prepTime: 2,
            ingredients: [
              { name: "Yogur griego", amount: "150", unit: "gramos" },
              { name: "Nueces", amount: "20", unit: "gramos" },
              { name: "Miel", amount: "1", unit: "cucharadita" },
            ],
          },
        ],
        benefits: ["Salud cardiovascular", "Antiinflamatorio", "Rico en omega-3", "Antioxidantes"],
        preferences: { vegetarian: false, vegan: false, glutenFree: false, lactoseFree: false },
        isTemplate: true,
      },
      {
        user: users[3]._id,
        title: "Plan Vegano Proteico",
        description: "Dieta vegana alta en proteínas para deportistas",
        calories: 2200,
        macros: { protein: 25, carbs: 50, fat: 25 },
        meals: [
          {
            name: "Desayuno Proteico Vegano",
            description: "Smoothie de proteína vegetal con avena y frutas",
            calories: 450,
            macros: { protein: 25, carbs: 55, fat: 20 },
            mealType: "breakfast",
            prepTime: 5,
            ingredients: [
              { name: "Proteína de guisante", amount: "30", unit: "gramos" },
              { name: "Avena", amount: "50", unit: "gramos" },
              { name: "Plátano", amount: "1", unit: "pieza" },
              { name: "Leche de almendras", amount: "250", unit: "ml" },
            ],
          },
          {
            name: "Almuerzo Vegano",
            description: "Bowl de quinoa con tempeh y verduras",
            calories: 680,
            macros: { protein: 28, carbs: 48, fat: 24 },
            mealType: "lunch",
            prepTime: 20,
            ingredients: [
              { name: "Quinoa", amount: "100", unit: "gramos" },
              { name: "Tempeh", amount: "100", unit: "gramos" },
              { name: "Brócoli", amount: "150", unit: "gramos" },
              { name: "Tahini", amount: "2", unit: "cucharadas" },
            ],
          },
          {
            name: "Cena Vegana",
            description: "Tofu salteado con arroz integral y vegetales",
            calories: 580,
            macros: { protein: 25, carbs: 45, fat: 30 },
            mealType: "dinner",
            prepTime: 18,
            ingredients: [
              { name: "Tofu firme", amount: "150", unit: "gramos" },
              { name: "Arroz integral", amount: "80", unit: "gramos" },
              { name: "Espinacas", amount: "100", unit: "gramos" },
              { name: "Aceite de coco", amount: "1", unit: "cucharada" },
            ],
          },
          {
            name: "Snack Vegano",
            description: "Hummus con vegetales y semillas",
            calories: 290,
            macros: { protein: 12, carbs: 35, fat: 35 },
            mealType: "snack",
            prepTime: 3,
            ingredients: [
              { name: "Hummus", amount: "80", unit: "gramos" },
              { name: "Zanahoria", amount: "100", unit: "gramos" },
              { name: "Semillas de girasol", amount: "15", unit: "gramos" },
            ],
          },
        ],
        benefits: ["Alto en proteína vegetal", "Rico en fibra", "Sostenible", "Antiinflamatorio"],
        preferences: { vegetarian: true, vegan: true, glutenFree: false, lactoseFree: true },
        isTemplate: true,
      },
      {
        user: users[3]._id,
        title: "Plan Keto Moderado",
        description: "Dieta cetogénica moderada para pérdida de grasa",
        calories: 1800,
        macros: { protein: 25, carbs: 10, fat: 65 },
        meals: [
          {
            name: "Desayuno Keto",
            description: "Huevos revueltos con aguacate y bacon",
            calories: 420,
            macros: { protein: 25, carbs: 8, fat: 67 },
            mealType: "breakfast",
            prepTime: 8,
            ingredients: [
              { name: "Huevos", amount: "3", unit: "piezas" },
              { name: "Aguacate", amount: "1/2", unit: "pieza" },
              { name: "Bacon", amount: "30", unit: "gramos" },
              { name: "Mantequilla", amount: "10", unit: "gramos" },
            ],
          },
          {
            name: "Almuerzo Keto",
            description: "Ensalada de pollo con aceite de oliva y queso",
            calories: 580,
            macros: { protein: 30, carbs: 8, fat: 62 },
            mealType: "lunch",
            prepTime: 12,
            ingredients: [
              { name: "Pechuga de pollo", amount: "150", unit: "gramos" },
              { name: "Lechuga", amount: "100", unit: "gramos" },
              { name: "Queso cheddar", amount: "50", unit: "gramos" },
              { name: "Aceite de oliva", amount: "3", unit: "cucharadas" },
            ],
          },
          {
            name: "Cena Keto",
            description: "Salmón con espárragos y mantequilla de hierbas",
            calories: 520,
            macros: { protein: 35, carbs: 6, fat: 59 },
            mealType: "dinner",
            prepTime: 20,
            ingredients: [
              { name: "Salmón", amount: "150", unit: "gramos" },
              { name: "Espárragos", amount: "150", unit: "gramos" },
              { name: "Mantequilla", amount: "20", unit: "gramos" },
              { name: "Hierbas frescas", amount: "10", unit: "gramos" },
            ],
          },
          {
            name: "Snack Keto",
            description: "Nueces macadamia y queso",
            calories: 280,
            macros: { protein: 8, carbs: 5, fat: 87 },
            mealType: "snack",
            prepTime: 1,
            ingredients: [
              { name: "Nueces macadamia", amount: "25", unit: "gramos" },
              { name: "Queso gouda", amount: "30", unit: "gramos" },
            ],
          },
        ],
        benefits: ["Pérdida de grasa", "Estabilidad energética", "Reducción de apetito", "Claridad mental"],
        preferences: { vegetarian: false, vegan: false, glutenFree: true, lactoseFree: false },
        isTemplate: true,
      },
      {
        user: users[3]._id,
        title: "Plan Deportista",
        description: "Dieta alta en carbohidratos para atletas de resistencia",
        calories: 2800,
        macros: { protein: 20, carbs: 60, fat: 20 },
        meals: [
          {
            name: "Desayuno Deportista",
            description: "Avena con frutas, miel y proteína",
            calories: 580,
            macros: { protein: 22, carbs: 65, fat: 13 },
            mealType: "breakfast",
            prepTime: 8,
            ingredients: [
              { name: "Avena", amount: "80", unit: "gramos" },
              { name: "Plátano", amount: "1", unit: "pieza" },
              { name: "Proteína whey", amount: "25", unit: "gramos" },
              { name: "Miel", amount: "2", unit: "cucharadas" },
            ],
          },
          {
            name: "Pre-Entreno",
            description: "Batido energético con carbohidratos",
            calories: 320,
            macros: { protein: 15, carbs: 70, fat: 5 },
            mealType: "pre-workout",
            prepTime: 3,
            ingredients: [
              { name: "Plátano", amount: "1", unit: "pieza" },
              { name: "Dátiles", amount: "3", unit: "piezas" },
              { name: "Agua de coco", amount: "200", unit: "ml" },
            ],
          },
          {
            name: "Almuerzo Deportista",
            description: "Pasta integral con pollo y verduras",
            calories: 850,
            macros: { protein: 25, carbs: 60, fat: 15 },
            mealType: "lunch",
            prepTime: 25,
            ingredients: [
              { name: "Pasta integral", amount: "120", unit: "gramos" },
              { name: "Pechuga de pollo", amount: "150", unit: "gramos" },
              { name: "Tomate", amount: "200", unit: "gramos" },
              { name: "Aceite de oliva", amount: "1", unit: "cucharada" },
            ],
          },
          {
            name: "Post-Entreno",
            description: "Batido de recuperación con proteína y carbohidratos",
            calories: 380,
            macros: { protein: 30, carbs: 50, fat: 10 },
            mealType: "post-workout",
            prepTime: 2,
            ingredients: [
              { name: "Proteína whey", amount: "30", unit: "gramos" },
              { name: "Plátano", amount: "1", unit: "pieza" },
              { name: "Leche desnatada", amount: "250", unit: "ml" },
            ],
          },
          {
            name: "Cena Deportista",
            description: "Arroz con pescado y vegetales",
            calories: 670,
            macros: { protein: 25, carbs: 55, fat: 20 },
            mealType: "dinner",
            prepTime: 22,
            ingredients: [
              { name: "Arroz basmati", amount: "100", unit: "gramos" },
              { name: "Merluza", amount: "150", unit: "gramos" },
              { name: "Brócoli", amount: "150", unit: "gramos" },
              { name: "Aceite de oliva", amount: "2", unit: "cucharadas" },
            ],
          },
        ],
        benefits: ["Energía sostenida", "Recuperación muscular", "Rendimiento deportivo", "Hidratación"],
        preferences: { vegetarian: false, vegan: false, glutenFree: false, lactoseFree: false },
        isTemplate: true,
      },
      {
        user: users[3]._id,
        title: "Plan Definición",
        description: "Dieta hipocalórica para definición muscular",
        calories: 1600,
        macros: { protein: 35, carbs: 30, fat: 35 },
        meals: [
          {
            name: "Desayuno Definición",
            description: "Claras de huevo con espinacas y aguacate",
            calories: 320,
            macros: { protein: 40, carbs: 15, fat: 45 },
            mealType: "breakfast",
            prepTime: 10,
            ingredients: [
              { name: "Claras de huevo", amount: "6", unit: "piezas" },
              { name: "Espinacas", amount: "100", unit: "gramos" },
              { name: "Aguacate", amount: "1/3", unit: "pieza" },
              { name: "Aceite de coco", amount: "1", unit: "cucharadita" },
            ],
          },
          {
            name: "Almuerzo Definición",
            description: "Pechuga de pollo con ensalada y quinoa",
            calories: 480,
            macros: { protein: 40, carbs: 30, fat: 30 },
            mealType: "lunch",
            prepTime: 18,
            ingredients: [
              { name: "Pechuga de pollo", amount: "150", unit: "gramos" },
              { name: "Quinoa", amount: "50", unit: "gramos" },
              { name: "Lechuga mixta", amount: "100", unit: "gramos" },
              { name: "Aceite de oliva", amount: "1", unit: "cucharada" },
            ],
          },
          {
            name: "Cena Definición",
            description: "Pescado blanco con verduras al vapor",
            calories: 380,
            macros: { protein: 45, carbs: 20, fat: 35 },
            mealType: "dinner",
            prepTime: 15,
            ingredients: [
              { name: "Pescado blanco", amount: "150", unit: "gramos" },
              { name: "Calabacín", amount: "150", unit: "gramos" },
              { name: "Pimientos", amount: "100", unit: "gramos" },
              { name: "Aceite de oliva", amount: "1.5", unit: "cucharadas" },
            ],
          },
          {
            name: "Snack Definición",
            description: "Yogur griego con almendras",
            calories: 220,
            macros: { protein: 25, carbs: 15, fat: 60 },
            mealType: "snack",
            prepTime: 2,
            ingredients: [
              { name: "Yogur griego 0%", amount: "150", unit: "gramos" },
              { name: "Almendras", amount: "15", unit: "gramos" },
            ],
          },
        ],
        benefits: ["Definición muscular", "Pérdida de grasa", "Mantenimiento de masa muscular", "Saciedad"],
        preferences: { vegetarian: false, vegan: false, glutenFree: true, lactoseFree: false },
        isTemplate: true,
      },
      {
        user: users[3]._id,
        title: "Plan Flexitariano",
        description: "Dieta principalmente vegetariana con ocasional consumo de carne",
        calories: 2100,
        macros: { protein: 22, carbs: 48, fat: 30 },
        meals: [
          {
            name: "Desayuno Flexitariano",
            description: "Tostada de centeno con hummus y vegetales",
            calories: 380,
            macros: { protein: 18, carbs: 50, fat: 32 },
            mealType: "breakfast",
            prepTime: 8,
            ingredients: [
              { name: "Pan de centeno", amount: "2", unit: "rebanadas" },
              { name: "Hummus", amount: "60", unit: "gramos" },
              { name: "Tomate cherry", amount: "80", unit: "gramos" },
              { name: "Pepino", amount: "50", unit: "gramos" },
            ],
          },
          {
            name: "Almuerzo Flexitariano",
            description: "Ensalada de lentejas con queso de cabra",
            calories: 620,
            macros: { protein: 25, carbs: 45, fat: 30 },
            mealType: "lunch",
            prepTime: 15,
            ingredients: [
              { name: "Lentejas cocidas", amount: "120", unit: "gramos" },
              { name: "Queso de cabra", amount: "50", unit: "gramos" },
              { name: "Rúcula", amount: "80", unit: "gramos" },
              { name: "Nueces", amount: "20", unit: "gramos" },
            ],
          },
          {
            name: "Cena Flexitariana",
            description: "Salmón con quinoa y verduras (2 veces por semana)",
            calories: 580,
            macros: { protein: 30, carbs: 35, fat: 35 },
            mealType: "dinner",
            prepTime: 20,
            ingredients: [
              { name: "Salmón", amount: "120", unit: "gramos" },
              { name: "Quinoa", amount: "70", unit: "gramos" },
              { name: "Espárragos", amount: "150", unit: "gramos" },
              { name: "Aceite de oliva", amount: "2", unit: "cucharadas" },
            ],
          },
          {
            name: "Snack Flexitariano",
            description: "Smoothie verde con proteína vegetal",
            calories: 280,
            macros: { protein: 20, carbs: 40, fat: 25 },
            mealType: "snack",
            prepTime: 5,
            ingredients: [
              { name: "Espinacas", amount: "50", unit: "gramos" },
              { name: "Manzana", amount: "1", unit: "pieza" },
              { name: "Proteína de hemp", amount: "20", unit: "gramos" },
              { name: "Leche de avena", amount: "200", unit: "ml" },
            ],
          },
        ],
        benefits: ["Flexibilidad dietética", "Rico en fibra", "Sostenible", "Variedad nutricional"],
        preferences: { vegetarian: false, vegan: false, glutenFree: false, lactoseFree: false },
        isTemplate: true,
      },
    ])

    console.log(`✅ Created ${diets.length} comprehensive diet plans`)

    // Create template diets
    console.log("🥗 Creating template diets...")
    const extraDiets = await Diet.insertMany([
      {
        title: "Plan Mediterráneo",
        description: "Dieta basada en la alimentación mediterránea tradicional",
        calories: 2000,
        macros: {
          protein: 20,
          carbs: 45,
          fat: 35
        },
        meals: [
          {
            name: "Desayuno Mediterráneo",
            description: "Pan integral con aceite de oliva, tomate y jamón",
            calories: 400,
            macros: {
              protein: 15,
              carbs: 45,
              fat: 20,
              fiber: 5
            },
            ingredients: [
              { name: "Pan integral", amount: "2", unit: "rebanadas" },
              { name: "Aceite de oliva", amount: "1", unit: "cucharada" },
              { name: "Tomate", amount: "1", unit: "pieza" },
              { name: "Jamón", amount: "30", unit: "gramos" }
            ],
            instructions: ["Tostar el pan", "Untar con aceite", "Añadir tomate y jamón"],
            prepTime: 10,
            mealType: "breakfast"
          }
        ],
        benefits: ["Salud cardiovascular", "Control de peso", "Energía sostenida"],
        preferences: {
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          lactoseFree: false,
          nutFree: true,
          lowCarb: false,
          highProtein: false
        },
        restrictions: [],
        isActive: false,
        isTemplate: true,
        user: users[3]._id // Asignar al usuario "Sistema"
      },
      {
        title: "Plan Vegetariano",
        description: "Dieta equilibrada basada en plantas",
        calories: 1800,
        macros: {
          protein: 25,
          carbs: 50,
          fat: 25
        },
        meals: [
          {
            name: "Desayuno Vegetariano",
            description: "Avena con frutas y nueces",
            calories: 350,
            macros: {
              protein: 12,
              carbs: 55,
              fat: 15,
              fiber: 8
            },
            ingredients: [
              { name: "Avena", amount: "50", unit: "gramos" },
              { name: "Leche de almendras", amount: "200", unit: "ml" },
              { name: "Plátano", amount: "1", unit: "pieza" },
              { name: "Nueces", amount: "15", unit: "gramos" }
            ],
            instructions: ["Cocer la avena", "Añadir frutas y nueces"],
            prepTime: 15,
            mealType: "breakfast"
          }
        ],
        benefits: ["Alto en fibra", "Bajo en grasas saturadas", "Rico en antioxidantes"],
        preferences: {
          vegetarian: true,
          vegan: false,
          glutenFree: false,
          lactoseFree: true,
          nutFree: false,
          lowCarb: false,
          highProtein: false
        },
        restrictions: [],
        isActive: false,
        isTemplate: true,
        user: users[3]._id // Asignar al usuario "Sistema"
      }
    ])
    console.log(`✅ Created ${extraDiets.length} template diets`)

    // Create progress data for users
    console.log("📊 Creating progress data...")
    const progressData = []
    const currentDate = new Date()

    // Ana García (Principiante) - 30 días de progreso
    for (let i = 30; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)

      progressData.push({
        user: users[0]._id,
        date: date,
        weight: 62 - i * 0.05, // Pérdida gradual de peso
        measurements: {
          chest: 88 - i * 0.02,
          waist: 75 - i * 0.08,
          hips: 95 - i * 0.03,
        },
        completedWorkouts: Math.floor(Math.random() * 2),
        nutrition: {
          caloriesConsumed: 1800 + Math.floor(Math.random() * 200),
          macrosConsumed: {
            protein: 90 + Math.floor(Math.random() * 20),
            carbs: 180 + Math.floor(Math.random() * 40),
            fat: 60 + Math.floor(Math.random() * 15),
          },
          waterIntake: 2 + Math.random() * 1,
        },
        mood: ["good", "excellent", "average"][Math.floor(Math.random() * 3)],
        energyLevel: 6 + Math.floor(Math.random() * 3),
        sleepHours: 7 + Math.random() * 2,
        notes: i % 7 === 0 ? "Semana completada con éxito" : "",
      })
    }

    // Carlos Rodríguez (Intermedio) - 45 días de progreso
    for (let i = 45; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)

      progressData.push({
        user: users[1]._id,
        date: date,
        weight: 75 + i * 0.03, // Ganancia gradual de peso (músculo)
        measurements: {
          chest: 98 + i * 0.04,
          waist: 82 - i * 0.02,
          hips: 95 + i * 0.01,
        },
        completedWorkouts: Math.floor(Math.random() * 2) + 1,
        nutrition: {
          caloriesConsumed: 2400 + Math.floor(Math.random() * 300),
          macrosConsumed: {
            protein: 150 + Math.floor(Math.random() * 30),
            carbs: 250 + Math.floor(Math.random() * 50),
            fat: 80 + Math.floor(Math.random() * 20),
          },
          waterIntake: 3 + Math.random() * 1,
        },
        mood: ["excellent", "good"][Math.floor(Math.random() * 2)],
        energyLevel: 7 + Math.floor(Math.random() * 3),
        sleepHours: 7.5 + Math.random() * 1.5,
        notes: i % 10 === 0 ? "Progreso excelente en fuerza" : "",
      })
    }

    // María López (Avanzada) - 60 días de progreso
    for (let i = 60; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)

      progressData.push({
        user: users[2]._id,
        date: date,
        weight: 68 + Math.sin(i * 0.1) * 0.5, // Peso estable con pequeñas variaciones
        measurements: {
          chest: 92 + i * 0.01,
          waist: 68 - i * 0.01,
          hips: 96 + i * 0.005,
        },
        completedWorkouts: 1 + Math.floor(Math.random() * 2),
        nutrition: {
          caloriesConsumed: 2200 + Math.floor(Math.random() * 200),
          macrosConsumed: {
            protein: 130 + Math.floor(Math.random() * 25),
            carbs: 220 + Math.floor(Math.random() * 40),
            fat: 75 + Math.floor(Math.random() * 15),
          },
          waterIntake: 3.5 + Math.random() * 0.5,
        },
        mood: ["excellent", "good", "excellent"][Math.floor(Math.random() * 3)],
        energyLevel: 8 + Math.floor(Math.random() * 2),
        sleepHours: 8 + Math.random() * 1,
        notes: i % 14 === 0 ? "Nuevo récord personal alcanzado" : "",
      })
    }

    await Progress.insertMany(progressData)
    console.log(`✅ Created ${progressData.length} progress entries`)

    // Crear rutinas personalizadas para cada usuario regular
    const createRoutines = async (users, exercises) => {
      const routines = []
      const regularUsers = users.filter(user => user.role === "user")

      for (const user of regularUsers) {
        // Crear 2-3 rutinas por usuario
        const numRoutines = Math.floor(Math.random() * 2) + 2

        for (let i = 0; i < numRoutines; i++) {
          const category = ["strength", "cardio", "hiit", "flexibility", "full-body", "split"][Math.floor(Math.random() * 6)]
          const level = user.fitnessLevel || "beginner"
          const duration = Math.floor(Math.random() * 60) + 30 // 30-90 minutos

          // Seleccionar 4-8 ejercicios aleatorios
          const numExercises = Math.floor(Math.random() * 5) + 4
          const selectedExercises = exercises
            .filter(ex => ex.category === category || ex.category === "full-body")
            .sort(() => 0.5 - Math.random())
            .slice(0, numExercises)

          const routineExercises = selectedExercises.map((exercise, index) => ({
            exerciseId: exercise._id,
            title: exercise.title,
            description: exercise.description,
            instructions: exercise.instructions,
            category: exercise.category,
            level: exercise.level,
            muscleGroups: exercise.muscleGroups,
            equipment: exercise.equipment,
            duration: exercise.duration,
            intensity: exercise.intensity,
            calories: exercise.calories,
            image: exercise.image,
            videoUrl: exercise.videoUrl,
            tags: exercise.tags,
            // Parámetros específicos de la rutina
            sets: Math.floor(Math.random() * 3) + 3, // 3-5 sets
            reps: exercise.category === "cardio" ? null : Math.floor(Math.random() * 10) + 8, // 8-17 reps
            time: exercise.category === "cardio" ? Math.floor(Math.random() * 300) + 300 : null, // 5-10 minutos para cardio
            rest: Math.floor(Math.random() * 30) + 45, // 45-75 segundos de descanso
            weight: exercise.category === "strength" ? Math.floor(Math.random() * 20) + 5 : null, // 5-25kg para fuerza
            notes: "",
            order: index + 1
          }))

          const routine = {
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Routine ${i + 1}`,
            description: `Personalized ${category} routine for ${user.name}`,
            user: user._id,
            exercises: routineExercises,
            category,
            level,
            duration,
            calories: Math.floor(Math.random() * 300) + 200, // 200-500 calorías estimadas
            isActive: i === 0, // La primera rutina está activa
            isTemplate: false,
            tags: [category, level, user.goal],
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 estrellas
            notes: `Created for ${user.name} based on their ${level} level and ${user.goal} goal`
          }

          routines.push(routine)
        }
      }

      return await Routine.insertMany(routines)
    }

    // Crear rutinas después de crear usuarios y ejercicios
    const routines = await createRoutines(users, exercises)
    console.log("✅ Rutinas creadas")

    // Assign active plans to users
    console.log("🎯 Assigning active plans to users...")
    await TrainingPlan.findOneAndUpdate(
      { title: "Principiante - Cuerpo Completo" },
      { user: users[0]._id, isActive: true, isTemplate: false },
    )

    await TrainingPlan.findOneAndUpdate(
      { title: "Intermedio - Fuerza y Resistencia" },
      { user: users[1]._id, isActive: true, isTemplate: false },
    )

    await TrainingPlan.findOneAndUpdate(
      { title: "Avanzado - Atlético" },
      { user: users[2]._id, isActive: true, isTemplate: false },
    )

    await Diet.findOneAndUpdate(
      { title: "Plan Mediterráneo" },
      { user: users[0]._id, isActive: true, isTemplate: false },
    )

    await Diet.findOneAndUpdate({ title: "Plan Deportista" }, { user: users[1]._id, isActive: true, isTemplate: false })

    await Diet.findOneAndUpdate(
      { title: "Plan Flexitariano" },
      { user: users[2]._id, isActive: true, isTemplate: false },
    )

    console.log("✅ Assigned active plans to users")

    console.log("\n🎉 ¡DATABASE SEEDED SUCCESSFULLY!")
    console.log("=".repeat(50))
    console.log(`👥 Users created: ${users.length}`)
    console.log(`💪 Exercises created: ${exercises.length} (15 per level)`)
    console.log(`🏋️ Training plans: ${trainingPlans.length}`)
    console.log(`🥗 Diet plans: ${diets.length}`)
    console.log(`📊 Progress entries: ${progressData.length}`)
    console.log("=".repeat(50))
    console.log("\n📋 USER CREDENTIALS:")
    console.log("Ana García: ana.garcia@email.com / password123")
    console.log("Carlos Rodríguez: carlos.rodriguez@email.com / password123")
    console.log("María López: maria.lopez@email.com / password123")
    console.log("\n🚀 Ready to launch your professional fitness app!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    console.log("\n🔧 TROUBLESHOOTING TIPS:")
    console.log("1. Check your MongoDB Atlas connection string")
    console.log("2. Verify your IP is whitelisted in MongoDB Atlas")
    console.log("3. Ensure your database user has proper permissions")
    console.log("4. Check if your cluster is active and running")
    console.log("5. Verify your .env file has the correct MONGODB_URI")
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
